"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
    FiPlus, FiEdit3, FiTrash2, FiEye, FiUsers, FiClock, 
    FiCheckCircle, FiXCircle, FiBarChart2 , FiPlay, FiFileText,
    FiCalendar, FiTarget, FiAward, FiTrendingUp, FiFilter, FiSearch
} from "react-icons/fi"
import { teacherTestsAPI } from "../../api/apiTeacherTests"
import useSelectedChannel from "../../hooks/useSelectedChannel"
import TestCreator from "./TestCreator"
import TestAttemptsModal from "./TestAttemptsModal"

const TeacherTests = () => {
    const { channelSlug } = useParams()
    const { selectedChannel } = useSelectedChannel()
    const [tests, setTests] = useState([])
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [testStats, setTestStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all") // all, video, course_type
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedTest, setSelectedTest] = useState(null)
    const [showStatsModal, setShowStatsModal] = useState(false)
    const [showAttemptsModal, setShowAttemptsModal] = useState(false)

    // Real API bilan ishlash

    // Ma'lumotlarni yuklash
    useEffect(() => {
        fetchTests()
        fetchCourses()
        fetchTestStats()
    }, [channelSlug, selectedCourse])

    const fetchTests = async () => {
        try {
            setLoading(true)
            const params = {}
            if (selectedCourse) {
                params.course = selectedCourse.slug
            }
            
            const response = await teacherTestsAPI.getChannelTests(channelSlug, params)
            setTests(response.results || [])
            setLoading(false)
        } catch (error) {
            console.error("Error fetching tests:", error)
            setLoading(false)
        }
    }

    const fetchCourses = async () => {
        try {
            const response = await teacherTestsAPI.getChannelTests(channelSlug, { courses_only: true })
            
            // Real API dan filters.available_courses ishlatamiz
            const coursesData = response.filters?.available_courses || response.results || [
                { id: 1, title: "dasturlash", slug: "dasturlash" },
                { id: 2, title: "Web Development", slug: "web-dev" },
                { id: 3, title: "Mobile App Development", slug: "mobile-app" }
            ]
            
            setCourses(coursesData)
            if (coursesData.length > 0 && !selectedCourse) {
                setSelectedCourse(coursesData[0])
            }
        } catch (error) {
            console.error("Error fetching courses:", error)
            // Fallback courses
            const fallbackCourses = [
                { id: 1, title: "dasturlash", slug: "dasturlash" },
                { id: 2, title: "Web Development", slug: "web-dev" },
                { id: 3, title: "Mobile App Development", slug: "mobile-app" }
            ]
            setCourses(fallbackCourses)
            if (!selectedCourse) {
                setSelectedCourse(fallbackCourses[0])
            }
        }
    }

    const fetchTestStats = async () => {
        try {
            const response = await teacherTestsAPI.getTestStats(channelSlug)
            setTestStats(response)
        } catch (error) {
            console.error("Error fetching test stats:", error)
        }
    }

    // Test yaratish
    const handleCreateTest = () => {
        setSelectedTest(null)
        setShowCreateModal(true)
    }

    // Test tahrirlash
    const handleEditTest = (test) => {
        setSelectedTest(test)
        setShowCreateModal(true)
    }

    // Test o'chirish
    const handleDeleteTest = async (testId) => {
        if (window.confirm("Testni o'chirishni xohlaysizmi?")) {
            try {
                await teacherTestsAPI.deleteTest(channelSlug, testId)
                fetchTests() // Ro'yxatni yangilash
                fetchTestStats() // Statistikani yangilash
            } catch (error) {
                console.error("Error deleting test:", error)
                alert("Testni o'chirishda xatolik yuz berdi")
            }
        }
    }

    // Test statistikasini ko'rish
    const handleViewStats = (test) => {
        setSelectedTest(test)
        setShowStatsModal(true)
    }

    // Test urinishlarini ko'rish
    const handleViewAttempts = (test) => {
        setSelectedTest(test)
        setShowAttemptsModal(true)
    }

    // Sana formatlash
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    // Testlarni filtrlash
    const filteredTests = tests.filter(test => {
        const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            test.course.toLowerCase().includes(searchTerm.toLowerCase())
        
        if (filterType === "all") return matchesSearch
        if (filterType === "video") return matchesSearch && test.type === "video"
        if (filterType === "course_type") return matchesSearch && test.type === "course_type"
        
        return matchesSearch
    })

    if (loading) {
        return (
            <div className="teacher-tests">
                <div className="loading-container">
                    <div className="spinner"></div>
                    <p>Testlar yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="teacher-tests">
            {/* Header */}
            <div className="tt-header">
                <div className="tt-header-content">
                    <h1>Testlar Boshqaruvi</h1>
                    <p>Kurs testlarini yarating, tahrirlang va kuzatib boring</p>
                    {selectedCourse && (
                        <div className="tt-selected-course">
                            <strong>Tanlangan kurs:</strong> {selectedCourse.title}
                        </div>
                    )}
                </div>
                <div className="tt-header-actions">
                    {courses.length > 0 && (
                        <select 
                            value={selectedCourse?.id || ""} 
                            onChange={(e) => {
                                const course = courses.find(c => c.id === Number(e.target.value))
                                setSelectedCourse(course)
                            }}
                            className="tt-course-select"
                        >
                            <option value="">Kurs tanlang</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    )}
                    <button 
                        className="tt-create-btn"
                        onClick={handleCreateTest}
                    >
                        <FiPlus /> Yangi Test
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            {testStats && (
                <div className="tt-stats-grid">
                    <div className="tt-stat-card total">
                        <div className="tt-stat-icon">
                            <FiFileText />
                        </div>
                        <div className="tt-stat-content">
                            <h3>{testStats.overview?.total_tests || testStats.total_tests}</h3>
                            <p>Jami Testlar</p>
                            <span className="tt-stat-change">
                                {testStats.overview?.active_tests || testStats.active_tests} faol
                            </span>
                        </div>
                    </div>

                    <div className="tt-stat-card attempts">
                        <div className="tt-stat-icon">
                            <FiUsers />
                        </div>
                        <div className="tt-stat-content">
                            <h3>{testStats.overview?.total_attempts || testStats.total_attempts}</h3>
                            <p>Jami Urinishlar</p>
                            <span className="tt-stat-change positive">
                                Barcha testlar
                            </span>
                        </div>
                    </div>

                    <div className="tt-stat-card pass-rate">
                        <div className="tt-stat-icon">
                            <FiTarget />
                        </div>
                        <div className="tt-stat-content">
                            <h3>{testStats.overview?.avg_pass_rate || testStats.avg_pass_rate}%</h3>
                            <p>O'rtacha O'tish</p>
                            <span className="tt-stat-change positive">
                                Muvaffaqiyat darajasi
                            </span>
                        </div>
                    </div>

                    <div className="tt-stat-card types">
                        <div className="tt-stat-icon">
                            <FiBarChart2  />
                        </div>
                        <div className="tt-stat-content">
                            <h3>{(testStats.test_types?.video_tests?.count || testStats.video_tests || 0) + (testStats.test_types?.course_type_tests?.count || testStats.course_type_tests || 0)}</h3>
                            <p>Test Turlari</p>
                            <span className="tt-stat-change">
                                {testStats.test_types?.video_tests?.count || testStats.video_tests || 0} video, {testStats.test_types?.course_type_tests?.count || testStats.course_type_tests || 0} oylik
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="tt-filters">
                <div className="tt-search">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Testlarni qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="tt-filter-buttons">
                    <button 
                        className={`tt-filter-btn ${filterType === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterType('all')}
                    >
                        Barchasi ({tests.length})
                    </button>
                    <button 
                        className={`tt-filter-btn ${filterType === 'video' ? 'active' : ''}`}
                        onClick={() => setFilterType('video')}
                    >
                        Video Testlar ({tests.filter(t => t.type === 'video').length})
                    </button>
                    <button 
                        className={`tt-filter-btn ${filterType === 'course_type' ? 'active' : ''}`}
                        onClick={() => setFilterType('course_type')}
                    >
                        Oylik Testlar ({tests.filter(t => t.type === 'course_type').length})
                    </button>
                </div>
            </div>

            {/* Tests Grid */}
            <div className="tt-tests-grid">
                {filteredTests.length === 0 ? (
                    <div className="tt-empty-state">
                        <FiFileText className="empty-icon" />
                        <h3>Testlar topilmadi</h3>
                        <p>Hali testlar yaratilmagan yoki qidiruv natijasi bo'sh</p>
                        <button 
                            className="tt-create-btn-empty"
                            onClick={handleCreateTest}
                        >
                            <FiPlus /> Birinchi testni yarating
                        </button>
                    </div>
                ) : (
                    filteredTests.map((test) => (
                        <div key={test.id} className="tt-test-card">
                            <div className="tt-test-header">
                                <div className="tt-test-type">
                                    {test.type === 'video' ? (
                                        <span className="type-video">
                                            <FiPlay /> Video Test
                                        </span>
                                    ) : (
                                        <span className="type-course">
                                            <FiCalendar /> Oylik Test
                                        </span>
                                    )}
                                    <span className={`difficulty ${test.difficulty}`}>
                                        {test.difficulty === 'beginner' && 'Boshlang\'ich'}
                                        {test.difficulty === 'intermediate' && 'O\'rta'}
                                        {test.difficulty === 'advanced' && 'Murakkab'}
                                    </span>
                                </div>
                                <div className="tt-test-status">
                                    {test.is_active ? (
                                        <FiCheckCircle className="active" />
                                    ) : (
                                        <FiXCircle className="inactive" />
                                    )}
                                </div>
                            </div>

                            <div className="tt-test-content">
                                <h3>{test.title}</h3>
                                <p className="tt-test-course">{test.course?.title || test.course}</p>
                                <div className="tt-test-meta">
                                    <span>{test.questions_count} savol</span>
                                    <span>{formatDate(test.created_at)}</span>
                                </div>
                            </div>

                            <div className="tt-test-stats">
                                <div className="tt-stat-item">
                                    <FiUsers />
                                    <span>{test.attempts_count} urinish</span>
                                </div>
                                <div className="tt-stat-item">
                                    <FiTarget />
                                    <span>{test.pass_rate}% o'tish</span>
                                </div>
                                <div className="tt-stat-item">
                                    <FiAward />
                                    <span>{test.avg_score}% o'rtacha</span>
                                </div>
                            </div>

                            <div className="tt-test-actions">
                                <button
                                    className="tt-action-btn attempts"
                                    onClick={() => handleViewAttempts(test)}
                                    title="Urinishlarni ko'rish"
                                >
                                    <FiUsers />
                                </button>
                                <button
                                    className="tt-action-btn stats"
                                    onClick={() => handleViewStats(test)}
                                    title="Statistikani ko'rish"
                                >
                                    <FiBarChart2  />
                                </button>
                                <button
                                    className="tt-action-btn edit"
                                    onClick={() => handleEditTest(test)}
                                    title="Testni tahrirlash"
                                >
                                    <FiEdit3 />
                                </button>
                                <button
                                    className="tt-action-btn delete"
                                    onClick={() => handleDeleteTest(test.id)}
                                    title="Testni o'chirish"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="tt-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="tt-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tt-modal-header">
                            <h2>{selectedTest ? 'Testni Tahrirlash' : 'Yangi Test Yaratish'}</h2>
                            <button 
                                className="tt-modal-close"
                                onClick={() => setShowCreateModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="tt-modal-content">
                            <TestCreator
                                testData={selectedTest}
                                onSave={async (testData) => {
                                    try {
                                        if (selectedTest) {
                                            // Test yangilash
                                            await teacherTestsAPI.updateTest(channelSlug, selectedTest.id, testData)
                                        } else {
                                            // Yangi test yaratish
                                            await teacherTestsAPI.createTest(channelSlug, testData)
                                        }
                                        
                                        setShowCreateModal(false)
                                        fetchTests() // Ro'yxatni yangilash
                                        fetchTestStats() // Statistikani yangilash
                                        alert(selectedTest ? "Test muvaffaqiyatli yangilandi!" : "Test muvaffaqiyatli yaratildi!")
                                    } catch (error) {
                                        console.error("Error saving test:", error)
                                        alert("Testni saqlashda xatolik yuz berdi")
                                    }
                                }}
                                onCancel={() => setShowCreateModal(false)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Modal */}
            {showStatsModal && selectedTest && (
                <div className="tt-modal-overlay" onClick={() => setShowStatsModal(false)}>
                    <div className="tt-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tt-modal-header">
                            <h2>{selectedTest.title} - Statistika</h2>
                            <button 
                                className="tt-modal-close"
                                onClick={() => setShowStatsModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="tt-modal-content">
                            <div className="tt-stats-details">
                                <div className="tt-stats-row">
                                    <span>Jami urinishlar:</span>
                                    <strong>{selectedTest.attempts_count}</strong>
                                </div>
                                <div className="tt-stats-row">
                                    <span>O'tish darajasi:</span>
                                    <strong>{selectedTest.pass_rate}%</strong>
                                </div>
                                <div className="tt-stats-row">
                                    <span>O'rtacha ball:</span>
                                    <strong>{selectedTest.avg_score}%</strong>
                                </div>
                                <div className="tt-stats-row">
                                    <span>Savollar soni:</span>
                                    <strong>{selectedTest.questions_count}</strong>
                                </div>
                                <div className="tt-stats-row">
                                    <span>Yaratilgan sana:</span>
                                    <strong>{formatDate(selectedTest.created_at)}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Test Attempts Modal */}
            <TestAttemptsModal
                test={selectedTest}
                channelSlug={channelSlug}
                isOpen={showAttemptsModal}
                onClose={() => {
                    setShowAttemptsModal(false)
                    setSelectedTest(null)
                }}
            />
        </div>
    )
}

export default TeacherTests
