import React, { useState, useEffect } from 'react';
import { FiFile, FiEdit, FiHelpCircle, FiCheckSquare, FiClock, FiAward, FiUpload, FiX, FiDownload } from 'react-icons/fi';
import { getClasswork, submitAssignment, getStudentSubmission } from '../../api/apiClassroom';

const StudentClasswork = ({ classroom }) => {
    const [classwork, setClasswork] = useState({ topics: [], items: [] });
    const [loading, setLoading] = useState(true);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [submissionText, setSubmissionText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (classroom) {
            fetchClasswork();
        }
    }, [classroom]);

    const fetchClasswork = async () => {
        try {
            setLoading(true);
            const data = await getClasswork(classroom.id);
            setClasswork(data);
        } catch (error) {
            console.error('Error fetching classwork:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitClick = async (item) => {
        setSelectedItem(item);
        
        // Check if already submitted
        try {
            const submission = await getStudentSubmission(item.id);
            if (submission) {
                alert('Siz bu vazifani allaqachon topshirgansiz');
                return;
            }
        } catch (error) {
            console.error('Error checking submission:', error);
        }
        
        setShowSubmitModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!submissionText.trim()) {
            alert('Javobingizni yozing');
            return;
        }

        try {
            setSubmitting(true);
            await submitAssignment(selectedItem.id, {
                submission_text: submissionText,
                attachments: []
            });
            setShowSubmitModal(false);
            setSubmissionText('');
            alert('Vazifa muvaffaqiyatli topshirildi!');
        } catch (error) {
            console.error('Error submitting:', error);
            alert('Topshirishda xatolik yuz berdi');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    if (loading) {
        return (
            <div className="scw-loading">
                <div className="spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="student-classwork">
            <div className="scw-header">
                <h2>Darslar</h2>
            </div>

            <div className="scw-content">
                {classwork.topics.map(topic => {
                    const topicItems = classwork.items.filter(item => item.topic_id === topic.id);
                    
                    return (
                        <div key={topic.id} className="scw-topic">
                            <div className="scw-topic-header">
                                <h3>{topic.name}</h3>
                            </div>

                            <div className="scw-items">
                                {topicItems.length === 0 ? (
                                    <div className="scw-empty">
                                        <p>Bu mavzuda hali elementlar yo'q</p>
                                    </div>
                                ) : (
                                    topicItems.map(item => (
                                        <div key={item.id} className={`scw-item scw-item-${item.type}`}>
                                            <div className="scw-item-icon">
                                                {item.type === 'material' && <FiFile />}
                                                {item.type === 'assignment' && <FiEdit />}
                                                {item.type === 'question' && <FiHelpCircle />}
                                                {item.type === 'quiz' && <FiCheckSquare />}
                                            </div>

                                            <div className="scw-item-content">
                                                <div className="scw-item-header">
                                                    <h4>{item.title}</h4>
                                                    {item.type === 'material' && (
                                                        <span className="scw-item-badge material">Material</span>
                                                    )}
                                                    {item.type === 'assignment' && (
                                                        <span className="scw-item-badge assignment">Topshiriq</span>
                                                    )}
                                                    {item.type === 'question' && (
                                                        <span className="scw-item-badge question">Savol</span>
                                                    )}
                                                    {item.type === 'quiz' && (
                                                        <span className="scw-item-badge quiz">Test</span>
                                                    )}
                                                </div>
                                                
                                                <p className="scw-item-description">{item.description}</p>
                                                
                                                <div className="scw-item-meta">
                                                    {item.due_date && (
                                                        <span className={`scw-item-due ${isOverdue(item.due_date) ? 'overdue' : ''}`}>
                                                            <FiClock /> Muddat: {formatDate(item.due_date)}
                                                            {isOverdue(item.due_date) && ' (Muddati o\'tgan)'}
                                                        </span>
                                                    )}

                                                    {item.points && (
                                                        <span className="scw-item-points">
                                                            <FiAward /> {item.points} ball
                                                        </span>
                                                    )}

                                                    {item.type === 'quiz' && (
                                                        <>
                                                            <span className="scw-item-info">
                                                                {item.questions_count} savol
                                                            </span>
                                                            <span className="scw-item-info">
                                                                {item.time_limit} daqiqa
                                                            </span>
                                                            <span className="scw-item-info">
                                                                O'tish: {item.passing_score}%
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                {item.attachments && item.attachments.length > 0 && (
                                                    <div className="scw-item-attachments">
                                                        {item.attachments.map((file, index) => (
                                                            <a 
                                                                key={index} 
                                                                href={file.url} 
                                                                className="scw-attachment"
                                                                download
                                                                title="Faylni yuklab olish"
                                                            >
                                                                <FiDownload />
                                                                <span>{file.name}</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="scw-item-actions">
                                                {item.type === 'material' && (
                                                    <button className="scw-action-btn view" title="Materiallarni ko'rish">
                                                        <FiFile /> Ko'rish
                                                    </button>
                                                )}
                                                {item.type === 'assignment' && (
                                                    <button 
                                                        className="scw-action-btn submit"
                                                        onClick={() => handleSubmitClick(item)}
                                                        title="Vazifani topshirish"
                                                    >
                                                        <FiUpload /> Topshirish
                                                    </button>
                                                )}
                                                {item.type === 'question' && (
                                                    <button className="scw-action-btn answer" title="Javob yozish">
                                                        <FiEdit /> Javob berish
                                                    </button>
                                                )}
                                                {item.type === 'quiz' && (
                                                    <button className="scw-action-btn start" title="Testni boshlash">
                                                        <FiCheckSquare /> Boshlash
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Submit Assignment Modal */}
            {showSubmitModal && selectedItem && (
                <div className="scw-modal-overlay" onClick={() => setShowSubmitModal(false)}>
                    <div className="scw-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="scw-modal-header">
                            <h2>Vazifani topshirish</h2>
                            <button 
                                className="scw-modal-close"
                                onClick={() => setShowSubmitModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="scw-modal-info">
                            <h3>{selectedItem.title}</h3>
                            <p>{selectedItem.description}</p>
                            {selectedItem.points && (
                                <span className="scw-modal-points">
                                    <FiAward /> Maksimal ball: {selectedItem.points}
                                </span>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="scw-modal-form">
                            <div className="scw-form-group">
                                <label>Javobingiz *</label>
                                <textarea
                                    value={submissionText}
                                    onChange={(e) => setSubmissionText(e.target.value)}
                                    placeholder="Vazifa javobini yozing..."
                                    rows="8"
                                    required
                                />
                            </div>

                            <div className="scw-form-group">
                                <label>Fayllar (ixtiyoriy)</label>
                                <div className="scw-file-upload">
                                    <button type="button" className="scw-upload-btn">
                                        <FiUpload /> Fayl yuklash
                                    </button>
                                    <p className="scw-upload-hint">PDF, Word, rasm yoki boshqa fayllar</p>
                                </div>
                            </div>

                            <div className="scw-modal-actions">
                                <button 
                                    type="button" 
                                    className="scw-btn-cancel"
                                    onClick={() => setShowSubmitModal(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button 
                                    type="submit" 
                                    className="scw-btn-submit"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Topshirilmoqda...' : 'Topshirish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentClasswork;
