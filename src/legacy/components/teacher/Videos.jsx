"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import {
    FiPlus, FiEdit, FiTrash2, FiEye, FiFileText, FiClipboard, FiHash,
    FiPlay, FiClock, FiCalendar, FiFilter, FiSearch, FiMoreVertical,
    FiBook, FiUsers, FiVideo, FiCheckCircle, FiX, FiBookOpen, FiHelpCircle
} from "react-icons/fi"
import useSelectedChannel from "../../hooks/useSelectedChannel"
import { teacherVideosAPI } from "../../api/apiTeacherVideos"
import { teacherCoursesAPI } from "../../api/apiTeacherInformationCourses"
import { testAssignmentAPI } from "../../api/apiTestEndAssignments"
import { BaseUrlReels } from "../../api/apiService"
import TestCreatorModal from "./TestCreatorModal"
import AssignmentCreatorModal from "./AssignmentCreatorModal"
import TestViewModal from "./TestViewModal"
import AssignmentViewModal from "./AssignmentViewModal"
import VideoTestsModal from "./VideoTestsModal"
import VideoAssignmentsModal from "./VideoAssignmentsModal"

const TeacherVideos = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { channelSlug } = useParams()
    const { selectedChannel } = useSelectedChannel()
    const videoRef = useRef(null)
    const hlsRef = useRef(null)

    // State management
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [courseMonths, setCourseMonths] = useState([])
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)
    const [videosLoading, setVideosLoading] = useState(false)

    // UI states
    const [showCourseSelector, setShowCourseSelector] = useState(true)
    const [showMonthSelector, setShowMonthSelector] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterBy, setFilterBy] = useState("all") // all, has_test, has_assignment
    const [sortBy, setSortBy] = useState("order")
    const [videoMenuOpen, setVideoMenuOpen] = useState(null)
    const [showVideoModal, setShowVideoModal] = useState(false)
    const [selectedVideo, setSelectedVideo] = useState(null)

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false)
    const [showTestModal, setShowTestModal] = useState(false)
    const [showAssignmentModal, setShowAssignmentModal] = useState(false)
    const [videoLoading, setVideoLoading] = useState(false)
    const [selectedVideoForTest, setSelectedVideoForTest] = useState(null)
    const [selectedVideoForAssignment, setSelectedVideoForAssignment] = useState(null)
    const [showTestViewModal, setShowTestViewModal] = useState(false)
    const [showAssignmentViewModal, setShowAssignmentViewModal] = useState(false)
    const [selectedTestId, setSelectedTestId] = useState(null)
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
    const [showVideoTestsModal, setShowVideoTestsModal] = useState(false)
    const [showVideoAssignmentsModal, setShowVideoAssignmentsModal] = useState(false)
    const [selectedVideoForTestsView, setSelectedVideoForTestsView] = useState(null)
    const [selectedVideoForAssignmentsView, setSelectedVideoForAssignmentsView] = useState(null)

    // Fetch functions
    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true)
            const slug = channelSlug || selectedChannel?.slug
            if (!slug) return

            const response = await teacherCoursesAPI.getChannelCourses(slug)
            setCourses(response.results || response || [])
        } catch (error) {
            console.error("Error fetching courses:", error)
            setCourses([])
        } finally {
            setLoading(false)
        }
    }, [channelSlug, selectedChannel])

    const fetchCourseMonths = useCallback(async (courseSlug) => {
        try {
            console.log('getCourseTypes API chaqirilmoqda, courseSlug:', courseSlug)
            const response = await teacherCoursesAPI.getCourseTypes(courseSlug)
            console.log('getCourseTypes javob:', response)
            
            const months = response.results || response || []
            console.log('Oylar ma\'lumotlari:', months)
            setCourseMonths(months)
            
            if (months.length > 0) {
                console.log('Jami oylar soni:', months.length)
                months.forEach((month, index) => {
                    console.log(`Oy ${index + 1}:`, month.name, '- ID:', month.id, '- Slug:', month.slug)
                })
            } else {
                console.log('Hech qanday oy topilmadi')
            }
        } catch (error) {
            console.error("Error fetching course months:", error)
            setCourseMonths([])
        }
    }, [])

    const fetchVideos = useCallback(async (courseSlug, monthSlug = null) => {
        try {
            setVideosLoading(true)
            let response

            if (monthSlug) {
                // Oyga qarab videolar
                console.log('getCourseTypeVideos chaqirilmoqda:', courseSlug, monthSlug)
                response = await teacherVideosAPI.getCourseTypeVideos(courseSlug, monthSlug)
                console.log('Oy videolari javob:', response)
            } else {
                // Barcha videolar - faqat "Barcha oylar" tugmasi bosilganda
                console.log('getCourseVideos chaqirilmoqda:', courseSlug)
                response = await teacherVideosAPI.getCourseVideos(courseSlug)
                console.log('Barcha videolar javob:', response)
            }

            const videos = response.results || response || []
            console.log('Videolar ma\'lumotlari:', videos)
            setVideos(videos)
        } catch (error) {
            console.error("Error fetching videos:", error)
            setVideos([])
        } finally {
            setVideosLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCourses()
    }, [fetchCourses])

    // TeacherInfomration.jsx dan kelgan course ma'lumotlarini handle qilish
    useEffect(() => {
        const state = location.state
        if (state?.selectedCourse) {
            handleCourseSelect(state.selectedCourse)
        }
    }, [location.state])

    // Course selection handler
    const handleCourseSelect = async (course) => {
        console.log('Kurs tanlandi:', course)
        setSelectedCourse(course)
        setShowCourseSelector(false)

        // Har doim getCourseTypes chaqirish - oylar ma'lumotlarini olish
        console.log('getCourseTypes chaqirilmoqda...')
        await fetchCourseMonths(course.slug)
        
        if (course.purchase_scope === 'course_type') {
            // Agar oylar bo'yicha bo'lsa, oylar selectorini ko'rsatish
            console.log('Oylar selector ko\'rsatilmoqda - foydalanuvchi oy tanlashi kerak')
            setShowMonthSelector(true)
            // Videolarni hali yuklamaymiz - foydalanuvchi oy tanlaganda yuklaymiz
        } else {
            // Agar butun kurs bo'lsa, oylar ma'lumotlarini ko'rsatish va videolarni yuklash
            console.log('Butun kurs - oylar ma\'lumotlari ko\'rsatildi, videolar yuklanmoqda')
            setShowMonthSelector(true) // Oylarni ko'rsatish lekin avtomatik "Barcha oylar" tanlash
        }
    }

    // Month selection handler
    const handleMonthSelect = async (month) => {
        setSelectedMonth(month)
        setShowMonthSelector(false)
        await fetchVideos(selectedCourse.slug, month.slug)
    }

    // All months selection
    const handleAllMonthsSelect = async () => {
        setSelectedMonth(null)
        setShowMonthSelector(false)
        await fetchVideos(selectedCourse.slug)
    }

    // Video actions
    const handleDeleteVideo = async (videoId) => {
        if (window.confirm("Videoni o'chirishni xohlaysizmi?")) {
            try {
                await teacherVideosAPI.deleteVideo(videoId)
                setVideos(videos.filter(video => video.id !== videoId))
                setVideoMenuOpen(null)
            } catch (error) {
                console.error("Error deleting video:", error)
                alert("Xatolik yuz berdi!")
            }
        }
    }

    const handleViewVideo = async (video) => {
        try {
            const videoDetail = await teacherVideosAPI.getVideoDetail(video.id)
            setSelectedVideo(videoDetail)
            setShowVideoModal(true)
            setVideoMenuOpen(null)
        } catch (error) {
            console.error("Error fetching video detail:", error)
            // Agar API xatolik bersa, mavjud ma'lumotlar bilan modal ochish
            setSelectedVideo(video)
            setShowVideoModal(true)
            setVideoMenuOpen(null)
        }
    }

    const handleCloseVideoModal = () => {
        // Cleanup HLS before closing modal
        if (hlsRef.current) {
            hlsRef.current.destroy()
            hlsRef.current = null
        }

        // Reset video element
        if (videoRef.current) {
            videoRef.current.src = ''
            videoRef.current.load()
        }

        setShowVideoModal(false)
        setSelectedVideo(null)
    }

    // HLS Video Player setup
    const setupHLSPlayer = useCallback((video) => {
        if (!videoRef.current || !video) return

        setVideoLoading(true)

        // Cleanup previous HLS instance
        if (hlsRef.current) {
            hlsRef.current.destroy()
            hlsRef.current = null
        }

        const videoElement = videoRef.current

        // Determine video URL priority: HLS -> MP4
        let videoUrl = null
        if (video.hls_playlist_url) {
            videoUrl = video.hls_playlist_url.startsWith('http')
                ? video.hls_playlist_url
                : `${BaseUrlReels}${video.hls_playlist_url}`
        } else if (video.upload_file) {
            videoUrl = video.upload_file
        }

        if (!videoUrl) {
            console.error('No video URL available')
            setVideoLoading(false)
            return
        }

        console.log('Setting up video player with URL:', videoUrl)

        // Check if it's HLS content
        if (video.hls_playlist_url) {
            // Check if HLS is natively supported (Safari)
            if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                console.log('Using native HLS support')
                videoElement.src = videoUrl
            } else {
                // Use HLS.js for other browsers
                console.log('Loading HLS.js for video playback')
                import('hls.js').then(({ default: Hls }) => {
                    if (Hls.isSupported()) {
                        console.log('HLS.js is supported, initializing...')
                        const hls = new Hls({
                            enableWorker: false,
                            lowLatencyMode: true,
                            backBufferLength: 90,
                            maxBufferLength: 30,
                            maxMaxBufferLength: 600,
                            startLevel: -1,
                            capLevelToPlayerSize: true
                        })

                        hlsRef.current = hls
                        hls.loadSource(videoUrl)
                        hls.attachMedia(videoElement)

                        hls.on(Hls.Events.MANIFEST_PARSED, () => {
                            console.log('HLS manifest parsed successfully')
                            setVideoLoading(false)
                        })

                        hls.on(Hls.Events.ERROR, (event, data) => {
                            console.error('HLS error:', event, data)
                            setVideoLoading(false)
                            if (data.fatal) {
                                console.log('Fatal HLS error, trying fallback to MP4')
                                // Fallback to MP4 if available
                                if (video.upload_file) {
                                    videoElement.src = video.upload_file
                                }
                            }
                        })
                        hls.on(Hls.Events.LEVEL_LOADED, () => {
                            console.log('HLS level loaded')
                            setVideoLoading(false)
                        })
                    } else {
                        console.error('HLS.js is not supported, using MP4 fallback')
                        setVideoLoading(false)
                        // Fallback to MP4
                        if (video.upload_file) {
                            videoElement.src = video.upload_file
                        }
                    }
                }).catch(error => {
                    console.error('Failed to load HLS.js:', error)
                    setVideoLoading(false)
                    // Fallback to MP4
                    if (video.upload_file) {
                        videoElement.src = video.upload_file
                    }
                })
            }
        } else {
            // Direct MP4 playback
            console.log('Using direct MP4 playback')
            videoElement.src = videoUrl
            setVideoLoading(false)
        }

        // Add event listeners for video loading
        const handleLoadStart = () => setVideoLoading(true)
        const handleCanPlay = () => setVideoLoading(false)
        const handleError = () => setVideoLoading(false)

        videoElement.addEventListener('loadstart', handleLoadStart)
        videoElement.addEventListener('canplay', handleCanPlay)
        videoElement.addEventListener('error', handleError)

        // Cleanup event listeners
        return () => {
            videoElement.removeEventListener('loadstart', handleLoadStart)
            videoElement.removeEventListener('canplay', handleCanPlay)
            videoElement.removeEventListener('error', handleError)
        }
    }, [])

    // Setup video player when modal opens
    useEffect(() => {
        if (showVideoModal && selectedVideo) {
            // Small delay to ensure video element is rendered
            const timer = setTimeout(() => {
                setupHLSPlayer(selectedVideo)
            }, 100)

            return () => clearTimeout(timer)
        }
    }, [showVideoModal, selectedVideo, setupHLSPlayer])

    // Cleanup HLS on component unmount
    useEffect(() => {
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy()
            }
        }
    }, [])

    // Modal action handlers
    const handleEditVideo = (video) => {
        setSelectedVideo(video)
        setShowEditModal(true)
        setVideoMenuOpen(null)
    }

    const handleVideoTests = (video) => {
        setSelectedVideo(video)
        setShowTestModal(true)
        setVideoMenuOpen(null)
    }

    const handleVideoAssignments = (video) => {
        setSelectedVideo(video)
        setShowAssignmentModal(true)
        setVideoMenuOpen(null)
    }

    // Test va Assignment yaratish funksiyalari
    const handleCreateTest = (video) => {
        setSelectedVideoForTest(video)
        setShowTestModal(true)
        setVideoMenuOpen(null)
    }

    const handleCreateAssignment = (video) => {
        setSelectedVideoForAssignment(video)
        setShowAssignmentModal(true)
        setVideoMenuOpen(null)
    }

    const handleTestCreated = (newTest) => {
        console.log('Test yaratildi:', newTest)
        // Videolar ro'yxatini yangilash
        if (selectedMonth) {
            fetchVideos(selectedCourse.id, selectedMonth.id)
        }
        setShowTestModal(false)
        setSelectedVideoForTest(null)
    }

    const handleAssignmentCreated = (newAssignment) => {
        console.log('Vazifa yaratildi:', newAssignment)
        // Videolar ro'yxatini yangilash
        if (selectedMonth) {
            fetchVideos(selectedCourse.id, selectedMonth.id)
        }
        setShowAssignmentModal(false)
        setSelectedVideoForAssignment(null)
    }

    // Test va Assignment ko'rish funksiyalari (yangi endpoint bilan)
    const handleViewTests = async (video) => {
        try {
            setSelectedVideoForTestsView(video)
            setShowVideoTestsModal(true)
        } catch (error) {
            console.error('Error opening tests modal:', error)
            alert('Testlarni ochishda xatolik!')
        }
        setVideoMenuOpen(null)
    }

    const handleViewAssignments = async (video) => {
        try {
            setSelectedVideoForAssignmentsView(video)
            setShowVideoAssignmentsModal(true)
        } catch (error) {
            console.error('Error opening assignments modal:', error)
            alert('Vazifalarni ochishda xatolik!')
        }
        setVideoMenuOpen(null)
    }

    // Test va Assignment tahrirlash/o'chirish
    const handleEditTest = (testData) => {
        console.log('Test tahrirlash:', testData)
        // Test tahrirlash modalini ochish
        setShowTestViewModal(false)
    }

    const handleDeleteTest = async (testId) => {
        try {
            // Test o'chirish API chaqiruvi
            console.log('Test o\'chirish:', testId)
            // Videolar ro'yxatini yangilash
            if (selectedMonth) {
                fetchVideos(selectedCourse.id, selectedMonth.id)
            }
            setShowTestViewModal(false)
        } catch (error) {
            console.error('Error deleting test:', error)
            alert('Testni o\'chirishda xatolik!')
        }
    }

    const handleEditAssignment = (assignmentData) => {
        console.log('Vazifa tahrirlash:', assignmentData)
        // Vazifa tahrirlash modalini ochish
        setShowAssignmentViewModal(false)
    }

    const handleDeleteAssignment = async (assignmentId) => {
        try {
            // Vazifa o'chirish API chaqiruvi
            console.log('Vazifa o\'chirish:', assignmentId)
            // Videolar ro'yxatini yangilash
            if (selectedMonth) {
                fetchVideos(selectedCourse.id, selectedMonth.id)
            }
            setShowAssignmentViewModal(false)
        } catch (error) {
            console.error('Error deleting assignment:', error)
            alert('Vazifani o\'chirishda xatolik!')
        }
    }

    // Reset selections
    const resetSelections = () => {
        setSelectedCourse(null)
        setSelectedMonth(null)
        setVideos([])
        setShowCourseSelector(true)
        setShowMonthSelector(false)
    }

    // Filter and sort videos
    const filteredAndSortedVideos = videos
        .filter(video => {
            // Search filter
            const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                video.description?.toLowerCase().includes(searchTerm.toLowerCase())

            // Feature filter
            let matchesFilter = true
            if (filterBy === 'has_test') matchesFilter = video.has_test
            else if (filterBy === 'has_assignment') matchesFilter = video.has_assignment

            return matchesSearch && matchesFilter
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'order':
                    return (a.order || 0) - (b.order || 0)
                case 'title':
                    return a.title.localeCompare(b.title)
                case 'date_desc':
                    return new Date(b.created_at) - new Date(a.created_at)
                case 'date_asc':
                    return new Date(a.created_at) - new Date(b.created_at)
                default:
                    return 0
            }
        })

    if (loading) {
        return (
            <div className="teacher-videos loading">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Kurslar yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="teacher-videos">
            {/* Header */}
            <div className="tv-header">
                <div className="tv-header-content">
                    <h1>Videolar Boshqaruvi</h1>
                    <div className="tv-breadcrumb">
                        {selectedCourse && (
                            <>
                                <span className="tv-breadcrumb-item" onClick={resetSelections}>
                                    Kurslar
                                </span>
                                <span className="tv-breadcrumb-separator">/</span>
                                <span className="tv-breadcrumb-item active">
                                    {selectedCourse.title}
                                </span>
                                {selectedMonth && (
                                    <>
                                        <span className="tv-breadcrumb-separator">/</span>
                                        <span className="tv-breadcrumb-item active">
                                            {selectedMonth.name}
                                        </span>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
                {selectedCourse && !showMonthSelector && (
                    <button 
                        className="tv-create-btn"
                        onClick={() => navigate(`/profile/teacher/${channelSlug}/videos/upload`, {
                            state: { 
                                selectedCourse,
                                selectedMonth 
                            }
                        })}
                    >
                        <FiPlus />
                        Yangi video
                    </button>
                )}
            </div>

            {/* Course Selector */}
            {showCourseSelector && (
                <div className="tv-course-selector">
                    <div className="tv-selector-header">
                        <h2>Kursni tanlang</h2>
                        <p>Videolarni boshqarish uchun avval kursni tanlang</p>
                    </div>

                    {courses.length === 0 ? (
                        <div className="tv-empty-courses">
                            <FiBook className="empty-icon" />
                            <h3>Hali kurslar yo'q</h3>
                            <p>Videolar boshqarish uchun avval kurs yarating</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/profile/teacher/${channelSlug}/courses`)}
                            >
                                <FiPlus /> Kurs yaratish
                            </button>
                        </div>
                    ) : (
                        <div className="tv-courses-grid">
                            {courses.map(course => (
                                <div
                                    key={course.id}
                                    className="tv-course-card"
                                    onClick={() => handleCourseSelect(course)}
                                >
                                    <div className="tv-course-info">
                                        <h3>{course.title}</h3>
                                        <div className="tv-course-stats">
                                            <span><FiVideo /> {course.videos_count || 0} video</span>
                                            <span><FiCalendar /> {course.course_types_count || 0} oy</span>
                                            <span><FiUsers /> {course.students_count || 0} o'quvchi</span>
                                        </div>
                                        <div className="tv-course-badges">
                                            <span className={`tv-scope-badge ${course.purchase_scope}`}>
                                                {course.purchase_scope === 'course' ? 'Butun kurs' : 'Oylar bo\'yicha'}
                                            </span>
                                            {course.price && (
                                                <span className="tv-price-badge">{course.price} FC</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Month Selector */}
            {showMonthSelector && (
                <div className="tv-month-selector">
                    <div className="tv-selector-header">
                        <h2>{selectedCourse.title} - Oyni tanlang</h2>
                        <p>Qaysi oyning videolarini boshqarishni xohlaysiz?</p>
                        <div className="tv-debug-info">
                            <p><strong>Debug:</strong> Jami {courseMonths.length} ta oy topildi</p>
                            {courseMonths.length === 0 && (
                                <p style={{color: 'red'}}>⚠️ Hech qanday oy ma'lumoti kelmadi!</p>
                            )}
                        </div>
                    </div>

                    <div className="tv-months-grid">
                        <div
                            className="tv-month-card all-months"
                            onClick={handleAllMonthsSelect}
                        >
                            <div className="tv-month-info">
                                <FiBookOpen className="tv-month-icon" />
                                <h3>Barcha oylar</h3>
                                <p>Kursning barcha videolarini ko'rish</p>
                                <div className="tv-month-stats">
                                    <span><FiVideo /> getCourseVideos chaqiriladi</span>
                                </div>
                            </div>
                        </div>

                        {courseMonths.length > 0 ? (
                            courseMonths.map(month => (
                                <div
                                    key={month.id}
                                    className="tv-month-card"
                                    onClick={() => handleMonthSelect(month)}
                                >
                                    <div className="tv-month-info">
                                        <FiCalendar className="tv-month-icon" />
                                        <h3>{month.name}</h3>
                                        <p>{month.description || 'Tavsif yo\'q'}</p>
                                        <div className="tv-month-stats">
                                            <span><FiVideo /> {month.total_course_videos || 0} video</span>
                                            {month.price && <span>{month.price} FC</span>}
                                            <span>ID: {month.id}</span>
                                            <span>Slug: {month.slug}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="tv-empty-months">
                                <FiHelpCircle className="empty-icon" />
                                <h3>Oylar yuklanmadi</h3>
                                <p>getCourseTypes API dan ma'lumot kelmadi</p>
                                <button 
                                    className="btn btn-secondary"
                                    onClick={() => fetchCourseMonths(selectedCourse.slug)}
                                >
                                    Qayta urinish
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Videos Table */}
            {selectedCourse && !showMonthSelector && (
                <div className="tv-videos-section">
                    {/* Filters and Search */}
                    <div className="tv-filters">
                        <div className="tv-search">
                            <FiSearch />
                            <input
                                type="text"
                                placeholder="Video qidirish..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="tv-filter-controls">
                            <select
                                value={filterBy}
                                onChange={(e) => setFilterBy(e.target.value)}
                                className="tv-filter-select"
                            >
                                <option value="all">Barcha videolar</option>
                                <option value="has_test">Test bilan</option>
                                <option value="has_assignment">Vazifa bilan</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="tv-sort-select"
                            >
                                <option value="order">Tartib bo'yicha</option>
                                <option value="title">Nom bo'yicha</option>
                                <option value="date_desc">Yangi birinchi</option>
                                <option value="date_asc">Eski birinchi</option>
                            </select>
                        </div>
                    </div>

                    {/* Videos Table */}
                    {videosLoading ? (
                        <div className="tv-loading">
                            <div className="spinner"></div>
                            <p>Videolar yuklanmoqda...</p>
                        </div>
                    ) : filteredAndSortedVideos.length === 0 ? (
                        <div className="tv-empty-videos">
                            <FiVideo className="empty-icon" />
                            <h3>Videolar topilmadi</h3>
                            <p>Bu {selectedMonth ? 'oy' : 'kurs'} uchun hali videolar yuklangan emas</p>
                            <button 
                                className="btn btn-primary"
                                onClick={() => navigate(`/profile/teacher/${channelSlug}/videos/upload`, {
                                    state: { 
                                        selectedCourse,
                                        selectedMonth 
                                    }
                                })}
                            >
                                <FiPlus /> Birinchi videoni yuklash
                            </button>
                        </div>
                    ) : (
                        <div className="tv-videos-table">
                            <div className="tv-table-header">
                                <div className="tv-th">Video</div>
                                <div className="tv-th">Oy</div>
                                <div className="tv-th">Tartib</div>
                                <div className="tv-th">Test/Vazifa</div>
                                <div className="tv-th">Sana</div>
                                <div className="tv-th">Amallar</div>
                            </div>

                            <div className="tv-table-body">
                                {filteredAndSortedVideos.map(video => (
                                    <div key={video.id} className="tv-table-row">
                                        <div className="tv-td tv-video-info">
                                            <div className="tv-video-thumbnail">
                                                <FiPlay className="play-icon" />
                                            </div>
                                            <div className="tv-video-details">
                                                <h4>{video.title}</h4>
                                                <p>
                                                    {video.description.length > 80
                                                        ? `${video.description.slice(0, 80)}...`
                                                        : video.description}
                                                </p>
                                                {video.duration && (
                                                    <span className="tv-duration">
                                                        <FiClock /> {video.duration}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="tv-td">
                                            {video.course_type_info ? (
                                                <span className="tv-month-badge">
                                                    {video.course_type_info.name}
                                                </span>
                                            ) : (
                                                <span className="tv-no-month">-</span>
                                            )}
                                        </div>

                                        <div className="tv-td">
                                            <span className="tv-order-badge">
                                                #{video.order || 0}
                                            </span>
                                        </div>

                                        <div className="tv-td">
                                            <div className="tv-features">
                                                {video.has_test && (
                                                    <span className="tv-feature-badge test">
                                                        <FiFileText /> Test
                                                        {video.tests_brief?.length > 0 && (
                                                            <span className="count">({video.tests_brief.length})</span>
                                                        )}
                                                    </span>
                                                )}
                                                {video.has_assignment && (
                                                    <span className="tv-feature-badge assignment">
                                                        <FiClipboard /> Vazifa
                                                        {video.assignments_brief?.length > 0 && (
                                                            <span className="count">({video.assignments_brief.length})</span>
                                                        )}
                                                    </span>
                                                )}
                                                {!video.has_test && !video.has_assignment && (
                                                    <span className="tv-no-features">-</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="tv-td">
                                            <span className="tv-date">
                                                {new Date(video.created_at).toLocaleDateString('uz-UZ')}
                                            </span>
                                        </div>

                                        <div className="tv-td">
                                            <div className="tv-video-menu">
                                                <button
                                                    className="tv-menu-btn"
                                                    onClick={() => setVideoMenuOpen(videoMenuOpen === video.id ? null : video.id)}
                                                >
                                                    <FiMoreVertical />
                                                </button>
                                                {videoMenuOpen === video.id && (
                                                    <div className="tv-dropdown">
                                                        <button
                                                            className="tv-dropdown-item"
                                                            onClick={() => handleViewVideo(video)}
                                                        >
                                                            <FiEye /> Ko'rish
                                                        </button>
                                                        <button
                                                            className="tv-dropdown-item"
                                                            onClick={() => handleEditVideo(video)}
                                                        >
                                                            <FiEdit /> Tahrirlash
                                                        </button>
                                                        <button
                                                            className="tv-dropdown-item"
                                                            onClick={() => handleCreateTest(video)}
                                                        >
                                                            <FiHelpCircle /> Test yaratish
                                                        </button>
                                                        <button
                                                            className="tv-dropdown-item"
                                                            onClick={() => handleCreateAssignment(video)}
                                                        >
                                                            <FiClipboard /> Vazifa yaratish
                                                        </button>
                                                        <div className="tv-dropdown-divider"></div>
                                                        <button
                                                            className="tv-dropdown-item"
                                                            onClick={() => handleViewTests(video)}
                                                        >
                                                            <FiFileText /> Testlarni ko'rish
                                                        </button>
                                                        <button
                                                            className="tv-dropdown-item"
                                                            onClick={() => handleViewAssignments(video)}
                                                        >
                                                            <FiBookOpen /> Vazifalarni ko'rish
                                                        </button>
                                                        <button
                                                            className="tv-dropdown-item danger"
                                                            onClick={() => handleDeleteVideo(video.id)}
                                                        >
                                                            <FiTrash2 /> O'chirish
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Video Detail Modal */}
            {showVideoModal && selectedVideo && (
                <div className="tv-video-modal-overlay" onClick={handleCloseVideoModal}>
                    <div className="tv-video-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tv-video-modal-header">
                            <h2>Video Ma'lumotlari</h2>
                            <button
                                className="tv-modal-close"
                                onClick={handleCloseVideoModal}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="tv-video-modal-content">
                            {/* Video Player */}
                            <div className="tv-video-player">
                                {selectedVideo.hls_playlist_url ? (
                                    <div className="tv-video-container">
                                        {videoLoading && (
                                            <div className="tv-video-loading">
                                                <div className="spinner"></div>
                                                <p>Video yuklanmoqda...</p>
                                            </div>
                                        )}
                                        <video
                                            ref={videoRef}
                                            controls
                                            width="100%"
                                            height="400"
                                            poster="/placeholder-video.jpg"
                                            preload="metadata"
                                            style={{ display: videoLoading ? 'none' : 'block' }}
                                        >
                                            Brauzeringiz video formatini qo'llab-quvvatlamaydi.
                                        </video>
                                    </div>
                                ) : (
                                    <div className="tv-video-placeholder">
                                        <FiPlay className="play-icon" />
                                        <p>Video mavjud emas</p>
                                    </div>
                                )}
                            </div>

                            {/* Video Info */}
                            <div className="tv-video-info-section">
                                <div className="tv-video-main-info">
                                    <h3>{selectedVideo.title}</h3>
                                    <p className="tv-video-description">{selectedVideo.description}</p>

                                    <div className="tv-video-meta">
                                        <div className="tv-meta-item">
                                            <FiCalendar />
                                            <span>Yaratilgan: {new Date(selectedVideo.created_at).toLocaleDateString('uz-UZ')}</span>
                                        </div>
                                        {selectedVideo.duration && (
                                            <div className="tv-meta-item">
                                                <FiClock />
                                                <span>Davomiyligi: {selectedVideo.duration}</span>
                                            </div>
                                        )}
                                        <div className="tv-meta-item">
                                            <FiHash />
                                            <span>Tartib: #{selectedVideo.order || 0}</span>
                                        </div>
                                        {selectedVideo.course_type_info && (
                                            <div className="tv-meta-item">
                                                <FiBookOpen />
                                                <span>Oy: {selectedVideo.course_type_info.name}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="tv-video-features">
                                        {selectedVideo.has_test && (
                                            <div className="tv-feature-card test">
                                                <FiFileText className="feature-icon" />
                                                <div className="feature-info">
                                                    <h4>Testlar</h4>
                                                    <p>{selectedVideo.tests_brief?.length || 0} ta test mavjud</p>
                                                    {selectedVideo.tests_brief?.map(test => (
                                                        <span key={test.id} className="feature-item">
                                                            • {test.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedVideo.has_assignment && (
                                            <div className="tv-feature-card assignment">
                                                <FiClipboard className="feature-icon" />
                                                <div className="feature-info">
                                                    <h4>Vazifalar</h4>
                                                    <p>{selectedVideo.assignments_brief?.length || 0} ta vazifa mavjud</p>
                                                    {selectedVideo.assignments_brief?.map(assignment => (
                                                        <span key={assignment.id} className="feature-item">
                                                            • {assignment.title}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {!selectedVideo.has_test && !selectedVideo.has_assignment && (
                                            <div className="tv-no-features">
                                                <p>Bu video uchun test yoki vazifa mavjud emas</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Technical Info */}
                                <div className="tv-technical-info">
                                    <h4>Texnik Ma'lumotlar</h4>
                                    <div className="tv-tech-grid">
                                        <div className="tv-tech-item">
                                            <span className="label">Video ID:</span>
                                            <span className="value">#{selectedVideo.id}</span>
                                        </div>
                                        <div className="tv-tech-item">
                                            <span className="label">Kurs ID:</span>
                                            <span className="value">#{selectedVideo.course}</span>
                                        </div>
                                        {selectedVideo.course_type && (
                                            <div className="tv-tech-item">
                                                <span className="label">Oy ID:</span>
                                                <span className="value">#{selectedVideo.course_type}</span>
                                            </div>
                                        )}
                                        <div className="tv-tech-item">
                                            <span className="label">Qulflangan:</span>
                                            <span className={`value ${selectedVideo.is_locked ? 'locked' : 'unlocked'}`}>
                                                {selectedVideo.is_locked ? 'Ha' : 'Yo\'q'}
                                            </span>
                                        </div>
                                        {selectedVideo.file_url && (
                                            <div className="tv-tech-item">
                                                <span className="label">Fayl URL:</span>
                                                <span className="value url">{selectedVideo.file_url}</span>
                                            </div>
                                        )}
                                        {selectedVideo.hls_playlist_url && (
                                            <div className="tv-tech-item">
                                                <span className="label">HLS Playlist:</span>
                                                <span className="value url">{selectedVideo.hls_playlist_url}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="tv-video-modal-actions">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        handleCloseVideoModal()
                                        handleEditVideo(selectedVideo)
                                    }}
                                >
                                    <FiEdit /> Tahrirlash
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        handleCloseVideoModal()
                                        handleVideoTests(selectedVideo)
                                    }}
                                >
                                    <FiFileText /> Testlar
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        handleCloseVideoModal()
                                        handleVideoAssignments(selectedVideo)
                                    }}
                                >
                                    <FiClipboard /> Vazifalar
                                </button>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => {
                                        handleCloseVideoModal()
                                        handleDeleteVideo(selectedVideo.id)
                                    }}
                                >
                                    <FiTrash2 /> O'chirish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Video Modal */}
            {showEditModal && selectedVideo && (
                <div className="tv-modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="tv-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tv-modal-header">
                            <h2>Videoni Tahrirlash</h2>
                            <button
                                className="tv-modal-close"
                                onClick={() => setShowEditModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>
                        <div className="tv-modal-content">
                            <p>Video tahrirlash funksiyasi tez orada qo'shiladi...</p>
                            <p><strong>Video:</strong> {selectedVideo.title}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Test Modal */}
            {showTestModal && selectedVideo && (
                <div className="tv-modal-overlay" onClick={() => setShowTestModal(false)}>
                    <div className="tv-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tv-modal-header">
                            <h2>Video Testlari</h2>
                            <button
                                className="tv-modal-close"
                                onClick={() => setShowTestModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>
                        <div className="tv-modal-content">
                            <div className="tv-test-info">
                                <h3>{selectedVideo.title} - Testlar</h3>
                                {selectedVideo.has_test ? (
                                    <div className="tv-test-list">
                                        <p><strong>Mavjud testlar:</strong></p>
                                        {selectedVideo.tests_brief?.map(test => (
                                            <div key={test.id} className="tv-test-item">
                                                <FiFileText />
                                                <span>{test.title}</span>
                                                <button className="btn btn-sm btn-primary">
                                                    Tahrirlash
                                                </button>
                                            </div>
                                        ))}
                                        <button className="btn btn-primary">
                                            <FiPlus /> Yangi test qo'shish
                                        </button>
                                    </div>
                                ) : (
                                    <div className="tv-no-tests">
                                        <p>Bu video uchun hali testlar yaratilmagan</p>
                                        <button className="btn btn-primary">
                                            <FiPlus /> Birinchi testni yaratish
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            {showAssignmentModal && selectedVideo && (
                <div className="tv-modal-overlay" onClick={() => setShowAssignmentModal(false)}>
                    <div className="tv-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tv-modal-header">
                            <h2>Video Vazifalari</h2>
                            <button
                                className="tv-modal-close"
                                onClick={() => setShowAssignmentModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>
                        <div className="tv-modal-content">
                            <div className="tv-assignment-info">
                                <h3>{selectedVideo.title} - Vazifalar</h3>
                                {selectedVideo.has_assignment ? (
                                    <div className="tv-assignment-list">
                                        <p><strong>Mavjud vazifalar:</strong></p>
                                        {selectedVideo.assignments_brief?.map(assignment => (
                                            <div key={assignment.id} className="tv-assignment-item">
                                                <FiClipboard />
                                                <span>{assignment.title}</span>
                                                <button className="btn btn-sm btn-primary">
                                                    Tahrirlash
                                                </button>
                                            </div>
                                        ))}
                                        <button className="btn btn-primary">
                                            <FiPlus /> Yangi vazifa qo'shish
                                        </button>
                                    </div>
                                ) : (
                                    <div className="tv-no-assignments">
                                        <p>Bu video uchun hali vazifalar yaratilmagan</p>
                                        <button className="btn btn-primary">
                                            <FiPlus /> Birinchi vazifani yaratish
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Test Creator Modal */}
            <TestCreatorModal
                isOpen={showTestModal}
                onClose={() => {
                    setShowTestModal(false)
                    setSelectedVideoForTest(null)
                }}
                videoId={selectedVideoForTest?.id}
                onTestCreated={handleTestCreated}
            />

            {/* Assignment Creator Modal */}
            <AssignmentCreatorModal
                isOpen={showAssignmentModal}
                onClose={() => {
                    setShowAssignmentModal(false)
                    setSelectedVideoForAssignment(null)
                }}
                videoId={selectedVideoForAssignment?.id}
                onAssignmentCreated={handleAssignmentCreated}
            />

            {/* Test View Modal */}
            <TestViewModal
                isOpen={showTestViewModal}
                onClose={() => {
                    setShowTestViewModal(false)
                    setSelectedTestId(null)
                }}
                testId={selectedTestId}
                onEdit={handleEditTest}
                onDelete={handleDeleteTest}
            />

            {/* Assignment View Modal */}
            <AssignmentViewModal
                isOpen={showAssignmentViewModal}
                onClose={() => {
                    setShowAssignmentViewModal(false)
                    setSelectedAssignmentId(null)
                }}
                assignmentId={selectedAssignmentId}
                onEdit={handleEditAssignment}
                onDelete={handleDeleteAssignment}
            />

            {/* Video Tests Modal */}
            <VideoTestsModal
                isOpen={showVideoTestsModal}
                onClose={() => {
                    setShowVideoTestsModal(false)
                    setSelectedVideoForTestsView(null)
                }}
                video={selectedVideoForTestsView}
                channelSlug={channelSlug}
                courseSlug={selectedCourse?.slug}
            />

            {/* Video Assignments Modal */}
            <VideoAssignmentsModal
                isOpen={showVideoAssignmentsModal}
                onClose={() => {
                    setShowVideoAssignmentsModal(false)
                    setSelectedVideoForAssignmentsView(null)
                }}
                video={selectedVideoForAssignmentsView}
                channelSlug={channelSlug}
                courseSlug={selectedCourse?.slug}
            />
        </div>
    )
}

export default TeacherVideos
