import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { teacherAPI } from '../../api/apiTeacher'
import {
    FiBarChart2,
    FiTrendingUp,
    FiUsers,
    FiPlay,
    FiBookOpen,
    FiEye,
    FiActivity,
    FiCalendar,
    FiAward,
    FiTarget,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiArrowUp,
    FiArrowDown,
    FiVideo,
    FiFileText,
    FiClipboard
} from 'react-icons/fi'

const TeacherAnalytics = () => {
    const { channelSlug } = useParams()
    const navigate = useNavigate()
    
    const [activeTab, setActiveTab] = useState('overview')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [overviewData, setOverviewData] = useState({})
    const [coursesData, setCoursesData] = useState({ courses: [] })
    const [engagementData, setEngagementData] = useState({})

    useEffect(() => {
        loadAnalyticsData()
    }, [channelSlug])

    const loadAnalyticsData = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Load all analytics data in parallel
            const [overview, courses, engagement] = await Promise.all([
                teacherAPI.getAnalyticsOverview(),
                teacherAPI.getAnalyticsCourses(),
                teacherAPI.getAnalyticsEngagement()
            ])

            setOverviewData(overview.data || {})
            setCoursesData(courses.data || { courses: [] })
            setEngagementData(engagement.data || {})

        } catch (error) {
            console.error('Analytics ma\'lumotlarini yuklashda xatolik:', error)
            setError('Ma\'lumotlarni yuklashda xatolik yuz berdi')
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    // Helper functions for performance calculation
    const getPerformanceColor = (course) => {
        const completionRate = course.videos_count > 0 
            ? (course.completed_video_events / course.videos_count) * 100 
            : 0
        
        if (completionRate >= 80) return '#10b981' // green
        if (completionRate >= 60) return '#f59e0b' // yellow
        if (completionRate >= 40) return '#f97316' // orange
        return '#ef4444' // red
    }

    const getPerformanceLabel = (course) => {
        const completionRate = course.videos_count > 0 
            ? (course.completed_video_events / course.videos_count) * 100 
            : 0
        
        if (completionRate >= 80) return 'A\'lo'
        if (completionRate >= 60) return 'Yaxshi'
        if (completionRate >= 40) return 'O\'rta'
        return 'Zaif'
    }

    if (loading) {
        return (
            <div className="teacher-analytics">
                <div className="ta__loading">
                    <div className="spinner"></div>
                    <p>Analytics yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="teacher-analytics">
                <div className="ta__error">
                    <h3>Xatolik yuz berdi</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={loadAnalyticsData}>
                        Qayta urinish
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="teacher-analytics">
            {/* Header */}
            <div className="ta__header">
                <div className="ta__header-content">
                    <h1><FiBarChart2 /> Analytics</h1>
                    <p>Kanal va kurslar bo'yicha batafsil statistika</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="ta__tabs">
                <button 
                    className={`ta__tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <FiTrendingUp size={16} />
                    Umumiy ko'rsatkichlar
                </button>
                <button 
                    className={`ta__tab ${activeTab === 'courses' ? 'active' : ''}`}
                    onClick={() => setActiveTab('courses')}
                >
                    <FiBookOpen size={16} />
                    Kurslar bo'yicha
                </button>
                <button 
                    className={`ta__tab ${activeTab === 'engagement' ? 'active' : ''}`}
                    onClick={() => setActiveTab('engagement')}
                >
                    <FiActivity size={16} />
                    Faollik
                </button>
            </div>

            {/* Tab Content */}
            <div className="ta__content">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="ta__overview">
                        <div className="ta__stats-grid">
                            <div className="ta__stat-card ta__stat-card--primary">
                                <div className="ta__stat-header">
                                    <div className="ta__stat-icon">
                                        <FiBookOpen size={24} />
                                    </div>
                                    <div className="ta__stat-trend positive">
                                        <FiArrowUp size={14} />
                                        +12%
                                    </div>
                                </div>
                                <div className="ta__stat-content">
                                    <div className="ta__stat-value">{overviewData.courses_count || 0}</div>
                                    <div className="ta__stat-label">Jami kurslar</div>
                                </div>
                            </div>

                            <div className="ta__stat-card ta__stat-card--success">
                                <div className="ta__stat-header">
                                    <div className="ta__stat-icon">
                                        <FiPlay size={24} />
                                    </div>
                                    <div className="ta__stat-trend positive">
                                        <FiArrowUp size={14} />
                                        +8%
                                    </div>
                                </div>
                                <div className="ta__stat-content">
                                    <div className="ta__stat-value">{overviewData.videos_count || 0}</div>
                                    <div className="ta__stat-label">Video darslar</div>
                                </div>
                            </div>

                            <div className="ta__stat-card ta__stat-card--warning">
                                <div className="ta__stat-header">
                                    <div className="ta__stat-icon">
                                        <FiUsers size={24} />
                                    </div>
                                    <div className="ta__stat-trend positive">
                                        <FiArrowUp size={14} />
                                        +25%
                                    </div>
                                </div>
                                <div className="ta__stat-content">
                                    <div className="ta__stat-value">{overviewData.students_total || 0}</div>
                                    <div className="ta__stat-label">Jami o'quvchilar</div>
                                </div>
                            </div>

                            <div className="ta__stat-card ta__stat-card--info">
                                <div className="ta__stat-header">
                                    <div className="ta__stat-icon">
                                        <FiEye size={24} />
                                    </div>
                                    <div className="ta__stat-trend positive">
                                        <FiArrowUp size={14} />
                                        +18%
                                    </div>
                                </div>
                                <div className="ta__stat-content">
                                    <div className="ta__stat-value">{overviewData.unique_learners || 0}</div>
                                    <div className="ta__stat-label">Noyob o'quvchilar</div>
                                </div>
                            </div>
                        </div>

                        <div className="ta__detailed-stats">
                            <div className="ta__detailed-card">
                                <h3><FiTarget /> Test va vazifalar</h3>
                                <div className="ta__detailed-grid">
                                    <div className="ta__detailed-item">
                                        <div className="ta__detailed-icon success">
                                            <FiCheckCircle />
                                        </div>
                                        <div className="ta__detailed-content">
                                            <div className="ta__detailed-value">{overviewData.tests_count || 0}</div>
                                            <div className="ta__detailed-label">Jami testlar</div>
                                        </div>
                                    </div>
                                    <div className="ta__detailed-item">
                                        <div className="ta__detailed-icon warning">
                                            <FiActivity />
                                        </div>
                                        <div className="ta__detailed-content">
                                            <div className="ta__detailed-value">{overviewData.assignments_count || 0}</div>
                                            <div className="ta__detailed-label">Jami vazifalar</div>
                                        </div>
                                    </div>
                                    <div className="ta__detailed-item">
                                        <div className="ta__detailed-icon info">
                                            <FiPlay />
                                        </div>
                                        <div className="ta__detailed-content">
                                            <div className="ta__detailed-value">{overviewData.completed_video_events || 0}</div>
                                            <div className="ta__detailed-label">Tugallangan darslar</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                    <div className="ta__courses">
                        <div className="ta__courses-header">
                            <h2>Kurslar bo'yicha batafsil statistika</h2>
                            <p>{coursesData.courses?.length || 0} ta kurs mavjud</p>
                        </div>

                        {coursesData.courses && coursesData.courses.length > 0 ? (
                            <div className="ta__courses-grid">
                                {coursesData.courses.map(course => {
                                    const performanceColor = getPerformanceColor(course)
                                    const performanceLabel = getPerformanceLabel(course)
                                    
                                    return (
                                        <div key={course.id} className="ta__course-card">
                                            <div className="ta__course-header">
                                                <div className="ta__course-info">
                                                    <h3>{course.title}</h3>
                                                    <span className="ta__course-slug">@{course.slug}</span>
                                                </div>
                                                <div 
                                                    className="ta__performance-badge"
                                                    style={{ backgroundColor: performanceColor }}
                                                >
                                                    {performanceLabel}
                                                </div>
                                            </div>

                                            <div className="ta__course-stats">
                                                <div className="ta__course-stat">
                                                    <FiUsers className="stat-icon" />
                                                    <div className="stat-content">
                                                        <div className="stat-value">{course.students_count || 0}</div>
                                                        <div className="stat-label">O'quvchi</div>
                                                    </div>
                                                </div>

                                                <div className="ta__course-stat">
                                                    <FiPlay className="stat-icon" />
                                                    <div className="stat-content">
                                                        <div className="stat-value">{course.videos_count || 0}</div>
                                                        <div className="stat-label">Video</div>
                                                    </div>
                                                </div>

                                                <div className="ta__course-stat">
                                                    <FiCheckCircle className="stat-icon" />
                                                    <div className="stat-content">
                                                        <div className="stat-value">{course.tests_count || 0}</div>
                                                        <div className="stat-label">Test</div>
                                                    </div>
                                                </div>

                                                <div className="ta__course-stat">
                                                    <FiActivity className="stat-icon" />
                                                    <div className="stat-content">
                                                        <div className="stat-value">{course.assignments_count || 0}</div>
                                                        <div className="stat-label">Vazifa</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ta__course-metrics">
                                                <div className="ta__course-metric">
                                                    <div className="metric-header">
                                                        <FiEye className="metric-icon" />
                                                        <span>Noyob o'quvchilar</span>
                                                    </div>
                                                    <div className="metric-value">{course.unique_learners || 0}</div>
                                                </div>

                                                <div className="ta__course-metric">
                                                    <div className="metric-header">
                                                        <FiCalendar className="metric-icon" />
                                                        <span>Yaratilgan: {formatDate(course.created_at)}</span>
                                                    </div>
                                                    
                                                    <div className="ta__engagement-rate">
                                                        <FiBarChart2 className="rate-icon" />
                                                        <span>
                                                            Faollik: {course.students_count > 0 
                                                                ? Math.round((course.unique_learners / course.students_count) * 100)
                                                                : 0}%
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="ta__course-progress">
                                                <div className="progress-header">
                                                    <span>Tugallanish darajasi</span>
                                                    <span>{course.completed_video_events || 0}/{course.videos_count || 0}</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div 
                                                        className="progress-fill"
                                                        style={{ 
                                                            width: `${course.videos_count > 0 ? (course.completed_video_events / course.videos_count) * 100 : 0}%`,
                                                            backgroundColor: performanceColor
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="ta__empty-state">
                                <FiBookOpen size={48} />
                                <h3>Hali kurslar yo'q</h3>
                                <p>Birinchi kursingizni yarating va statistikani kuzating</p>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => navigate(`/profile/teacher/${channelSlug}/courses`)}
                                >
                                    Kurs yaratish
                                </button>
                            </div>
                        )}

                        {/* Course Insights */}
                        {coursesData.courses && coursesData.courses.length > 0 && (
                            <div className="ta__insights">
                                <h3>Tahlil va tavsiyalar</h3>
                                <div className="ta__insights-grid">
                                    <div className="ta__insight-card">
                                        <h4>Eng faol kurs</h4>
                                        {(() => {
                                            const mostActive = coursesData.courses.reduce((prev, current) =>
                                                ((prev.unique_learners || 0) > (current.unique_learners || 0)) ? prev : current
                                            )
                                            return (
                                                <div className="insight-content">
                                                    <div className="insight-title">{mostActive.title}</div>
                                                    <div className="insight-value">{mostActive.unique_learners || 0} faol o'quvchi</div>
                                                </div>
                                            )
                                        })()}
                                    </div>

                                    <div className="ta__insight-card">
                                        <h4>Eng ko'p videoli kurs</h4>
                                        {(() => {
                                            const mostVideos = coursesData.courses.reduce((prev, current) =>
                                                ((prev.videos_count || 0) > (current.videos_count || 0)) ? prev : current
                                            )
                                            return (
                                                <div className="insight-content">
                                                    <div className="insight-title">{mostVideos.title}</div>
                                                    <div className="insight-value">{mostVideos.videos_count || 0} ta video</div>
                                                </div>
                                            )
                                        })()}
                                    </div>

                                    <div className="ta__insight-card">
                                        <h4>Eng yangi kurs</h4>
                                        {(() => {
                                            const newest = coursesData.courses.reduce((prev, current) =>
                                                (new Date(prev.created_at) > new Date(current.created_at)) ? prev : current
                                            )
                                            return (
                                                <div className="insight-content">
                                                    <div className="insight-title">{newest.title}</div>
                                                    <div className="insight-value">{formatDate(newest.created_at)}</div>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Engagement Tab */}
                {activeTab === 'engagement' && (
                    <div className="ta__engagement">
                        <div className="ta__engagement-header">
                            <h2>Faollik ko'rsatkichlari</h2>
                            <p>Oxirgi {engagementData.window_days || 30} kun davomidagi ma'lumotlar</p>
                        </div>

                        <div className="ta__engagement-grid">
                            <div className="ta__engagement-card">
                                <div className="ta__engagement-icon success">
                                    <FiCheckCircle size={24} />
                                </div>
                                <div className="ta__engagement-content">
                                    <div className="ta__engagement-value">{engagementData.video_test_pass_rate || 0}%</div>
                                    <div className="ta__engagement-label">Video test o'tish darajasi</div>
                                    <div className="ta__engagement-progress">
                                        <div 
                                            className="progress-fill success"
                                            style={{ width: `${engagementData.video_test_pass_rate || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="ta__engagement-card">
                                <div className="ta__engagement-icon warning">
                                    <FiTarget size={24} />
                                </div>
                                <div className="ta__engagement-content">
                                    <div className="ta__engagement-value">{engagementData.ct_test_pass_rate || 0}%</div>
                                    <div className="ta__engagement-label">Kurs turi test o'tish</div>
                                    <div className="ta__engagement-progress">
                                        <div 
                                            className="progress-fill warning"
                                            style={{ width: `${engagementData.ct_test_pass_rate || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="ta__engagement-card">
                                <div className="ta__engagement-icon info">
                                    <FiActivity size={24} />
                                </div>
                                <div className="ta__engagement-content">
                                    <div className="ta__engagement-value">{engagementData.assignment_submissions || 0}</div>
                                    <div className="ta__engagement-label">Vazifa topshirish</div>
                                    <div className="ta__engagement-progress">
                                        <div 
                                            className="progress-fill info"
                                            style={{ width: `${Math.min((engagementData.assignment_submissions / 10) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="ta__engagement-card">
                                <div className="ta__engagement-icon primary">
                                    <FiUsers size={24} />
                                </div>
                                <div className="ta__engagement-content">
                                    <div className="ta__engagement-value">{engagementData.active_learners || 0}</div>
                                    <div className="ta__engagement-label">Faol o'quvchilar</div>
                                    <div className="ta__engagement-progress">
                                        <div 
                                            className="progress-fill primary"
                                            style={{ width: `${Math.min((engagementData.active_learners / 5) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ta__engagement-details">
                            <div className="ta__engagement-detail-card">
                                <h3><FiClock /> Faollik tafsilotlari</h3>
                                <div className="ta__engagement-detail-grid">
                                    <div className="detail-item">
                                        <div className="detail-label">Jami test natijalari</div>
                                        <div className="detail-value">{engagementData.ct_test_results || 0}</div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label">Progress hodisalari</div>
                                        <div className="detail-value">{engagementData.progress_events || 0}</div>
                                    </div>
                                    <div className="detail-item">
                                        <div className="detail-label">Kuzatuv oynasi</div>
                                        <div className="detail-value">{engagementData.window_days || 30} kun</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TeacherAnalytics