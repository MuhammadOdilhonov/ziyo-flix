import React, { useState, useEffect } from 'react'
import { FiArrowLeft, FiLoader, FiAlertCircle, FiX, FiDownload, FiPlay } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { getPurchasedCourses } from '../../api/apiUserProfile'
import { BaseUrlReels } from '../../api/apiService'

const UserCourses = () => {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])
    const [courseTypes, setCourseTypes] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchPurchasedCourses()
    }, [])

    const fetchPurchasedCourses = async () => {
        try {
            setLoading(true)
            const data = await getPurchasedCourses()
            setCourses(data.courses || [])
            setCourseTypes(data.course_types || [])
            setError(null)
        } catch (err) {
            console.error('Error fetching purchased courses:', err)
            setError('Kurslarni yuklashda xatolik yuz berdi')
            // Mock data fallback
            setCourses([])
            setCourseTypes([])
        } finally {
            setLoading(false)
        }
    }

    const handleCourseClick = (course) => {
        setSelectedCourse(course)
        setShowModal(true)
    }

    const handleCourseTypeClick = (courseType) => {
        setSelectedCourse(courseType)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setSelectedCourse(null)
    }

    const handleStartCourse = (courseSlug) => {
        closeModal()
        navigate(`/tutorials/${courseSlug}`)
    }

    const downloadCourse = () => {
        alert('Kurs yuklab olish funksiyasi tez orada mavjud bo\'ladi')
    }

    return (
        <div className="uc__container">
            {/* Header */}
            <div className="uc__header">
                <h1 className="uc__title">Video darsliklari</h1>
                <div className="uc__header-spacer"></div>
            </div>

            {/* Content */}
            <div className="uc__content">
                {loading ? (
                    <div className="uc__loading">
                        <FiLoader className="uc__spinner" />
                        <p>Kurslar yuklanmoqda...</p>
                    </div>
                ) : error ? (
                    <div className="uc__error">
                        <FiAlertCircle className="uc__error-icon" />
                        <p>{error}</p>
                        <button className="uc__retry-btn" onClick={fetchPurchasedCourses}>
                            Qayta urinish
                        </button>
                    </div>
                ) : courses.length === 0 && courseTypes.length === 0 ? (
                    <div className="uc__empty">
                        <FiAlertCircle className="uc__empty-icon" />
                        <p>Hali kurs sotib olmadingiz</p>
                        <button 
                            className="uc__explore-btn"
                            onClick={() => navigate('/courses')}
                        >
                            Kurslarni ko'rish
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Courses Section */}
                        {courses.length > 0 && (
                            <div className="uc__section">
                                <h2 className="uc__section-title">Kurslar</h2>
                                <div className="uc__grid">
                                    {courses.map((course) => (
                                        <div
                                            key={course.course_id}
                                            className="uc__course-card"
                                            onClick={() => handleCourseClick(course)}
                                        >
                                            <div className="uc__card-image">
                                                <img
                                                    src={`${BaseUrlReels}${course.course_thumbnail}`}
                                                    alt={course.title}
                                                    onError={(e) => {
                                                        e.target.src = `${BaseUrlReels}${course.course_thumbnail}`
                                                    }}
                                                />
                                                <div className="uc__card-overlay">
                                                    <button className="uc__play-btn">
                                                        <FiPlay />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="uc__card-content">
                                                <h3 className="uc__card-title">{course.title}</h3>
                                                <p className="uc__card-date">
                                                    {new Date(course.purchased_at).toLocaleDateString('uz-UZ', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Course Types Section */}
                        {courseTypes.length > 0 && (
                            <div className="uc__section">
                                <h2 className="uc__section-title">Oylik kurslar</h2>
                                <div className="uc__grid">
                                    {courseTypes.map((courseType) => (
                                        <div
                                            key={courseType.course_type_id}
                                            className="uc__course-card"
                                            onClick={() => handleCourseTypeClick(courseType)}
                                        >
                                            <div className="uc__card-image">
                                                <img
                                                    src={`${BaseUrlReels}${courseType.course_type_thumbnail}`}
                                                    alt={courseType.name}
                                                    onError={(e) => {
                                                        e.target.src = `${BaseUrlReels}${courseType.course_type_thumbnail}`
                                                    }}
                                                />
                                                <div className="uc__card-overlay">
                                                    <button className="uc__play-btn">
                                                        <FiPlay />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="uc__card-content">
                                                <h3 className="uc__card-title">{courseType.name}</h3>
                                                <p className="uc__card-subtitle">{courseType.course_title}</p>
                                                <p className="uc__card-date">
                                                    {new Date(courseType.purchased_at).toLocaleDateString('uz-UZ', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Course Detail Modal */}
            {showModal && selectedCourse && (
                <div className="uc__modal-overlay" onClick={closeModal}>
                    <div className="uc__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="uc__modal-header">
                            <h2>Kurs batafsil</h2>
                            <button className="uc__modal-close" onClick={closeModal}>
                                <FiX />
                            </button>
                        </div>

                        <div className="uc__modal-content">
                            {/* Course Image */}
                            <div className="uc__modal-image">
                                <img
                                    src={`${BaseUrlReels}${selectedCourse.course_cover || selectedCourse.course_type_cover}`}
                                    alt={selectedCourse.title || selectedCourse.name}
                                    onError={(e) => {
                                        e.target.src = `${BaseUrlReels}${selectedCourse.course_thumbnail || selectedCourse.course_type_thumbnail}`
                                    }}
                                />
                            </div>

                            {/* Course Info */}
                            <div className="uc__modal-info">
                                <h3>{selectedCourse.title || selectedCourse.name}</h3>
                                {selectedCourse.course_title && (
                                    <p className="uc__modal-parent">{selectedCourse.course_title}</p>
                                )}
                                <p className="uc__modal-date">
                                    Sotib olingan: {new Date(selectedCourse.purchased_at).toLocaleDateString('uz-UZ', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>

                                {/* Course Stats */}
                                <div className="uc__modal-stats">
                                    <div className="uc__stat-item">
                                        <span className="uc__stat-label">Kurs ID</span>
                                        <span className="uc__stat-value">{selectedCourse.course_id || selectedCourse.course_type_id}</span>
                                    </div>
                                    <div className="uc__stat-item">
                                        <span className="uc__stat-label">Slug</span>
                                        <span className="uc__stat-value">{selectedCourse.title || selectedCourse.course_title}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="uc__modal-actions">
                                    <button 
                                        className="uc__btn uc__btn-primary"
                                        onClick={() => handleStartCourse(selectedCourse.course_slug)}
                                    >
                                        <FiPlay /> Boshlash
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserCourses
