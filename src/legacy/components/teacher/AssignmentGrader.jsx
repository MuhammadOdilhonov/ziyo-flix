"use client"

import { useState, useEffect } from "react"
import { FiDownload, FiEye, FiCheck, FiStar, FiClock } from "react-icons/fi"

const AssignmentGrader = () => {
    const [assignments, setAssignments] = useState([])
    const [filter, setFilter] = useState("pending")
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [gradeForm, setGradeForm] = useState({
        score: "",
        maxScore: 100,
        feedback: "",
    })

    useEffect(() => {
        fetchAssignments()
    }, [])

    const fetchAssignments = async () => {
        // Mock data - replace with actual API call
        const mockAssignments = [
            {
                id: 1,
                studentName: "Akmal Toshmatov",
                studentAvatar: "/placeholder.svg?height=40&width=40",
                videoTitle: "JavaScript Asoslari - 1-dars",
                assignmentTitle: "JavaScript o'zgaruvchilar haqida",
                submissionDate: "2024-03-15 14:30",
                status: "pending",
                fileUrl: "/placeholder-document.pdf",
                fileName: "akmal_javascript_vazifa.pdf",
                fileSize: "2.5 MB",
                description: "JavaScript da var, let va const o'zgaruvchilar orasidagi farqlar haqida yozgan.",
            },
            {
                id: 2,
                studentName: "Malika Karimova",
                studentAvatar: "/placeholder.svg?height=40&width=40",
                videoTitle: "React Hooks Tutorial",
                assignmentTitle: "useState Hook amaliyoti",
                submissionDate: "2024-03-14 16:45",
                status: "graded",
                score: 85,
                maxScore: 100,
                feedback: "Yaxshi ishlangan, lekin ba'zi qismlar to'liqroq bo'lishi kerak edi.",
                fileUrl: "/placeholder-document.pdf",
                fileName: "malika_react_vazifa.pdf",
                fileSize: "1.8 MB",
                description: "useState hook yordamida counter komponenti yaratish.",
            },
        ]
        setAssignments(mockAssignments)
    }

    const handleGrade = (assignmentId) => {
        if (!gradeForm.score || gradeForm.score < 0 || gradeForm.score > gradeForm.maxScore) {
            alert("To'g'ri ball kiriting")
            return
        }

        setAssignments(
            assignments.map((assignment) =>
                assignment.id === assignmentId
                    ? {
                        ...assignment,
                        status: "graded",
                        score: Number.parseInt(gradeForm.score),
                        maxScore: gradeForm.maxScore,
                        feedback: gradeForm.feedback,
                        gradedDate: new Date().toISOString(),
                    }
                    : assignment,
            ),
        )

        setSelectedAssignment(null)
        setGradeForm({ score: "", maxScore: 100, feedback: "" })
    }

    const filteredAssignments = assignments.filter((assignment) => {
        if (filter === "all") return true
        return assignment.status === filter
    })

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "#f59e0b"
            case "graded":
                return "#10b981"
            case "late":
                return "#ef4444"
            default:
                return "#6b7280"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return "Kutilmoqda"
            case "graded":
                return "Baholangan"
            case "late":
                return "Kechikkan"
            default:
                return "Noma'lum"
        }
    }

    return (
        <div className="assignment-grader">
            <div className="grader-header">
                <h1>Vazifalarni tekshirish</h1>
                <p>O'quvchilar yuborgan vazifalarni tekshiring va baholang</p>
            </div>

            <div className="grader-stats">
                <div className="stat-card">
                    <h3>{assignments.filter((a) => a.status === "pending").length}</h3>
                    <p>Kutilayotgan</p>
                </div>
                <div className="stat-card">
                    <h3>{assignments.filter((a) => a.status === "graded").length}</h3>
                    <p>Baholangan</p>
                </div>
                <div className="stat-card">
                    <h3>{assignments.length}</h3>
                    <p>Jami vazifalar</p>
                </div>
                <div className="stat-card">
                    <h3>
                        {assignments.filter((a) => a.status === "graded").length > 0
                            ? Math.round(
                                assignments.filter((a) => a.status === "graded").reduce((sum, a) => sum + (a.score || 0), 0) /
                                assignments.filter((a) => a.status === "graded").length,
                            )
                            : 0}
                    </h3>
                    <p>O'rtacha ball</p>
                </div>
            </div>

            <div className="grader-filters">
                <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>
                    Kutilayotgan ({assignments.filter((a) => a.status === "pending").length})
                </button>
                <button className={filter === "graded" ? "active" : ""} onClick={() => setFilter("graded")}>
                    Baholangan ({assignments.filter((a) => a.status === "graded").length})
                </button>
                <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
                    Barchasi ({assignments.length})
                </button>
            </div>

            <div className="assignments-list">
                {filteredAssignments.map((assignment) => (
                    <div key={assignment.id} className="assignment-card">
                        <div className="assignment-header">
                            <div className="student-info">
                                <img
                                    src={assignment.studentAvatar || "/placeholder.svg"}
                                    alt={assignment.studentName}
                                    className="student-avatar"
                                />
                                <div>
                                    <h4>{assignment.studentName}</h4>
                                    <p className="video-title">{assignment.videoTitle}</p>
                                </div>
                            </div>
                            <div className="assignment-status" style={{ color: getStatusColor(assignment.status) }}>
                                {getStatusText(assignment.status)}
                            </div>
                        </div>

                        <div className="assignment-content">
                            <h3>{assignment.assignmentTitle}</h3>
                            <p className="assignment-description">{assignment.description}</p>

                            <div className="assignment-meta">
                                <div className="meta-item">
                                    <FiClock />
                                    <span>Yuborilgan: {assignment.submissionDate}</span>
                                </div>
                                <div className="meta-item">
                                    <FiDownload />
                                    <span>
                                        {assignment.fileName} ({assignment.fileSize})
                                    </span>
                                </div>
                            </div>

                            {assignment.status === "graded" && (
                                <div className="grade-info">
                                    <div className="score">
                                        <FiStar />
                                        <span>
                                            {assignment.score}/{assignment.maxScore} ball
                                        </span>
                                    </div>
                                    {assignment.feedback && (
                                        <div className="feedback">
                                            <strong>Izoh:</strong> {assignment.feedback}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="assignment-actions">
                            <button className="btn btn-secondary">
                                <FiEye /> Ko'rish
                            </button>
                            <button className="btn btn-secondary">
                                <FiDownload /> Yuklab olish
                            </button>
                            {assignment.status === "pending" && (
                                <button className="btn btn-primary" onClick={() => setSelectedAssignment(assignment)}>
                                    <FiCheck /> Baholash
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredAssignments.length === 0 && (
                <div className="empty-state">
                    <h3>Vazifalar topilmadi</h3>
                    <p>
                        Hozircha {filter === "pending" ? "kutilayotgan" : filter === "graded" ? "baholangan" : ""} vazifalar yo'q
                    </p>
                </div>
            )}

            {/* Grading Modal */}
            {selectedAssignment && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Vazifani baholash</h2>
                            <button onClick={() => setSelectedAssignment(null)}>×</button>
                        </div>

                        <div className="modal-content">
                            <div className="assignment-info">
                                <h3>{selectedAssignment.assignmentTitle}</h3>
                                <p>
                                    <strong>O'quvchi:</strong> {selectedAssignment.studentName}
                                </p>
                                <p>
                                    <strong>Video:</strong> {selectedAssignment.videoTitle}
                                </p>
                                <p>
                                    <strong>Yuborilgan:</strong> {selectedAssignment.submissionDate}
                                </p>
                            </div>

                            <div className="grading-form">
                                <div className="form-group">
                                    <label>Ball *</label>
                                    <div className="score-input">
                                        <input
                                            type="number"
                                            value={gradeForm.score}
                                            onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                                            min="0"
                                            max={gradeForm.maxScore}
                                            placeholder="0"
                                        />
                                        <span>/ {gradeForm.maxScore}</span>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Maksimal ball</label>
                                    <input
                                        type="number"
                                        value={gradeForm.maxScore}
                                        onChange={(e) => setGradeForm({ ...gradeForm, maxScore: Number.parseInt(e.target.value) })}
                                        min="1"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Izoh</label>
                                    <textarea
                                        value={gradeForm.feedback}
                                        onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                                        placeholder="O'quvchiga izoh yozing..."
                                        rows="4"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setSelectedAssignment(null)}>
                                Bekor qilish
                            </button>
                            <button className="btn btn-primary" onClick={() => handleGrade(selectedAssignment.id)}>
                                <FiCheck /> Baholash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AssignmentGrader
