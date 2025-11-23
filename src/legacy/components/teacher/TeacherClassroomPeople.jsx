import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiCalendar, FiAward, FiEye, FiX } from 'react-icons/fi';
import { getClassroomStudents } from '../../api/apiClassroom';

const TeacherClassroomPeople = ({ classroom }) => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        if (classroom) {
            fetchStudents();
        }
    }, [classroom]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await getClassroomStudents(classroom.id);
            setStudents(response.results || []);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewStudent = (student) => {
        setSelectedStudent(student);
        setShowDetailModal(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="tcp-loading">
                <div className="spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="teacher-classroom-people">
            <div className="tcp-header">
                <div className="tcp-header-info">
                    <h2>O'quvchilar</h2>
                    <span className="tcp-count">{students.length} ta o'quvchi</span>
                </div>
                <button className="tcp-invite-btn" title="O'quvchilarni taklif qilish">
                    <FiMail /> Taklif qilish
                </button>
            </div>

            <div className="tcp-students">
                {students.length === 0 ? (
                    <div className="tcp-empty">
                        <FiUser />
                        <p>Hali o'quvchilar yo'q</p>
                        <span>O'quvchilarni sinf kodini ulashib taklif qiling</span>
                    </div>
                ) : (
                    <div className="tcp-grid">
                        {students.map(student => (
                            <div key={student.id} className="tcp-student-card">
                                <div className="tcp-student-avatar">
                                    {student.avatar ? (
                                        <img src={student.avatar} alt={student.full_name} />
                                    ) : (
                                        <FiUser />
                                    )}
                                </div>

                                <div className="tcp-student-info">
                                    <h3>{student.full_name}</h3>
                                    <p className="tcp-student-username">@{student.username}</p>
                                    <p className="tcp-student-email">{student.email}</p>
                                </div>

                                <div className="tcp-student-stats">
                                    <div className="tcp-stat">
                                        <span className="tcp-stat-label">Topshiriqlar</span>
                                        <span className="tcp-stat-value">
                                            {student.assignments_completed}/{student.assignments_total}
                                        </span>
                                    </div>
                                    <div className="tcp-stat">
                                        <span className="tcp-stat-label">O'rtacha ball</span>
                                        <span className="tcp-stat-value">{student.average_grade}%</span>
                                    </div>
                                </div>

                                <div className="tcp-student-footer">
                                    <span className="tcp-joined">
                                        <FiCalendar /> {formatDate(student.joined_at)}
                                    </span>
                                    <button 
                                        className="tcp-view-btn"
                                        onClick={() => handleViewStudent(student)}
                                        title="To'liq ma'lumotni ko'rish"
                                    >
                                        <FiEye /> Ko'rish
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Student Detail Modal */}
            {showDetailModal && selectedStudent && (
                <div className="tcp-modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="tcp-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tcp-modal-header">
                            <h2>O'quvchi ma'lumotlari</h2>
                            <button 
                                className="tcp-modal-close"
                                onClick={() => setShowDetailModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="tcp-modal-content">
                            <div className="tcp-modal-profile">
                                <div className="tcp-modal-avatar">
                                    {selectedStudent.avatar ? (
                                        <img src={selectedStudent.avatar} alt={selectedStudent.full_name} />
                                    ) : (
                                        <FiUser />
                                    )}
                                </div>
                                <div className="tcp-modal-info">
                                    <h3>{selectedStudent.full_name}</h3>
                                    <p>@{selectedStudent.username}</p>
                                    <p>{selectedStudent.email}</p>
                                </div>
                            </div>

                            <div className="tcp-modal-stats">
                                <div className="tcp-modal-stat-card">
                                    <div className="tcp-modal-stat-icon">
                                        <FiAward />
                                    </div>
                                    <div className="tcp-modal-stat-info">
                                        <h4>O'rtacha ball</h4>
                                        <p className="tcp-modal-stat-value">{selectedStudent.average_grade}%</p>
                                    </div>
                                </div>

                                <div className="tcp-modal-stat-card">
                                    <div className="tcp-modal-stat-icon">
                                        <FiCalendar />
                                    </div>
                                    <div className="tcp-modal-stat-info">
                                        <h4>Qo'shilgan sana</h4>
                                        <p className="tcp-modal-stat-value">{formatDate(selectedStudent.joined_at)}</p>
                                    </div>
                                </div>

                                <div className="tcp-modal-stat-card">
                                    <div className="tcp-modal-stat-icon">
                                        <FiUser />
                                    </div>
                                    <div className="tcp-modal-stat-info">
                                        <h4>Topshiriqlar</h4>
                                        <p className="tcp-modal-stat-value">
                                            {selectedStudent.assignments_completed} / {selectedStudent.assignments_total}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="tcp-modal-section">
                                <h4>Oxirgi faollik</h4>
                                <p>{formatDate(selectedStudent.last_active)}</p>
                            </div>

                            <div className="tcp-modal-section">
                                <h4>Progress</h4>
                                <div className="tcp-progress-bar">
                                    <div 
                                        className="tcp-progress-fill"
                                        style={{ 
                                            width: `${(selectedStudent.assignments_completed / selectedStudent.assignments_total) * 100}%` 
                                        }}
                                    />
                                </div>
                                <p className="tcp-progress-text">
                                    {Math.round((selectedStudent.assignments_completed / selectedStudent.assignments_total) * 100)}% bajarildi
                                </p>
                            </div>
                        </div>

                        <div className="tcp-modal-actions">
                            <button 
                                className="tcp-modal-btn"
                                onClick={() => setShowDetailModal(false)}
                            >
                                Yopish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherClassroomPeople;
