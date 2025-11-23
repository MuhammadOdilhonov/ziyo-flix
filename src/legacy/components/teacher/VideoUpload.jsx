"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { 
    FiUpload, 
    FiPlay, 
    FiArrowLeft, 
    FiCheck, 
    FiX, 
    FiAlertCircle, 
    FiFile, 
    FiClock,
    FiEye,
    FiExternalLink,
    FiRefreshCw
} from "react-icons/fi"
import { teacherVideoUploadAPI } from "../../api/apiTeacherVideoUpload"
import { teacherCoursesAPI } from "../../api/apiTeacherInformationCourses"
import useSelectedChannel from "../../hooks/useSelectedChannel"

const VideoUpload = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { channelSlug } = useParams()
    const { selectedChannel } = useSelectedChannel()
    const fileInputRef = useRef(null)
    const [uploadState, setUploadState] = useState('idle') // idle, uploading, completed, error
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadedVideoId, setUploadedVideoId] = useState(null)
    const [videoStatus, setVideoStatus] = useState(null)
    const [streamUrl, setStreamUrl] = useState(null)
    const [error, setError] = useState(null)
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [uploadedVideoData, setUploadedVideoData] = useState(null)
    
    // Form data
    const [formData, setFormData] = useState({
        course_id: '',
        title: '',
        description: '',
        order: 0,
        chunkSize: 1024 * 1024 // 1MB default
    })

    // Course and month info from navigation state
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [courseMonths, setCourseMonths] = useState([])
    const [showMonthSelector, setShowMonthSelector] = useState(false)
    const [monthsLoading, setMonthsLoading] = useState(false)
    
    // Upload tracking
    const [uploadInfo, setUploadInfo] = useState({
        totalChunks: 0,
        uploadedChunks: 0,
        uploadId: null,
        fileName: '',
        fileSize: 0
    })

    // Initialize course data from navigation state
    useEffect(() => {
        const state = location.state
        if (state?.selectedCourse) {
            setSelectedCourse(state.selectedCourse)
            setFormData(prev => ({
                ...prev,
                course_id: state.selectedCourse.id.toString()
            }))
            
            // Agar oy tanlanmagan bo'lsa, kurs oylarini yuklash
            if (!state?.selectedMonth) {
                loadCourseMonths(state.selectedCourse.slug || state.selectedCourse.id)
                setShowMonthSelector(true)
            }
        }
        if (state?.selectedMonth) {
            setSelectedMonth(state.selectedMonth)
        }
    }, [location.state])

    // Load course months if no month selected
    const loadCourseMonths = async (courseId) => {
        try {
            setMonthsLoading(true)
            // Course slug kerak, ID emas
            const courseSlug = selectedCourse?.slug || courseId
            const response = await teacherCoursesAPI.getCourseTypes(courseSlug)
            setCourseMonths(response || [])
        } catch (error) {
            console.error('Error loading course months:', error)
            setError('Kurs oylarini yuklashda xatolik yuz berdi!')
        } finally {
            setMonthsLoading(false)
        }
    }

    // Handle month selection
    const handleMonthSelect = (month) => {
        setSelectedMonth(month)
        setShowMonthSelector(false)
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (!file) return

        if (!file.type.startsWith('video/')) {
            setError('Faqat video fayllar qabul qilinadi!')
            return
        }

        const totalChunks = Math.ceil(file.size / formData.chunkSize)
        const uploadId = `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        setUploadInfo({
            totalChunks,
            uploadedChunks: 0,
            uploadId,
            fileName: file.name,
            fileSize: file.size
        })

        setUploadState('idle')
    }

    const uploadChunk = async (chunk, chunkIndex, totalChunks, uploadId) => {
        console.log(`Uploading chunk ${chunkIndex + 1}/${totalChunks}`)

        const chunkFormData = new FormData()
        chunkFormData.append('file', chunk)
        chunkFormData.append('chunkIndex', chunkIndex)
        chunkFormData.append('totalChunks', totalChunks)
        chunkFormData.append('uploadId', uploadId)
        chunkFormData.append('course_id', formData.course_id)
        chunkFormData.append('title', formData.title)
        chunkFormData.append('description', formData.description)
        chunkFormData.append('order', formData.order)
        
        // Majburiy course_type_id yuborish
        if (selectedMonth && selectedMonth.id) {
            chunkFormData.append('course_type_id', selectedMonth.id.toString())
            console.log('Sending course_type_id:', selectedMonth.id)
        } else {
            console.error('selectedMonth yoki selectedMonth.id mavjud emas:', selectedMonth)
            throw new Error('Oy tanlanmagan! Iltimos, avval oyni tanlang.')
        }

        // Debug: FormData ni ko'rish
        console.log('FormData contents:')
        for (let [key, value] of chunkFormData.entries()) {
            console.log(key, ':', value)
        }

        try {
            const response = await teacherVideoUploadAPI.uploadChunk(chunkFormData)
            return response
        } catch (error) {
            console.error(`Chunk ${chunkIndex} upload error:`, error)
            throw error
        }
    }

    const handleUpload = async () => {
        // Validation
        if (!uploadInfo.fileName || !formData.course_id || !formData.title) {
            setError('Iltimos, barcha majburiy maydonlarni to\'ldiring!')
            return
        }

        if (!selectedMonth || !selectedMonth.id) {
            setError('Iltimos, avval oyni tanlang!')
            setShowMonthSelector(true)
            return
        }

        // Open upload modal
        setShowUploadModal(true)
        
        try {
            setError(null)
            setUploadState('uploading')
            setUploadProgress(0)

            const file = fileInputRef.current.files[0]
            if (!file) {
                throw new Error('Fayl topilmadi!')
            }

            const totalChunks = Math.ceil(file.size / formData.chunkSize)
            const uploadId = uploadInfo.uploadId

            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                const start = chunkIndex * formData.chunkSize
                const end = Math.min(start + formData.chunkSize, file.size)
                const chunk = file.slice(start, end)

                const response = await uploadChunk(chunk, chunkIndex, totalChunks, uploadId)
                
                setUploadInfo(prev => ({
                    ...prev,
                    uploadedChunks: chunkIndex + 1
                }))

                const progress = ((chunkIndex + 1) / totalChunks) * 100
                setUploadProgress(progress)

                // If this is the last chunk and upload is complete
                if (chunkIndex === totalChunks - 1 && response.video_id) {
                    setUploadedVideoId(response.video_id)
                    setUploadedVideoData(response)
                    setUploadState('completed')
                    
                    // Check video status
                    setTimeout(() => {
                        checkVideoStatus(response.video_id)
                    }, 2000)
                }
            }
        } catch (error) {
            console.error('Upload error:', error)
            setError(error.message || 'Video yuklashda xatolik yuz berdi!')
            setUploadState('error')
        }
    }

    const checkVideoStatus = async (videoId) => {
        if (!videoId) return

        try {
            const response = await teacherVideoUploadAPI.getVideoStatus(videoId)
            setVideoStatus(response)
        } catch (error) {
            console.error('Status check error:', error)
            setError('Video holatini tekshirishda xatolik!')
        }
    }

    const getStreamUrl = async () => {
        if (!uploadedVideoId) return

        try {
            const response = await teacherVideoUploadAPI.getVideoStream(uploadedVideoId)
            setStreamUrl(response.hls_url)
        } catch (error) {
            console.error('Stream URL error:', error)
            setError('Video stream URL olishda xatolik!')
        }
    }

    const openStream = () => {
        if (streamUrl) {
            window.open(streamUrl, '_blank')
        }
    }

    const resetUpload = () => {
        setUploadState('idle')
        setUploadProgress(0)
        setUploadedVideoId(null)
        setUploadedVideoData(null)
        setVideoStatus(null)
        setStreamUrl(null)
        setError(null)
        setShowUploadModal(false)
        setUploadInfo({
            totalChunks: 0,
            uploadedChunks: 0,
            uploadId: null,
            fileName: '',
            fileSize: 0
        })
        setFormData({
            course_id: selectedCourse?.id?.toString() || '',
            title: '',
            description: '',
            order: 0,
            chunkSize: 1024 * 1024
        })
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const closeUploadModal = () => {
        if (uploadState === 'uploading') {
            if (window.confirm('Video hali yuklanmoqda. Bekor qilishni xohlaysizmi?')) {
                setShowUploadModal(false)
                setUploadState('idle')
            }
        } else {
            setShowUploadModal(false)
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'processing': return 'orange'
            case 'completed': return 'green'
            case 'failed': return 'red'
            default: return 'blue'
        }
    }

    return (
        <div className="video-upload">
            <div className="upload-header">
                <h1>Video yuklash</h1>
                <p>Video darsliklaringizni chunked upload usuli bilan yuklang</p>
                
                <div className="upload-context">
                    {selectedChannel && (
                        <div className="context-item">
                            <span className="channel-badge">Kanal: {selectedChannel.title}</span>
                        </div>
                    )}
                    {selectedCourse && (
                        <div className="context-item">
                            <span className="course-badge">Kurs: {selectedCourse.title}</span>
                        </div>
                    )}
                    {selectedMonth && (
                        <div className="context-item">
                            <span className="month-badge">Oy: {selectedMonth.name}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="upload-container">
                {/* Month Selector Section - Always visible at top */}
                {showMonthSelector && (
                    <div className="upload-section">
                        <div className="section-header">
                            <h2><FiClock /> Oy tanlash</h2>
                            <p>Video yuklash uchun oyni tanlang</p>
                        </div>
                        
                        {monthsLoading ? (
                            <div className="month-loading">
                                <div className="spinner"></div>
                                <p>Oylar yuklanmoqda...</p>
                            </div>
                        ) : courseMonths.length > 0 ? (
                            <div className="month-selector">
                                {courseMonths.map((month) => (
                                    <div 
                                        key={month.id}
                                        className="month-card"
                                        onClick={() => handleMonthSelect(month)}
                                    >
                                        <div className="month-info">
                                            <h3>{month.name}</h3>
                                            <p>{month.description || 'Oy tavsifi'}</p>
                                            <div className="month-stats">
                                                <span>Videolar: {month.videos_count || 0}</span>
                                            </div>
                                        </div>
                                        <div className="month-select-btn">
                                            <FiCheck />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="no-months">
                                <FiAlertCircle />
                                <p>Bu kurs uchun oylar topilmadi</p>
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => setShowMonthSelector(false)}
                                >
                                    Bekor qilish
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* File Upload Section */}
                {uploadState === 'idle' && !showMonthSelector && (
                    <div className="upload-section">
                        <div className="section-header">
                            <h2><FiUpload /> Fayl tanlash</h2>
                        </div>
                        
                        <div className="file-upload-area">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                onChange={handleFileSelect}
                                className="file-input"
                            />
                            <div className="file-upload-label">
                                <FiUpload size={48} />
                                <span>Video faylni tanlang yoki shu yerga tashlang</span>
                                <small>MP4, AVI, MOV va boshqa video formatlar qo'llab-quvvatlanadi</small>
                            </div>
                        </div>

                        {uploadInfo.fileName && (
                            <div className="file-info">
                                <div className="file-details">
                                    <span className="file-name">{uploadInfo.fileName}</span>
                                    <span className="file-size">{formatFileSize(uploadInfo.fileSize)}</span>
                                </div>
                                <div className="chunk-info">
                                    <span>Jami bo'laklar: {uploadInfo.totalChunks}</span>
                                    <span>Bo'lak hajmi: {formatFileSize(formData.chunkSize)}</span>
                                </div>
                            </div>
                        )}

                        {/* Compact Form */}
                        <div className="compact-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="title">Video nomi *</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Video nomini kiriting"
                                        className="form-input"
                                        required
                                        disabled={uploadState === 'uploading'}
                                    />
                                </div>

                                <div className="form-group form-group-small">
                                    <label htmlFor="order">Tartib</label>
                                    <input
                                        type="number"
                                        id="order"
                                        value={formData.order}
                                        onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                                        placeholder="0"
                                        className="form-input"
                                        min="0"
                                        disabled={uploadState === 'uploading'}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Tavsif</label>
                                <textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Video haqida qisqacha ma'lumot"
                                    className="form-input form-textarea"
                                    rows="2"
                                    disabled={uploadState === 'uploading'}
                                />
                            </div>

                            {/* Advanced Settings */}
                            <details className="advanced-settings">
                                <summary>Qo'shimcha sozlamalar</summary>
                                <div className="advanced-content">
                                    <div className="form-group">
                                        <label htmlFor="chunkSize">
                                            Bo'lak hajmi
                                            <span className="chunk-size-info">
                                                ({formatFileSize(formData.chunkSize)})
                                            </span>
                                        </label>
                                        <div className="chunk-size-options">
                                            <button 
                                                type="button"
                                                className={`chunk-btn ${formData.chunkSize === 512 * 1024 ? 'active' : ''}`}
                                                onClick={() => handleInputChange('chunkSize', 512 * 1024)}
                                                disabled={uploadState === 'uploading'}
                                            >
                                                512KB
                                            </button>
                                            <button 
                                                type="button"
                                                className={`chunk-btn ${formData.chunkSize === 1024 * 1024 ? 'active' : ''}`}
                                                onClick={() => handleInputChange('chunkSize', 1024 * 1024)}
                                                disabled={uploadState === 'uploading'}
                                            >
                                                1MB
                                            </button>
                                            <button 
                                                type="button"
                                                className={`chunk-btn ${formData.chunkSize === 2 * 1024 * 1024 ? 'active' : ''}`}
                                                onClick={() => handleInputChange('chunkSize', 2 * 1024 * 1024)}
                                                disabled={uploadState === 'uploading'}
                                            >
                                                2MB
                                            </button>
                                            <button 
                                                type="button"
                                                className={`chunk-btn ${formData.chunkSize === 5 * 1024 * 1024 ? 'active' : ''}`}
                                                onClick={() => handleInputChange('chunkSize', 5 * 1024 * 1024)}
                                                disabled={uploadState === 'uploading'}
                                            >
                                                5MB
                                            </button>
                                        </div>
                                        <input
                                            type="number"
                                            id="chunkSize"
                                            value={formData.chunkSize}
                                            onChange={(e) => handleInputChange('chunkSize', parseInt(e.target.value) || 1024 * 1024)}
                                            placeholder="1048576"
                                            className="form-input form-input-small"
                                            min="1024"
                                            disabled={uploadState === 'uploading'}
                                        />
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="upload-section">
                        <div className="error-section">
                            <div className="error-card">
                                <FiAlertCircle />
                                <span>{error}</span>
                            </div>
                        </div>
                    </div>
                )}


                {/* Action Buttons */}
                <div className="upload-actions">
                    {uploadState === 'idle' && !showMonthSelector && (
                        <button 
                            className="btn btn-primary btn-lg"
                            onClick={handleUpload}
                            disabled={
                                !uploadInfo.fileName || 
                                !formData.course_id || 
                                !formData.title || 
                                (!selectedMonth && selectedCourse)
                            }
                        >
                            <FiUpload /> 
                            Video yuklash
                        </button>
                    )}
                    
                    <button 
                        className="btn btn-secondary"
                        onClick={() => navigate(`/profile/teacher/${channelSlug}/videos`)}
                    >
                        <FiArrowLeft /> Videolar sahifasiga qaytish
                    </button>
                </div>
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="upload-modal-overlay" onClick={closeUploadModal}>
                    <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="upload-modal-header">
                            <h3>
                                {uploadState === 'uploading' && <><FiUpload /> Video yuklanmoqda...</>}
                                {uploadState === 'completed' && <><FiCheck /> Video yuklandi!</>}
                                {uploadState === 'error' && <><FiX /> Xatolik yuz berdi!</>}
                            </h3>
                            <button 
                                className="modal-close-btn"
                                onClick={closeUploadModal}
                                disabled={uploadState === 'uploading'}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="upload-modal-content">
                            {uploadState === 'uploading' && (
                                <div className="upload-progress-modal">
                                    <div className="progress-circle">
                                        <div className="progress-percentage">{uploadProgress.toFixed(0)}%</div>
                                    </div>
                                    
                                    <div className="progress-details">
                                        <p><strong>{formData.title}</strong></p>
                                        <p>Bo'lak {uploadInfo.uploadedChunks} / {uploadInfo.totalChunks}</p>
                                        <p>Hajm: {formatFileSize(uploadInfo.fileSize)}</p>
                                        {selectedMonth && <p>Oy: {selectedMonth.name}</p>}
                                    </div>

                                    <div className="progress-bar-modal">
                                        <div 
                                            className="progress-fill-modal" 
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {uploadState === 'completed' && uploadedVideoData && (
                                <div className="upload-success-modal">
                                    <div className="success-icon">
                                        <FiCheck />
                                    </div>
                                    
                                    <div className="video-preview">
                                        <h4>{uploadedVideoData.title || formData.title}</h4>
                                        <div className="video-info">
                                            <div className="info-item">
                                                <span>Video ID:</span>
                                                <span>{uploadedVideoData.video_id}</span>
                                            </div>
                                            <div className="info-item">
                                                <span>Kurs:</span>
                                                <span>{selectedCourse?.title}</span>
                                            </div>
                                            <div className="info-item">
                                                <span>Oy:</span>
                                                <span>{selectedMonth?.name}</span>
                                            </div>
                                            <div className="info-item">
                                                <span>Hajm:</span>
                                                <span>{formatFileSize(uploadInfo.fileSize)}</span>
                                            </div>
                                        </div>

                                        <div className="video-actions">
                                            <button 
                                                className="btn btn-primary"
                                                onClick={() => {
                                                    closeUploadModal()
                                                    navigate(`/profile/teacher/${channelSlug}/videos`)
                                                }}
                                            >
                                                <FiEye /> Videolarni ko'rish
                                            </button>
                                            <button 
                                                className="btn btn-outline"
                                                onClick={() => {
                                                    closeUploadModal()
                                                    resetUpload()
                                                }}
                                            >
                                                <FiUpload /> Yangi video yuklash
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {uploadState === 'error' && error && (
                                <div className="upload-error-modal">
                                    <div className="error-icon">
                                        <FiAlertCircle />
                                    </div>
                                    <p>{error}</p>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={closeUploadModal}
                                    >
                                        Yopish
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default VideoUpload
