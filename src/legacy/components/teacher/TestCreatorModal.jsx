import React, { useState } from 'react'
import { 
    FiX, 
    FiPlus, 
    FiTrash2, 
    FiCheck, 
    FiClock, 
    FiUsers, 
    FiTarget,
    FiHelpCircle,
    FiSave
} from 'react-icons/fi'
import { testAssignmentAPI } from '../../api/apiTestEndAssignments'

const TestCreatorModal = ({ isOpen, onClose, videoId, onTestCreated }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const [testData, setTestData] = useState({
        course_video: videoId || null,
        title: '',
        description: '',
        time_limit_minutes: 15,
        attempts_allowed: 1,
        pass_score: 60,
        is_active: true,
        questions: [
            {
                text: '',
                order: 1,
                points: 1,
                options: [
                    { text: '', is_correct: false, order: 1 },
                    { text: '', is_correct: false, order: 2 }
                ]
            }
        ]
    })

    // Video ID o'zgarganda testData ni yangilash
    React.useEffect(() => {
        if (videoId && isOpen) {
            setTestData({
                course_video: videoId,
                title: '',
                description: '',
                time_limit_minutes: 15,
                attempts_allowed: 1,
                pass_score: 60,
                is_active: true,
                questions: [
                    {
                        text: '',
                        order: 1,
                        points: 1,
                        options: [
                            { text: '', is_correct: false, order: 1 },
                            { text: '', is_correct: false, order: 2 }
                        ]
                    }
                ]
            })
            setError(null)
        }
    }, [videoId, isOpen])

    const handleInputChange = (field, value) => {
        setTestData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleQuestionChange = (questionIndex, field, value) => {
        setTestData(prev => ({
            ...prev,
            questions: prev.questions.map((q, index) => 
                index === questionIndex ? { ...q, [field]: value } : q
            )
        }))
    }

    const handleOptionChange = (questionIndex, optionIndex, field, value) => {
        setTestData(prev => ({
            ...prev,
            questions: prev.questions.map((q, qIndex) => 
                qIndex === questionIndex ? {
                    ...q,
                    options: q.options.map((opt, oIndex) => 
                        oIndex === optionIndex ? { ...opt, [field]: value } : opt
                    )
                } : q
            )
        }))
    }

    const addQuestion = () => {
        setTestData(prev => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    text: '',
                    order: prev.questions.length + 1,
                    points: 1,
                    options: [
                        { text: '', is_correct: false, order: 1 },
                        { text: '', is_correct: false, order: 2 }
                    ]
                }
            ]
        }))
    }

    const removeQuestion = (questionIndex) => {
        if (testData.questions.length > 1) {
            setTestData(prev => ({
                ...prev,
                questions: prev.questions.filter((_, index) => index !== questionIndex)
                    .map((q, index) => ({ ...q, order: index + 1 }))
            }))
        }
    }

    const addOption = (questionIndex) => {
        setTestData(prev => ({
            ...prev,
            questions: prev.questions.map((q, index) => 
                index === questionIndex ? {
                    ...q,
                    options: [
                        ...q.options,
                        { 
                            text: '', 
                            is_correct: false, 
                            order: q.options.length + 1 
                        }
                    ]
                } : q
            )
        }))
    }

    const removeOption = (questionIndex, optionIndex) => {
        setTestData(prev => ({
            ...prev,
            questions: prev.questions.map((q, qIndex) => 
                qIndex === questionIndex ? {
                    ...q,
                    options: q.options.filter((_, oIndex) => oIndex !== optionIndex)
                        .map((opt, index) => ({ ...opt, order: index + 1 }))
                } : q
            )
        }))
    }

    const setCorrectOption = (questionIndex, optionIndex) => {
        setTestData(prev => ({
            ...prev,
            questions: prev.questions.map((q, qIndex) => 
                qIndex === questionIndex ? {
                    ...q,
                    options: q.options.map((opt, oIndex) => ({
                        ...opt,
                        is_correct: oIndex === optionIndex
                    }))
                } : q
            )
        }))
    }

    const validateTest = () => {
        if (!testData.course_video) {
            throw new Error('Video ID topilmadi!')
        }
        
        if (!testData.title.trim()) {
            throw new Error('Test nomini kiriting!')
        }
        
        if (testData.questions.length === 0) {
            throw new Error('Kamida bitta savol qo\'shing!')
        }

        testData.questions.forEach((question, qIndex) => {
            if (!question.text.trim()) {
                throw new Error(`${qIndex + 1}-savol matnini kiriting!`)
            }
            
            if (question.options.length < 2) {
                throw new Error(`${qIndex + 1}-savol uchun kamida 2 ta variant kerak!`)
            }
            
            const hasCorrectAnswer = question.options.some(opt => opt.is_correct)
            if (!hasCorrectAnswer) {
                throw new Error(`${qIndex + 1}-savol uchun to'g'ri javobni belgilang!`)
            }
            
            question.options.forEach((option, oIndex) => {
                if (!option.text.trim()) {
                    throw new Error(`${qIndex + 1}-savol ${oIndex + 1}-variantini kiriting!`)
                }
            })
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            setError(null)
            setLoading(true)
            
            console.log('Test yaratish ma\'lumotlari:', testData)
            console.log('Video ID:', testData.course_video)
            
            validateTest()
            
            const response = await testAssignmentAPI.createTest(testData)
            
            onTestCreated(response)
            onClose()
            
        } catch (error) {
            console.error('Test creation error:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setTestData({
            course_video: videoId,
            title: '',
            description: '',
            time_limit_minutes: 15,
            attempts_allowed: 1,
            pass_score: 60,
            is_active: true,
            questions: [
                {
                    text: '',
                    order: 1,
                    points: 1,
                    options: [
                        { text: '', is_correct: false, order: 1 },
                        { text: '', is_correct: false, order: 2 }
                    ]
                }
            ]
        })
        setError(null)
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="test-modal-overlay" onClick={handleClose}>
            <div className="test-modal" onClick={(e) => e.stopPropagation()}>
                <div className="test-modal-header">
                    <h2><FiHelpCircle /> Test yaratish</h2>
                    <button 
                        className="modal-close-btn"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        <FiX />
                    </button>
                </div>

                <div className="test-modal-content">
                    <form onSubmit={handleSubmit}>
                        {/* Test Settings */}
                        <div className="test-settings">
                            <h3>Test sozlamalari</h3>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="title">Test nomi *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={testData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Masalan: Python Basics Quiz"
                                        className="form-input"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Tavsif</label>
                                <textarea
                                    id="description"
                                    value={testData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Test haqida qisqacha ma'lumot"
                                    className="form-input form-textarea"
                                    rows="2"
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="time_limit">
                                        <FiClock /> Vaqt chegarasi (daqiqa)
                                    </label>
                                    <input
                                        type="number"
                                        id="time_limit"
                                        value={testData.time_limit_minutes}
                                        onChange={(e) => handleInputChange('time_limit_minutes', parseInt(e.target.value) || 15)}
                                        min="1"
                                        max="180"
                                        className="form-input"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="attempts">
                                        <FiUsers /> Urinishlar soni
                                    </label>
                                    <input
                                        type="number"
                                        id="attempts"
                                        value={testData.attempts_allowed}
                                        onChange={(e) => handleInputChange('attempts_allowed', parseInt(e.target.value) || 1)}
                                        min="1"
                                        max="10"
                                        className="form-input"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="pass_score">
                                        <FiTarget /> O'tish bali (%)
                                    </label>
                                    <input
                                        type="number"
                                        id="pass_score"
                                        value={testData.pass_score}
                                        onChange={(e) => handleInputChange('pass_score', parseInt(e.target.value) || 60)}
                                        min="1"
                                        max="100"
                                        className="form-input"
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Questions */}
                        <div className="test-questions">
                            <div className="questions-header">
                                <h3>Savollar ({testData.questions.length})</h3>
                                <button
                                    type="button"
                                    className="btn btn-outline btn-sm"
                                    onClick={addQuestion}
                                    disabled={loading}
                                >
                                    <FiPlus /> Savol qo'shish
                                </button>
                            </div>

                            {testData.questions.map((question, questionIndex) => (
                                <div key={questionIndex} className="question-card">
                                    <div className="question-header">
                                        <span className="question-number">Savol {questionIndex + 1}</span>
                                        {testData.questions.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn-icon btn-danger"
                                                onClick={() => removeQuestion(questionIndex)}
                                                disabled={loading}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label>Savol matni *</label>
                                        <textarea
                                            value={question.text}
                                            onChange={(e) => handleQuestionChange(questionIndex, 'text', e.target.value)}
                                            placeholder="Savolni kiriting..."
                                            className="form-input form-textarea"
                                            rows="2"
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group form-group-small">
                                            <label>Ball</label>
                                            <input
                                                type="number"
                                                value={question.points}
                                                onChange={(e) => handleQuestionChange(questionIndex, 'points', parseInt(e.target.value) || 1)}
                                                min="1"
                                                max="100"
                                                className="form-input"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="question-options">
                                        <div className="options-header">
                                            <label>Javob variantlari *</label>
                                            <button
                                                type="button"
                                                className="btn btn-outline btn-xs"
                                                onClick={() => addOption(questionIndex)}
                                                disabled={loading}
                                            >
                                                <FiPlus /> Variant qo'shish
                                            </button>
                                        </div>

                                        {question.options.map((option, optionIndex) => (
                                            <div key={optionIndex} className="option-item">
                                                <div className="option-input">
                                                    <input
                                                        type="text"
                                                        value={option.text}
                                                        onChange={(e) => handleOptionChange(questionIndex, optionIndex, 'text', e.target.value)}
                                                        placeholder={`Variant ${optionIndex + 1}`}
                                                        className="form-input"
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                                
                                                <button
                                                    type="button"
                                                    className={`correct-btn ${option.is_correct ? 'active' : ''}`}
                                                    onClick={() => setCorrectOption(questionIndex, optionIndex)}
                                                    disabled={loading}
                                                    title="To'g'ri javob"
                                                >
                                                    <FiCheck />
                                                </button>

                                                {question.options.length > 2 && (
                                                    <button
                                                        type="button"
                                                        className="btn-icon btn-danger"
                                                        onClick={() => removeOption(questionIndex, optionIndex)}
                                                        disabled={loading}
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="error-message">
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="test-modal-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Bekor qilish
                            </button>
                            
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner-sm"></div>
                                        Yaratilmoqda...
                                    </>
                                ) : (
                                    <>
                                        <FiSave /> Test yaratish
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

export default TestCreatorModal
