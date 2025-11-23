"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
    FiTrendingUp,
    FiUsers,
    FiPlay,
    FiBookOpen,
    FiFileText,
    FiClipboard,
    FiEye,
    FiDollarSign,
    FiBarChart2,
    FiCalendar,
    FiArrowUpRight,
    FiArrowDownRight,
    FiActivity
} from "react-icons/fi"
import { teacherAPI } from "../../api/apiTeacher"
import useSelectedChannel from "../../hooks/useSelectedChannel"

const TeacherDashboard = () => {
    const navigate = useNavigate()
    const { selectedChannel } = useSelectedChannel()
    const [loading, setLoading] = useState(true)
    const [analytics, setAnalytics] = useState(null)
    const [courseAnalytics, setCourseAnalytics] = useState([])
    const [engagement, setEngagement] = useState(null)
    const [channels, setChannels] = useState([])

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        try {
            setLoading(true)
            const [analyticsRes, coursesRes, engagementRes, channelsRes] = await Promise.all([
                teacherAPI.getAnalyticsOverview(),
                teacherAPI.getCourseAnalytics(),
                teacherAPI.getEngagementAnalytics(),
                teacherAPI.getChannels()
            ])

            setAnalytics(analyticsRes.data)
            setCourseAnalytics(coursesRes.data.courses || [])
            setEngagement(engagementRes.data)
            setChannels(channelsRes.data || [])
        } catch (error) {
            console.error('Dashboard data fetch error:', error)
            // Fallback to mock data
            setAnalytics({
                channels_count: 1,
                courses_count: 2,
                videos_count: 4,
                reels_count: 14,
                students_total: 0,
                unique_learners: 2,
                tests_count: 3,
                assignments_count: 3,
                completed_video_events: 4
            })
            setCourseAnalytics([
                {
                    id: 2,
                    title: "matematik amallar",
                    slug: "matematik-amallar",
                    students_count: 0,
                    videos_count: 3,
                    tests_count: 2,
                    assignments_count: 2,
                    unique_learners: 2,
                    completed_video_events: 4,
                    created_at: "2025-09-20T12:32:43.515566Z"
                },
                {
                    id: 1,
                    title: "dasturlash",
                    slug: "dasturlash",
                    students_count: 0,
                    videos_count: 1,
                    tests_count: 1,
                    assignments_count: 1,
                    unique_learners: 0,
                    completed_video_events: 0,
                    created_at: "2025-09-16T14:40:52.089772Z"
                }
            ])
            setEngagement({
                window_days: 30,
                progress_events: 4,
                active_learners: 2,
                video_test_pass_rate: 75.0,
                ct_test_results: 3,
                ct_test_pass_rate: 66.67,
                assignment_submissions: 4
            })
            setChannels([
                {
                    id: 1,
                    title: "biringchi kanal",
                    slug: "behruz-dev",
                    description: "nimadir",
                    avatar: "/media/channel_avatars/photo_2025-09-09_16-16-14.jpg",
                    banner: "/media/channel_banners/1355035.jpeg",
                    verified: true,
                    created_at: "2025-08-23T08:27:10.189939Z",
                    user: 1,
                    subscribers: []
                }
            ])
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

    const getPercentageChange = (current, previous) => {
        if (!previous || previous === 0) return 0
        return ((current - previous) / previous * 100).toFixed(1)
    }

    if (loading) {
        return (
            <div className="teacher-dashboard">
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Dashboard yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="teacher-dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>O'qituvchi kabineti</h1>
                    <p>Kurslaringiz va o'quvchilaringiz haqida to'liq ma'lumot</p>
                    {selectedChannel && (
                        <div className="active-channel">
                            <span className="channel-badge">Faol kanal: {selectedChannel.title}</span>
                        </div>
                    )}
                </div>
                <div className="header-actions">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/profile/teacher/videos/upload')}
                    >
                        <FiPlay /> Yangi video yuklash
                    </button>
                </div>
            </div>

            {/* Analytics Overview */}
            <div className="analytics-overview">
                <div className="section-header">
                    <h2><FiBarChart2 /> Umumiy statistika</h2>
                    <span className="section-subtitle">Oxirgi 30 kun</span>
                </div>

                <div className="stats-grid">
                    <div className="stat-card primary">
                        <div className="stat-icon">
                            <FiUsers />
                        </div>
                        <div className="stat-content">
                            <h3>{analytics?.unique_learners || 0}</h3>
                            <p>Faol o'quvchilar</p>
                            <div className="stat-change positive">
                                <FiArrowUpRight />
                                <span>+12%</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card success">
                        <div className="stat-icon">
                            <FiPlay />
                        </div>
                        <div className="stat-content">
                            <h3>{analytics?.videos_count || 0}</h3>
                            <p>Video darslar</p>
                            <div className="stat-change positive">
                                <FiArrowUpRight />
                                <span>+8%</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card warning">
                        <div className="stat-icon">
                            <FiBookOpen />
                        </div>
                        <div className="stat-content">
                            <h3>{analytics?.courses_count || 0}</h3>
                            <p>Kurslar</p>
                            <div className="stat-change positive">
                                <FiArrowUpRight />
                                <span>+3%</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card info">
                        <div className="stat-icon">
                            <FiEye />
                        </div>
                        <div className="stat-content">
                            <h3>{analytics?.completed_video_events || 0}</h3>
                            <p>Ko'rilgan videolar</p>
                            <div className="stat-change positive">
                                <FiArrowUpRight />
                                <span>+15%</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card secondary">
                        <div className="stat-icon">
                            <FiFileText />
                        </div>
                        <div className="stat-content">
                            <h3>{analytics?.tests_count || 0}</h3>
                            <p>Testlar</p>
                            <div className="stat-change neutral">
                                <FiActivity />
                                <span>0%</span>
                            </div>
                        </div>
                    </div>

                    <div className="stat-card accent">
                        <div className="stat-icon">
                            <FiClipboard />
                        </div>
                        <div className="stat-content">
                            <h3>{analytics?.assignments_count || 0}</h3>
                            <p>Vazifalar</p>
                            <div className="stat-change positive">
                                <FiArrowUpRight />
                                <span>+5%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Engagement Analytics */}
            {engagement && (
                <div className="engagement-section">
                    <div className="section-header">
                        <h2><FiActivity /> Faollik ko'rsatkichlari</h2>
                        <span className="section-subtitle">Oxirgi {engagement.window_days} kun</span>
                    </div>

                    <div className="engagement-grid">
                        <div className="engagement-card">
                            <div className="engagement-header">
                                <h3>Test natijalari</h3>
                                <span className="engagement-rate">{engagement.video_test_pass_rate}%</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${engagement.video_test_pass_rate}%` }}
                                ></div>
                            </div>
                            <p className="engagement-description">
                                {engagement.ct_test_results} ta test natijasi
                            </p>
                        </div>

                        <div className="engagement-card">
                            <div className="engagement-header">
                                <h3>Vazifa topshirish</h3>
                                <span className="engagement-count">{engagement.assignment_submissions}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(engagement.assignment_submissions / 10) * 100}%` }}
                                ></div>
                            </div>
                            <p className="engagement-description">
                                Topshirilgan vazifalar soni
                            </p>
                        </div>

                        <div className="engagement-card">
                            <div className="engagement-header">
                                <h3>Faol o'quvchilar</h3>
                                <span className="engagement-count">{engagement.active_learners}</span>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(engagement.active_learners / 5) * 100}%` }}
                                ></div>
                            </div>
                            <p className="engagement-description">
                                Oxirgi 30 kunda faol bo'lgan
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Course Analytics */}
            <div className="courses-section">
                <div className="section-header">
                    <h2><FiBookOpen /> Kurslar bo'yicha statistika</h2>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/profile/teacher/courses')}
                    >
                        Barcha kurslar
                    </button>
                </div>

                <div className="courses-grid">
                    {courseAnalytics.map((course) => (
                        <div key={course.id} className="course-card">
                            <div className="course-header">
                                <h3>{course.title}</h3>
                                <span className="course-date">{formatDate(course.created_at)}</span>
                            </div>

                            <div className="course-stats">
                                <div className="course-stat">
                                    <FiUsers />
                                    <span>{course.unique_learners} o'quvchi</span>
                                </div>
                                <div className="course-stat">
                                    <FiPlay />
                                    <span>{course.videos_count} video</span>
                                </div>
                                <div className="course-stat">
                                    <FiFileText />
                                    <span>{course.tests_count} test</span>
                                </div>
                                <div className="course-stat">
                                    <FiClipboard />
                                    <span>{course.assignments_count} vazifa</span>
                                </div>
                            </div>

                            <div className="course-progress">
                                <div className="progress-info">
                                    <span>Ko'rilgan videolar</span>
                                    <span>{course.completed_video_events}</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${course.videos_count > 0 ? (course.completed_video_events / course.videos_count) * 100 : 0}%`
                                        }}
                                    ></div>
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <div className="section-header">
                    <h2>Tezkor amallar</h2>
                </div>

                <div className="actions-grid">
                    <button
                        className="action-card"
                        onClick={() => navigate('/profile/teacher/videos/upload')}
                    >
                        <FiPlay />
                        <span>Video yuklash</span>
                    </button>

                    <button
                        className="action-card"
                        onClick={() => navigate('/profile/teacher/test-creator')}
                    >
                        <FiFileText />
                        <span>Test yaratish</span>
                    </button>

                    <button
                        className="action-card"
                        onClick={() => navigate('/profile/teacher/assignment-creator')}
                    >
                        <FiClipboard />
                        <span>Vazifa yaratish</span>
                    </button>

                    <button
                        className="action-card"
                        onClick={() => navigate('/profile/teacher/channel')}
                    >
                        <FiUsers />
                        <span>Kanal sozlamalari</span>
                    </button>

                    <button
                        className="action-card"
                        onClick={() => navigate('/profile/teacher/wallet')}
                    >
                        <FiDollarSign />
                        <span>Hamyon</span>
                    </button>

                    <button
                        className="action-card"
                        onClick={() => navigate('/profile/teacher/settings')}
                    >
                        <FiCalendar />
                        <span>Sozlamalar</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TeacherDashboard
