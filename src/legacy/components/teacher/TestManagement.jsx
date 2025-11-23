"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    FiFileText,
    FiPlus,
    FiEdit,
    FiTrash2,
    FiEye,
    FiClock,
    FiUsers,
    FiCheck,
    FiX,
    FiSave,
    FiRefreshCw,
    FiBarChart2
} from "react-icons/fi"
import { teacherAPI } from "../../api/apiTeacher"

const TestManagement = () => {
    const navigate = useNavigate()
    const { channelSlug, courseSlug, videoId } = useParams()
    const [loading, setLoading] = useState(true)
    const [testData, setTestData] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [editingQuestion, setEditingQuestion] = useState(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [newTest, setNewTest] = useState({
        title: '',
        description: '',
        time_limit_minutes: 30,
        attempts_allowed: 1,
        pass_score: 80,
        is_active: true,
        questions: []
    })
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        points: 10,
        options: [
            { text: '', is_correct: false, order: 1 },
            { text: '', is_correct: false, order: 2 }
        ]
    })

    useEffect(() => {
        if (videoId) {
            fetchTestData()
        }
    }, [videoId])

    const fetchTestData = async () => {
        try {
            setLoading(true)
            const response = await teacherAPI.getVideoTests(channelSlug, courseSlug, videoId)
            setTestData(response.data)
        } catch (error) {
            console.error('Test fetch error:', error)
            // Mock data fallback
            setTestData({
                video: 74,
                video_test: {
                    id: 1,
                    course_video: 74,
                    title: "test",
                    description: "nimadir",
                    time_limit_minutes: 30,
                    attempts_allowed: 1,
                    pass_score: 80,
                    is_active: true,
                    created_at: "2025-09-18T08:52:12.029912Z",
                    attempts: 1,
                    pass_rate: 100.0,
                    questions: [
                        {
                            id: 1,
                            text: "Eng zo'r dasturchi kim?",
                            order: 1,
                            points: 10,
                            options: [
                                {
                                    id: 1,
                                    text: "Behruz",
                                    is_correct: true,
                                    order: 1
                                },
                                {
                                    id: 2,
                                    text: "Muhammad",
                                    is_correct: false,
                                    order: 2
                                },
                                {
                                    id: 3,
                                    text: "Kimdir",
                                    is_correct: false,
                                    order: 3
                                }
                            ]
                        }
                    ]
                }
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTest = async () => {
        try {
            const response = await teacherAPI.createVideoTest(channelSlug, courseSlug, videoId, newTest)
            setTestData(response.data)
            setShowCreateModal(false)
            setNewTest({
                title: '',
                description: '',
                time_limit_minutes: 30,
                attempts_allowed: 1,
                pass_score: 80,
                is_active: true,
                questions: []
            })
        } catch (error) {
            console.error('Test creation error:', error)
            alert('Test yaratishda xatolik!')
        }
    }

    const handleUpdateTest = async () => {
        try {
            const response = await teacherAPI.updateVideoTest(
                channelSlug,
                courseSlug,
                videoId,
                testData.video_test.id,
                testData.video_test
            )
            setTestData(response.data)
            setIsEditing(false)
        } catch (error) {
            console.error('Test update error:', error)
            alert('Test yangilashda xatolik!')
        }
    }

    const handleDeleteTest = async () => {
        if (!window.confirm('Testni o\'chirishni xohlaysizmi?')) return

        try {
            await teacherAPI.deleteVideoTest(channelSlug, courseSlug, videoId, testData.video_test.id)
            setTestData(null)
        } catch (error) {
            console.error('Test deletion error:', error)
            alert('Test o\'chirishda xatolik!')
        }
    }

    const addQuestion = () => {
        const question = {
            ...newQuestion,
            id: Date.now(),
            order: testData.video_test.questions.length + 1
        }

        setTestData(prev => ({
            ...prev,
            video_test: {
                ...prev.video_test,
                questions: [...prev.video_test.questions, question]
            }
        }))

        setNewQuestion({
            text: '',
            points: 10,
            options: [
                { text: '', is_correct: false, order: 1 },
                { text: '', is_correct: false, order: 2 }
            ]
        })
    }

    const updateQuestion = (questionId, field, value) => {
        setTestData(prev => ({
            ...prev,
            video_test: {
                ...prev.video_test,
                questions: prev.video_test.questions.map(q =>
                    q.id === questionId ? { ...q, [field]: value } : q
                )
            }
        }))
    }

    const updateOption = (questionId, optionId, field, value) => {
        setTestData(prev => ({
            ...prev,
            video_test: {
                ...prev.video_test,
                questions: prev.video_test.questions.map(q =>
                    q.id === questionId ? {
                        ...q,
                        options: q.options.map(opt =>
                            opt.id === optionId ? { ...opt, [field]: value } : opt
                        )
                    } : q
                )
            }
        }))
    }

    const addOption = (questionId) => {
        setTestData(prev => ({
            ...prev,
            video_test: {
                ...prev.video_test,
                questions: prev.video_test.questions.map(q =>
                    q.id === questionId ? {
                        ...q,
                        options: [...q.options, {
                            id: Date.now(),
                            text: '',
                            is_correct: false,
                            order: q.options.length + 1
                        }]
                    } : q
                )
            }
        }))
    }

    const removeOption = (questionId, optionId) => {
        setTestData(prev => ({
            ...prev,
            video_test: {
                ...prev.video_test,
                questions: prev.video_test.questions.map(q =>
                    q.id === questionId ? {
                        ...q,
                        options: q.options.filter(opt => opt.id !== optionId)
                    } : q
                )
            }
        }))
    }

    const removeQuestion = (questionId) => {
        setTestData(prev => ({
            ...prev,
            video_test: {
                ...prev.video_test,
                questions: prev.video_test.questions.filter(q => q.id !== questionId)
            }
        }))
    }

    if (loading) {
        return (
            <div className="test-management">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Test ma'lumotlari yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="test-management">
            <div className="page-header">
                <div className="header-content">
                    <h1><FiFileText /> Test boshqaruvi</h1>
                    <p>Video uchun test yarating va boshqaring</p>
                </div>
                <div className="header-actions">
                    {!testData?.video_test ? (
                        <button
                            className="btn btn-primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <FiPlus /> Test yaratish
                        </button>
                    ) : (
                        <div className="action-group">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <FiEdit /> {isEditing ? 'Saqlash' : 'Tahrirlash'}
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteTest}
                            >
                                <FiTrash2 /> O'chirish
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {!testData?.video_test ? (
                <div className="empty-state">
                    <FiFileText size={64} />
                    <h3>Test mavjud emas</h3>
                    <p>Bu video uchun hali test yaratilmagan</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        <FiPlus /> Test yaratish
                    </button>
                </div>
            ) : (
                <div className="test-content">
                    {/* Test Overview */}
                    <div className="test-overview">
                        <div className="overview-header">
                            <h2>{testData.video_test.title}</h2>
                            <div className="test-status">
                                <span className={`status-badge ${testData.video_test.is_active ? 'active' : 'inactive'}`}>
                                    {testData.video_test.is_active ? 'Faol' : 'Nofaol'}
                                </span>
                            </div>
                        </div>

                        <p className="test-description">{testData.video_test.description}</p>

                        <div className="test-stats">
                            <div className="stat-item">
                                <FiClock />
                                <span>{testData.video_test.time_limit_minutes} daqiqa</span>
                            </div>
                            <div className="stat-item">
                                <FiUsers />
                                <span>{testData.video_test.attempts} urinish</span>
                            </div>
                            <div className="stat-item">
                                <FiCheck />
                                <span>{testData.video_test.pass_score}% o'tish</span>
                            </div>
                            <div className="stat-item">
                                <FiBarChart2 />
                                <span>{testData.video_test.pass_rate}% o'tish darajasi</span>
                            </div>
                        </div>
                    </div>

                    {/* Test Settings */}
                    {isEditing && (
                        <div className="test-settings">
                            <h3>Test sozlamalari</h3>
                            <div className="settings-grid">
                                <div className="form-group">
                                    <label>Test sarlavhasi</label>
                                    <input
                                        type="text"
                                        value={testData.video_test.title}
                                        onChange={(e) => setTestData(prev => ({
                                            ...prev,
                                            video_test: { ...prev.video_test, title: e.target.value }
                                        }))}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Tavsif</label>
                                    <textarea
                                        value={testData.video_test.description}
                                        onChange={(e) => setTestData(prev => ({
                                            ...prev,
                                            video_test: { ...prev.video_test, description: e.target.value }
                                        }))}
                                        className="form-textarea"
                                        rows="3"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Vaqt chegarasi (daqiqa)</label>
                                    <input
                                        type="number"
                                        value={testData.video_test.time_limit_minutes}
                                        onChange={(e) => setTestData(prev => ({
                                            ...prev,
                                            video_test: { ...prev.video_test, time_limit_minutes: parseInt(e.target.value) }
                                        }))}
                                        className="form-input"
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Urinishlar soni</label>
                                    <input
                                        type="number"
                                        value={testData.video_test.attempts_allowed}
                                        onChange={(e) => setTestData(prev => ({
                                            ...prev,
                                            video_test: { ...prev.video_test, attempts_allowed: parseInt(e.target.value) }
                                        }))}
                                        className="form-input"
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>O'tish balli (%)</label>
                                    <input
                                        type="number"
                                        value={testData.video_test.pass_score}
                                        onChange={(e) => setTestData(prev => ({
                                            ...prev,
                                            video_test: { ...prev.video_test, pass_score: parseInt(e.target.value) }
                                        }))}
                                        className="form-input"
                                        min="1"
                                        max="100"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={testData.video_test.is_active}
                                            onChange={(e) => setTestData(prev => ({
                                                ...prev,
                                                video_test: { ...prev.video_test, is_active: e.target.checked }
                                            }))}
                                        />
                                        Test faol
                                    </label>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={handleUpdateTest}
                            >
                                <FiSave /> Sozlamalarni saqlash
                            </button>
                        </div>
                    )}

                    {/* Questions */}
                    <div className="questions-section">
                        <div className="section-header">
                            <h3>Savollar ({testData.video_test.questions.length})</h3>
                            {isEditing && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setEditingQuestion('new')}
                                >
                                    <FiPlus /> Savol qo'shish
                                </button>
                            )}
                        </div>

                        <div className="questions-list">
                            {testData.video_test.questions.map((question, index) => (
                                <div key={question.id} className="question-card">
                                    <div className="question-header">
                                        <span className="question-number">{index + 1}.</span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={question.text}
                                                onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                                                className="form-input"
                                                placeholder="Savol matnini kiriting"
                                            />
                                        ) : (
                                            <h4>{question.text}</h4>
                                        )}
                                        {isEditing && (
                                            <div className="question-actions">
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => removeQuestion(question.id)}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="question-options">
                                        {question.options.map((option) => (
                                            <div key={option.id} className={`option-item ${option.is_correct ? 'correct' : ''}`}>
                                                {isEditing ? (
                                                    <>
                                                        <input
                                                            type="text"
                                                            value={option.text}
                                                            onChange={(e) => updateOption(question.id, option.id, 'text', e.target.value)}
                                                            className="form-input"
                                                            placeholder="Variant matni"
                                                        />
                                                        <label className="correct-checkbox">
                                                            <input
                                                                type="checkbox"
                                                                checked={option.is_correct}
                                                                onChange={(e) => updateOption(question.id, option.id, 'is_correct', e.target.checked)}
                                                            />
                                                            To'g'ri
                                                        </label>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => removeOption(question.id, option.id)}
                                                        >
                                                            <FiX />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="option-text">{option.text}</span>
                                                        {option.is_correct && <FiCheck className="correct-icon" />}
                                                    </>
                                                )}
                                            </div>
                                        ))}

                                        {isEditing && (
                                            <button
                                                className="btn btn-outline btn-sm"
                                                onClick={() => addOption(question.id)}
                                            >
                                                <FiPlus /> Variant qo'shish
                                            </button>
                                        )}
                                    </div>

                                    {isEditing && (
                                        <div className="question-settings">
                                            <div className="form-group">
                                                <label>Ball</label>
                                                <input
                                                    type="number"
                                                    value={question.points}
                                                    onChange={(e) => updateQuestion(question.id, 'points', parseInt(e.target.value))}
                                                    className="form-input"
                                                    min="1"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Create Test Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Yangi test yaratish</h2>
                            <button onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        <div className="modal-content">
                            <div className="form-group">
                                <label>Test sarlavhasi *</label>
                                <input
                                    type="text"
                                    value={newTest.title}
                                    onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                                    className="form-input"
                                    placeholder="Test sarlavhasini kiriting"
                                />
                            </div>

                            <div className="form-group">
                                <label>Tavsif</label>
                                <textarea
                                    value={newTest.description}
                                    onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                                    className="form-textarea"
                                    rows="3"
                                    placeholder="Test haqida qisqacha ma'lumot"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Vaqt chegarasi (daqiqa)</label>
                                    <input
                                        type="number"
                                        value={newTest.time_limit_minutes}
                                        onChange={(e) => setNewTest({ ...newTest, time_limit_minutes: parseInt(e.target.value) })}
                                        className="form-input"
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Urinishlar soni</label>
                                    <input
                                        type="number"
                                        value={newTest.attempts_allowed}
                                        onChange={(e) => setNewTest({ ...newTest, attempts_allowed: parseInt(e.target.value) })}
                                        className="form-input"
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>O'tish balli (%)</label>
                                    <input
                                        type="number"
                                        value={newTest.pass_score}
                                        onChange={(e) => setNewTest({ ...newTest, pass_score: parseInt(e.target.value) })}
                                        className="form-input"
                                        min="1"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleCreateTest}
                                    disabled={!newTest.title}
                                >
                                    <FiPlus /> Test yaratish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TestManagement
