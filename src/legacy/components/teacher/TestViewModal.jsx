import React, { useState, useEffect } from 'react'
import { 
    FiX, 
    FiEye, 
    FiClock, 
    FiUsers, 
    FiTarget,
    FiHelpCircle,
    FiCheck,
    FiEdit,
    FiTrash2
} from 'react-icons/fi'
import { testAssignmentAPI } from '../../api/apiTestEndAssignments'

const TestViewModal = ({ isOpen, onClose, testId, onEdit, onDelete }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [testData, setTestData] = useState(null)

    useEffect(() => {
        if (isOpen && testId) {
            fetchTestData()
        }
    }, [isOpen, testId])

    const fetchTestData = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await testAssignmentAPI.getTest(testId)
            setTestData(response)
            
        } catch (error) {
            console.error('Error fetching test:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = () => {
        if (onEdit && testData) {
            onEdit(testData)
        }
        onClose()
    }

    const handleDelete = () => {
        if (onDelete && testData) {
            if (window.confirm('Testni o\'chirishni xohlaysizmi?')) {
                onDelete(testData.id)
            }
        }
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="test-view-modal-overlay" onClick={onClose}>
            <div className="test-view-modal" onClick={(e) => e.stopPropagation()}>
                <div className="test-view-modal-header">
                    <h2><FiEye /> Test ko'rish</h2>
                    <div className="header-actions">
                        {testData && (
                            <>
                                <button 
                                    className="btn-icon btn-primary"
                                    onClick={handleEdit}
                                    title="Tahrirlash"
                                >
                                    <FiEdit />
                                </button>
                                <button 
                                    className="btn-icon btn-danger"
                                    onClick={handleDelete}
                                    title="O'chirish"
                                >
                                    <FiTrash2 />
                                </button>
                            </>
                        )}
                        <button 
                            className="modal-close-btn"
                            onClick={onClose}
                        >
                            <FiX />
                        </button>
                    </div>
                </div>

                <div className="test-view-modal-content">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Test ma'lumotlari yuklanmoqda...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button 
                                className="btn btn-primary"
                                onClick={fetchTestData}
                            >
                                Qayta urinish
                            </button>
                        </div>
                    ) : testData ? (
                        <div className="test-content">
                            {/* Test Info */}
                            <div className="test-info">
                                <h3>{testData.title}</h3>
                                {testData.description && (
                                    <p className="test-description">{testData.description}</p>
                                )}
                                
                                <div className="test-stats">
                                    <div className="stat-item">
                                        <FiClock />
                                        <span>Vaqt: {testData.time_limit_minutes} daqiqa</span>
                                    </div>
                                    <div className="stat-item">
                                        <FiUsers />
                                        <span>Urinishlar: {testData.attempts_allowed}</span>
                                    </div>
                                    <div className="stat-item">
                                        <FiTarget />
                                        <span>O'tish bali: {testData.pass_score}%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Questions */}
                            <div className="test-questions-view">
                                <h4>Savollar ({testData.questions?.length || 0})</h4>
                                
                                {testData.questions?.map((question, questionIndex) => (
                                    <div key={question.id} className="question-view-card">
                                        <div className="question-header">
                                            <span className="question-number">
                                                Savol {questionIndex + 1}
                                            </span>
                                            <span className="question-points">
                                                {question.points} ball
                                            </span>
                                        </div>
                                        
                                        <div className="question-text">
                                            {question.text}
                                        </div>
                                        
                                        <div className="question-options-view">
                                            {question.options?.map((option, optionIndex) => (
                                                <div 
                                                    key={option.id} 
                                                    className={`option-view-item ${option.is_correct ? 'correct' : ''}`}
                                                >
                                                    <div className="option-marker">
                                                        {option.is_correct ? (
                                                            <FiCheck className="correct-icon" />
                                                        ) : (
                                                            <span className="option-letter">
                                                                {String.fromCharCode(65 + optionIndex)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="option-text">
                                                        {option.text}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                
                                {(!testData.questions || testData.questions.length === 0) && (
                                    <div className="no-questions">
                                        <FiHelpCircle />
                                        <p>Bu testda hali savollar yo'q</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="no-data">
                            <p>Test ma'lumotlari topilmadi</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TestViewModal
