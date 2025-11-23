"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    FiBookOpen,
    FiPlay,
    FiUsers,
    FiFileText,
    FiClipboard,
    FiEye,
    FiEdit,
    FiPlus,
    FiFilter,
    FiSearch,
    FiCalendar,
    FiTrendingUp,
    FiBarChart2
} from "react-icons/fi"
import { teacherAPI } from "../../api/apiTeacher"
import useSelectedChannel from "../../hooks/useSelectedChannel"

const CourseManagement = () => {
    const navigate = useNavigate()
    const { channelSlug, courseSlug } = useParams()
    const { selectedChannel } = useSelectedChannel()

    const [loading, setLoading] = useState(true)
    const [courses, setCourses] = useState([])
    const [videos, setVideos] = useState([])
    const [courseTypes, setCourseTypes] = useState([])
    const [selectedCourseType, setSelectedCourseType] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('order')
    const [currentCourse, setCurrentCourse] = useState(null)

    useEffect(() => {
        if (channelSlug && courseSlug) {
            fetchCourseVideos()
        } else {
            fetchChannelCourses()
        }
    }, [channelSlug, courseSlug, selectedCourseType])

    const fetchChannelCourses = async () => {
        try {
            setLoading(true)
            const response = await teacherAPI.getChannelCourses(selectedChannel?.slug || 'behruz-dev')
            setCourses(response.data.courses || [])
        } catch (error) {
            console.error('Courses fetch error:', error)
            // Mock data fallback
            setCourses([
                {
                    id: 2,
                    title: "matematik amallar",
                    slug: "matematik-amallar",
                    students_count: 0,
                    created_at: "2025-09-20T12:32:43.515566Z",
                    course_types_count: 2,
                    videos_count: 3
                },
                {
                    id: 1,
                    title: "dasturlash",
                    slug: "dasturlash",
                    students_count: 0,
                    created_at: "2025-09-16T14:40:52.089772Z",
                    course_types_count: 1,
                    videos_count: 1
                }
            ])
        } finally {
            setLoading(false)
        }
    }

    const fetchCourseVideos = async () => {
        try {
            setLoading(true)
            let response

            if (selectedCourseType === 'all') {
                response = await teacherAPI.getCourseVideos(channelSlug, courseSlug)
            } else {
                response = await teacherAPI.getCourseTypeVideos(channelSlug, courseSlug, selectedCourseType)
            }

            setVideos(response.data.videos || [])
            setCourseTypes(response.data.course_types || [])
            setCurrentCourse(response.data.course)
        } catch (error) {
            console.error('Videos fetch error:', error)
            // Mock data fallback
            setVideos([
                {
                    id: 74,
                    title: "niasf",
                    order: 0,
                    duration: null,
                    created_at: "2025-09-16T15:20:45.810042Z",
                    course_type: {
                        id: 1,
                        name: "1-oy",
                        slug: "birinchi-oy"
                    },
                    has_test: true,
                    has_assignment: true
                }
            ])
            setCourseTypes([
                {
                    id: 1,
                    name: "1-oy",
                    slug: "birinchi-oy"
                }
            ])
            setCurrentCourse({
                id: 1,
                title: "dasturlash",
                slug: "dasturlash"
            })
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatDuration = (seconds) => {
        if (!seconds) return 'Noma\'lum'
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    const filteredVideos = videos.filter(video => {
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = selectedCourseType === 'all' || video.course_type?.slug === selectedCourseType
        return matchesSearch && matchesType
    })

    const sortedVideos = [...filteredVideos].sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.title.localeCompare(b.title)
            case 'date':
                return new Date(b.created_at) - new Date(a.created_at)
            case 'order':
            default:
                return a.order - b.order
        }
    })

    if (loading) {
        return (
            <div className="course-management">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Ma'lumotlar yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="course-management">
            {!courseSlug ? (
                // Course List View
                <div className="courses-list">
                    <div className="page-header">
                        <div className="header-content">
                            <h1><FiBookOpen /> Kurslar</h1>
                            <p>Kurslaringizni boshqaring va video darsliklarni ko'ring</p>
                            {selectedChannel && (
                                <div className="active-channel">
                                    <span className="channel-badge">Kanal: {selectedChannel.title}</span>
                                </div>
                            )}
                        </div>
                        <div className="header-actions">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/profile/teacher/courses/create')}
                            >
                                <FiPlus /> Yangi kurs
                            </button>
                        </div>
                    </div>

                    <div className="courses-grid">
                        {courses.map((course) => (
                            <div key={course.id} className="course-card">
                                <div className="course-header">
                                    <h3>{course.title}</h3>
                                    <span className="course-date">{formatDate(course.created_at)}</span>
                                </div>

                                <div className="course-stats">
                                    <div className="stat-item">
                                        <FiUsers />
                                        <span>{course.students_count} o'quvchi</span>
                                    </div>
                                    <div className="stat-item">
                                        <FiPlay />
                                        <span>{course.videos_count} video</span>
                                    </div>
                                    <div className="stat-item">
                                        <FiBookOpen />
                                        <span>{course.course_types_count} bo'lim</span>
                                    </div>
                                </div>

                                <div className="course-actions">
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => navigate(`/profile/teacher/courses/${course.slug}`)}
                                    >
                                        <FiEye /> Ko'rish
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => navigate(`/profile/teacher/courses/${course.slug}/videos`)}
                                    >
                                        <FiPlay /> Videolar
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => navigate(`/profile/teacher/courses/${course.slug}/analytics`)}
                                    >
                                        <FiBarChart2 /> Statistika
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Video List View
                <div className="videos-list">
                    <div className="page-header">
                        <div className="header-content">
                            <h1><FiPlay /> Video darslar</h1>
                            <p>{currentCourse?.title} kursi bo'yicha video darslar</p>
                            <div className="breadcrumb">
                                <span onClick={() => navigate('/profile/teacher/courses')}>Kurslar</span>
                                <span>/</span>
                                <span>{currentCourse?.title}</span>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/profile/teacher/videos/upload?course=${currentCourse?.slug}`)}
                            >
                                <FiPlus /> Yangi video
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="filters-section">
                        <div className="filters-row">
                            <div className="search-box">
                                <FiSearch />
                                <input
                                    type="text"
                                    placeholder="Video qidirish..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="filter-group">
                                <label>Bo'lim:</label>
                                <select
                                    value={selectedCourseType}
                                    onChange={(e) => setSelectedCourseType(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="all">Barcha bo'limlar</option>
                                    {courseTypes.map((type) => (
                                        <option key={type.id} value={type.slug}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Tartiblash:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="order">Tartib bo'yicha</option>
                                    <option value="title">Sarlavha bo'yicha</option>
                                    <option value="date">Sana bo'yicha</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Videos Grid */}
                    <div className="videos-grid">
                        {sortedVideos.map((video) => (
                            <div key={video.id} className="video-card">
                                <div className="video-header">
                                    <h3>{video.title}</h3>
                                    <span className="video-order">#{video.order}</span>
                                </div>

                                <div className="video-meta">
                                    <div className="meta-item">
                                        <FiCalendar />
                                        <span>{formatDate(video.created_at)}</span>
                                    </div>
                                    <div className="meta-item">
                                        <FiClock />
                                        <span>{formatDuration(video.duration)}</span>
                                    </div>
                                    {video.course_type && (
                                        <div className="meta-item">
                                            <FiBookOpen />
                                            <span>{video.course_type.name}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="video-features">
                                    {video.has_test && (
                                        <span className="feature-badge test">
                                            <FiFileText /> Test
                                        </span>
                                    )}
                                    {video.has_assignment && (
                                        <span className="feature-badge assignment">
                                            <FiClipboard /> Vazifa
                                        </span>
                                    )}
                                </div>

                                <div className="video-actions">
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => navigate(`/profile/teacher/videos/${video.id}/summary`)}
                                    >
                                        <FiEye /> Ko'rish
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => navigate(`/profile/teacher/videos/${video.id}/edit`)}
                                    >
                                        <FiEdit /> Tahrirlash
                                    </button>
                                    {video.has_test && (
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => navigate(`/profile/teacher/videos/${video.id}/tests`)}
                                        >
                                            <FiFileText /> Test
                                        </button>
                                    )}
                                    {video.has_assignment && (
                                        <button
                                            className="btn btn-accent btn-sm"
                                            onClick={() => navigate(`/profile/teacher/videos/${video.id}/assignments`)}
                                        >
                                            <FiClipboard /> Vazifa
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {sortedVideos.length === 0 && (
                        <div className="empty-state">
                            <FiPlay size={64} />
                            <h3>Video darslar topilmadi</h3>
                            <p>Bu kursda hali video darslar mavjud emas</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/profile/teacher/videos/upload?course=${currentCourse?.slug}`)}
                            >
                                <FiPlus /> Birinchi videoni yuklash
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default CourseManagement
