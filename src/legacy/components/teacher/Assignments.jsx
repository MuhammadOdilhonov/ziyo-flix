"use client"

import { useState, useEffect } from "react"
import { FiPlus, FiEdit, FiTrash2, FiEye, FiDownload, FiCheck, FiClock, FiStar, FiMessageSquare, FiX } from "react-icons/fi"

const TeacherAssignments = () => {
    const [assignments, setAssignments] = useState([])
    const [submissions, setSubmissions] = useState([])
    const [activeTab, setActiveTab] = useState("assignments")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showGradingModal, setShowGradingModal] = useState(false)
    const [selectedSubmission, setSelectedSubmission] = useState(null)
    const [gradingForm, setGradingForm] = useState({
        score: "",
        feedback: "",
    })
    const [assignmentForm, setAssignmentForm] = useState({
        title: "",
        description: "",
        videoId: "",
        dueDate: "",
        maxScore: 100,
        instructions: "",
    })

    useEffect(() => {
        fetchAssignments()
        fetchSubmissions()
    }, [])

    const fetchAssignments = async () => {
        // Mock data - replace with actual API call
        const mockAssignments = [
            {
                id: 1,
                title: "JavaScript Variables va Functions",
                description: "O'zgaruvchilar va funksiyalar haqida amaliy vazifa",
                videoTitle: "JavaScript Asoslari - 1-dars",
                videoId: 1,
                dueDate: "2024-03-25",
                maxScore: 100,
                submissionsCount: 15,
                gradedCount: 10,
                createdDate: "2024-03-15",
            },
            {
                id: 2,
                title: "React Component yaratish",
                description: "Oddiy React komponenti yarating",
                videoTitle: "React Hooks Tutorial",
                videoId: 2,
                dueDate: "2024-03-30",
                maxScore: 100,
                submissionsCount: 8,
                gradedCount: 5,
                createdDate: "2024-03-18",
            },
        ]
        setAssignments(mockAssignments)
    }

    const fetchSubmissions = async () => {
        // Mock data - replace with actual API call
        const mockSubmissions = [
            {
                id: 1,
                assignmentId: 1,
                assignmentTitle: "JavaScript Variables va Functions",
                studentName: "Ahmadjon Karimov",
                studentEmail: "ahmad@example.com",
                submissionDate: "2024-03-20",
                status: "pending",
                fileUrl: "/path/to/file.zip",
                score: null,
                feedback: "",
            },
            {
                id: 2,
                assignmentId: 1,
                assignmentTitle: "JavaScript Variables va Functions",
                studentName: "Malika Tosheva",
                studentEmail: "malika@example.com",
                submissionDate: "2024-03-19",
                status: "graded",
                fileUrl: "/path/to/file.zip",
                score: 85,
                feedback: "Yaxshi ish, lekin ba'zi qismlarni yaxshilash mumkin",
            },
        ]
        setSubmissions(mockSubmissions)
    }

    const handleCreateAssignment = async (e) => {
        e.preventDefault()
        console.log("[v0] Creating assignment:", assignmentForm)

        const newAssignment = {
            id: Date.now(),
            ...assignmentForm,
            submissionsCount: 0,
            gradedCount: 0,
            createdDate: new Date().toISOString().split("T")[0],
        }

        setAssignments([...assignments, newAssignment])
        setShowCreateModal(false)
        setAssignmentForm({
            title: "",
            description: "",
            videoId: "",
            dueDate: "",
            maxScore: 100,
            instructions: "",
        })
    }

    const handleGradeSubmission = (e) => {
        e.preventDefault()
        if (!selectedSubmission) return

        console.log("[v0] Grading submission:", selectedSubmission.id, gradingForm)

        setSubmissions(
            submissions.map((sub) =>
                sub.id === selectedSubmission.id
                    ? { ...sub, status: "graded", score: Number.parseInt(gradingForm.score), feedback: gradingForm.feedback }
                    : sub
            )
        )

        setShowGradingModal(false)
        setSelectedSubmission(null)
        setGradingForm({ score: "", feedback: "" })
    }

    const openGradingModal = (submission) => {
        setSelectedSubmission(submission)
        setGradingForm({
            score: submission.score || "",
            feedback: submission.feedback || "",
        })
        setShowGradingModal(true)
    }

    const pendingSubmissions = submissions.filter((sub) => sub.status === "pending")
    const gradedSubmissions = submissions.filter((sub) => sub.status === "graded")

    return (
        <div className="teacher-assignments">
            <div className="assignments-header">
                <h1>Vazifalar boshqaruvi</h1>
                <p>O'quvchilar uchun vazifalar yarating va baholang</p>
                <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                    <FiPlus /> Yangi vazifa yaratish
                </button>
            </div>

            <div className="assignments-tabs">
                <button className={activeTab === "assignments" ? "active" : ""} onClick={() => setActiveTab("assignments")}>
                    Vazifalar ({assignments.length})
                </button>
                <button className={activeTab === "submissions" ? "active" : ""} onClick={() => setActiveTab("submissions")}>
                    Topshirilgan vazifalar ({submissions.length})
                </button>
                <button className={activeTab === "pending" ? "active" : ""} onClick={() => setActiveTab("pending")}>
                    Baholanmagan ({pendingSubmissions.length})
                </button>
            </div>

            {activeTab === "assignments" && (
                <div className="assignments-list">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="assignment-card">
                            <div className="assignment-header">
                                <h3>{assignment.title}</h3>
                                <div className="assignment-actions">
                                    <button className="btn btn-secondary">
                                        <FiEye /> Ko'rish
                                    </button>
                                    <button className="btn btn-secondary">
                                        <FiEdit /> Tahrirlash
                                    </button>
                                    <button className="btn btn-danger">
                                        <FiTrash2 /> O'chirish
                                    </button>
                                </div>
                            </div>

                            <p className="assignment-description">{assignment.description}</p>

                            <div className="assignment-meta">
                                <div className="meta-item">
                                    <strong>Video:</strong> {assignment.videoTitle}
                                </div>
                                <div className="meta-item">
                                    <strong>Muddat:</strong> {assignment.dueDate}
                                </div>
                                <div className="meta-item">
                                    <strong>Maksimal ball:</strong> {assignment.maxScore}
                                </div>
                            </div>

                            <div className="assignment-stats">
                                <div className="stat">
                                    <span className="stat-number">{assignment.submissionsCount}</span>
                                    <span className="stat-label">Topshirilgan</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">{assignment.gradedCount}</span>
                                    <span className="stat-label">Baholangan</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-number">{assignment.submissionsCount - assignment.gradedCount}</span>
                                    <span className="stat-label">Kutilmoqda</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "submissions" && (
                <div className="submissions-list">
                    {submissions.map((submission) => (
                        <div key={submission.id} className="submission-card">
                            <div className="submission-header">
                                <div className="student-info">
                                    <h4>{submission.studentName}</h4>
                                    <p>{submission.studentEmail}</p>
                                </div>
                                <div className={`submission-status status-${submission.status}`}>
                                    {submission.status === "pending" ? "Kutilmoqda" : "Baholangan"}
                                </div>
                            </div>

                            <div className="submission-details">
                                <p>
                                    <strong>Vazifa:</strong> {submission.assignmentTitle}
                                </p>
                                <p>
                                    <strong>Topshirilgan:</strong> {submission.submissionDate}
                                </p>
                                {submission.score !== null && (
                                    <p>
                                        <strong>Ball:</strong> {submission.score}/100
                                    </p>
                                )}
                            </div>

                            {submission.feedback && (
                                <div className="submission-feedback">
                                    <strong>Izoh:</strong> {submission.feedback}
                                </div>
                            )}

                            <div className="submission-actions">
                                <button className="btn btn-secondary">
                                    <FiDownload /> Yuklab olish
                                </button>
                                <button
                                    className={`btn ${submission.status === "pending" ? "btn-primary" : "btn-secondary"}`}
                                    onClick={() => openGradingModal(submission)}
                                >
                                    {submission.status === "pending" ? (
                                        <>
                                            <FiCheck /> Baholash
                                        </>
                                    ) : (
                                        <>
                                            <FiEdit /> Tahrirlash
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "pending" && (
                <div className="pending-submissions">
                    <div className="pending-header">
                        <h3>Baholanmagan vazifalar</h3>
                        <p>{pendingSubmissions.length} ta vazifa baholashni kutmoqda</p>
                    </div>

                    <div className="submissions-list">
                        {pendingSubmissions.map((submission) => (
                            <div key={submission.id} className="submission-card urgent">
                                <div className="submission-header">
                                    <div className="student-info">
                                        <h4>{submission.studentName}</h4>
                                        <p>{submission.assignmentTitle}</p>
                                    </div>
                                    <div className="submission-date">
                                        <FiClock />
                                        <span>{submission.submissionDate}</span>
                                    </div>
                                </div>

                                <div className="submission-actions">
                                    <button className="btn btn-secondary">
                                        <FiDownload /> Yuklab olish
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => openGradingModal(submission)}
                                    >
                                        <FiCheck /> Baholash
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Create Assignment Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Yangi vazifa yaratish</h2>
                            <button onClick={() => setShowCreateModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleCreateAssignment} className="assignment-form">
                            <div className="form-group">
                                <label>Vazifa nomi *</label>
                                <input
                                    type="text"
                                    value={assignmentForm.title}
                                    onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
                                    placeholder="Vazifa nomini kiriting"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Tavsif</label>
                                <textarea
                                    value={assignmentForm.description}
                                    onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })}
                                    placeholder="Vazifa haqida qisqacha ma'lumot"
                                    rows="3"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Video dars</label>
                                    <select
                                        value={assignmentForm.videoId}
                                        onChange={(e) => setAssignmentForm({ ...assignmentForm, videoId: e.target.value })}
                                    >
                                        <option value="">Video tanlang</option>
                                        <option value="1">JavaScript Asoslari - 1-dars</option>
                                        <option value="2">React Hooks Tutorial</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Muddat</label>
                                    <input
                                        type="date"
                                        value={assignmentForm.dueDate}
                                        onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Maksimal ball</label>
                                    <input
                                        type="number"
                                        value={assignmentForm.maxScore}
                                        onChange={(e) => setAssignmentForm({ ...assignmentForm, maxScore: e.target.value })}
                                        min="1"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Ko'rsatmalar</label>
                                <textarea
                                    value={assignmentForm.instructions}
                                    onChange={(e) => setAssignmentForm({ ...assignmentForm, instructions: e.target.value })}
                                    placeholder="O'quvchilar uchun batafsil ko'rsatmalar"
                                    rows="4"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" onClick={() => setShowCreateModal(false)}>
                                    Bekor qilish
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    <FiPlus /> Yaratish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Grading Modal */}
            {showGradingModal && selectedSubmission && (
                <div className="modal-overlay">
                    <div className="modal grading-modal">
                        <div className="modal-header">
                            <h2>
                                <FiStar /> Vazifani baholash
                            </h2>
                            <button onClick={() => setShowGradingModal(false)}>
                                <FiX />
                            </button>
                        </div>

                        <div className="grading-content">
                            <div className="submission-info">
                                <h3>{selectedSubmission.studentName}</h3>
                                <p><strong>Vazifa:</strong> {selectedSubmission.assignmentTitle}</p>
                                <p><strong>Topshirilgan:</strong> {selectedSubmission.submissionDate}</p>
                            </div>

                            <form onSubmit={handleGradeSubmission} className="grading-form">
                                <div className="form-group">
                                    <label>Ball (0-100) *</label>
                                    <div className="score-input">
                                        <input
                                            type="number"
                                            value={gradingForm.score}
                                            onChange={(e) => setGradingForm({ ...gradingForm, score: e.target.value })}
                                            min="0"
                                            max="100"
                                            placeholder="85"
                                            required
                                        />
                                        <span className="score-max">/ 100</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Izoh</label>
                                    <textarea
                                        value={gradingForm.feedback}
                                        onChange={(e) => setGradingForm({ ...gradingForm, feedback: e.target.value })}
                                        placeholder="O'quvchi uchun izoh yozing..."
                                        rows="4"
                                    />
                                </div>

                                <div className="grading-actions">
                                    <button type="button" onClick={() => setShowGradingModal(false)}>
                                        Bekor qilish
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        <FiCheck /> Baholash
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherAssignments
