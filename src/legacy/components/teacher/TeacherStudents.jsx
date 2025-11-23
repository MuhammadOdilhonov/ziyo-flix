"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
    FiUsers, FiTrendingUp, FiDollarSign, FiActivity, FiCalendar,
    FiEye, FiTrash2, FiAward, FiFileText, FiClock, FiBarChart3,
    FiPieChart, FiTarget, FiBookOpen, FiCheckCircle, FiXCircle,
    FiDownload, FiExternalLink, FiStar, FiFilter, FiSearch, FiPlay
} from "react-icons/fi"
import { teacherStudentsAPI } from "../../api/apiTeacherStudents"
import useSelectedChannel from "../../hooks/useSelectedChannel"
import { BaseUrlReels } from "../../api/apiService"

const TeacherStudents = () => {
    const [students, setStudents] = useState([])
    const [stats, setStats] = useState(null)
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [studentActivity, setStudentActivity] = useState(null)
    const [loading, setLoading] = useState(true)
    const [statsLoading, setStatsLoading] = useState(false)
    const [activityLoading, setActivityLoading] = useState(false)
    const [showActivityModal, setShowActivityModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [windowDays, setWindowDays] = useState(30)

    const { channelSlug } = useParams()
    const { selectedChannel } = useSelectedChannel()
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(null)

    // Kurslar ro'yxatini yuklash
    const fetchCourses = async () => {
        try {
            // Bu yerda kurslar API'sini chaqiramiz
            console.log("Fetching courses for channel:", channelSlug)
            // Hozircha mock data
            const mockCourses = [
                { id: 1, slug: "dasturlash", title: "Dasturlash Kursi" },
                { id: 2, slug: "web-development", title: "Web Development" },
                { id: 3, slug: "mobile-app", title: "Mobile App Development" }
            ]
            setCourses(mockCourses)
            // Birinchi kursni default qilib tanlaymiz
            if (mockCourses.length > 0) {
                setSelectedCourse(mockCourses[0])
            }
        } catch (error) {
            console.error("Error fetching courses:", error)
        }
    }

    const courseSlug = selectedCourse?.slug || "dasturlash"

    // Rasm URL ni to'g'ri formatga keltirish
    const getImageUrl = (imagePath) => {
        if (!imagePath) return "https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff"
        if (imagePath.startsWith('http')) return imagePath
        return `${BaseUrlReels}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`
    }

    // O'quvchilarni yuklash
    const fetchStudents = async () => {
        try {
            console.log("fetchStudents called with:", { channelSlug, courseSlug, searchTerm, currentPage })
            setLoading(true)
            const response = await teacherStudentsAPI.getStudents(channelSlug, courseSlug, {
                search: searchTerm,
                page: currentPage
            })
            console.log("Students fetched successfully:", response)
            setStudents(response.results || [])
        } catch (error) {
            console.error("Error fetching students:", error)
            setStudents([])
        } finally {
            setLoading(false)
        }
    }

    // Statistikani yuklash
    const fetchStats = async () => {
        try {
            console.log("fetchStats called with:", { channelSlug, courseSlug, windowDays })
            setStatsLoading(true)
            const response = await teacherStudentsAPI.getStudentsStats(channelSlug, courseSlug, windowDays)
            console.log("Stats fetched successfully:", response)
            setStats(response)
        } catch (error) {
            console.error("Error fetching stats:", error)
            setStats(null)
        } finally {
            setStatsLoading(false)
        }
    }

    // O'quvchi faoliyatini yuklash
    const fetchStudentActivity = async (userId) => {
        try {
            setActivityLoading(true)
            const response = await teacherStudentsAPI.getStudentActivity(channelSlug, courseSlug, userId)
            setStudentActivity(response.activity)
        } catch (error) {
            console.error("Error fetching student activity:", error)
            setStudentActivity(null)
        } finally {
            setActivityLoading(false)
        }
    }

    // O'quvchi faoliyatini ko'rish
    const handleViewActivity = async (student) => {
        setSelectedStudent(student)
        setShowActivityModal(true)
        await fetchStudentActivity(student.user.id)
    }

    // O'quvchini o'chirish
    const handleRemoveStudent = async (userId) => {
        if (window.confirm("Haqiqatan ham bu o'quvchini kursdan chiqarmoqchimisiz?")) {
            try {
                await teacherStudentsAPI.removeStudent(channelSlug, courseSlug, userId)
                await fetchStudents()
                alert("O'quvchi muvaffaqiyatli chiqarildi!")
            } catch (error) {
                console.error("Error removing student:", error)
                alert("O'quvchini chiqarishda xatolik yuz berdi!")
            }
        }
    }

    // Vaqtni formatlash
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Filtrlangan o'quvchilar
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.user.username.toLowerCase().includes(searchTerm.toLowerCase())

        if (filterType === "all") return matchesSearch
        if (filterType === "active") return matchesSearch && student.tests_count > 0
        if (filterType === "inactive") return matchesSearch && student.tests_count === 0

        return matchesSearch
    })

    // Kurslarni yuklash
    useEffect(() => {
        if (channelSlug) {
            fetchCourses()
        }
    }, [channelSlug])

    useEffect(() => {
        console.log("useEffect triggered:", { channelSlug, courseSlug, searchTerm, currentPage })
        if (channelSlug && courseSlug && selectedCourse) {
            fetchStudents()
            fetchStats()
        } else {
            console.log("Missing parameters:", { channelSlug, courseSlug, selectedCourse })
        }
    }, [channelSlug, courseSlug, searchTerm, currentPage, selectedCourse])

    useEffect(() => {
        console.log("windowDays useEffect triggered:", { channelSlug, courseSlug, windowDays })
        if (channelSlug && courseSlug) {
            fetchStats()
        }
    }, [windowDays])

    if (loading) {
        return (
            <div className="ts-loading">
                <div className="ts-loading-spinner">
                    <div className="spinner"></div>
                    <p>O'quvchilar yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="teacher-students">
            {/* Header */}
            <div className="ts-header">
                <div className="ts-header-content">
                    <h1>O'quvchilar Boshqaruvi</h1>
                    <p>Kurs o'quvchilarini kuzatib boring va boshqaring</p>
                    {selectedCourse && (
                        <div className="ts-selected-course">
                            <strong>Tanlangan kurs:</strong> {selectedCourse.title}
                        </div>
                    )}
                </div>
                <div className="ts-header-actions">
                    {courses.length > 0 && (
                        <select
                            value={selectedCourse?.id || ""}
                            onChange={(e) => {
                                const course = courses.find(c => c.id === Number(e.target.value))
                                setSelectedCourse(course)
                            }}
                            className="ts-course-select"
                        >
                            <option value="">Kurs tanlang</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    )}
                    <select
                        value={windowDays}
                        onChange={(e) => setWindowDays(Number(e.target.value))}
                        className="ts-period-select"
                    >
                        <option value={7}>7 kun</option>
                        <option value={30}>30 kun</option>
                        <option value={90}>90 kun</option>
                    </select>
                </div>
            </div>

            {/* Statistics Cards */}
            {stats && (
                <div className="ts-stats-grid">
                    <div className="ts-stat-card students">
                        <div className="ts-stat-icon">
                            <FiUsers />
                        </div>
                        <div className="ts-stat-content">
                            <h3>{stats.students?.total || 0}</h3>
                            <p>Jami O'quvchilar</p>
                            <span className="ts-stat-change positive">
                                +{stats.students?.new_in_window || 0} yangi
                            </span>
                        </div>
                    </div>

                    <div className="ts-stat-card revenue">
                        <div className="ts-stat-icon">
                            <FiDollarSign />
                        </div>
                        <div className="ts-stat-content">
                            <h3>{stats.revenue?.total || 0} FC</h3>
                            <p>Jami Daromad</p>
                            <span className="ts-stat-change positive">
                                +{stats.revenue?.in_window || 0} FC
                            </span>
                        </div>
                    </div>

                    <div className="ts-stat-card engagement">
                        <div className="ts-stat-icon">
                            <FiActivity />
                        </div>
                        <div className="ts-stat-content">
                            <h3>{stats.engagement?.progress_daily?.reduce((sum, day) => sum + day.active_learners, 0) || 0}</h3>
                            <p>Faol O'quvchilar</p>
                            <span className="ts-stat-change">
                                {windowDays} kun ichida
                            </span>
                        </div>
                    </div>

                    <div className="ts-stat-card tests">
                        <div className="ts-stat-icon">
                            <FiFileText />
                        </div>
                        <div className="ts-stat-content">
                            <h3>
                                {(stats.engagement?.tests_daily?.video?.reduce((sum, day) => sum + day.attempts, 0) || 0) +
                                    (stats.engagement?.tests_daily?.course_type?.reduce((sum, day) => sum + day.attempts, 0) || 0)}
                            </h3>
                            <p>Test Urinishlari</p>
                            <span className="ts-stat-change positive">
                                {(stats.engagement?.tests_daily?.video?.reduce((sum, day) => sum + day.passed, 0) || 0) +
                                    (stats.engagement?.tests_daily?.course_type?.reduce((sum, day) => sum + day.passed, 0) || 0)} o'tdi
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="ts-filters">
                <div className="ts-search">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="O'quvchilarni qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="ts-filter-buttons">
                    <button
                        className={`ts-filter-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        Barchasi ({students.length})
                    </button>
                    <button
                        className={`ts-filter-btn ${filterType === 'active' ? 'active' : ''}`}
                        onClick={() => setFilterType('active')}
                    >
                        Faol ({students.filter(s => s.tests_count > 0).length})
                    </button>
                    <button
                        className={`ts-filter-btn ${filterType === 'inactive' ? 'active' : ''}`}
                        onClick={() => setFilterType('inactive')}
                    >
                        Nofaol ({students.filter(s => s.tests_count === 0).length})
                    </button>
                </div>
            </div>

            {/* Students Grid */}
            <div className="ts-students-grid">
                {filteredStudents.length === 0 ? (
                    <div className="ts-empty-state">
                        <FiUsers className="empty-icon" />
                        <h3>O'quvchilar topilmadi</h3>
                        <p>Hali bu kursga yozilgan o'quvchilar yo'q yoki qidiruv natijasi bo'sh</p>
                    </div>
                ) : (
                    filteredStudents.map((student) => (
                        <div key={student.user.id} className="ts-student-card">
                            <div className="ts-student-avatar">
                                <img
                                    src={getImageUrl(student.user.avatar)}
                                    alt={student.user.full_name}
                                />
                                <div className="ts-student-status">
                                    {student.tests_count > 0 ? (
                                        <FiCheckCircle className="active" />
                                    ) : (
                                        <FiClock className="inactive" />
                                    )}
                                </div>
                            </div>

                            <div className="ts-student-info">
                                <h3>{student.user.full_name}</h3>
                                <p>@{student.user.username}</p>
                                <span className="ts-student-email">{student.user.email}</span>
                            </div>

                            <div className="ts-student-stats">
                                <div className="ts-stat-item">
                                    <FiDollarSign />
                                    <span>{student.purchases_count} xarid</span>
                                </div>
                                <div className="ts-stat-item">
                                    <FiFileText />
                                    <span>{student.tests_count} test</span>
                                </div>
                                <div className="ts-stat-item">
                                    <FiBookOpen />
                                    <span>{student.assignments_count} vazifa</span>
                                </div>
                            </div>

                            <div className="ts-student-actions">
                                <button
                                    className="ts-action-btn view"
                                    onClick={() => handleViewActivity(student)}
                                    title="Faoliyatni ko'rish"
                                >
                                    <FiEye />
                                </button>
                                <button
                                    className="ts-action-btn remove"
                                    onClick={() => handleRemoveStudent(student.user.id)}
                                    title="Kursdan chiqarish"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Student Activity Modal */}
            {showActivityModal && selectedStudent && (
                <div className="ts-modal-overlay" onClick={() => setShowActivityModal(false)}>
                    <div className="ts-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="ts-modal-header">
                            <div className="ts-modal-title">
                                <img
                                    src={getImageUrl(selectedStudent.user.avatar)}
                                    alt={selectedStudent.user.full_name}
                                />
                                <div>
                                    <h2>{selectedStudent.user.full_name}</h2>
                                    <p>@{selectedStudent.user.username}</p>
                                </div>
                            </div>
                            <button
                                className="ts-modal-close"
                                onClick={() => setShowActivityModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="ts-modal-content">
                            {activityLoading ? (
                                <div className="ts-loading">
                                    <div className="spinner"></div>
                                    <p>Faoliyat yuklanmoqda...</p>
                                </div>
                            ) : studentActivity ? (
                                <div className="ts-activity-content">
                                    {/* Video Test Results */}
                                    {studentActivity.video_test_results?.length > 0 && (
                                        <div className="ts-activity-section">
                                            <h3><FiPlay /> Video Testlari</h3>
                                            <div className="ts-results-list">
                                                {studentActivity.video_test_results.map((result) => (
                                                    <div key={result.id} className="ts-result-card">
                                                        <div className="ts-result-header">
                                                            <h4>{result.test_title}</h4>
                                                            <span className={`ts-score ${result.score >= 70 ? 'passed' : 'failed'}`}>
                                                                {result.score}%
                                                            </span>
                                                        </div>
                                                        <div className="ts-result-meta">
                                                            <span>Urinish: {result.attempt}</span>
                                                            <span>{formatDate(result.completed_at)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Course Type Test Results */}
                                    {studentActivity.course_type_test_results?.length > 0 && (
                                        <div className="ts-activity-section">
                                            <h3><FiFileText /> Oylik Testlar</h3>
                                            <div className="ts-results-list">
                                                {studentActivity.course_type_test_results.map((result) => (
                                                    <div key={result.id} className="ts-result-card">
                                                        <div className="ts-result-header">
                                                            <h4>{result.test_title}</h4>
                                                            <span className={`ts-score ${result.score >= 70 ? 'passed' : 'failed'}`}>
                                                                {result.score}%
                                                            </span>
                                                        </div>
                                                        <div className="ts-result-meta">
                                                            <span>Urinish: {result.attempt}</span>
                                                            <span>{formatDate(result.completed_at)}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Assignment Submissions */}
                                    {studentActivity.assignment_submissions?.length > 0 && (
                                        <div className="ts-activity-section">
                                            <h3><FiBookOpen /> Vazifalar</h3>
                                            <div className="ts-assignments-list">
                                                {studentActivity.assignment_submissions.map((submission) => (
                                                    <div key={submission.id} className="ts-assignment-card">
                                                        <div className="ts-assignment-header">
                                                            <h4>{submission.assignment.title}</h4>
                                                            <div className="ts-assignment-status">
                                                                {submission.is_graded ? (
                                                                    <span className="graded">
                                                                        <FiCheckCircle /> Baholandi
                                                                    </span>
                                                                ) : (
                                                                    <span className="pending">
                                                                        <FiClock /> Kutilmoqda
                                                                    </span>
                                                                )}
                                                                {submission.is_late && (
                                                                    <span className="late">
                                                                        <FiXCircle /> Kech topshirildi
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="ts-assignment-content">
                                                            {submission.text_answer && (
                                                                <div className="ts-text-answer">
                                                                    <strong>Javob:</strong>
                                                                    <p>{submission.text_answer}</p>
                                                                </div>
                                                            )}

                                                            <div className="ts-assignment-links">
                                                                {submission.attachment && (
                                                                    <a
                                                                        href={`${BaseUrlReels}${submission.attachment}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="ts-attachment-link"
                                                                    >
                                                                        <FiDownload /> Faylni yuklash
                                                                    </a>
                                                                )}
                                                                {submission.external_link && (
                                                                    <a
                                                                        href={submission.external_link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="ts-external-link"
                                                                    >
                                                                        <FiExternalLink /> Tashqi havola
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="ts-assignment-meta">
                                                            <span>Topshirildi: {formatDate(submission.submitted_at)}</span>
                                                            <span>Muddat: {submission.assignment.due_days_after_completion} kun (video tugagandan keyin)</span>
                                                            <span>Maksimal ball: {submission.assignment.max_points}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Empty State */}
                                    {(!studentActivity.video_test_results?.length &&
                                        !studentActivity.course_type_test_results?.length &&
                                        !studentActivity.assignment_submissions?.length) && (
                                            <div className="ts-empty-activity">
                                                <FiActivity className="empty-icon" />
                                                <h3>Faoliyat topilmadi</h3>
                                                <p>Bu o'quvchi hali hech qanday faoliyat ko'rsatmagan</p>
                                            </div>
                                        )}
                                </div>
                            ) : (
                                <div className="ts-error-state">
                                    <p>Faoliyat ma'lumotlarini yuklashda xatolik yuz berdi</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherStudents
