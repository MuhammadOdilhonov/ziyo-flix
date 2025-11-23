"use client"

import { useState, useEffect, useMemo } from "react"
import Skeleton from "../common/Skeleton"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { BsArrowLeft, BsClock, BsCheckCircle, BsXCircle, BsTrophy, BsAward } from "react-icons/bs"
import { getTestByVideoId, submitTestAnswers, getMyTestResults } from "../../api/apiTests"

const TestPage = () => {
    const { tutorialSlug, lessonId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()

    // Get lesson data from location state (optional, for title)
    const lessonData = location.state?.lesson

    // Server-driven test
    const [testData, setTestData] = useState(null)
    const [loadingTest, setLoadingTest] = useState(true)

    const [selectedAnswers, setSelectedAnswers] = useState({})
    const [timeLeft, setTimeLeft] = useState(0)
    const [testStarted, setTestStarted] = useState(false)
    const [testCompleted, setTestCompleted] = useState(false)
    const [testResults, setTestResults] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [shuffledQuestions, setShuffledQuestions] = useState([])

    // Load test by video (lesson) id
    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                setLoadingTest(true)
                const test = await getTestByVideoId(lessonId)
                if (!mounted) return
                setTestData(test)
                if (test?.questions?.length) {
                    const shuffled = [...test.questions].sort(() => Math.random() - 0.5)
                    setShuffledQuestions(shuffled)
                }
            } catch (_) {
                if (mounted) {
                    setTestData(null)
                    setShuffledQuestions([])
                }
            } finally {
                if (mounted) setLoadingTest(false)
            }
        })()
        return () => { mounted = false }
    }, [lessonId])

    // Initialize timer when test starts
    useEffect(() => {
        if (testStarted && timeLeft > 0) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (testStarted && timeLeft === 0) {
            handleTestSubmit()
        }
    }, [testStarted, timeLeft])

    const startTest = () => {
        setTestStarted(true)
        const minutes = testData?.time_limit_minutes ?? lessonData?.testDuration ?? 0
        setTimeLeft(Number(minutes) * 60)
    }

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setSelectedAnswers((prev) => ({
            ...prev,
            [questionIndex]: answerIndex,
        }))
    }

    const handleTestSubmit = async () => {
        if (!shuffledQuestions.length || !testData?.id) return

        // Build payload answers [{question_id, selected_option_id}]
        const answers = shuffledQuestions.map((q, index) => ({
            question_id: q.id,
            selected_option_id: selectedAnswers[index] ?? null,
        })).filter(a => a.selected_option_id !== null)

        try {
            await submitTestAnswers({ test_id: testData.id, answers })
        } catch (e) {
            // even if submit fails, we stop test but show message via console
            console.error("Test submit failed", e)
        }

        // Fetch my results and show the latest attempt for this test
        const results = await getMyTestResults()
        // Try to pick the latest by completed_at
        const latest = results
            .filter(r => typeof r.attempt !== 'undefined')
            .sort((a, b) => (new Date(b.completed_at || 0)) - (new Date(a.completed_at || 0)))[0] || null

        const score = latest?.score ? Math.round(Number(latest.score)) : 0
        const passScore = testData?.pass_score ?? lessonData?.minScore ?? 0
        const passed = score >= Number(passScore)

        setTestResults({
            score,
            correctAnswers: null,
            totalQuestions: shuffledQuestions.length,
            passed,
            results: shuffledQuestions.map((q, index) => ({
                question: q.text || q.question,
                userAnswer: (q.options || []).find(o => o.id === selectedAnswers[index])?.text || "",
                correctAnswer: "",
                isCorrect: undefined,
                explanation: "",
            })),
        })

        setTestCompleted(true)
    }

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }

    const handleGoBack = () => {
        navigate(`/tutorials/${tutorialSlug}`)
    }

    const handleRetakeTest = () => {
        setSelectedAnswers({})
        setTestStarted(false)
        setTestCompleted(false)
        setTestResults(null)
        setCurrentQuestion(0)
        if (lessonData?.testQuestions) {
            const shuffled = [...lessonData.testQuestions].sort(() => Math.random() - 0.5)
            setShuffledQuestions(shuffled)
        }
    }

    if (loadingTest) {
        return (
            <div className="test-page" style={{ padding: 20 }}>
                <div className="skeleton-card">
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                        <Skeleton width={120} height={36} rounded={8} />
                        <Skeleton width={160} height={28} rounded={999} />
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <Skeleton lines={2} />
                    </div>
                    <div style={{ marginTop: 18, display:'grid', gap:12 }}>
                        <Skeleton height={18} />
                        <Skeleton height={18} />
                        <Skeleton height={18} />
                    </div>
                </div>
            </div>
        )
    }

    if (!testData || !Array.isArray(testData?.questions) || testData.questions.length === 0) {
        return (
            <div className="test-page-error">
                <h2>Test topilmadi</h2>
                <p style={{ opacity: 0.9 }}>Ushbu dars uchun test mavjud emas.</p>
                <button onClick={handleGoBack}>Orqaga qaytish</button>
            </div>
        )
    }

    return (
        <div className="test-page">
            <div className="test-page-container">
                {/* Header */}
                <div className="test-page-header">
                    <button className="test-page-back" onClick={handleGoBack}>
                        <BsArrowLeft size={20} />
                        Orqaga
                    </button>
                    <h1 className="test-page-title">{lessonData?.title || testData?.title || "Test"}</h1>
                    {testStarted && !testCompleted && (
                        <div className="test-page-timer">
                            <BsClock size={16} />
                            <span className={timeLeft < 60 ? "warning" : ""}>{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>

                {!testStarted && !testCompleted && (
                    <div className="test-page-intro">
                        <div className="test-page-intro-content">
                            <h2>Testni boshlash</h2>
                            <div className="test-page-info">
                                <div className="test-page-info-item">
                                    <strong>Savollar soni:</strong> {shuffledQuestions.length}
                                </div>
                                <div className="test-page-info-item">
                                    <strong>Vaqt:</strong> {testData?.time_limit_minutes ?? lessonData?.testDuration ?? 0} daqiqa
                                </div>
                                <div className="test-page-info-item">
                                    <strong>O'tish balli:</strong> {Number.isFinite(testData?.pass_score) ? testData.pass_score : 0}%
                                </div>
                                <div className="test-page-info-item">
                                    <strong>Har bir savol:</strong> {shuffledQuestions.length ? Math.round(100 / shuffledQuestions.length) : 0}%
                                </div>
                            </div>
                            <div className="test-page-rules">
                                <h3>Qoidalar:</h3>
                                <ul>
                                    <li>Testni boshlashdan oldin videoni to'liq ko'rib chiqing</li>
                                    <li>Har bir savolga faqat bitta javob tanlash mumkin</li>
                                    <li>Vaqt tugagach test avtomatik yakunlanadi</li>
                                    <li>O'tish uchun kamida {Number.isFinite(testData?.pass_score) ? testData.pass_score : 0}% ball to'plang</li>
                                </ul>
                            </div>
                            <button className="test-page-start-btn" onClick={startTest}>
                                Testni boshlash
                            </button>
                        </div>
                    </div>
                )}

                {testStarted && !testCompleted && (
                    <div className="test-page-content">
                        {/* Progress */}
                        <div className="test-page-progress">
                            <div className="test-page-progress-bar">
                                <div
                                    className="test-page-progress-fill"
                                    style={{ width: `${(Object.keys(selectedAnswers).length / shuffledQuestions.length) * 100}%` }}
                                />
                            </div>
                            <span className="test-page-progress-text">
                                {Object.keys(selectedAnswers).length}/{shuffledQuestions.length} javob berildi
                            </span>
                        </div>

                        {/* Questions */}
                        <div className="test-page-questions">
                            {shuffledQuestions.map((question, qIndex) => (
                                <div key={`${question.id}-${qIndex}`} className="test-page-question">
                                    <h3 className="test-page-question-text">
                                        {qIndex + 1}. {question.text || question.question}
                                    </h3>
                                    <div className="test-page-options">
                                        {(question.options || []).map((option, oIndex) => (
                                            <label
                                                key={oIndex}
                                                className={`test-page-option ${selectedAnswers[qIndex] === option.id ? "selected" : ""}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${qIndex}`}
                                                    value={option.id}
                                                    checked={selectedAnswers[qIndex] === option.id}
                                                    onChange={() => handleAnswerSelect(qIndex, option.id)}
                                                />
                                                <span className="test-page-option-text">{option.text ?? String(option)}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            className="test-page-submit-btn"
                            onClick={handleTestSubmit}
                            disabled={Object.keys(selectedAnswers).length !== shuffledQuestions.length}
                        >
                            Testni yakunlash ({Object.keys(selectedAnswers).length}/{shuffledQuestions.length})
                        </button>
                    </div>
                )}

                {testCompleted && testResults && (
                    <div className="test-page-results">
                        <div className="test-page-results-header">
                            <div className="test-page-score">
                                <BsTrophy size={48} className={testResults.passed ? "success" : "fail"} />
                                <h2>{testResults.score}%</h2>
                                <p>
                                    {testResults.correctAnswers}/{testResults.totalQuestions} to'g'ri javob
                                </p>
                            </div>

                            <div className={`test-page-status ${testResults.passed ? "passed" : "failed"}`}>
                                {testResults.passed ? (
                                    <div className="test-page-success">
                                        <BsCheckCircle size={24} />
                                        <h3>Tabriklaymiz! Test muvaffaqiyatli topshirildi</h3>
                                        <p>Siz keyingi darsga o'ta olasiz</p>
                                    </div>
                                ) : (
                                    <div className="test-page-fail">
                                        <BsXCircle size={24} />
                                        <h3>Test topshirilmadi</h3>
                                        <p>O'tish uchun kamida {lessonData.minScore}% ball kerak</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detailed Results */}
                        <div className="test-page-detailed-results">
                            <h3>Batafsil natijalar</h3>
                            {testResults.results.map((result, index) => (
                                <div key={index} className={`test-page-result-item ${result.isCorrect ? "correct" : "incorrect"}`}>
                                    <div className="test-page-result-question">
                                        <h4>
                                            {index + 1}. {result.question}
                                        </h4>
                                    </div>
                                    <div className="test-page-result-answers">
                                        <div className="test-page-result-user-answer">
                                            <strong>Sizning javobingiz:</strong>
                                            <span className={result.isCorrect ? "correct" : "incorrect"}>
                                                {result.userAnswer}
                                                {result.isCorrect ? <BsCheckCircle size={16} /> : <BsXCircle size={16} />}
                                            </span>
                                        </div>
                                        {!result.isCorrect && (
                                            <div className="test-page-result-correct-answer">
                                                <strong>To'g'ri javob:</strong>
                                                <span className="correct">{result.correctAnswer}</span>
                                            </div>
                                        )}
                                    </div>
                                    {result.explanation && (
                                        <div className="test-page-result-explanation">
                                            <strong>Tushuntirish:</strong> {result.explanation}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="test-page-actions">
                            {testResults.passed ? (
                                <button className="test-page-continue-btn" onClick={handleGoBack}>
                                    <BsAward size={16} />
                                    Keyingi darsga o'tish
                                </button>
                            ) : (
                                <button className="test-page-retry-btn" onClick={handleRetakeTest}>
                                    Testni qayta topshirish
                                </button>
                            )}
                            <button className="test-page-back-btn" onClick={handleGoBack}>
                                Darslar ro'yxatiga qaytish
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TestPage
