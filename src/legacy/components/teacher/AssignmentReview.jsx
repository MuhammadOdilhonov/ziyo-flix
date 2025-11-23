"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
    FiUsers, FiClock, FiCheckCircle, FiXCircle, FiEye, FiDownload,
    FiExternalLink, FiCalendar, FiFileText, FiStar, FiMessageSquare,
    FiFilter, FiSearch, FiBookOpen, FiUpload, FiAward, FiAlertCircle
} from "react-icons/fi"
import { teacherAssignmentsCheckAPI } from "../../api/apiTeacherAssignmentsCheck"
import { BaseUrlReels } from "../../api/apiService"
import useSelectedChannel from "../../hooks/useSelectedChannel"

const AssignmentReview = () => {
    const { channelSlug } = useParams()
    const { selectedChannel } = useSelectedChannel()
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterStatus, setFilterStatus] = useState("all") // all, pending, graded, overdue
    const [selectedSubmission, setSelectedSubmission] = useState(null)
    const [showGradingModal, setShowGradingModal] = useState(false)
    const [gradingScore, setGradingScore] = useState("")
    const [gradingFeedback, setGradingFeedback] = useState("")
    const [summary, setSummary] = useState(null)

    useEffect(() => {
        fetchAssignmentsWithSubmissions()
    }, [channelSlug])

    const fetchAssignmentsWithSubmissions = async () => {
        try {
            setLoading(true)
            console.log('Fetching assignments with submissions for channel:', channelSlug)
            const response = await teacherAssignmentsCheckAPI.getAllAssignmentsWithSubmissions(channelSlug)
            console.log('Full API Response:', response)
            console.log('Assignments data:', response.results)
            console.log('Summary data:', response.summary)
            
            setAssignments(response.results || [])
            setSummary(response.summary || null)
            setLoading(false)
        } catch (error) {
            console.error("Error fetching assignments with submissions:", error)
            setLoading(false)
        }
    }

    const handleGradeSubmission = (submission) => {
        setSelectedSubmission(submission)
        setGradingScore(submission.grade || "")
        setGradingFeedback(submission.feedback || "")
        setShowGradingModal(true)
    }

    const submitGrade = async () => {
        if (!selectedSubmission || !gradingScore) {
            alert("Ball kiriting!")
            return
        }

        try {
            const gradeData = {
                grade: parseFloat(gradingScore),
                feedback: gradingFeedback
            }

            await teacherAssignmentsCheckAPI.gradeSubmission(channelSlug, selectedSubmission.id, gradeData)
            
            // Ma'lumotlarni yangilash
            await fetchAssignmentsWithSubmissions()
            
            // Modalni yopish
            setShowGradingModal(false)
            setSelectedSubmission(null)
            setGradingScore("")
            setGradingFeedback("")
            
            alert("Baholash muvaffaqiyatli saqlandi!")
        } catch (error) {
            console.error("Error grading submission:", error)
            alert("Baholashda xatolik yuz berdi")
        }
    }

    const downloadFile = async (fileUrl, fileName) => {
        try {
            const blob = await teacherAssignmentsCheckAPI.downloadFile(fileUrl)
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = fileName
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Error downloading file:", error)
            alert("Faylni yuklashda xatolik yuz berdi")
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date()
    }

    // Barcha topshiriqlarni filtrlash
    const getAllSubmissions = () => {
        const allSubmissions = []
        assignments.forEach(assignment => {
            assignment.submissions?.forEach(submission => {
                allSubmissions.push({
                    ...submission,
                    assignment: {
                        id: assignment.id,
                        title: assignment.title,
                        description: assignment.description,
                        course: assignment.course,
                        due_days_after_completion: assignment.due_days_after_completion,
                        max_score: assignment.max_score,
                        attachment: assignment.attachment
                    },
                    // Status real API dan keladi
                    status: submission.status || (submission.grade ? 'graded' : 'pending')
                })
            })
        })
        return allSubmissions
    }

    const filteredSubmissions = getAllSubmissions().filter(submission => {
        const matchesSearch = (submission.student?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (submission.assignment?.title || '').toLowerCase().includes(searchTerm.toLowerCase())
        
        if (filterStatus === "all") return matchesSearch
        if (filterStatus === "pending") return matchesSearch && submission.status === "pending"
        if (filterStatus === "graded") return matchesSearch && submission.status === "graded"
        if (filterStatus === "overdue") return matchesSearch && submission.is_late
        
        return matchesSearch
    })

    if (loading) {
        return (
            <div className="ar-loading">
                <div className="ar-spinner"></div>
                <p>Vazifalar yuklanmoqda...</p>
            </div>
        )
    }

    return (
        <div className="assignment-review">
            <div className="ar-header">
                <div className="ar-title-section">
                    <h1>O'quvchilardan Kelgan Vazifalarni Tekshirish</h1>
                    <p>Barcha vazifalar va topshiriqlarni ko'ring va baholang</p>
                </div>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="ar-summary-grid">
                    <div className="ar-summary-card total">
                        <div className="ar-summary-icon">
                            <FiBookOpen />
                        </div>
                        <div className="ar-summary-content">
                            <h3>{summary.total_assignments}</h3>
                            <p>Jami Vazifalar</p>
                        </div>
                    </div>

                    <div className="ar-summary-card submissions">
                        <div className="ar-summary-icon">
                            <FiUpload />
                        </div>
                        <div className="ar-summary-content">
                            <h3>{summary.total_submissions}</h3>
                            <p>Jami Topshiriqlar</p>
                        </div>
                    </div>

                    <div className="ar-summary-card pending">
                        <div className="ar-summary-icon">
                            <FiClock />
                        </div>
                        <div className="ar-summary-content">
                            <h3>{summary.pending_submissions}</h3>
                            <p>Kutilayotgan</p>
                        </div>
                    </div>

                    <div className="ar-summary-card graded">
                        <div className="ar-summary-icon">
                            <FiCheckCircle />
                        </div>
                        <div className="ar-summary-content">
                            <h3>{summary.graded_submissions}</h3>
                            <p>Baholangan</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="ar-filters">
                <div className="ar-search">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="O'quvchi yoki vazifa nomi bo'yicha qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="ar-filter-buttons">
                    <button 
                        className={`ar-filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                    >
                        Barchasi ({getAllSubmissions().length})
                    </button>
                    <button 
                        className={`ar-filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('pending')}
                    >
                        Kutilayotgan ({getAllSubmissions().filter(s => s.status === 'pending').length})
                    </button>
                    <button 
                        className={`ar-filter-btn ${filterStatus === 'graded' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('graded')}
                    >
                        Baholangan ({getAllSubmissions().filter(s => s.status === 'graded').length})
                    </button>
                    <button 
                        className={`ar-filter-btn ${filterStatus === 'overdue' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('overdue')}
                    >
                        Kech topshirilgan ({getAllSubmissions().filter(s => s.is_late).length})
                    </button>
                </div>
            </div>

            {/* Submissions List */}
            <div className="ar-submissions-list">
                {filteredSubmissions.length === 0 ? (
                    <div className="ar-empty-state">
                        <FiFileText className="ar-empty-icon" />
                        <h3>Topshiriqlar topilmadi</h3>
                        <p>Hozircha tekshirish uchun topshiriqlar yo'q</p>
                    </div>
                ) : (
                    filteredSubmissions.map((submission) => (
                        <div key={submission.id} className={`ar-submission-card ${submission.status}`}>
                            <div className="ar-submission-header">
                                <div className="ar-student-info">
                                    <img 
                                        src={submission.student.avatar ? 
                                            `${BaseUrlReels}${submission.student.avatar}` : 
                                            '/default-avatar.png'
                                        }
                                        alt={submission.student.full_name}
                                        className="ar-student-avatar"
                                    />
                                    <div className="ar-student-details">
                                        <h4>{submission.student.full_name}</h4>
                                        <p>@{submission.student.username}</p>
                                    </div>
                                </div>
                                <div className="ar-submission-status">
                                    {submission.status === 'pending' ? (
                                        <span className="ar-status-badge pending">
                                            <FiClock /> Kutilayotgan
                                        </span>
                                    ) : (
                                        <span className="ar-status-badge graded">
                                            <FiCheckCircle /> Baholangan
                                        </span>
                                    )}
                                    {submission.is_late && (
                                        <span className="ar-status-badge overdue">
                                            <FiAlertCircle /> Kech
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="ar-submission-content">
                                <div className="ar-assignment-info">
                                    <h3>{submission.assignment.title}</h3>
                                    <p className="ar-course-name">{submission.assignment.course.title}</p>
                                    
                                    {submission.assignment.description && (
                                        <div className="ar-assignment-description">
                                            <h5>Vazifa tavsifi:</h5>
                                            <p>{submission.assignment.description}</p>
                                        </div>
                                    )}
                                    
                                    {submission.assignment.attachment && (
                                        <div className="ar-assignment-attachment">
                                            <h5>Vazifa fayli:</h5>
                                            <div className="ar-attachment-item">
                                                <FiFileText />
                                                <div className="ar-attachment-info">
                                                    <span className="ar-attachment-name">{submission.assignment.attachment.name}</span>
                                                    <span className="ar-attachment-size">
                                                        {submission.assignment.attachment.size ? 
                                                            `${(submission.assignment.attachment.size / 1024 / 1024).toFixed(2)} MB` : 
                                                            'N/A'
                                                        }
                                                    </span>
                                                </div>
                                                <button 
                                                    onClick={() => downloadFile(`${BaseUrlReels}${submission.assignment.attachment.file}`, submission.assignment.attachment.name)}
                                                    className="ar-download-btn"
                                                    title={`${submission.assignment.attachment.name} ni yuklash`}
                                                >
                                                    <FiDownload />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="ar-assignment-meta">
                                        <span className="ar-due-days">
                                            <FiCalendar /> Muddat: {submission.assignment.due_days_after_completion} kun (video tugagandan keyin)
                                        </span>
                                        <span className="ar-max-score">
                                            <FiAward /> Maksimal: {submission.assignment.max_score} ball
                                        </span>
                                    </div>
                                </div>

                                <div className="ar-submission-details">
                                    {submission.text_answer && (
                                        <div className="ar-submission-text">
                                            <h5>O'quvchi javobi:</h5>
                                            <p>{submission.text_answer}</p>
                                        </div>
                                    )}

                                    {submission.attachment_info && (
                                        <div className="ar-attachments">
                                            <h5>Yuklangan fayl:</h5>
                                            <div className="ar-files-list">
                                                <div className="ar-file-item">
                                                    <FiFileText />
                                                    <div className="ar-file-info">
                                                        <span className="ar-file-name">{submission.attachment_info.name}</span>
                                                        <span className="ar-file-size">
                                                            {submission.attachment_info.size ? 
                                                                `${(submission.attachment_info.size / 1024 / 1024).toFixed(2)} MB` : 
                                                                'N/A'
                                                            }
                                                        </span>
                                                        <span className="ar-file-date">
                                                            Yuklangan: {formatDate(submission.submitted_at)}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={() => downloadFile(`${BaseUrlReels}${submission.attachment_info.file}`, submission.attachment_info.name)}
                                                        className="ar-download-btn"
                                                        title={`${submission.attachment_info.name} ni yuklash`}
                                                    >
                                                        <FiDownload />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {submission.external_link && (
                                        <div className="ar-external-links">
                                            <h5>Tashqi havola:</h5>
                                            <div className="ar-links-list">
                                                <div className="ar-link-item">
                                                    <a 
                                                        href={submission.external_link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="ar-external-link"
                                                    >
                                                        <FiExternalLink />
                                                        <div className="ar-link-info">
                                                            <span className="ar-link-title">Tashqi havola</span>
                                                            <span className="ar-link-url">{submission.external_link}</span>
                                                        </div>
                                                    </a>
                                                    <button 
                                                        onClick={() => window.open(submission.external_link, '_blank')}
                                                        className="ar-open-btn"
                                                        title="Havolani ochish"
                                                    >
                                                        <FiExternalLink />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="ar-submission-meta">
                                        <span className="ar-submit-date">
                                            <FiUpload /> Topshirilgan: {formatDate(submission.submitted_at)}
                                        </span>
                                        <span className="ar-attempt-number">
                                            #{submission.attempt_number || 1} urinish
                                        </span>
                                        {submission.is_late && (
                                            <span className="ar-late-indicator">
                                                <FiAlertCircle /> Kech topshirilgan
                                            </span>
                                        )}
                                        {submission.updated_at && (
                                            <span className="ar-update-date">
                                                Yangilangan: {formatDate(submission.updated_at)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {submission.grade && (
                                    <div className="ar-grade-info">
                                        <div className="ar-grade-score">
                                            <FiStar />
                                            <span>{submission.grade}/{submission.assignment.max_score} ball</span>
                                            <span className="ar-percentage">
                                                ({Math.round((submission.grade / submission.assignment.max_score) * 100)}%)
                                            </span>
                                        </div>
                                        {submission.feedback && (
                                            <div className="ar-grade-feedback">
                                                <FiMessageSquare />
                                                <p>{submission.feedback}</p>
                                            </div>
                                        )}
                                        <div className="ar-grade-meta">
                                            <span>Status: {submission.status === 'graded' ? 'Baholangan' : 'Kutilayotgan'}</span>
                                            {submission.graded_by && (
                                                <span>Baholovchi ID: {submission.graded_by}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="ar-submission-actions">
                                <button 
                                    className="ar-grade-btn"
                                    onClick={() => handleGradeSubmission(submission)}
                                >
                                    <FiStar />
                                    {submission.status === 'graded' ? 'Qayta baholash' : 'Baholash'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Grading Modal */}
            {showGradingModal && selectedSubmission && (
                <div className="ar-modal-overlay" onClick={() => setShowGradingModal(false)}>
                    <div className="ar-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ar-modal-header">
                            <h3>Topshiriqni Baholash</h3>
                            <button 
                                className="ar-modal-close"
                                onClick={() => setShowGradingModal(false)}
                            >
                                <FiXCircle />
                            </button>
                        </div>

                        <div className="ar-modal-content">
                            <div className="ar-grading-student">
                                <img 
                                    src={selectedSubmission.student.avatar ? 
                                        `${BaseUrlReels}${selectedSubmission.student.avatar}` : 
                                        '/default-avatar.png'
                                    }
                                    alt={selectedSubmission.student.full_name}
                                    className="ar-grading-avatar"
                                />
                                <div>
                                    <h4>{selectedSubmission.student.full_name}</h4>
                                    <p>{selectedSubmission.assignment.title}</p>
                                </div>
                            </div>

                            <div className="ar-grading-form">
                                <div className="ar-form-group">
                                    <label>Ball (maksimal: {selectedSubmission.assignment.max_score})</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max={selectedSubmission.assignment.max_score}
                                        value={gradingScore}
                                        onChange={(e) => setGradingScore(e.target.value)}
                                        placeholder="Ball kiriting"
                                    />
                                </div>

                                <div className="ar-form-group">
                                    <label>Izoh (ixtiyoriy)</label>
                                    <textarea
                                        value={gradingFeedback}
                                        onChange={(e) => setGradingFeedback(e.target.value)}
                                        placeholder="O'quvchi uchun izoh yozing..."
                                        rows="4"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="ar-modal-actions">
                            <button 
                                className="ar-cancel-btn"
                                onClick={() => setShowGradingModal(false)}
                            >
                                Bekor qilish
                            </button>
                            <button 
                                className="ar-save-btn"
                                onClick={submitGrade}
                            >
                                <FiStar /> Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AssignmentReview
