"use client"

import { useState } from "react"
import { FiStar, FiMessageSquare, FiSave, FiX } from "react-icons/fi"
import { BaseUrlReels } from "../../api/apiService"

const GradingModal = ({ 
    submission, 
    assignment, 
    isOpen, 
    onClose, 
    onSave 
}) => {
    const [grade, setGrade] = useState(submission?.grade || "")
    const [feedback, setFeedback] = useState(submission?.feedback || "")
    const [loading, setLoading] = useState(false)

    if (!isOpen || !submission || !assignment) return null

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!grade || isNaN(grade) || grade < 0 || grade > assignment.max_points) {
            alert(`Ball 0 dan ${assignment.max_points} gacha bo'lishi kerak`)
            return
        }

        setLoading(true)
        try {
            await onSave({
                grade: parseInt(grade),
                feedback: feedback.trim()
            })
            onClose()
        } catch (error) {
            console.error("Error saving grade:", error)
            alert("Baholashda xatolik yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    const getGradeColor = (score, maxPoints) => {
        const percentage = (score / maxPoints) * 100
        if (percentage >= 90) return "#10b981" // green
        if (percentage >= 70) return "#f59e0b" // yellow
        if (percentage >= 50) return "#f97316" // orange
        return "#ef4444" // red
    }

    return (
        <div className="grading-modal-overlay" onClick={onClose}>
            <div className="grading-modal" onClick={(e) => e.stopPropagation()}>
                <div className="grading-modal-header">
                    <div className="grading-header-info">
                        <h2>Topshiriqni Baholash</h2>
                        <div className="grading-assignment-info">
                            <strong>{assignment.title}</strong>
                            <span>Maksimal ball: {assignment.max_points}</span>
                        </div>
                    </div>
                    <button className="grading-modal-close" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className="grading-modal-content">
                    {/* Student Info */}
                    <div className="grading-student-info">
                        <div className="student-avatar">
                            <img 
                                src={submission.student.avatar ? 
                                    `${BaseUrlReels}${submission.student.avatar}` : 
                                    '/default-avatar.png'
                                } 
                                alt={submission.student.full_name}
                            />
                        </div>
                        <div className="student-details">
                            <h3>{submission.student.full_name}</h3>
                            <p>@{submission.student.username}</p>
                            <div className="submission-meta">
                                <span>Topshirildi: {new Date(submission.submitted_at).toLocaleDateString('uz-UZ')}</span>
                                {submission.is_late && (
                                    <span className="late-badge">Kech topshirildi</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submission Content */}
                    <div className="grading-submission-content">
                        {submission.text_answer && (
                            <div className="submission-text">
                                <h4><FiMessageSquare /> Matnli javob:</h4>
                                <div className="text-content">
                                    {submission.text_answer}
                                </div>
                            </div>
                        )}

                        {(submission.attachment || submission.external_link) && (
                            <div className="submission-files">
                                <h4>Biriktirgan fayllar:</h4>
                                <div className="file-links">
                                    {submission.attachment && (
                                        <a 
                                            href={`${process.env.REACT_APP_BASE_URL_REELS || ''}${submission.attachment}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="file-link attachment"
                                        >
                                            📎 Faylni yuklash
                                        </a>
                                    )}
                                    {submission.external_link && (
                                        <a 
                                            href={submission.external_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="file-link external"
                                        >
                                            🔗 Tashqi havola
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Grading Form */}
                    <form onSubmit={handleSubmit} className="grading-form">
                        <div className="grading-score-section">
                            <div className="score-input-group">
                                <label htmlFor="grade">
                                    <FiStar /> Ball (0-{assignment.max_points})
                                </label>
                                <div className="score-input-container">
                                    <input
                                        id="grade"
                                        type="number"
                                        min="0"
                                        max={assignment.max_points}
                                        value={grade}
                                        onChange={(e) => setGrade(e.target.value)}
                                        className="score-input"
                                        placeholder="0"
                                        required
                                    />
                                    <span className="score-max">/ {assignment.max_points}</span>
                                </div>
                            </div>

                            {grade && !isNaN(grade) && (
                                <div className="score-preview">
                                    <div 
                                        className="score-bar"
                                        style={{
                                            width: `${(grade / assignment.max_points) * 100}%`,
                                            backgroundColor: getGradeColor(grade, assignment.max_points)
                                        }}
                                    ></div>
                                    <span className="score-percentage">
                                        {Math.round((grade / assignment.max_points) * 100)}%
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="grading-feedback-section">
                            <label htmlFor="feedback">
                                <FiMessageSquare /> Izoh (ixtiyoriy)
                            </label>
                            <textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="O'quvchiga izoh yozing..."
                                rows="4"
                                className="feedback-textarea"
                            />
                        </div>

                        <div className="grading-actions">
                            <button 
                                type="button" 
                                className="grading-btn secondary"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Bekor qilish
                            </button>
                            <button 
                                type="submit" 
                                className="grading-btn primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner-small"></div>
                                        Saqlanmoqda...
                                    </>
                                ) : (
                                    <>
                                        <FiSave /> Baholash
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default GradingModal
