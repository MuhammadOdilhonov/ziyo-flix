import React, { useState, useEffect } from 'react'
import { FiArrowLeft, FiCheckCircle, FiClock, FiAlertCircle, FiX, FiDownload, FiExternalLink } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getSubmittedAssignments, getSubmittedAssignmentDetail } from '../../api/apiUserProfile'
import { BaseUrlReels } from '../../api/apiService'


const UserSubmittedAssignments = () => {
    const navigate = useNavigate()
    const [assignments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [filterType, setFilterType] = useState('all')
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [assignmentDetail, setAssignmentDetail] = useState(null)
    const [detailLoading, setDetailLoading] = useState(false)

    useEffect(() => {
        fetchAssignments()
    }, [])

    const fetchAssignments = async () => {
        try {
            setLoading(true)
            const data = await getSubmittedAssignments()
            setAssignments(data.submissions || [])
            setError(null)
        } catch (err) {
            console.error('Error fetching assignments:', err)
            setError('Vazifalarni yuklashda xatolik')
            // Mock data fallback
            setAssignments([])
        } finally {
            setLoading(false)
        }
    }

    const getFilteredAssignments = () => {
        if (filterType === 'all') return assignments
        if (filterType === 'graded') return assignments.filter(a => a.grade !== null)
        if (filterType === 'pending') return assignments.filter(a => a.grade === null)
        return assignments
    }

    const filteredAssignments = getFilteredAssignments()

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getGradeColor = (grade) => {
        if (grade === null) return 'pending'
        if (grade >= 80) return 'excellent'
        if (grade >= 60) return 'good'
        return 'poor'
    }

    const handleAssignmentClick = async (assignment) => {
        try {
            setDetailLoading(true)
            const detail = await getSubmittedAssignmentDetail(assignment.id)
            setAssignmentDetail(detail)
            setSelectedAssignment(assignment)
        } catch (err) {
            console.error('Error fetching assignment detail:', err)
            alert('Vazifa batafsil ma\'lumotlarini yuklashda xatolik')
        } finally {
            setDetailLoading(false)
        }
    }

    const closeModal = () => {
        setSelectedAssignment(null)
        setAssignmentDetail(null)
    }

    const stats = {
        total: assignments.length,
        graded: assignments.filter(a => a.grade !== null).length,
        pending: assignments.filter(a => a.grade === null).length,
        avgGrade: assignments.filter(a => a.grade !== null).length > 0
            ? (assignments.filter(a => a.grade !== null).reduce((sum, a) => sum + a.grade, 0) / assignments.filter(a => a.grade !== null).length).toFixed(1)
            : 0
    }

    return (
        <div className="user-submitted-assignments">
            {/* Header */}
            <div className="usa__header">
               
                <h1 className="usa__title">Yuborgan vazifalar</h1>
                <div className="usa__spacer"></div>
            </div>

            {/* Statistics */}
            <div className="usa__stats">
                <div className="usa__stat-card">
                    <div className="usa__stat-label">Jami vazifalar</div>
                    <div className="usa__stat-value">{stats.total}</div>
                </div>
                <div className="usa__stat-card">
                    <div className="usa__stat-label">Baholangan</div>
                    <div className="usa__stat-value">{stats.graded}</div>
                </div>
                <div className="usa__stat-card">
                    <div className="usa__stat-label">Kutilayotgan</div>
                    <div className="usa__stat-value">{stats.pending}</div>
                </div>
                <div className="usa__stat-card">
                    <div className="usa__stat-label">O'rtacha ball</div>
                    <div className="usa__stat-value">{stats.avgGrade}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="usa__filters">
                <button
                    className={`usa__filter-btn ${filterType === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterType('all')}
                >
                    Barchasi ({assignments.length})
                </button>
                <button
                    className={`usa__filter-btn ${filterType === 'graded' ? 'active' : ''}`}
                    onClick={() => setFilterType('graded')}
                >
                    Baholangan ({stats.graded})
                </button>
                <button
                    className={`usa__filter-btn ${filterType === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilterType('pending')}
                >
                    Kutilayotgan ({stats.pending})
                </button>
            </div>

            {/* Content */}
            <div className="usa__content">
                {loading ? (
                    <div className="usa__loading">
                        <div className="usa__spinner"></div>
                        <p>Yuklanmoqda...</p>
                    </div>
                ) : error && assignments.length === 0 ? (
                    <div className="usa__error">
                        <FiAlertCircle />
                        <p>{error}</p>
                    </div>
                ) : filteredAssignments.length === 0 ? (
                    <div className="usa__empty">
                        <FiAlertCircle />
                        <p>Vazifalar topilmadi</p>
                    </div>
                ) : (
                    <div className="usa__assignments-list">
                        {filteredAssignments.map((assignment) => (
                            <div 
                                key={assignment.id} 
                                className={`usa__assignment-card grade-${getGradeColor(assignment.grade)}`}
                                onClick={() => handleAssignmentClick(assignment)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="usa__card-header">
                                    <div className="usa__card-title-section">
                                        <h3 className="usa__card-title">{assignment.title}</h3>
                                        <span className={`usa__card-type ${assignment.type}`}>{assignment.type}</span>
                                    </div>
                                    {assignment.grade !== null ? (
                                        <div className="usa__grade-badge">
                                            <FiCheckCircle className="usa__grade-icon" />
                                            <span className="usa__grade-value">{assignment.grade.toFixed(1)}</span>
                                        </div>
                                    ) : (
                                        <div className="usa__pending-badge">
                                            <FiClock className="usa__pending-icon" />
                                            <span>Kutilayotgan</span>
                                        </div>
                                    )}
                                </div>
                                <div className="usa__card-footer">
                                    <span className="usa__submitted-date">
                                        Yuborilgan: {formatDate(assignment.submitted_at)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Assignment Detail Modal */}
            {selectedAssignment && (
                <div className="assignment-detail-modal-overlay" onClick={closeModal}>
                    <div className="assignment-detail-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="assignment-modal-header">
                            <h2>Vazifa batafsil</h2>
                            <button className="assignment-modal-close" onClick={closeModal}>
                                <FiX />
                            </button>
                        </div>

                        {detailLoading ? (
                            <div className="assignment-modal-loading">
                                <div className="spinner"></div>
                                <p>Yuklanmoqda...</p>
                            </div>
                        ) : assignmentDetail ? (
                            <div className="assignment-modal-content">
                                {/* Header Info */}
                                <div className="assignment-info-header">
                                    <div className="assignment-title-section">
                                        <h3>{assignmentDetail.assignment?.title}</h3>
                                        <p className="course-name">{assignmentDetail.course_type?.course_title}</p>
                                    </div>
                                    {assignmentDetail.grade !== null ? (
                                        <div className={`grade-badge graded`}>
                                            <span className="grade-value">{assignmentDetail.grade}</span>
                                            <span className="grade-label">/ {assignmentDetail.assignment?.max_points}</span>
                                        </div>
                                    ) : (
                                        <div className="grade-badge pending">
                                            <span className="grade-label">Kutilayotgan</span>
                                        </div>
                                    )}
                                </div>

                                {/* Assignment Details */}
                                <div className="assignment-details-section">
                                    <div className="detail-item">
                                        <span className="detail-label">Tavsif:</span>
                                        <p className="detail-value">{assignmentDetail.assignment?.description}</p>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Maksimal ball:</span>
                                        <p className="detail-value">{assignmentDetail.assignment?.max_points}</p>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Muddat:</span>
                                        <p className="detail-value">
                                            {new Date(assignmentDetail.assignment?.due_at).toLocaleDateString('uz-UZ')}
                                        </p>
                                    </div>
                                </div>

                                {/* Submission Content */}
                                <div className="submission-section">
                                    <h4>Topshiriq ma'lumotlari</h4>
                                    
                                    {assignmentDetail.text_answer && (
                                        <div className="submission-item">
                                            <span className="submission-label">Javob:</span>
                                            <p className="submission-text">{assignmentDetail.text_answer}</p>
                                        </div>
                                    )}

                                    {assignmentDetail.attachment && (
                                        <div className="submission-item">
                                            <span className="submission-label">Fayl:</span>
                                            <a 
                                                href={`${BaseUrlReels}${assignmentDetail.attachment}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="attachment-link"
                                                download
                                            >
                                                <FiDownload /> Faylni yuklash
                                            </a>
                                        </div>
                                    )}

                                    {assignmentDetail.external_link && (
                                        <div className="submission-item">
                                            <span className="submission-label">Tashqi havola:</span>
                                            <a 
                                                href={assignmentDetail.external_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="external-link"
                                            >
                                                <FiExternalLink /> {assignmentDetail.external_link}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* Feedback Section */}
                                {assignmentDetail.feedback && (
                                    <div className="feedback-section">
                                        <h4>O'qituvchi izohи</h4>
                                        <div className="feedback-content">
                                            <p>{assignmentDetail.feedback}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Submission Metadata */}
                                <div className="submission-metadata">
                                    <div className="meta-item">
                                        <span className="meta-label">Yuborilgan:</span>
                                        <span className="meta-value">{formatDate(assignmentDetail.submitted_at)}</span>
                                    </div>
                                    {assignmentDetail.graded_by && (
                                        <div className="meta-item">
                                            <span className="meta-label">Baholagan:</span>
                                            <span className="meta-value">{assignmentDetail.graded_by}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="assignment-modal-error">
                                <p>Ma'lumot yuklashda xatolik</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserSubmittedAssignments
