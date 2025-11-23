import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiUpload, FiVideo, FiX, FiCheck, FiAlertCircle, FiPlay, FiPause, FiVolume2, FiVolumeX, FiArrowLeft, FiSave, FiEye, FiClock, FiFileText } from 'react-icons/fi'
import { teacherReelsAPI } from '../../api/apiTeacherReels'
import useSelectedChannel from '../../hooks/useSelectedChannel'

const TeacherUploadReels = () => {
    const { channelSlug } = useParams()
    const navigate = useNavigate()
    const { selectedChannel } = useSelectedChannel()
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        caption: '',
        file: null,
        is_public: true,
        reel_type_id_or_slug: 'default',
        channel_id: null
    })
    
    // Upload state
    const [dragActive, setDragActive] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadError, setUploadError] = useState('')
    const [uploadSuccess, setUploadSuccess] = useState(false)
    
    // Video preview state
    const [videoPreview, setVideoPreview] = useState(null)
    const [videoPlaying, setVideoPlaying] = useState(false)
    const [videoMuted, setVideoMuted] = useState(true)
    const [videoDuration, setVideoDuration] = useState(0)
    
    // Refs
    const fileInputRef = useRef(null)
    const videoRef = useRef(null)
    const dragCounter = useRef(0)

    // Update channel_id when selectedChannel changes
    useEffect(() => {
        if (selectedChannel?.id) {
            setFormData(prev => ({
                ...prev,
                channel_id: selectedChannel.id
            }))
        }
    }, [selectedChannel])

    // File validation
    const validateFile = (file) => {
        const maxSize = 100 * 1024 * 1024 // 100MB
        const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
        
        if (!allowedTypes.includes(file.type)) {
            return 'Faqat video fayllar qo\'llab-quvvatlanadi (MP4, WebM, OGG, AVI, MOV)'
        }
        
        if (file.size > maxSize) {
            return 'Fayl hajmi 100MB dan oshmasligi kerak'
        }
        
        return null
    }

    // Handle file selection
    const handleFileSelect = useCallback((file) => {
        const error = validateFile(file)
        if (error) {
            setUploadError(error)
            return
        }

        setUploadError('')
        setFormData(prev => ({ ...prev, file }))
        
        // Create video preview
        const videoUrl = URL.createObjectURL(file)
        setVideoPreview(videoUrl)
        
        // Auto-generate title from filename
        if (!formData.title) {
            const fileName = file.name.replace(/\.[^/.]+$/, "")
            setFormData(prev => ({ ...prev, title: fileName }))
        }
    }, [formData.title])

    // Drag and drop handlers
    const handleDrag = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDragIn = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        dragCounter.current++
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setDragActive(true)
        }
    }, [])

    const handleDragOut = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        dragCounter.current--
        if (dragCounter.current === 0) {
            setDragActive(false)
        }
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        dragCounter.current = 0
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }, [handleFileSelect])

    // File input change
    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0])
        }
    }

    // Form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    // Video controls
    const toggleVideoPlay = () => {
        if (videoRef.current) {
            if (videoPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setVideoPlaying(!videoPlaying)
        }
    }

    const toggleVideoMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoMuted
            setVideoMuted(!videoMuted)
        }
    }

    const handleVideoLoadedMetadata = () => {
        if (videoRef.current) {
            setVideoDuration(videoRef.current.duration)
        }
    }

    // Remove video
    const removeVideo = () => {
        setFormData(prev => ({ ...prev, file: null }))
        setVideoPreview(null)
        setVideoPlaying(false)
        setUploadError('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!formData.file) {
            setUploadError('Video fayl tanlang')
            console.error('No file selected:', formData)
            return
        }

        console.log('File validation passed:', {
            fileName: formData.file.name,
            fileSize: formData.file.size,
            fileType: formData.file.type
        })
        
        if (!formData.title.trim()) {
            setUploadError('Reel sarlavhasini kiriting')
            return
        }

        if (!formData.channel_id) {
            setUploadError('Kanal ID topilmadi')
            return
        }

        setUploading(true)
        setUploadProgress(0)
        setUploadError('')

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return 90
                    }
                    return prev + Math.random() * 15
                })
            }, 200)

            // Prepare data with required fields
            const uploadData = {
                ...formData,
                reel_type_id_or_slug: formData.reel_type_id_or_slug || 'default',
                channel_id: formData.channel_id
            }

            console.log('Upload Data:', uploadData)
            console.log('Channel ID:', formData.channel_id)
            console.log('Reel Type:', formData.reel_type_id_or_slug)

            const result = await teacherReelsAPI.createReel(channelSlug, uploadData)
            
            clearInterval(progressInterval)
            setUploadProgress(100)
            setUploadSuccess(true)
            
            // Success notification
            setTimeout(() => {
                navigate(`/profile/teacher/${channelSlug}/reels`)
            }, 2000)
            
        } catch (error) {
            setUploadError(error.message || 'Reel yuklashda xatolik yuz berdi')
        } finally {
            setUploading(false)
        }
    }

    // Format duration
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="teacher-upload-reels">
            <div className="upload-header">
                <button 
                    className="back-btn"
                    onClick={() => navigate(`/profile/teacher/${channelSlug}/reels`)}
                >
                    <FiArrowLeft />
                    <span>Orqaga</span>
                </button>
                <h1 className="upload-title">
                    <FiVideo />
                    <span>Yangi Reel Yuklash</span>
                </h1>
            </div>

            <div className="upload-container">
                <div className="upload-content">
                    {/* Video Upload Area */}
                    <div className="upload-section">
                        <h2 className="section-title">
                            <FiUpload />
                            <span>Video Yuklash</span>
                        </h2>
                        
                        {!formData.file ? (
                            <div 
                                className={`upload-dropzone ${dragActive ? 'drag-active' : ''}`}
                                onDragEnter={handleDragIn}
                                onDragLeave={handleDragOut}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <div className="dropzone-content">
                                    <div className="upload-icon">
                                        <FiVideo />
                                    </div>
                                    <h3>Video faylni bu yerga tashlang</h3>
                                    <p>yoki <span className="browse-text">ko'rib chiqish</span> uchun bosing</p>
                                    <div className="file-info">
                                        <span>MP4, WebM, OGG, AVI, MOV</span>
                                        <span>Maksimal hajm: 100MB</span>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileInputChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        ) : (
                            <div className="video-preview-container">
                                <div className="video-preview">
                                    <video
                                        ref={videoRef}
                                        src={videoPreview}
                                        onLoadedMetadata={handleVideoLoadedMetadata}
                                        muted={videoMuted}
                                        loop
                                    />
                                    <div className="video-overlay">
                                        <button 
                                            className="video-control play-btn"
                                            onClick={toggleVideoPlay}
                                        >
                                            {videoPlaying ? <FiPause /> : <FiPlay />}
                                        </button>
                                        <button 
                                            className="video-control mute-btn"
                                            onClick={toggleVideoMute}
                                        >
                                            {videoMuted ? <FiVolumeX /> : <FiVolume2 />}
                                        </button>
                                        <button 
                                            className="video-control remove-btn"
                                            onClick={removeVideo}
                                        >
                                            <FiX />
                                        </button>
                                    </div>
                                </div>
                                <div className="video-info">
                                    <div className="video-details">
                                        <span className="video-name">{formData.file.name}</span>
                                        <div className="video-meta">
                                            <span className="video-size">
                                                {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                                            </span>
                                            {videoDuration > 0 && (
                                                <span className="video-duration">
                                                    <FiClock />
                                                    {formatDuration(videoDuration)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Form Section */}
                    <div className="form-section">
                        <h2 className="section-title">
                            <FiFileText />
                            <span>Reel Ma'lumotlari</span>
                        </h2>
                        
                        <form onSubmit={handleSubmit} className="upload-form">
                            <div className="form-group">
                                <label htmlFor="title">Sarlavha *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Reel sarlavhasini kiriting..."
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="caption">Tavsif</label>
                                <textarea
                                    id="caption"
                                    name="caption"
                                    value={formData.caption}
                                    onChange={handleInputChange}
                                    placeholder="Reel haqida qisqacha ma'lumot..."
                                    rows="4"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="reel_type_id_or_slug">Reel Turi</label>
                                <select
                                    id="reel_type_id_or_slug"
                                    name="reel_type_id_or_slug"
                                    value={formData.reel_type_id_or_slug}
                                    onChange={handleInputChange}
                                >
                                    <option value="default">Standart</option>
                                    <option value="educational">Ta'limiy</option>
                                    <option value="entertainment">Ko'ngilochar</option>
                                    <option value="tutorial">Darslik</option>
                                    <option value="news">Yangiliklar</option>
                                </select>
                            </div>

                            <div className="form-group checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="is_public"
                                        checked={formData.is_public}
                                        onChange={handleInputChange}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <div className="checkbox-text">
                                        <span className="checkbox-title">Ommaviy reel</span>
                                        <span className="checkbox-desc">Barcha foydalanuvchilar ko'ra oladi</span>
                                    </div>
                                </label>
                            </div>

                            {/* Upload Progress */}
                            {uploading && (
                                <div className="upload-progress">
                                    <div className="progress-header">
                                        <span>Yuklanmoqda...</span>
                                        <span>{Math.round(uploadProgress)}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {uploadError && (
                                <div className="error-message">
                                    <FiAlertCircle />
                                    <span>{uploadError}</span>
                                </div>
                            )}

                            {/* Success Message */}
                            {uploadSuccess && (
                                <div className="success-message">
                                    <FiCheck />
                                    <span>Reel muvaffaqiyatli yuklandi! Reels sahifasiga yo'naltirilmoqda...</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={uploading || !formData.file || !formData.title.trim()}
                                >
                                    {uploading ? (
                                        <>
                                            <div className="loading-spinner"></div>
                                            <span>Yuklanmoqda...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiSave />
                                            <span>Reelni Yuklash</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherUploadReels
