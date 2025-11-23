"use client"

import { useState, useEffect } from "react"
import { 
    FiX, FiUsers, FiClock, FiCheckCircle, FiXCircle, 
    FiTrendingUp, FiCalendar, FiUser, FiAward, FiEye 
} from "react-icons/fi"
import { teacherTestsAPI } from "../../api/apiTeacherTests"
import { BaseUrlReels } from "../../api/apiService"

const TestAttemptsModal = ({ 
    test, 
    channelSlug,
    isOpen, 
    onClose 
}) => {
    const [attempts, setAttempts] = useState([])
    const [loading, setLoading] = useState(false)
    const [stats, setStats] = useState(null)
    const [selectedAttempt, setSelectedAttempt] = useState(null)
    const [showAnswersModal, setShowAnswersModal] = useState(false)

    useEffect(() => {
        if (isOpen && test && channelSlug) {
            fetchAttempts()
        }
    }, [isOpen, test, channelSlug])

    const fetchAttempts = async () => {
        try {
            setLoading(true)
            console.log('Fetching attempts for test:', { id: test.id, type: test.type, channelSlug })
            const response = await teacherTestsAPI.getTestAttempts(channelSlug, test.id, test.type)
            setAttempts(response.results || [])
            
            // Real API dan summary ma'lumotlarini ishlatish
            if (response.summary) {
                const passedAttempts = response.results?.filter(a => a.score >= 70).length || 0
                const avgScore = response.results?.length > 0 ? 
                    response.results.reduce((sum, a) => sum + a.score, 0) / response.results.length : 0
                
                setStats({
                    total: response.summary.total_attempts,
                    passed: passedAttempts,
                    failed: response.summary.total_attempts - passedAttempts,
                    passRate: response.summary.total_attempts > 0 ? (passedAttempts / response.summary.total_attempts) * 100 : 0,
                    avgScore: avgScore,
                    uniqueStudents: response.summary.unique_students
                })
            } else {
                // Fallback statistikalar
                const totalAttempts = response.results?.length || 0
                const passedAttempts = response.results?.filter(a => a.score >= 70).length || 0
                const avgScore = totalAttempts > 0 ? 
                    response.results.reduce((sum, a) => sum + a.score, 0) / totalAttempts : 0
                
                setStats({
                    total: totalAttempts,
                    passed: passedAttempts,
                    failed: totalAttempts - passedAttempts,
                    passRate: totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0,
                    avgScore: avgScore
                })
            }
            
            setLoading(false)
        } catch (error) {
            console.error("Error fetching test attempts:", error)
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatTime = (startTime, endTime) => {
        if (!startTime || !endTime) return 'N/A'
        const start = new Date(startTime)
        const end = new Date(endTime)
        const diffMs = end - start
        const diffSeconds = Math.floor(diffMs / 1000)
        const minutes = Math.floor(diffSeconds / 60)
        const seconds = diffSeconds % 60
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const getScoreColor = (score) => {
        if (score >= 90) return "#10b981" // green
        if (score >= 70) return "#f59e0b" // yellow
        if (score >= 50) return "#f97316" // orange
        return "#ef4444" // red
    }

    const handleViewAnswers = (attempt) => {
        setSelectedAttempt(attempt)
        setShowAnswersModal(true)
    }

    if (!isOpen || !test) return null

    return (
        <div className="test-attempts-modal-overlay" onClick={onClose}>
            <div className="test-attempts-modal" onClick={(e) => e.stopPropagation()}>
                <div className="test-attempts-header">
                    <div className="test-info">
                        <h2>{test.title} - Urinishlar</h2>
                        <div className="test-meta">
                            <span className="test-type">
                                {test.type === 'video' ? 'Video Test' : 'Oylik Test'}
                            </span>
                            <span className="test-questions">
                                {test.questions_count} savol
                            </span>
                        </div>
                    </div>
                    <button className="test-attempts-close" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                <div className="test-attempts-content">
                    {/* Statistics Summary */}
                    {stats && (
                        <div className="attempts-stats">
                            <div className="stat-card total">
                                <div className="stat-icon">
                                    <FiUsers />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.total}</h3>
                                    <p>Jami urinish</p>
                                </div>
                            </div>

                            <div className="stat-card passed">
                                <div className="stat-icon">
                                    <FiCheckCircle />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.passed}</h3>
                                    <p>O'tdi</p>
                                </div>
                            </div>

                            <div className="stat-card failed">
                                <div className="stat-icon">
                                    <FiXCircle />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.failed}</h3>
                                    <p>O'tmadi</p>
                                </div>
                            </div>

                            <div className="stat-card rate">
                                <div className="stat-icon">
                                    <FiTrendingUp />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.passRate.toFixed(1)}%</h3>
                                    <p>O'tish darajasi</p>
                                </div>
                            </div>

                            <div className="stat-card average">
                                <div className="stat-icon">
                                    <FiAward />
                                </div>
                                <div className="stat-info">
                                    <h3>{stats.avgScore.toFixed(1)}%</h3>
                                    <p>O'rtacha ball</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attempts List */}
                    <div className="attempts-list">
                        <h3>Urinishlar ro'yxati</h3>
                        
                        {loading ? (
                            <div className="attempts-loading">
                                <div className="spinner"></div>
                                <p>Urinishlar yuklanmoqda...</p>
                            </div>
                        ) : attempts.length === 0 ? (
                            <div className="attempts-empty">
                                <FiUsers className="empty-icon" />
                                <h4>Urinishlar topilmadi</h4>
                                <p>Bu test uchun hali urinishlar yo'q</p>
                            </div>
                        ) : (
                            <div className="attempts-table">
                                <div className="attempts-table-header">
                                    <div className="col-student">O'quvchi</div>
                                    <div className="col-score">Ball</div>
                                    <div className="col-attempt">Urinish</div>
                                    <div className="col-time">Vaqt</div>
                                    <div className="col-date">Sana</div>
                                    <div className="col-status">Holat</div>
                                    <div className="col-actions">Javoblar</div>
                                </div>

                                <div className="attempts-table-body">
                                    {attempts.map((attempt) => (
                                        <div key={attempt.id} className="attempt-row">
                                            <div className="col-student">
                                                <div className="student-info">
                                                    <img 
                                                        src={attempt.user.avatar ? 
                                                            `${BaseUrlReels}${attempt.user.avatar}` : 
                                                            '/default-avatar.png'
                                                        }
                                                        alt={attempt.user.full_name}
                                                        className="student-avatar"
                                                    />
                                                    <div className="student-details">
                                                        <strong>{attempt.user.full_name}</strong>
                                                        <span>@{attempt.user.username}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-score">
                                                <div 
                                                    className="score-badge"
                                                    style={{ backgroundColor: getScoreColor(attempt.score) }}
                                                >
                                                    {attempt.score}%
                                                </div>
                                            </div>

                                            <div className="col-attempt">
                                                <span className="attempt-number">
                                                    #{attempt.attempt}
                                                </span>
                                            </div>

                                            <div className="col-time">
                                                <span className="time-spent">
                                                    <FiClock />
                                                    {formatTime(attempt.started_at, attempt.completed_at)}
                                                </span>
                                            </div>

                                            <div className="col-date">
                                                <span className="completion-date">
                                                    <FiCalendar />
                                                    {formatDate(attempt.completed_at)}
                                                </span>
                                            </div>

                                            <div className="col-status">
                                                {attempt.score >= 70 ? (
                                                    <span className="status-passed">
                                                        <FiCheckCircle />
                                                        O'tdi
                                                    </span>
                                                ) : (
                                                    <span className="status-failed">
                                                        <FiXCircle />
                                                        O'tmadi
                                                    </span>
                                                )}
                                            </div>

                                            <div className="col-actions">
                                                <button 
                                                    className="view-answers-btn"
                                                    onClick={() => handleViewAnswers(attempt)}
                                                    title="Javoblarni ko'rish"
                                                >
                                                    <FiEye />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Answers Modal */}
            {showAnswersModal && selectedAttempt && (
                <div className="answers-modal-overlay" onClick={() => setShowAnswersModal(false)}>
                    <div className="answers-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="answers-modal-header">
                            <div className="student-info-header">
                                <img 
                                    src={selectedAttempt.user.avatar ? 
                                        `${BaseUrlReels}${selectedAttempt.user.avatar}` : 
                                        '/default-avatar.png'
                                    }
                                    alt={selectedAttempt.user.full_name}
                                    className="student-avatar-large"
                                />
                                <div className="student-details-header">
                                    <h3>{selectedAttempt.user.full_name}</h3>
                                    <p>@{selectedAttempt.user.username}</p>
                                    <div className="attempt-info">
                                        <span className="score-large" style={{ color: getScoreColor(selectedAttempt.score) }}>
                                            {selectedAttempt.score}%
                                        </span>
                                        <span className="attempt-number">#{selectedAttempt.attempt} urinish</span>
                                    </div>
                                </div>
                            </div>
                            <button className="answers-modal-close" onClick={() => setShowAnswersModal(false)}>
                                <FiX />
                            </button>
                        </div>

                        <div className="answers-modal-content">
                            <h4>Javoblar ({selectedAttempt.answers?.length || 0} savol)</h4>
                            
                            {selectedAttempt.answers && selectedAttempt.answers.length > 0 ? (
                                <div className="answers-list">
                                    {selectedAttempt.answers.map((answer, index) => (
                                        <div key={answer.question_id} className={`answer-item ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                                            <div className="question-header">
                                                <span className="question-number">Savol {index + 1}</span>
                                                <span className={`answer-status ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                                                    {answer.is_correct ? <FiCheckCircle /> : <FiXCircle />}
                                                    {answer.is_correct ? 'To\'g\'ri' : 'Noto\'g\'ri'}
                                                </span>
                                            </div>
                                            
                                            <div className="question-text">
                                                <p><strong>Savol:</strong> {answer.question_text}</p>
                                            </div>

                                            <div className="answer-options">
                                                <div className="selected-option">
                                                    <strong>Tanlangan javob:</strong>
                                                    <span className={`option ${answer.is_correct ? 'correct' : 'incorrect'}`}>
                                                        {answer.selected_option.text}
                                                    </span>
                                                </div>

                                                {!answer.is_correct && answer.correct_options && (
                                                    <div className="correct-options">
                                                        <strong>To'g'ri javob:</strong>
                                                        <div className="correct-options-list">
                                                            {answer.correct_options.map((option) => (
                                                                <span key={option.id} className="option correct">
                                                                    {option.text}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="no-answers">
                                    <FiUser className="empty-icon" />
                                    <p>Bu urinish uchun javoblar topilmadi</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TestAttemptsModal
