import React, { useState, useEffect } from 'react';
import { FiHelpCircle, FiSend, FiUser, FiCheckCircle } from 'react-icons/fi';
import { getMyQuestions, askQuestion } from '../../api/apiClassroom';
import { BaseUrlReels } from '../../api/apiService';

const StudentQuestions = ({ classroom }) => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAskModal, setShowAskModal] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (classroom) {
            fetchQuestions();
        }
    }, [classroom]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const data = await getMyQuestions(classroom.id);
            setQuestions(data.results || []);
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAskQuestion = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await askQuestion(classroom.id, formData);
            setShowAskModal(false);
            setFormData({ title: '', content: '' });
            fetchQuestions();
        } catch (error) {
            console.error('Error asking question:', error);
        } finally {
            setSubmitting(false);
        }
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
            <div className="sq-loading">
                <div className="spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="student-questions">
            <div className="sq-header">
                <div className="sq-header-info">
                    <h2>Mening Savollarim</h2>
                    <p>{questions.length} ta savol</p>
                </div>
                <button 
                    className="sq-ask-btn"
                    onClick={() => setShowAskModal(true)}
                >
                    <FiHelpCircle /> Savol berish
                </button>
            </div>

            {questions.length === 0 ? (
                <div className="sq-empty">
                    <FiHelpCircle />
                    <p>Hali savollar yo'q</p>
                    <span>O'qituvchiga savol bering</span>
                </div>
            ) : (
                <div className="sq-list">
                    {questions.map(question => (
                        <div key={question.id} className="sq-card">
                            <div className="sq-card-header">
                                <div className="sq-date">
                                    <span>{formatDate(question.created_at)}</span>
                                </div>
                                {question.answer ? (
                                    <span className="sq-status answered">
                                        <FiCheckCircle /> Javob berildi
                                    </span>
                                ) : (
                                    <span className="sq-status pending">
                                        Javob kutilmoqda
                                    </span>
                                )}
                            </div>

                            <div className="sq-card-body">
                                <div className="sq-question">
                                    <h3>{question.title}</h3>
                                    <p>{question.content}</p>
                                </div>

                                {question.answer && (
                                    <div className="sq-answer">
                                        <div className="sq-answer-header">
                                            <div className="sq-teacher-avatar">
                                                {question.teacher?.avatar ? (
                                                    <img src={`${BaseUrlReels}${question.teacher.avatar}`} alt={question.teacher.full_name} />
                                                ) : (
                                                    <FiUser />
                                                )}
                                            </div>
                                            <div>
                                                <h4>{question.teacher?.full_name || "O'qituvchi"}</h4>
                                                <span>Javob berdi</span>
                                            </div>
                                        </div>
                                        <p>{question.answer}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Ask Question Modal */}
            {showAskModal && (
                <div className="sq-modal-overlay" onClick={() => setShowAskModal(false)}>
                    <div className="sq-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="sq-modal-header">
                            <h2>Savol Berish</h2>
                            <button 
                                className="sq-modal-close"
                                onClick={() => setShowAskModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleAskQuestion} className="sq-modal-form">
                            <div className="sq-form-group">
                                <label>Savol sarlavhasi *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    placeholder="Masalan: Python'da list va tuple farqi nima?"
                                    required
                                />
                            </div>

                            <div className="sq-form-group">
                                <label>Savol matni *</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                                    placeholder="Savolingizni batafsil yozing..."
                                    rows="6"
                                    required
                                />
                                <span className="sq-hint">O'qituvchi sizning savolingizga javob beradi</span>
                            </div>

                            <div className="sq-modal-actions">
                                <button 
                                    type="button" 
                                    className="sq-btn-cancel"
                                    onClick={() => setShowAskModal(false)}
                                    disabled={submitting}
                                >
                                    Bekor qilish
                                </button>
                                <button 
                                    type="submit" 
                                    className="sq-btn-submit"
                                    disabled={submitting}
                                >
                                    <FiSend /> {submitting ? 'Yuborilmoqda...' : 'Savol yuborish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentQuestions;
