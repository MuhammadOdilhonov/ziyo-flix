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
    FiTrash2,
    FiBarChart,
    FiCalendar,
    FiActivity
} from 'react-icons/fi'
import { testAssignmentAPI } from '../../api/apiTestEndAssignments'

const VideoTestsModal = ({ isOpen, onClose, video, channelSlug, courseSlug }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [testData, setTestData] = useState(null)
    const [selectedTestId, setSelectedTestId] = useState(null)
    const [availableTests, setAvailableTests] = useState([])
    const [currentTest, setCurrentTest] = useState(null)

    useEffect(() => {
        if (isOpen && video && channelSlug && courseSlug) {
            fetchVideoTests()
        }
    }, [isOpen, video, channelSlug, courseSlug])

    const fetchVideoTests = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Video obyektidan tests_brief ni olish
            if (video?.tests_brief && video.tests_brief.length > 0) {
                setAvailableTests(video.tests_brief)
                
                // Birinchi testni default qilib tanlash
                if (!selectedTestId) {
                    const firstTestId = video.tests_brief[0].id
                    setSelectedTestId(firstTestId)
                    
                    // Birinchi testning batafsil ma'lumotlarini yuklash
                    try {
                        const response = await testAssignmentAPI.getTest(firstTestId, channelSlug, courseSlug, video.id)
                        setCurrentTest(response)
                    } catch (error) {
                        console.error('Error loading first test:', error)
                        setError('Birinchi testni yuklashda xatolik!')
                    }
                }
            } else {
                // Testlar yo'q
                setAvailableTests([])
                setCurrentTest(null)
                setError('Bu video uchun testlar topilmadi!')
            }
            
        } catch (error) {
            console.error('Error fetching video tests:', error)
            setError('Testlarni yuklashda xatolik yuz berdi!')
        } finally {
            setLoading(false)
        }
    }

    // Test tanlash funksiyasi
    const handleTestSelect = async (testId) => {
        if (testId === selectedTestId) return
        
        try {
            setSelectedTestId(testId)
            setLoading(true)
            setError(null)
            
            // Tanlangan testning batafsil ma'lumotlarini yuklash
            const response = await testAssignmentAPI.getTest(testId, channelSlug, courseSlug, video.id)
            setCurrentTest(response)
            
        } catch (error) {
            console.error('Error fetching test details:', error)
            setError('Test ma\'lumotlarini yuklashda xatolik!')
            setCurrentTest(null)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Belgilanmagan'
        const date = new Date(dateString)
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleClose = () => {
        setTestData(null)
        setCurrentTest(null)
        setAvailableTests([])
        setSelectedTestId(null)
        setError(null)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="video-tests-modal-overlay" onClick={handleClose}>
            <div className="video-tests-modal" onClick={(e) => e.stopPropagation()}>
                <div className="video-tests-modal-header">
                    <div className="header-info">
                        <h2><FiHelpCircle /> Video Testlari</h2>
                        <p className="video-title">{video?.title}</p>
                    </div>
                    <button 
                        className="modal-close-btn"
                        onClick={handleClose}
                    >
                        <FiX />
                    </button>
                </div>

                <div className="video-tests-modal-content">
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
                                onClick={fetchVideoTests}
                            >
                                Qayta urinish
                            </button>
                        </div>
                    ) : (testData?.video_test || currentTest) ? (
                        <div className="test-content">
                            {/* Test Selector - ko'p testlar bo'lsa */}
                            {availableTests.length > 1 && (
                                <div className="test-selector">
                                    <h4>Testlarni tanlang:</h4>
                                    <div className="test-buttons">
                                        {availableTests.map((test) => (
                                            <button
                                                key={test.id}
                                                className={`test-btn ${selectedTestId === test.id ? 'active' : ''}`}
                                                onClick={() => handleTestSelect(test.id)}
                                            >
                                                <FiHelpCircle />
                                                {test.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Test Overview */}
                            {currentTest && (
                                <div className="test-overview">
                                    <div className="test-header">
                                        <h3>{currentTest.title}</h3>
                                        <div className="test-status">
                                            <span className={`status-badge ${currentTest.is_active ? 'active' : 'inactive'}`}>
                                                {currentTest.is_active ? 'Faol' : 'Nofaol'}
                                            </span>
                                        </div>
                                    </div>

                                    {currentTest.description && (
                                        <p className="test-description">{currentTest.description}</p>
                                    )}

                                    {/* Test Statistics */}
                                    <div className="test-stats-grid">
                                        <div className="stat-card">
                                            <div className="stat-icon">
                                                <FiClock />
                                            </div>
                                            <div className="stat-content">
                                                <span className="stat-label">Vaqt chegarasi</span>
                                                <span className="stat-value">{currentTest.time_limit_minutes} daqiqa</span>
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">
                                                <FiUsers />
                                            </div>
                                            <div className="stat-content">
                                                <span className="stat-label">Urinishlar</span>
                                                <span className="stat-value">{currentTest.attempts_allowed}</span>
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">
                                                <FiTarget />
                                            </div>
                                            <div className="stat-content">
                                                <span className="stat-label">O'tish bali</span>
                                                <span className="stat-value">{currentTest.pass_score}%</span>
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">
                                                <FiActivity />
                                            </div>
                                            <div className="stat-content">
                                                <span className="stat-label">Urinishlar soni</span>
                                                <span className="stat-value">{currentTest.attempts}</span>
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">
                                                <FiBarChart />
                                            </div>
                                            <div className="stat-content">
                                                <span className="stat-label">O'tish foizi</span>
                                                <span className="stat-value">{currentTest.pass_rate}%</span>
                                            </div>
                                        </div>

                                        <div className="stat-card">
                                            <div className="stat-icon">
                                                <FiCalendar />
                                            </div>
                                            <div className="stat-content">
                                                <span className="stat-label">Yaratilgan</span>
                                                <span className="stat-value">{formatDate(currentTest.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Questions */}
                                    <div className="test-questions-section">
                                        <div className="section-header">
                                            <h4>Savollar ({currentTest.questions?.length || 0})</h4>
                                            <div className="total-points">
                                                Jami: {currentTest.questions?.reduce((sum, q) => sum + q.points, 0) || 0} ball
                                            </div>
                                        </div>

                                        {currentTest.questions?.map((question, questionIndex) => (
                                            <div key={question.id} className="question-display-card">
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
                                                
                                                <div className="question-options">
                                                    {question.options?.map((option, optionIndex) => (
                                                        <div 
                                                            key={option.id} 
                                                            className={`option-display-item ${option.is_correct ? 'correct' : ''}`}
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

                                        {(!currentTest.questions || currentTest.questions.length === 0) && (
                                            <div className="no-questions">
                                                <FiHelpCircle />
                                                <p>Bu testda hali savollar yo'q</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-test-state">
                            <FiHelpCircle className="no-test-icon" />
                            <h3>Test topilmadi</h3>
                            <p>Bu video uchun hali test yaratilmagan</p>
                            <button 
                                className="btn btn-primary"
                                onClick={handleClose}
                            >
                                Test yaratish
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VideoTestsModal
