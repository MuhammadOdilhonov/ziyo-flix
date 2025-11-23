import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { teacherAPI } from '../../api/apiTeacher'
import useSelectedChannel from '../../hooks/useSelectedChannel'
import {
    FiUsers,
    FiVideo,
    FiBookOpen,
    FiTrendingUp,
    FiEye,
    FiClock,
    FiAward,
    FiBarChart2,
    FiPlus,
    FiArrowRight
} from 'react-icons/fi'

const TeacherDashboard = () => {
    const { channelSlug } = useParams()
    const { selectedChannel } = useSelectedChannel()
    const [stats, setStats] = useState(null)
    const [recentCourses, setRecentCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchDashboardData()
    }, [channelSlug])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch overview stats
            const overviewResponse = await teacherAPI.getAnalyticsOverview()
            setStats(overviewResponse.data)

            // Fetch recent courses
            const coursesResponse = await teacherAPI.getAnalyticsCourses()
            setRecentCourses(coursesResponse.data?.courses?.slice(0, 3) || [])

        } catch (error) {
            console.error('Dashboard ma\'lumotlarini yuklashda xatolik:', error)
            setError('Ma\'lumotlarni yuklashda xatolik yuz berdi')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="teacher-dashboard">
                <div className="dashboard-loading">
                    <div className="spinner"></div>
                    <p>Dashboard yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="teacher-dashboard">
                <div className="dashboard-error">
                    <h3>Xatolik yuz berdi</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={fetchDashboardData}>
                        Qayta urinish
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="teacher-dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Dashboard</h1>
                    <p>Xush kelibsiz, {selectedChannel?.title || 'O\'qituvchi'}!</p>
                </div>
                <div className="header-actions">
                    <Link to={`/profile/teacher/${channelSlug}/information`} className="btn btn-primary">
                        <FiPlus size={18} />
                        Yangi kurs yaratish
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-stats">
                <div className="stat-card stat-card--blue">
                    <div className="stat-icon">
                        <FiBookOpen size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats?.courses_count || 0}</h3>
                        <p>Kurslar</p>
                    </div>
                </div>

                <div className="stat-card stat-card--green">
                    <div className="stat-icon">
                        <FiVideo size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats?.videos_count || 0}</h3>
                        <p>Videolar</p>
                    </div>
                </div>

                <div className="stat-card stat-card--purple">
                    <div className="stat-icon">
                        <FiUsers size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats?.unique_learners || 0}</h3>
                        <p>O'quvchilar</p>
                    </div>
                </div>

                <div className="stat-card stat-card--orange">
                    <div className="stat-icon">
                        <FiTrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>{stats?.reels_count || 0}</h3>
                        <p>Reels</p>
                    </div>
                </div>
            </div>

            {/* Analytics Overview */}
            <div className="dashboard-analytics">
                <div className="analytics-card">
                    <div className="card-header">
                        <h3>
                            <FiBarChart2 size={20} />
                            Tezkor ko'rsatkichlar
                        </h3>
                        <Link to={`/profile/teacher/${channelSlug}/assignment-review`} className="view-all-link">
                            Batafsil <FiArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="analytics-grid">
                        <div className="metric-item">
                            <div className="metric-icon">
                                <FiEye size={18} />
                            </div>
                            <div className="metric-content">
                                <span className="metric-value">{stats?.completed_video_events || 0}</span>
                                <span className="metric-label">Tugallangan videolar</span>
                            </div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-icon">
                                <FiClock size={18} />
                            </div>
                            <div className="metric-content">
                                <span className="metric-value">{stats?.tests_count || 0}</span>
                                <span className="metric-label">Testlar</span>
                            </div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-icon">
                                <FiAward size={18} />
                            </div>
                            <div className="metric-content">
                                <span className="metric-value">{stats?.assignments_count || 0}</span>
                                <span className="metric-label">Topshiriqlar</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Courses */}
            <div className="dashboard-courses">
                <div className="courses-header">
                    <h3>So'nggi kurslar</h3>
                    <Link to={`/profile/teacher/${channelSlug}/courses`} className="view-all-link">
                        Barcha kurslar <FiArrowRight size={16} />
                    </Link>
                </div>

                {recentCourses.length > 0 ? (
                    <div className="courses-grid">
                        {recentCourses.map(course => (
                            <div key={course.id} className="course-card">
                                <div className="course-thumbnail">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt={course.title} />
                                    ) : (
                                        <div className="course-placeholder">
                                            <FiBookOpen size={32} />
                                        </div>
                                    )}
                                </div>
                                <div className="course-content">
                                    <h4>{course.title}</h4>
                                    <p className="course-slug">@{course.slug}</p>
                                    <div className="course-stats">
                                        <span className="stat">
                                            <FiUsers size={14} />
                                            {course.unique_learners || 0} o'quvchi
                                        </span>
                                        <span className="stat">
                                            <FiVideo size={14} />
                                            {course.videos_count || 0} video
                                        </span>
                                        <span className="stat">
                                            <FiAward size={14} />
                                            {course.tests_count || 0} test
                                        </span>
                                    </div>
                                    <div className="course-progress">
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill" 
                                                style={{ width: `${course.completed_video_events > 0 ? (course.completed_video_events / course.videos_count * 100) : 0}%` }}
                                            ></div>
                                        </div>
                                        <span className="progress-text">{course.completed_video_events || 0} / {course.videos_count || 0} tugallangan</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FiBookOpen size={48} />
                        <h4>Hozircha kurslar yo'q</h4>
                        <p>Birinchi kursingizni yaratib boshlang</p>
                            <Link to={`/profile/teacher/${channelSlug}/information`} className="btn btn-primary">
                            <FiPlus size={18} />
                            Kurs yaratish
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="dashboard-actions">
                <h3>Tezkor amallar</h3>
                <div className="actions-grid">
                    <Link to={`/profile/teacher/${channelSlug}/information`} className="action-card">
                        <FiBookOpen size={24} />
                        <span>Kurslarni boshqarish</span>
                    </Link>
                    <Link to={`/profile/teacher/${channelSlug}/videos`} className="action-card">
                        <FiVideo size={24} />
                        <span>Videolarni boshqarish</span>
                    </Link>
                    <Link to={`/profile/teacher/analytics/overview`} className="action-card">
                        <FiBarChart2 size={24} />
                        <span>Analitika ko'rish</span>
                    </Link>
                    <Link to={`/profile/teacher/channels`} className="action-card">
                        <FiUsers size={24} />
                        <span>Kanal sozlamalari</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default TeacherDashboard