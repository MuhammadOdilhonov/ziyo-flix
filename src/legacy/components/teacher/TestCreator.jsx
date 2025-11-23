"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FiPlus, FiTrash2, FiSave } from "react-icons/fi"

const TestCreator = ({ videoId: videoIdProp, onSave, onCancel }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const fallbackVideoId = params.get("videoId")
    const videoId = videoIdProp || fallbackVideoId || null
    const [testData, setTestData] = useState({
        title: "",
        description: "",
        timeLimit: 30, // minutes
        questions: [
            {
                id: 1,
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
                points: 1,
            },
        ],
    })

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            points: 1,
        }
        setTestData({
            ...testData,
            questions: [...testData.questions, newQuestion],
        })
    }

    const removeQuestion = (questionId) => {
        setTestData({
            ...testData,
            questions: testData.questions.filter((q) => q.id !== questionId),
        })
    }

    const updateQuestion = (questionId, field, value) => {
        setTestData({
            ...testData,
            questions: testData.questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)),
        })
    }

    const updateOption = (questionId, optionIndex, value) => {
        setTestData({
            ...testData,
            questions: testData.questions.map((q) =>
                q.id === questionId
                    ? {
                        ...q,
                        options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)),
                    }
                    : q,
            ),
        })
    }

    const handleSave = () => {
        // Validate test data
        if (!testData.title.trim()) {
            alert("Test nomini kiriting")
            return
        }

        const invalidQuestions = testData.questions.filter(
            (q) => !q.question.trim() || q.options.some((opt) => !opt.trim()),
        )

        if (invalidQuestions.length > 0) {
            alert("Barcha savollar va variantlarni to'ldiring")
            return
        }

        if (typeof onSave === "function") {
            onSave({ ...testData, videoId })
        } else {
            // Navigate back to upload with flag
            const titleParam = encodeURIComponent(testData.title)
            navigate(`/profile/teacher/videos/upload?testDone=1${videoId ? `&videoId=${videoId}` : ""}&title=${titleParam}`)
        }
    }

    const getTotalPoints = () => {
        return testData.questions.reduce((sum, q) => sum + q.points, 0)
    }

    return (
        <div className="test-creator">
            <div className="test-creator__header">
                <h2>Test yaratish</h2>
                <div className="test-creator__stats">
                    <span>{testData.questions.length} savol</span>
                    <span>{getTotalPoints()} ball</span>
                    <span>{testData.timeLimit} daqiqa</span>
                </div>
            </div>

            <div className="test-creator__form">
                <div className="form-group">
                    <label>Test nomi *</label>
                    <input
                        type="text"
                        value={testData.title}
                        onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                        placeholder="Test nomini kiriting"
                    />
                </div>

                <div className="form-group">
                    <label>Tavsif</label>
                    <textarea
                        value={testData.description}
                        onChange={(e) => setTestData({ ...testData, description: e.target.value })}
                        placeholder="Test haqida qisqacha ma'lumot"
                        rows="3"
                    />
                </div>

                <div className="form-group">
                    <label>Vaqt chegarasi (daqiqa) *</label>
                    <input
                        type="number"
                        value={testData.timeLimit}
                        onChange={(e) => setTestData({ ...testData, timeLimit: Number.parseInt(e.target.value) })}
                        min="5"
                        max="180"
                    />
                </div>
            </div>

            <div className="test-creator__questions">
                <div className="questions-header">
                    <h3>Savollar</h3>
                    <button className="btn btn-primary" onClick={addQuestion}>
                        <FiPlus /> Savol qo'shish
                    </button>
                </div>

                {testData.questions.map((question, questionIndex) => (
                    <div key={question.id} className="question-card">
                        <div className="question-header">
                            <span className="question-number">Savol {questionIndex + 1}</span>
                            <div className="question-actions">
                                <input
                                    type="number"
                                    value={question.points}
                                    onChange={(e) => updateQuestion(question.id, "points", Number.parseInt(e.target.value) || 1)}
                                    min="1"
                                    max="10"
                                    className="points-input"
                                />
                                <span>ball</span>
                                {testData.questions.length > 1 && (
                                    <button className="btn btn-danger btn-sm" onClick={() => removeQuestion(question.id)}>
                                        <FiTrash2 />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Savol matni *</label>
                            <textarea
                                value={question.question}
                                onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                                placeholder="Savolni kiriting"
                                rows="2"
                            />
                        </div>

                        <div className="options-grid">
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="option-item">
                                    <label className="option-label">
                                        <input
                                            type="radio"
                                            name={`correct-${question.id}`}
                                            checked={question.correctAnswer === optionIndex}
                                            onChange={() => updateQuestion(question.id, "correctAnswer", optionIndex)}
                                        />
                                        <span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                        placeholder={`${String.fromCharCode(65 + optionIndex)} variant`}
                                        className="option-input"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="test-creator__actions">
                <button className="btn btn-secondary" onClick={onCancel || (() => navigate(-1))}>
                    Bekor qilish
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                    <FiSave /> Testni saqlash
                </button>
            </div>
        </div>
    )
}

export default TestCreator
