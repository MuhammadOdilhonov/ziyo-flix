import React, { useState, useEffect } from 'react';
import { FiHelpCircle, FiMessageSquare, FiUser, FiMoreVertical, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { getQuestions, answerQuestion, deleteQuestion } from '../../api/apiClassroom';
import { BaseUrlReels } from '../../api/apiService';

const TeacherQuestions = ({ classroom }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showAnswerModal, setShowAnswerModal] = useState(false);
    const [showMenu, setShowMenu] = useState(null);
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        if (classroom) {
            fetchQuestions();
        }
    }, [classroom]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const data = await getQuestions(classroom.id);
            setQuestions(data.results || []);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (e) => {
        e.preventDefault();
        try {
            await answerQuestion(selectedQuestion.id, { answer });
            setShowAnswerModal(false);
            setSelectedQuestion(null);
            setAnswer('');
            fetchQuestions();
        } catch (error) {
            console.error('Error answering:', error);
        }
    };

    const handleDelete = async (questionId) => {
        if (window.confirm('Savolni o\'chirmoqchimisiz?')) {
            try {
                await deleteQuestion(questionId);
                fetchQuestions();
            } catch (error) {
                console.error('Error deleting:', error);
            }
        }
        setShowMenu(null);
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
            <div className="tq-loading">
                <div className="spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="teacher-questions">
            <div className="tq-header">
                <div className="tq-header-info">
                    <h2>Savollar</h2>
                    <p>{questions.length} ta savol</p>
                </div>
            </div>

            {questions.length === 0 ? (
                <div className="tq-empty">
                    <FiHelpCircle />
                    <p>Hali savollar yo'q</p>
                    <span>O'quvchilar savol berganda bu yerda ko'rinadi</span>
                </div>
            ) : (
                <div className="tq-list">
                    {questions.map(question => (
                        <div key={question.id} className="tq-card">
                            <div className="tq-card-header">
                                <div className="tq-student">
                                    <div className="tq-student-avatar">
                                        {question.student.avatar ? (
                                            <img src={`${BaseUrlReels}${question.student.avatar}`} alt={question.student.full_name} />
                                        ) : (
                                            <FiUser />
                                        )}
                                    </div>
                                    <div className="tq-student-info">
                                        <h4>{question.student.full_name}</h4>
                                        <span>{formatDate(question.created_at)}</span>
                                    </div>
                                </div>
                                <div className="tq-card-menu">
                                    <button 
                                        className="tq-menu-btn"
                                        onClick={() => setShowMenu(showMenu === question.id ? null : question.id)}
                                        title="Boshqa amallar"
                                    >
                                        <FiMoreVertical />
                                    </button>
                                    {showMenu === question.id && (
                                        <div className="tq-menu-dropdown">
                                            <button onClick={() => {
                                                setSelectedQuestion(question);
                                                setAnswer(question.answer || '');
                                                setShowAnswerModal(true);
                                                setShowMenu(null);
                                            }}>
                                                <FiMessageSquare /> Javob berish
                                            </button>
                                            <button onClick={() => handleDelete(question.id)} className="danger">
                                                <FiTrash2 /> O'chirish
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="tq-card-body">
                                <div className="tq-question">
                                    <h3>{question.title}</h3>
                                    <p>{question.content}</p>
                                </div>

                                {question.answer ? (
                                    <div className="tq-answer">
                                        <div className="tq-answer-header">
                                            <FiCheckCircle />
                                            <span>Javob berildi</span>
                                        </div>
                                        <p>{question.answer}</p>
                                    </div>
                                ) : (
                                    <div className="tq-no-answer">
                                        <span>Javob kutilmoqda</span>
                                    </div>
                                )}
                            </div>

                            <div className="tq-card-footer">
                                <button 
                                    className="tq-answer-btn"
                                    onClick={() => {
                                        setSelectedQuestion(question);
                                        setAnswer(question.answer || '');
                                        setShowAnswerModal(true);
                                    }}
                                >
                                    <FiMessageSquare /> {question.answer ? 'Javobni tahrirlash' : 'Javob berish'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Answer Modal */}
            {showAnswerModal && selectedQuestion && (
                <div className="tq-modal-overlay" onClick={() => setShowAnswerModal(false)}>
                    <div className="tq-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tq-modal-header">
                            <h2>Javob Berish</h2>
                            <button 
                                className="tq-modal-close"
                                onClick={() => setShowAnswerModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="tq-modal-question">
                            <div className="tq-student">
                                <div className="tq-student-avatar">
                                    {selectedQuestion.student.avatar ? (
                                        <img src={`${BaseUrlReels}${selectedQuestion.student.avatar}`} alt={selectedQuestion.student.full_name} />
                                    ) : (
                                        <FiUser />
                                    )}
                                </div>
                                <div>
                                    <h4>{selectedQuestion.student.full_name}</h4>
                                    <p>{selectedQuestion.title}</p>
                                </div>
                            </div>
                            <div className="tq-question-content">
                                <p>{selectedQuestion.content}</p>
                            </div>
                        </div>

                        <form onSubmit={handleAnswer} className="tq-modal-form">
                            <div className="tq-form-group">
                                <label>Javobingiz *</label>
                                <textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Savolga batafsil javob yozing..."
                                    rows="6"
                                    required
                                />
                            </div>

                            <div className="tq-modal-actions">
                                <button 
                                    type="button" 
                                    className="tq-btn-cancel"
                                    onClick={() => setShowAnswerModal(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button type="submit" className="tq-btn-submit">
                                    Javob yuborish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherQuestions;
