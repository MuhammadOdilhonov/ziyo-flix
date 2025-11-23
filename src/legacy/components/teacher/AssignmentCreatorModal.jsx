import React, { useState, useRef } from 'react'
import { 
    FiX, 
    FiUpload, 
    FiFile, 
    FiCalendar, 
    FiTarget,
    FiSave,
    FiTrash2,
    FiDownload
} from 'react-icons/fi'
import { testAssignmentAPI } from '../../api/apiTestEndAssignments'

const AssignmentCreatorModal = ({ isOpen, onClose, videoId, onAssignmentCreated }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const fileInputRef = useRef(null)
    
    const [assignmentData, setAssignmentData] = useState({
        course_video: videoId || null,
        title: '',
        description: '',
        due_days_after_completion: 7,
        max_points: 100,
        allow_multiple_submissions: false,
        is_active: true,
        file: null
    })

    // Video ID o'zgarganda assignmentData ni yangilash
    React.useEffect(() => {
        if (videoId && isOpen) {
            setAssignmentData({
                course_video: videoId,
                title: '',
                description: '',
                due_days_after_completion: 7,
                max_points: 100,
                allow_multiple_submissions: false,
                is_active: true,
                file: null
            })
            setFileInfo({
                name: '',
                size: 0,
                type: ''
            })
            setError(null)
        }
    }, [videoId, isOpen])

    const [fileInfo, setFileInfo] = useState({
        name: '',
        size: 0,
        type: ''
    })

    const handleInputChange = (field, value) => {
        setAssignmentData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            setAssignmentData(prev => ({
                ...prev,
                file: file
            }))
            
            setFileInfo({
                name: file.name,
                size: file.size,
                type: file.type
            })
        }
    }

    const removeFile = () => {
        setAssignmentData(prev => ({
            ...prev,
            file: null
        }))
        
        setFileInfo({
            name: '',
            size: 0,
            type: ''
        })
        
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const formatDateTime = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM format
    }

    const validateAssignment = () => {
        if (!assignmentData.course_video) {
            throw new Error('Video ID topilmadi!')
        }
        
        if (!assignmentData.title.trim()) {
            throw new Error('Vazifa nomini kiriting!')
        }
        
        if (!assignmentData.description.trim()) {
            throw new Error('Vazifa tavsifini kiriting!')
        }
        
        if (!assignmentData.due_days_after_completion || assignmentData.due_days_after_completion < 1) {
            throw new Error('Topshirish muddatini belgilang (kamida 1 kun)!')
        }
        
        if (assignmentData.max_points < 1 || assignmentData.max_points > 1000) {
            throw new Error('Maksimal ball 1 dan 1000 gacha bo\'lishi kerak!')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            setError(null)
            setLoading(true)
            
            console.log('Vazifa yaratish ma\'lumotlari:', assignmentData)
            console.log('Video ID:', assignmentData.course_video)
            
            validateAssignment()
            
            // Assignment data tayyor
            const submissionData = {
                ...assignmentData
            }
            
            console.log('Yuborilayotgan ma\'lumotlar:', submissionData)
            
            const response = await testAssignmentAPI.createAssignment(submissionData)
            
            onAssignmentCreated(response)
            onClose()
            
        } catch (error) {
            console.error('Assignment creation error:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const resetForm = () => {
        setAssignmentData({
            course_video: videoId,
            title: '',
            description: '',
            due_days_after_completion: 7,
            max_points: 100,
            allow_multiple_submissions: false,
            is_active: true,
            file: null
        })
        
        setFileInfo({
            name: '',
            size: 0,
            type: ''
        })
        
        setError(null)
        
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="assignment-modal-overlay" onClick={handleClose}>
            <div className="assignment-modal" onClick={(e) => e.stopPropagation()}>
                <div className="assignment-modal-header">
                    <h2><FiFile /> Vazifa yaratish</h2>
                    <button 
                        className="modal-close-btn"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        <FiX />
                    </button>
                </div>

                <div className="assignment-modal-content">
                    <form onSubmit={handleSubmit}>
                        {/* Assignment Info */}
                        <div className="assignment-info">
                            <h3>Vazifa ma'lumotlari</h3>
                            
                            <div className="form-group">
                                <label htmlFor="title">Vazifa nomi *</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={assignmentData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Masalan: Homework 1"
                                    className="form-input"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Vazifa tavsifi *</label>
                                <textarea
                                    id="description"
                                    value={assignmentData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Vazifa haqida batafsil ma'lumot, talablar va ko'rsatmalar..."
                                    className="form-input form-textarea"
                                    rows="4"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="due_days_after_completion">
                                        <FiCalendar /> Muddat (video tugagandan keyin necha kun) *
                                    </label>
                                    <input
                                        type="number"
                                        id="due_days_after_completion"
                                        min="1"
                                        max="365"
                                        value={assignmentData.due_days_after_completion}
                                        onChange={(e) => handleInputChange('due_days_after_completion', parseInt(e.target.value) || 7)}
                                        className="form-input"
                                        placeholder="Masalan: 7 kun"
                                        required
                                        disabled={loading}
                                    />
                                    <small className="form-help">Video tugagandan keyin necha kun ichida topshirish kerak</small>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="max_points">
                                        <FiTarget /> Maksimal ball
                                    </label>
                                    <input
                                        type="number"
                                        id="max_points"
                                        value={assignmentData.max_points}
                                        onChange={(e) => handleInputChange('max_points', parseInt(e.target.value) || 100)}
                                        min="1"
                                        max="1000"
                                        className="form-input"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={assignmentData.allow_multiple_submissions}
                                        onChange={(e) => handleInputChange('allow_multiple_submissions', e.target.checked)}
                                        disabled={loading}
                                    />
                                    <span className="checkbox-text">
                                        Bir necha marta topshirishga ruxsat berish
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* File Upload */}
                        <div className="assignment-file">
                            <h3>Qo'shimcha fayl</h3>
                            <p className="file-description">
                                Vazifa uchun kerakli fayllarni yuklang (PDF, DOC, ZIP va boshqalar)
                            </p>
                            
                            {!assignmentData.file ? (
                                <div className="file-upload-area">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleFileSelect}
                                        className="file-input"
                                        accept=".pdf,.doc,.docx,.zip,.rar,.txt,.jpg,.jpeg,.png"
                                        disabled={loading}
                                    />
                                    <div className="file-upload-label">
                                        <FiUpload size={32} />
                                        <span>Fayl tanlang yoki shu yerga tashlang</span>
                                        <small>PDF, DOC, ZIP, rasm va boshqa formatlar</small>
                                    </div>
                                </div>
                            ) : (
                                <div className="file-selected">
                                    <div className="file-info">
                                        <div className="file-icon">
                                            <FiFile />
                                        </div>
                                        <div className="file-details">
                                            <span className="file-name">{fileInfo.name}</span>
                                            <span className="file-size">{formatFileSize(fileInfo.size)}</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="btn-icon btn-danger"
                                        onClick={removeFile}
                                        disabled={loading}
                                        title="Faylni o'chirish"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="error-message">
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="assignment-modal-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClose}
                                disabled={loading}
                            >
                                Bekor qilish
                            </button>
                            
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner-sm"></div>
                                        Yaratilmoqda...
                                    </>
                                ) : (
                                    <>
                                        <FiSave /> Vazifa yaratish
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AssignmentCreatorModal
