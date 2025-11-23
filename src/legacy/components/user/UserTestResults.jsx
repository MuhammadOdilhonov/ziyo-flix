import React, { useState, useEffect } from 'react'
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiTrendingUp, FiClock, FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getTestResults, getTestResultDetail } from '../../api/apiUserProfile'

const UserTestResults = () => {
    const navigate = useNavigate()
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterType, setFilterType] = useState('all')
    const [selectedTest, setSelectedTest] = useState(null)
    const [testDetail, setTestDetail] = useState(null)
    const [detailLoading, setDetailLoading] = useState(false)

    useEffect(() => {
        fetchTestResults()
    }, [])

    const fetchTestResults = async () => {
        try {
            setLoading(true)
            const data = await getTestResults()
            setResults(data.results || [])
            setError(null)
        } catch (err) {
            console.error('Error fetching test results:', err)
            setError('Test natijalari yuklashda xatolik')
            // Mock data fallback
            setResults([ ])
        } finally {
            setLoading(false)
        }
    }

    const getFilteredResults = () => {
        let filtered = results

        if (filterStatus !== 'all') {
            filtered = filtered.filter(r =>
                filterStatus === 'passed' ? r.is_passed : !r.is_passed
            )
        }

        if (filterType !== 'all') {
            filtered = filtered.filter(r => r.type === filterType)
        }

        return filtered
    }

    const filteredResults = getFilteredResults()

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatTime = (startTime, endTime) => {
        if (!startTime || !endTime) return '0s'
        const start = new Date(startTime)
        const end = new Date(endTime)
        const diffMs = end - start
        const diffSeconds = Math.floor(diffMs / 1000)
        return `${diffSeconds}s`
    }

    const handleTestClick = async (testResult) => {
        try {
            setDetailLoading(true)
            const detail = await getTestResultDetail(testResult.result_id)
            setTestDetail(detail)
            setSelectedTest(testResult)
        } catch (err) {
            console.error('Error fetching test detail:', err)
            alert('Test batafsil ma\'lumotlarini yuklashda xatolik')
        } finally {
            setDetailLoading(false)
        }
    }

    const closeModal = () => {
        setSelectedTest(null)
        setTestDetail(null)
    }

    const stats = {
        total: results.length,
        passed: results.filter(r => r.is_passed).length,
        failed: results.filter(r => !r.is_passed).length,
        passRate: results.length > 0
            ? ((results.filter(r => r.is_passed).length / results.length) * 100).toFixed(1)
            : 0,
        avgScore: results.length > 0
            ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)
            : 0
    }

    return (
        <div className="user-test-results">
            {/* Header */}
            <div className="utr__header">
                
                <h1 className="utr__title">Test natijalari</h1>
                <div className="utr__spacer"></div>
            </div>

            {/* Statistics */}
            <div className="utr__stats">
                <div className="utr__stat-card">
                    <div className="utr__stat-label">Jami testlar</div>
                    <div className="utr__stat-value">{stats.total}</div>
                </div>
                <div className="utr__stat-card success">
                    <div className="utr__stat-label">O'tgan</div>
                    <div className="utr__stat-value">{stats.passed}</div>
                </div>
                <div className="utr__stat-card danger">
                    <div className="utr__stat-label">O'tmagan</div>
                    <div className="utr__stat-value">{stats.failed}</div>
                </div>
                <div className="utr__stat-card">
                    <div className="utr__stat-label">O'tish darajasi</div>
                    <div className="utr__stat-value">{stats.passRate}%</div>
                </div>
                <div className="utr__stat-card">
                    <div className="utr__stat-label">O'rtacha ball</div>
                    <div className="utr__stat-value">{stats.avgScore}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="utr__filters">
                <div className="utr__filter-group">
                    <label className="utr__filter-label">Holati:</label>
                    <div className="utr__filter-buttons">
                        <button
                            className={`utr__filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('all')}
                        >
                            Barchasi ({results.length})
                        </button>
                        <button
                            className={`utr__filter-btn ${filterStatus === 'passed' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('passed')}
                        >
                            O'tgan ({stats.passed})
                        </button>
                        <button
                            className={`utr__filter-btn ${filterStatus === 'failed' ? 'active' : ''}`}
                            onClick={() => setFilterStatus('failed')}
                        >
                            O'tmagan ({stats.failed})
                        </button>
                    </div>
                </div>

                <div className="utr__filter-group">
                    <label className="utr__filter-label">Turi:</label>
                    <div className="utr__filter-buttons">
                        <button
                            className={`utr__filter-btn ${filterType === 'all' ? 'active' : ''}`}
                            onClick={() => setFilterType('all')}
                        >
                            Barchasi
                        </button>
                        <button
                            className={`utr__filter-btn ${filterType === 'video' ? 'active' : ''}`}
                            onClick={() => setFilterType('video')}
                        >
                            Video
                        </button>
                        <button
                            className={`utr__filter-btn ${filterType === 'course_type' ? 'active' : ''}`}
                            onClick={() => setFilterType('course_type')}
                        >
                            Kurs
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="utr__content">
                {loading ? (
                    <div className="utr__loading">
                        <div className="utr__spinner"></div>
                        <p>Yuklanmoqda...</p>
                    </div>
                ) : error && results.length === 0 ? (
                    <div className="utr__error">
                        <FiXCircle />
                        <p>{error}</p>
                    </div>
                ) : filteredResults.length === 0 ? (
                    <div className="utr__empty">
                        <FiXCircle />
                        <p>Natijalar topilmadi</p>
                    </div>
                ) : (
                    <div className="utr__results-grid">
                        {filteredResults.map((result) => (
                            <div
                                key={result.result_id}
                                className={`utr__result-card ${result.is_passed ? 'passed' : 'failed'}`}
                                onClick={() => handleTestClick(result)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="utr__card-header">
                                    <div className="utr__card-status">
                                        {result.is_passed ? (
                                            <FiCheckCircle className="utr__status-icon passed" />
                                        ) : (
                                            <FiXCircle className="utr__status-icon failed" />
                                        )}
                                        <span className="utr__status-text">
                                            {result.is_passed ? 'O\'tgan' : 'O\'tmagan'}
                                        </span>
                                    </div>
                                    <div className="utr__card-score">
                                        <span className="utr__score-value">{result.score.toFixed(1)}</span>
                                        <span className="utr__score-label">/ {result.pass_score}</span>
                                    </div>
                                </div>

                                <div className="utr__card-body">
                                    <div className="utr__info-row">
                                        <span className="utr__info-label">Test ID:</span>
                                        <span className="utr__info-value">{result.test_id}</span>
                                    </div>
                                    <div className="utr__info-row">
                                        <span className="utr__info-label">Turi:</span>
                                        <span className="utr__info-value">{result.type === 'video' ? 'Video' : 'Kurs'}</span>
                                    </div>
                                    <div className="utr__info-row">
                                        <span className="utr__info-label">Urinish:</span>
                                        <span className="utr__info-value">{result.attempt}</span>
                                    </div>
                                    <div className="utr__info-row">
                                        <span className="utr__info-label">Vaqt:</span>
                                        <span className="utr__info-value">
                                            {formatTime(result.started_at, result.completed_at)}
                                        </span>
                                    </div>
                                </div>

                                <div className="utr__card-footer">
                                    <span className="utr__date">
                                        {formatDate(result.completed_at)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Test Detail Modal */}
            {selectedTest && (
                <div className="test-detail-modal-overlay" onClick={closeModal}>
                    <div className="test-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="test-modal-header">
                            <h2>Test natijalari</h2>
                            <button className="test-modal-close" onClick={closeModal}>
                                <FiX />
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="test-modal-loading">
                                <div className="spinner"></div>
                                <p>Yuklanmoqda...</p>
                            </div>
                        ) : testDetail ? (
                            <div className="test-modal-content">
                                {/* Header Info */}
                                <div className="test-info-header">
                                    <div className="test-score-display">
                                        <div className={`score-badge ${selectedTest.is_passed ? 'passed' : 'failed'}`}>
                                            {selectedTest.score.toFixed(0)}%
                                        </div>
                                        <div className="score-info">
                                            <h3>{testDetail.test_title}</h3>
                                            <p>{testDetail.course_video?.title}</p>
                                        </div>
                                    </div>
                                    <div className="test-meta">
                                        <div className="meta-item">
                                            <span className="meta-label">Status:</span>
                                            <span className={`meta-value ${selectedTest.is_passed ? 'passed' : 'failed'}`}>
                                                {selectedTest.is_passed ? '✓ O\'tgan' : '✗ O\'tmagan'}
                                            </span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Urinish:</span>
                                            <span className="meta-value">{selectedTest.attempt}</span>
                                        </div>
                                        <div className="meta-item">
                                            <span className="meta-label">Vaqt:</span>
                                            <span className="meta-value">
                                                {formatTime(selectedTest.started_at, selectedTest.completed_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Questions */}
                                <div className="test-questions">
                                    <h4>Savollar va javoblar</h4>
                                    {testDetail.questions && testDetail.questions.map((question, idx) => (
                                        <div key={question.question_id} className="question-item">
                                            <div className="question-header">
                                                <span className="question-number">Savol {idx + 1}</span>
                                                <span className={`question-status ${question.is_correct ? 'correct' : 'incorrect'}`}>
                                                    {question.is_correct ? '✓ To\'g\'ri' : '✗ Noto\'g\'ri'}
                                                </span>
                                            </div>
                                            <p className="question-text">{question.text}</p>
                                            
                                            <div className="options-list">
                                                {question.options && question.options.map((option) => (
                                                    <div 
                                                        key={option.id} 
                                                        className={`option-item ${option.is_selected ? 'selected' : ''} ${option.is_correct ? 'correct' : ''}`}
                                                    >
                                                        <div className="option-indicator">
                                                            {option.is_selected && <span className="selected-mark">✓</span>}
                                                            {option.is_correct && !option.is_selected && <span className="correct-mark">✓</span>}
                                                        </div>
                                                        <span className="option-text">{option.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="test-modal-error">
                                <p>Ma'lumot yuklashda xatolik</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserTestResults
