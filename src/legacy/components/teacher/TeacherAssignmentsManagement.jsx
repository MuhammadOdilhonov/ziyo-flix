"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
    FiPlus, FiEdit3, FiTrash2, FiEye, FiUsers, FiClock, 
    FiCheckCircle, FiXCircle, FiBarChart3, FiBookOpen, FiFileText,
    FiCalendar, FiTarget, FiAward, FiTrendingUp, FiFilter, FiSearch,
    FiDownload, FiExternalLink, FiUpload
} from "react-icons/fi"
import { teacherAssignmentsAPI } from "../../api/apiTeacherAssignments"
import useSelectedChannel from "../../hooks/useSelectedChannel"
import AssignmentCreator from "./AssignmentCreator"
import GradingModal from "./GradingModal"

const TeacherAssignmentsManagement = () => {
    const { channelSlug } = useParams()
    const { selectedChannel } = useSelectedChannel()
    const [assignments, setAssignments] = useState([])
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [assignmentStats, setAssignmentStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all") // all, active, completed, overdue
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [showSubmissionsModal, setShowSubmissionsModal] = useState(false)
    const [submissions, setSubmissions] = useState([])
    const [submissionsLoading, setSubmissionsLoading] = useState(false)
    const [showGradingModal, setShowGradingModal] = useState(false)
    const [selectedSubmission, setSelectedSubmission] = useState(null)

    // Real API bilan ishlash

    // Ma'lumotlarni yuklash
    useEffect(() => {
        fetchAssignments()
        fetchCourses()
        fetchAssignmentStats()
    }, [channelSlug, selectedCourse])

    const fetchAssignments = async () => {
        try {
            setLoading(true)
            const params = {}
            if (selectedCourse) {
                params.course = selectedCourse.slug
            }
            
            const response = await teacherAssignmentsAPI.getChannelAssignments(channelSlug, params)
            setAssignments(response.results || [])
            setLoading(false)
        } catch (error) {
            console.error("Error fetching assignments:", error)
            setLoading(false)
        }
    }

    const fetchCourses = async () => {
        try {
            const response = await teacherAssignmentsAPI.getCourses(channelSlug)
            const coursesData = response.results || []
            
            setCourses(coursesData)
            if (coursesData.length > 0 && !selectedCourse) {
                setSelectedCourse(coursesData[0])
            }
        } catch (error) {
            console.error("Error fetching courses:", error)
            // Fallback courses
            const fallbackCourses = [
                { id: 1, title: "Dasturlash kursi", slug: "dasturlash" },
                { id: 2, title: "Web Development", slug: "web-dev" },
                { id: 3, title: "Mobile App Development", slug: "mobile-app" }
            ]
            setCourses(fallbackCourses)
            if (!selectedCourse) {
                setSelectedCourse(fallbackCourses[0])
            }
        }
    }

    const fetchAssignmentStats = async () => {
        try {
            const response = await teacherAssignmentsAPI.getAssignmentStats(channelSlug)
            setAssignmentStats(response)
        } catch (error) {
            console.error("Error fetching assignment stats:", error)
        }
    }

    // Vazifa yaratish
    const handleCreateAssignment = () => {
        setSelectedAssignment(null)
        setShowCreateModal(true)
    }

    // Vazifa tahrirlash
    const handleEditAssignment = (assignment) => {
        setSelectedAssignment(assignment)
        setShowCreateModal(true)
    }

    // Vazifa o'chirish
    const handleDeleteAssignment = async (assignmentId) => {
        if (window.confirm("Vazifani o'chirishni xohlaysizmi?")) {
            try {
                await teacherAssignmentsAPI.deleteAssignment(channelSlug, assignmentId)
                fetchAssignments() // Ro'yxatni yangilash
                fetchAssignmentStats() // Statistikani yangilash
            } catch (error) {
                console.error("Error deleting assignment:", error)
                alert("Vazifani o'chirishda xatolik yuz berdi")
            }
        }
    }

    // Topshiriqlarni ko'rish
    const handleViewSubmissions = async (assignment) => {
        setSelectedAssignment(assignment)
        setShowSubmissionsModal(true)
        await fetchSubmissions(assignment.id)
    }

    // Topshiriqlarni yuklash
    const fetchSubmissions = async (assignmentId) => {
        try {
            setSubmissionsLoading(true)
            const response = await teacherAssignmentsAPI.getAssignmentSubmissions(channelSlug, assignmentId)
            setSubmissions(response.results || [])
            setSubmissionsLoading(false)
        } catch (error) {
            console.error("Error fetching submissions:", error)
            setSubmissionsLoading(false)
        }
    }

    // Topshiriqni baholash
    const handleGradeSubmission = async (submissionId, grade) => {
        try {
            const gradeData = {
                grade: grade,
                feedback: prompt("Izoh qoldiring (ixtiyoriy):") || ""
            }
            
            await teacherAssignmentsAPI.gradeSubmission(channelSlug, selectedAssignment.id, submissionId, gradeData)
            
            // Topshiriqlar ro'yxatini yangilash
            await fetchSubmissions(selectedAssignment.id)
            
            // Statistikani yangilash
            fetchAssignmentStats()
            
            alert("Topshiriq muvaffaqiyatli baholandi!")
        } catch (error) {
            console.error("Error grading submission:", error)
            alert("Baholashda xatolik yuz berdi")
        }
    }

    // Professional baholash modalini ochish
    const handleOpenGradingModal = (submission) => {
        setSelectedSubmission(submission)
        setShowGradingModal(true)
    }

    // Professional baholash
    const handleProfessionalGrading = async (gradeData) => {
        try {
            await teacherAssignmentsAPI.gradeSubmission(
                channelSlug, 
                selectedAssignment.id, 
                selectedSubmission.id, 
                gradeData
            )
            
            // Topshiriqlar ro'yxatini yangilash
            await fetchSubmissions(selectedAssignment.id)
            
            // Statistikani yangilash
            fetchAssignmentStats()
            
            alert("Topshiriq muvaffaqiyatli baholandi!")
        } catch (error) {
            console.error("Error grading submission:", error)
            throw error
        }
    }

    // Sana formatlash
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Due days after completion - muddat tekshirish endi kerak emas
    // Chunki bu video tugagandan keyin hisoblanadi

    // Vazifalarni filtrlash
    const filteredAssignments = assignments.filter(assignment => {
        const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (assignment.course?.title || assignment.course || '').toLowerCase().includes(searchTerm.toLowerCase())
        
        if (filterType === "all") return matchesSearch
        if (filterType === "active") return matchesSearch && assignment.is_active
        if (filterType === "completed") return matchesSearch && !assignment.is_active
        if (filterType === "overdue") return matchesSearch && assignment.is_active // Overdue logic endi boshqacha
        
        return matchesSearch
    })

    if (loading) {
        return (
            <div className="teacher-assignments">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Vazifalar yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="teacher-assignments">
            {/* Header */}
            <div className="ta-header">
                <div className="ta-header-content">
                    <h1>Vazifalar Boshqaruvi</h1>
                    <p>Kurs vazifalarini yarating, tahrirlang va baholang</p>
                    {selectedCourse && (
                        <div className="ta-selected-course">
                            <strong>Tanlangan kurs:</strong> {selectedCourse.title}
                        </div>
                    )}
                </div>
                <div className="ta-header-actions">
                    {courses.length > 0 && (
                        <select 
                            value={selectedCourse?.id || ""} 
                            onChange={(e) => {
                                const course = courses.find(c => c.id === Number(e.target.value))
                                setSelectedCourse(course)
                            }}
                            className="ta-course-select"
                        >
                            <option value="">Kurs tanlang</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    )}
                    <button 
                        className="ta-create-btn"
                        onClick={handleCreateAssignment}
                    >
                        <FiPlus /> Yangi Vazifa
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            {assignmentStats && (
                <div className="ta-stats-grid">
                    <div className="ta-stat-card total">
                        <div className="ta-stat-icon">
                            <FiBookOpen />
                        </div>
                        <div className="ta-stat-content">
                            <h3>{assignmentStats.overview?.total_assignments || assignmentStats.total_assignments}</h3>
                            <p>Jami Vazifalar</p>
                            <span className="ta-stat-change">
                                {assignmentStats.overview?.active_assignments || assignmentStats.active_assignments} faol
                            </span>
                        </div>
                    </div>

                    <div className="ta-stat-card submissions">
                        <div className="ta-stat-icon">
                            <FiUpload />
                        </div>
                        <div className="ta-stat-content">
                            <h3>{assignmentStats.overview?.total_submissions || assignmentStats.total_submissions}</h3>
                            <p>Jami Topshiriqlar</p>
                            <span className="ta-stat-change positive">
                                Barcha vazifalar
                            </span>
                        </div>
                    </div>

                    <div className="ta-stat-card pending">
                        <div className="ta-stat-icon">
                            <FiClock />
                        </div>
                        <div className="ta-stat-content">
                            <h3>{assignmentStats.overview?.pending_grading || assignmentStats.pending_grading}</h3>
                            <p>Baholash Kutilmoqda</p>
                            <span className="ta-stat-change warning">
                                Tekshirish kerak
                            </span>
                        </div>
                    </div>

                    <div className="ta-stat-card average">
                        <div className="ta-stat-icon">
                            <FiAward />
                        </div>
                        <div className="ta-stat-content">
                            <h3>{assignmentStats.overview?.avg_score || assignmentStats.avg_score}%</h3>
                            <p>O'rtacha Ball</p>
                            <span className="ta-stat-change positive">
                                Umumiy natija
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="ta-filters">
                <div className="ta-search">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Vazifalarni qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="ta-filter-buttons">
                    <button 
                        className={`ta-filter-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        Barchasi ({assignments.length})
                    </button>
                    <button 
                        className={`ta-filter-btn ${filterType === 'active' ? 'active' : ''}`}
                        onClick={() => setFilterType('active')}
                    >
                        Faol ({assignments.filter(a => a.is_active).length})
                    </button>
                    <button 
                        className={`ta-filter-btn ${filterType === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilterType('completed')}
                    >
                        Tugagan ({assignments.filter(a => !a.is_active).length})
                    </button>
                    <button 
                        className={`ta-filter-btn ${filterType === 'overdue' ? 'active' : ''}`}
                        onClick={() => setFilterType('overdue')}
                    >
                        Muddati o'tgan ({assignments.filter(a => a.is_active).length})
                    </button>
                </div>
            </div>

            {/* Assignments Grid */}
            <div className="ta-assignments-grid">
                {filteredAssignments.length === 0 ? (
                    <div className="ta-empty-state">
                        <FiBookOpen className="empty-icon" />
                        <h3>Vazifalar topilmadi</h3>
                        <p>Hali vazifalar yaratilmagan yoki qidiruv natijasi bo'sh</p>
                        <button 
                            className="ta-create-btn-empty"
                            onClick={handleCreateAssignment}
                        >
                            <FiPlus /> Birinchi vazifani yarating
                        </button>
                    </div>
                ) : (
                    filteredAssignments.map((assignment) => (
                        <div key={assignment.id} className="ta-assignment-card">
                            <div className="ta-assignment-header">
                                <div className="ta-assignment-type">
                                    <span className={`type-${assignment.type}`}>
                                        {assignment.type === 'project' && <><FiFileText /> Loyiha</>}
                                        {assignment.type === 'coding' && <><FiBookOpen /> Kodlash</>}
                                        {assignment.type === 'design' && <><FiTarget /> Dizayn</>}
                                    </span>
                                    <span className="max-points">
                                        {assignment.max_points} ball
                                    </span>
                                </div>
                                <div className="ta-assignment-status">
                                    {assignment.is_active ? (
                                        <FiCheckCircle className="active" title="Faol" />
                                    ) : (
                                        <FiCheckCircle className="completed" title="Tugagan" />
                                    )}
                                </div>
                            </div>

                            <div className="ta-assignment-content">
                                <p className="ta-assignment-description">{assignment.description}</p>
                                <p className="ta-assignment-course">{assignment.course?.title || assignment.course}</p>
                                <div className="ta-assignment-meta">
                                    <span className="due-days">
                                        <FiCalendar /> {assignment.due_days_after_completion} kun (video tugagandan keyin)
                                    </span>
                                </div>
                            </div>

                            <div className="ta-assignment-stats">
                                <div className="ta-stat-item">
                                    <FiUpload />
                                    <span>{assignment.submissions_count} topshiriq</span>
                                </div>
                                <div className="ta-stat-item">
                                    <FiCheckCircle />
                                    <span>{assignment.graded_count} baholangan</span>
                                </div>
                                <div className="ta-stat-item">
                                    <FiAward />
                                    <span>{assignment.avg_score}% o'rtacha</span>
                                </div>
                            </div>

                            <div className="ta-assignment-actions">
                                <button
                                    className="ta-action-btn submissions"
                                    onClick={() => handleViewSubmissions(assignment)}
                                    title="Topshiriqlarni ko'rish"
                                >
                                    <FiEye />
                                </button>
                                <button
                                    className="ta-action-btn edit"
                                    onClick={() => handleEditAssignment(assignment)}
                                    title="Vazifani tahrirlash"
                                >
                                    <FiEdit3 />
                                </button>
                                <button
                                    className="ta-action-btn delete"
                                    onClick={() => handleDeleteAssignment(assignment.id)}
                                    title="Vazifani o'chirish"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="ta-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="ta-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ta-modal-header">
                            <h2>{selectedAssignment ? 'Vazifani Tahrirlash' : 'Yangi Vazifa Yaratish'}</h2>
                            <button 
                                className="ta-modal-close"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="ta-modal-content">
                            <AssignmentCreator
                                assignmentData={selectedAssignment}
                                onSave={async (assignmentData) => {
                                    try {
                                        if (selectedAssignment) {
                                            // Vazifa yangilash
                                            await teacherAssignmentsAPI.updateAssignment(channelSlug, selectedAssignment.id, assignmentData)
                                        } else {
                                            // Yangi vazifa yaratish
                                            await teacherAssignmentsAPI.createAssignment(channelSlug, assignmentData)
                                        }
                                        
                                        setShowCreateModal(false)
                                        fetchAssignments() // Ro'yxatni yangilash
                                        fetchAssignmentStats() // Statistikani yangilash
                                        alert(selectedAssignment ? "Vazifa muvaffaqiyatli yangilandi!" : "Vazifa muvaffaqiyatli yaratildi!")
                                    } catch (error) {
                                        console.error("Error saving assignment:", error)
                                        alert("Vazifani saqlashda xatolik yuz berdi")
                                    }
                                }}
                                onCancel={() => setShowCreateModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Submissions Modal */}
            {showSubmissionsModal && selectedAssignment && (
                <div className="ta-modal-overlay" onClick={() => setShowSubmissionsModal(false)}>
                    <div className="ta-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ta-modal-header">
                            <h2>{selectedAssignment.title} - Topshiriqlar</h2>
                            <button 
                                className="ta-modal-close"
                                onClick={() => setShowSubmissionsModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="ta-modal-content">
                            {submissionsLoading ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <div className="spinner"></div>
                                    <p>Topshiriqlar yuklanmoqda...</p>
                                </div>
                            ) : submissions.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <FiBookOpen style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }} />
                                    <h3>Topshiriqlar topilmadi</h3>
                                    <p>Bu vazifa uchun hali topshiriqlar yo'q</p>
                                </div>
                            ) : (
                                <div className="ta-submissions-list">
                                    {submissions.map((submission) => (
                                        <div key={submission.id} className="ta-submission-item">
                                            <div className="ta-submission-info">
                                                <strong>{submission.student.full_name}</strong>
                                                <span>Topshirildi: {formatDate(submission.submitted_at)}</span>
                                                {submission.text_answer && (
                                                    <p style={{ margin: '8px 0', fontSize: '14px', color: '#666' }}>
                                                        {submission.text_answer}
                                                    </p>
                                                )}
                                                {submission.is_late && (
                                                    <span style={{ color: '#ef4444', fontSize: '12px' }}>
                                                        Kech topshirildi
                                                    </span>
                                                )}
                                            </div>
                                            <div className="ta-submission-actions">
                                                {submission.is_graded ? (
                                                    <button className="ta-grade-btn graded">
                                                        {submission.grade} ball
                                                    </button>
                                                ) : (
                                                    <button 
                                                        className="ta-grade-btn"
                                                        onClick={() => handleOpenGradingModal(submission)}
                                                    >
                                                        Baholash
                                                    </button>
                                                )}
                                                {submission.attachment && (
                                                    <button 
                                                        className="ta-download-btn"
                                                        onClick={() => window.open(`${process.env.REACT_APP_BASE_URL_REELS || ''}${submission.attachment}`, '_blank')}
                                                    >
                                                        <FiDownload />
                                                    </button>
                                                )}
                                                {submission.external_link && (
                                                    <button 
                                                        className="ta-download-btn"
                                                        onClick={() => window.open(submission.external_link, '_blank')}
                                                        style={{ marginLeft: '8px' }}
                                                    >
                                                        <FiExternalLink />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Professional Grading Modal */}
            <GradingModal
                submission={selectedSubmission}
                assignment={selectedAssignment}
                isOpen={showGradingModal}
                onClose={() => {
                    setShowGradingModal(false)
                    setSelectedSubmission(null)
                }}
                onSave={handleProfessionalGrading}
            />
        </div>
    )
}

export default TeacherAssignmentsManagement
