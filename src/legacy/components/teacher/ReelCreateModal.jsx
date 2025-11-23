import React, { useState, useRef } from 'react'
import { 
    FiX, 
    FiUpload, 
    FiPlay, 
    FiSave,
    FiTrash2,
    FiVideo
} from 'react-icons/fi'
import { teacherReelsAPI } from '../../api/apiTeacherReels'

const ReelCreateModal = ({ isOpen, onClose, reelData, channelSlug, onReelCreated }) => {
    const fileInputRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const [formData, setFormData] = useState({
        title: reelData?.title || '',
        caption: reelData?.caption || '',
        file: null
    })

    const [fileInfo, setFileInfo] = useState({
        name: '',
        size: 0,
        type: '',
        preview: null
    })

    // Modal ochilganda form ni reset qilish
    React.useEffect(() => {
        if (isOpen) {
            if (reelData) {
                // Edit mode
                setFormData({
                    title: reelData.title || '',
                    caption: reelData.caption || '',
                    file: null
                })
            } else {
                // Create mode
                setFormData({
                    title: '',
                    caption: '',
                    file: null
                })
            }
            setFileInfo({
                name: '',
                size: 0,
                type: '',
                preview: null
            })
            setError(null)
        }
    }, [isOpen, reelData])

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (file) {
            // Video file validation
            if (!file.type.startsWith('video/')) {
                setError('Faqat video fayllarni yuklash mumkin!')
                return
            }

            // File size validation (100MB limit)
            const maxSize = 100 * 1024 * 1024 // 100MB
            if (file.size > maxSize) {
                setError('Fayl hajmi 100MB dan oshmasligi kerak!')
                return
            }

            setFormData(prev => ({
                ...prev,
                file: file
            }))
            
            setFileInfo({
                name: file.name,
                size: file.size,
                type: file.type,
                preview: URL.createObjectURL(file)
            })
            
            setError(null)
        }
    }

    const handleFileRemove = () => {
        setFormData(prev => ({
            ...prev,
            file: null
        }))
        
        if (fileInfo.preview) {
            URL.revokeObjectURL(fileInfo.preview)
        }
        
        setFileInfo({
            name: '',
            size: 0,
            type: '',
            preview: null
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

    const validateForm = () => {
        if (!formData.title.trim()) {
            throw new Error('Reel nomini kiriting!')
        }
        
        if (!formData.caption.trim()) {
            throw new Error('Reel tavsifini kiriting!')
        }
        
        if (!reelData && !formData.file) {
            throw new Error('Video faylni tanlang!')
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            setError(null)
            setLoading(true)
            
            validateForm()
            
            let response
            if (reelData) {
                // Edit mode - faqat text ma'lumotlarni yangilash
                response = await teacherReelsAPI.updateReel(channelSlug, reelData.id, {
                    title: formData.title,
                    caption: formData.caption
                })
            } else {
                // Create mode
                response = await teacherReelsAPI.createReel(channelSlug, formData)
            }
            
            onReelCreated(response)
            onClose()
            
        } catch (error) {
            console.error('Reel creation/update error:', error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        if (fileInfo.preview) {
            URL.revokeObjectURL(fileInfo.preview)
        }
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="reel-create-modal-overlay" onClick={handleClose}>
            <div className="reel-create-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>
                        {reelData ? 'Reel Tahrirlash' : 'Yangi Reel Yaratish'}
                    </h2>
                    <button className="modal-close-btn" onClick={handleClose}>
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-content">
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="form-section">
                        <div className="form-group">
                            <label htmlFor="title">Reel Nomi *</label>
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Reel nomini kiriting..."
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="caption">Tavsif *</label>
                            <textarea
                                id="caption"
                                value={formData.caption}
                                onChange={(e) => handleInputChange('caption', e.target.value)}
                                placeholder="Reel haqida qisqacha ma'lumot..."
                                rows="4"
                                required
                            />
                        </div>

                        {!reelData && (
                            <div className="form-group">
                                <label>Video Fayl *</label>
                                <div className="file-upload-section">
                                    {!formData.file ? (
                                        <div 
                                            className="file-upload-area"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <FiUpload className="upload-icon" />
                                            <h4>Video faylni yuklang</h4>
                                            <p>MP4, MOV, AVI formatlarida</p>
                                            <p className="file-size-limit">Maksimal: 100MB</p>
                                            <button type="button" className="btn btn-outline">
                                                Fayl tanlash
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="file-preview">
                                            <div className="video-preview">
                                                <video 
                                                    src={fileInfo.preview}
                                                    controls
                                                    className="preview-video"
                                                />
                                            </div>
                                            <div className="file-details">
                                                <div className="file-info">
                                                    <FiVideo className="file-icon" />
                                                    <div className="file-meta">
                                                        <span className="file-name">{fileInfo.name}</span>
                                                        <span className="file-size">{formatFileSize(fileInfo.size)}</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button"
                                                    className="remove-file-btn"
                                                    onClick={handleFileRemove}
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="video/*"
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button 
                            type="button" 
                            className="btn btn-outline"
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
                                    {reelData ? 'Saqlanmoqda...' : 'Yaratilmoqda...'}
                                </>
                            ) : (
                                <>
                                    <FiSave />
                                    {reelData ? 'Saqlash' : 'Yaratish'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ReelCreateModal
