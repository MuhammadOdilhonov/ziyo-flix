import React, { useState, useEffect } from 'react'
import { 
    FiX, 
    FiEye, 
    FiCalendar, 
    FiTarget,
    FiFile,
    FiDownload,
    FiEdit,
    FiTrash2,
    FiClock,
    FiUser,
    FiBarChart,
    FiCheckCircle,
    FiUsers
} from 'react-icons/fi'
import { testAssignmentAPI } from '../../api/apiTestEndAssignments'

const VideoAssignmentsModal = ({ isOpen, onClose, video, channelSlug, courseSlug }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [assignmentsData, setAssignmentsData] = useState(null)
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
    const [availableAssignments, setAvailableAssignments] = useState([])
    const [currentAssignment, setCurrentAssignment] = useState(null)

    useEffect(() => {
        if (isOpen && video && channelSlug && courseSlug) {
            fetchVideoAssignments()
        }
    }, [isOpen, video, channelSlug, courseSlug])

    const fetchVideoAssignments = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Video obyektidan assignments_brief ni olish
            if (video?.assignments_brief && video.assignments_brief.length > 0) {
                setAvailableAssignments(video.assignments_brief)
                
                // Birinchi vazifani default qilib tanlash
                if (!selectedAssignmentId) {
                    const firstAssignmentId = video.assignments_brief[0].id
                    setSelectedAssignmentId(firstAssignmentId)
                    
                    // Birinchi vazifaning batafsil ma'lumotlarini yuklash
                    try {
                        const response = await testAssignmentAPI.getAssignment(firstAssignmentId, channelSlug, courseSlug, video.id)
                        setCurrentAssignment(response)
                    } catch (error) {
                        console.error('Error loading first assignment:', error)
                        setError('Birinchi vazifani yuklashda xatolik!')
                    }
                }
            } else {
                // Vazifalar yo'q
                setAvailableAssignments([])
                setCurrentAssignment(null)
                setError('Bu video uchun vazifalar topilmadi!')
            }
            
        } catch (error) {
            console.error('Error fetching video assignments:', error)
            setError('Vazifalarni yuklashda xatolik yuz berdi!')
        } finally {
            setLoading(false)
        }
    }

    // Vazifa tanlash funksiyasi
    const handleAssignmentSelect = async (assignmentId) => {
        if (assignmentId === selectedAssignmentId) return
        
        try {
            setSelectedAssignmentId(assignmentId)
            setLoading(true)
            setError(null)
            
            // Tanlangan vazifaning batafsil ma'lumotlarini yuklash
            const response = await testAssignmentAPI.getAssignment(assignmentId, channelSlug, courseSlug, video.id)
            setCurrentAssignment(response)
            
        } catch (error) {
            console.error('Error fetching assignment details:', error)
            setError('Vazifa ma\'lumotlarini yuklashda xatolik!')
            setCurrentAssignment(null)
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

    const isOverdue = (dueDate) => {
        if (!dueDate) return false
        return new Date(dueDate) < new Date()
    }

    const handleClose = () => {
        setAssignmentsData(null)
        setCurrentAssignment(null)
        setAvailableAssignments([])
        setSelectedAssignmentId(null)
        setError(null)
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="video-assignments-modal-overlay" onClick={handleClose}>
            <div className="video-assignments-modal" onClick={(e) => e.stopPropagation()}>
                <div className="video-assignments-modal-header">
                    <div className="header-info">
                        <h2><FiFile /> Video Vazifalari</h2>
                        <p className="video-title">{video?.title}</p>
                    </div>
                    <button 
                        className="modal-close-btn"
                        onClick={handleClose}
                    >
                        <FiX />
                    </button>
                </div>

                <div className="video-assignments-modal-content">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Vazifa ma'lumotlari yuklanmoqda...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button 
                                className="btn btn-primary"
                                onClick={fetchVideoAssignments}
                            >
                                Qayta urinish
                            </button>
                        </div>
                    ) : (availableAssignments.length > 0 || currentAssignment) ? (
                        <div className="assignments-content">
                            {/* Assignment Selector - ko'p vazifalar bo'lsa */}
                            {availableAssignments.length > 1 && (
                                <div className="test-selector">
                                    <h4>Vazifalarni tanlang:</h4>
                                    <div className="test-buttons">
                                        {availableAssignments.map((assignment) => (
                                            <button
                                                key={assignment.id}
                                                className={`test-btn ${selectedAssignmentId === assignment.id ? 'active' : ''}`}
                                                onClick={() => handleAssignmentSelect(assignment.id)}
                                            >
                                                <FiFile />
                                                {assignment.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentAssignment && (
                                <div className="assignments-header">
                                    <h3>{currentAssignment.title}</h3>
                                    <div className="assignments-count">
                                        Vazifa ID: {currentAssignment.id}
                                    </div>
                                </div>
                            )}

                            {currentAssignment && (
                                <div className="assignments-list">
                                    <div className="assignment-card">
                                        <div className="assignment-header">
                                            <div className="assignment-title-section">
                                                <h4>{currentAssignment.title}</h4>
                                                <div className="assignment-badges">
                                                    <span className={`status-badge ${currentAssignment.is_active ? 'active' : 'inactive'}`}>
                                                        {currentAssignment.is_active ? 'Faol' : 'Nofaol'}
                                                    </span>
                                                    {/* Overdue check olib tashlandi - due_days_after_completion ishlatiladi */}
                                                </div>
                                            </div>
                                            <div className="assignment-number">
                                                #{currentAssignment.id}
                                            </div>
                                        </div>

                                        <div className="assignment-description">
                                            <p>{currentAssignment.description}</p>
                                        </div>

                                        <div className="assignment-stats-grid">
                                            <div className="stat-item">
                                                <FiCalendar className="stat-icon" />
                                                <div className="stat-content">
                                                    <span className="stat-label">Topshirish muddati</span>
                                                    <span className="stat-value">
                                                        {currentAssignment.due_days_after_completion} kun (video tugagandan keyin)
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="stat-item">
                                                <FiTarget className="stat-icon" />
                                                <div className="stat-content">
                                                    <span className="stat-label">Maksimal ball</span>
                                                    <span className="stat-value">{currentAssignment.max_points}</span>
                                                </div>
                                            </div>

                                            <div className="stat-item">
                                                <FiUsers className="stat-icon" />
                                                <div className="stat-content">
                                                    <span className="stat-label">Topshiriqlar</span>
                                                    <span className="stat-value">{currentAssignment.submissions_count}</span>
                                                </div>
                                            </div>

                                            <div className="stat-item">
                                                <FiCheckCircle className="stat-icon" />
                                                <div className="stat-content">
                                                    <span className="stat-label">Baholangan</span>
                                                    <span className="stat-value">{currentAssignment.graded_count}</span>
                                                </div>
                                            </div>

                                            <div className="stat-item">
                                                <FiBarChart className="stat-icon" />
                                                <div className="stat-content">
                                                    <span className="stat-label">O'rtacha ball</span>
                                                    <span className="stat-value">
                                                        {currentAssignment.avg_grade ? `${currentAssignment.avg_grade}%` : 'Yo\'q'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="stat-item">
                                                <FiClock className="stat-icon" />
                                                <div className="stat-content">
                                                    <span className="stat-label">Yaratilgan</span>
                                                    <span className="stat-value">{formatDate(currentAssignment.created_at)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="assignment-settings">
                                            <div className="setting-item">
                                                <span className="setting-label">Bir necha marta topshirish:</span>
                                                <span className={`setting-badge ${currentAssignment.allow_multiple_submissions ? 'enabled' : 'disabled'}`}>
                                                    {currentAssignment.allow_multiple_submissions ? 'Ruxsat berilgan' : 'Ruxsat berilmagan'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="assignment-actions">
                                            <button className="btn btn-outline btn-sm">
                                                <FiEye /> Ko'rish
                                            </button>
                                            <button className="btn btn-outline btn-sm">
                                                <FiEdit /> Tahrirlash
                                            </button>
                                            <button className="btn btn-outline btn-sm">
                                                <FiUsers /> Topshiriqlar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-assignments-state">
                            <FiFile className="no-assignments-icon" />
                            <h3>Vazifalar topilmadi</h3>
                            <p>Bu video uchun hali vazifa yaratilmagan</p>
                            <button 
                                className="btn btn-primary"
                                onClick={handleClose}
                            >
                                Vazifa yaratish
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VideoAssignmentsModal
