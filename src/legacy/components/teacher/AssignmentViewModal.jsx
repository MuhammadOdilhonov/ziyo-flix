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
    FiUser
} from 'react-icons/fi'
import { testAssignmentAPI } from '../../api/apiTestEndAssignments'

const AssignmentViewModal = ({ isOpen, onClose, assignmentId, onEdit, onDelete }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [assignmentData, setAssignmentData] = useState(null)

    useEffect(() => {
        if (isOpen && assignmentId) {
            fetchAssignmentData()
        }
    }, [isOpen, assignmentId])

    const fetchAssignmentData = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await testAssignmentAPI.getAssignment(assignmentId)
            setAssignmentData(response)
            
        } catch (error) {
            console.error('Error fetching assignment:', error)
            setError(error.message)
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

    const handleEdit = () => {
        if (onEdit && assignmentData) {
            onEdit(assignmentData)
        }
        onClose()
    }

    const handleDelete = () => {
        if (onDelete && assignmentData) {
            if (window.confirm('Vazifani o\'chirishni xohlaysizmi?')) {
                onDelete(assignmentData.id)
            }
        }
        onClose()
    }

    const handleDownloadFile = () => {
        if (assignmentData?.file) {
            const link = document.createElement('a')
            link.href = assignmentData.file
            link.download = assignmentData.title || 'assignment-file'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    if (!isOpen) return null

    return (
        <div className="assignment-view-modal-overlay" onClick={onClose}>
            <div className="assignment-view-modal" onClick={(e) => e.stopPropagation()}>
                <div className="assignment-view-modal-header">
                    <h2><FiEye /> Vazifa ko'rish</h2>
                    <div className="header-actions">
                        {assignmentData && (
                            <>
                                <button 
                                    className="btn-icon btn-primary"
                                    onClick={handleEdit}
                                    title="Tahrirlash"
                                >
                                    <FiEdit />
                                </button>
                                <button 
                                    className="btn-icon btn-danger"
                                    onClick={handleDelete}
                                    title="O'chirish"
                                >
                                    <FiTrash2 />
                                </button>
                            </>
                        )}
                        <button 
                            className="modal-close-btn"
                            onClick={onClose}
                        >
                            <FiX />
                        </button>
                    </div>
                </div>

                <div className="assignment-view-modal-content">
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
                                onClick={fetchAssignmentData}
                            >
                                Qayta urinish
                            </button>
                        </div>
                    ) : assignmentData ? (
                        <div className="assignment-content">
                            {/* Assignment Info */}
                            <div className="assignment-info-view">
                                <h3>{assignmentData.title}</h3>
                                
                                <div className="assignment-description">
                                    <h4>Tavsif:</h4>
                                    <p>{assignmentData.description}</p>
                                </div>
                                
                                <div className="assignment-stats">
                                    <div className="stat-item">
                                        <FiCalendar />
                                        <div className="stat-content">
                                            <span className="stat-label">Topshirish muddati:</span>
                                            <span className="stat-value">
                                                {assignmentData.due_days_after_completion} kun (video tugagandan keyin)
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="stat-item">
                                        <FiTarget />
                                        <div className="stat-content">
                                            <span className="stat-label">Maksimal ball:</span>
                                            <span className="stat-value">
                                                {assignmentData.max_points}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="stat-item">
                                        <FiUser />
                                        <div className="stat-content">
                                            <span className="stat-label">Yaratuvchi:</span>
                                            <span className="stat-value">
                                                ID: {assignmentData.created_by}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="stat-item">
                                        <FiClock />
                                        <div className="stat-content">
                                            <span className="stat-label">Yaratilgan:</span>
                                            <span className="stat-value">
                                                {formatDate(assignmentData.created_at)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="assignment-settings">
                                    <div className="setting-item">
                                        <span className="setting-label">Bir necha marta topshirish:</span>
                                        <span className={`setting-badge ${assignmentData.allow_multiple_submissions ? 'enabled' : 'disabled'}`}>
                                            {assignmentData.allow_multiple_submissions ? 'Ruxsat berilgan' : 'Ruxsat berilmagan'}
                                        </span>
                                    </div>
                                    
                                    <div className="setting-item">
                                        <span className="setting-label">Holat:</span>
                                        <span className={`setting-badge ${assignmentData.is_active ? 'active' : 'inactive'}`}>
                                            {assignmentData.is_active ? 'Faol' : 'Nofaol'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Assignment File */}
                            {assignmentData.file && (
                                <div className="assignment-file-view">
                                    <h4>Qo'shimcha fayl:</h4>
                                    <div className="file-item">
                                        <div className="file-info">
                                            <div className="file-icon">
                                                <FiFile />
                                            </div>
                                            <div className="file-details">
                                                <span className="file-name">
                                                    {assignmentData.title || 'Assignment File'}
                                                </span>
                                                <span className="file-type">
                                                    Qo'shimcha material
                                                </span>
                                            </div>
                                        </div>
                                        <button 
                                            className="btn btn-outline btn-sm"
                                            onClick={handleDownloadFile}
                                        >
                                            <FiDownload /> Yuklab olish
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-data">
                            <p>Vazifa ma'lumotlari topilmadi</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AssignmentViewModal
