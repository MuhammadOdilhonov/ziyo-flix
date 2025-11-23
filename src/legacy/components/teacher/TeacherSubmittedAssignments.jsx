import React, { useState, useEffect } from 'react';
import { FiFileText, FiClock, FiCheckCircle, FiXCircle, FiEye, FiEdit, FiTrash2, FiMoreVertical, FiDownload, FiUser } from 'react-icons/fi';
import { getSubmittedAssignments, gradeAssignment, deleteSubmission } from '../../api/apiClassroom';
import { BaseUrlReels } from '../../api/apiService';

const TeacherSubmittedAssignments = ({ classroom }) => {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [showGradeModal, setShowGradeModal] = useState(false);
    const [showMenu, setShowMenu] = useState(null);
    const [gradeData, setGradeData] = useState({ score: '', feedback: '' });

    useEffect(() => {
        if (classroom) {
            fetchSubmissions();
        }
    }, [classroom]);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const data = await getSubmittedAssignments(classroom.id);
            setSubmissions(data.results || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGrade = async (e) => {
        e.preventDefault();
        try {
            await gradeAssignment(selectedSubmission.id, gradeData);
            setShowGradeModal(false);
            setSelectedSubmission(null);
            setGradeData({ score: '', feedback: '' });
            fetchSubmissions();
        } catch (error) {
            console.error('Error grading:', error);
        }
    };

    const handleDelete = async (submissionId) => {
        if (window.confirm('Topshiriqni o\'chirmoqchimisiz?')) {
            try {
                await deleteSubmission(submissionId);
                fetchSubmissions();
            } catch (error) {
                console.error('Error deleting:', error);
            }
        }
        setShowMenu(null);
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { label: 'Kutilmoqda', class: 'pending' },
            graded: { label: 'Baholandi', class: 'graded' },
            late: { label: 'Kech topshirildi', class: 'late' }
        };
        return badges[status] || badges.pending;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="tsa-loading">
                <div className="spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="teacher-submitted-assignments">
            <div className="tsa-header">
                <div className="tsa-header-info">
                    <h2>Topshirilgan Vazifalar</h2>
                    <p>{submissions.length} ta topshiriq</p>
                </div>
            </div>

            {submissions.length === 0 ? (
                <div className="tsa-empty">
                    <FiFileText />
                    <p>Hali topshirilgan vazifalar yo'q</p>
                    <span>O'quvchilar vazifa topshirganda bu yerda ko'rinadi</span>
                </div>
            ) : (
                <div className="tsa-grid">
                    {submissions.map(submission => {
                        const status = getStatusBadge(submission.status);
                        return (
                            <div key={submission.id} className="tsa-card">
                                <div className="tsa-card-header">
                                    <div className="tsa-student">
                                        <div className="tsa-student-avatar">
                                            {submission.student.avatar ? (
                                                <img src={`${BaseUrlReels}${submission.student.avatar}`} alt={submission.student.full_name} />
                                            ) : (
                                                <FiUser />
                                            )}
                                        </div>
                                        <div className="tsa-student-info">
                                            <h4>{submission.student.full_name}</h4>
                                            <span>@{submission.student.username}</span>
                                        </div>
                                    </div>
                                    <div className="tsa-card-menu">
                                        <button 
                                            className="tsa-menu-btn"
                                            onClick={() => setShowMenu(showMenu === submission.id ? null : submission.id)}
                                            title="Boshqa amallar"
                                        >
                                            <FiMoreVertical />
                                        </button>
                                        {showMenu === submission.id && (
                                            <div className="tsa-menu-dropdown">
                                                <button onClick={() => {
                                                    setSelectedSubmission(submission);
                                                    setGradeData({ 
                                                        score: submission.score || '', 
                                                        feedback: submission.feedback || '' 
                                                    });
                                                    setShowGradeModal(true);
                                                    setShowMenu(null);
                                                }}>
                                                    <FiEdit /> Baholash
                                                </button>
                                                <button onClick={() => handleDelete(submission.id)} className="danger">
                                                    <FiTrash2 /> O'chirish
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="tsa-card-body">
                                    <h3>{submission.assignment.title}</h3>
                                    <p className="tsa-description">{submission.content}</p>

                                    {submission.files && submission.files.length > 0 && (
                                        <div className="tsa-files">
                                            {submission.files.map((file, index) => (
                                                <a 
                                                    key={index} 
                                                    href={file.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="tsa-file"
                                                >
                                                    <FiDownload />
                                                    <span>{file.name}</span>
                                                </a>
                                            ))}
                                        </div>
                                    )}

                                    <div className="tsa-meta">
                                        <div className="tsa-date">
                                            <FiClock />
                                            <span>{formatDate(submission.submitted_at)}</span>
                                        </div>
                                        <span className={`tsa-status ${status.class}`}>
                                            {status.label}
                                        </span>
                                    </div>

                                    {submission.score !== null && (
                                        <div className="tsa-grade">
                                            <div className="tsa-grade-score">
                                                <span className="tsa-score">{submission.score}</span>
                                                <span className="tsa-max-score">/ {submission.assignment.points}</span>
                                            </div>
                                            {submission.feedback && (
                                                <p className="tsa-feedback">{submission.feedback}</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="tsa-card-footer">
                                    <button 
                                        className="tsa-grade-btn"
                                        onClick={() => {
                                            setSelectedSubmission(submission);
                                            setGradeData({ 
                                                score: submission.score || '', 
                                                feedback: submission.feedback || '' 
                                            });
                                            setShowGradeModal(true);
                                        }}
                                    >
                                        <FiEdit /> Baholash
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Grade Modal */}
            {showGradeModal && selectedSubmission && (
                <div className="tsa-modal-overlay" onClick={() => setShowGradeModal(false)}>
                    <div className="tsa-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tsa-modal-header">
                            <h2>Vazifani Baholash</h2>
                            <button 
                                className="tsa-modal-close"
                                onClick={() => setShowGradeModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="tsa-modal-student">
                            <div className="tsa-student-avatar">
                                {selectedSubmission.student.avatar ? (
                                    <img src={`${BaseUrlReels}${selectedSubmission.student.avatar}`} alt={selectedSubmission.student.full_name} />
                                ) : (
                                    <FiUser />
                                )}
                            </div>
                            <div>
                                <h4>{selectedSubmission.student.full_name}</h4>
                                <p>{selectedSubmission.assignment.title}</p>
                            </div>
                        </div>

                        <form onSubmit={handleGrade} className="tsa-modal-form">
                            <div className="tsa-form-group">
                                <label>Ball *</label>
                                <input
                                    type="number"
                                    min="0"
                                    max={selectedSubmission.assignment.points}
                                    value={gradeData.score}
                                    onChange={(e) => setGradeData({...gradeData, score: e.target.value})}
                                    placeholder={`0 - ${selectedSubmission.assignment.points}`}
                                    required
                                />
                                <span className="tsa-hint">Maksimal: {selectedSubmission.assignment.points} ball</span>
                            </div>

                            <div className="tsa-form-group">
                                <label>Izoh</label>
                                <textarea
                                    value={gradeData.feedback}
                                    onChange={(e) => setGradeData({...gradeData, feedback: e.target.value})}
                                    placeholder="O'quvchiga izoh yozing..."
                                    rows="4"
                                />
                            </div>

                            <div className="tsa-modal-actions">
                                <button 
                                    type="button" 
                                    className="tsa-btn-cancel"
                                    onClick={() => setShowGradeModal(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button type="submit" className="tsa-btn-submit">
                                    Saqlash
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherSubmittedAssignments;
