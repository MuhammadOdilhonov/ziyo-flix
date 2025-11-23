"use client"

import { useState, useEffect } from "react"
import { FiDownload, FiEye, FiAward, FiCalendar, FiUser, FiStar, FiShare, FiSearch, FiFilter } from "react-icons/fi"

const UserCertificates = () => {
    const [certificates, setCertificates] = useState([])
    const [filter, setFilter] = useState("all") // all, completed, in_progress
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCertificate, setSelectedCertificate] = useState(null)
    const [showCertificateModal, setShowCertificateModal] = useState(false)

    useEffect(() => {
        fetchUserCertificates()
    }, [])

    const fetchUserCertificates = async () => {
        // Mock data - replace with actual API call
        const mockCertificates = [
            {
                id: 1,
                title: "JavaScript Asoslari Sertifikati",
                courseTitle: "JavaScript Asoslari",
                courseId: 1,
                instructor: "Ahmadjon Karimov",
                instructorAvatar: "/instructor1.jpg",
                issuer: "ZiyoFlex Academy",
                issueDate: "2024-03-20",
                expiryDate: null, // No expiry
                certificateId: "ZF-JS-2024-001",
                score: 92,
                grade: "A",
                status: "completed",
                thumbnail: "/certificates/js-certificate.jpg",
                pdfUrl: "/certificates/js-certificate.pdf",
                description: "JavaScript tilining asosiy tushunchalari, o'zgaruvchilar, funksiyalar, objects va arrays haqida to'liq bilim olganingiz uchun berilgan sertifikat.",
                skills: ["JavaScript", "Variables", "Functions", "Objects", "Arrays"],
                completionDate: "2024-03-20",
                courseDuration: "12 soat",
                totalVideos: 24,
                completedVideos: 24
            },
            {
                id: 2,
                title: "React Development Sertifikati",
                courseTitle: "React Development",
                courseId: 2,
                instructor: "Malika Tosheva",
                instructorAvatar: "/instructor2.jpg",
                issuer: "ZiyoFlex Academy",
                issueDate: "2024-03-15",
                expiryDate: "2025-03-15", // 1 year expiry
                certificateId: "ZF-REACT-2024-002",
                score: 88,
                grade: "A-",
                status: "completed",
                thumbnail: "/certificates/react-certificate.jpg",
                pdfUrl: "/certificates/react-certificate.pdf",
                description: "React.js bilan zamonaviy web ilovalar yaratish, Hooks, Context API, Router va boshqa muhim tushunchalar haqida bilim olganingiz uchun berilgan sertifikat.",
                skills: ["React", "JSX", "Hooks", "Context API", "Router", "State Management"],
                completionDate: "2024-03-15",
                courseDuration: "15 soat",
                totalVideos: 20,
                completedVideos: 20
            },
            {
                id: 3,
                title: "UI/UX Dizayn Sertifikati",
                courseTitle: "UI/UX Dizayn",
                courseId: 3,
                instructor: "Sardor Rahimov",
                instructorAvatar: "/instructor3.jpg",
                issuer: "ZiyoFlex Academy",
                issueDate: "2024-03-10",
                expiryDate: null,
                certificateId: "ZF-UIUX-2024-003",
                score: 95,
                grade: "A+",
                status: "completed",
                thumbnail: "/certificates/ui-certificate.jpg",
                pdfUrl: "/certificates/ui-certificate.pdf",
                description: "Figma, Adobe XD va boshqa dizayn vositalari bilan ishlash, user experience dizayni tamoyillari haqida bilim olganingiz uchun berilgan sertifikat.",
                skills: ["Figma", "Adobe XD", "UI Design", "UX Design", "Prototyping", "User Research"],
                completionDate: "2024-03-10",
                courseDuration: "10 soat",
                totalVideos: 16,
                completedVideos: 16
            },
            {
                id: 4,
                title: "Node.js Backend Sertifikati",
                courseTitle: "Node.js Backend Development",
                courseId: 4,
                instructor: "Ahmadjon Karimov",
                instructorAvatar: "/instructor1.jpg",
                issuer: "ZiyoFlex Academy",
                issueDate: "2024-02-28",
                expiryDate: "2025-02-28",
                certificateId: "ZF-NODE-2024-004",
                score: 85,
                grade: "B+",
                status: "completed",
                thumbnail: "/certificates/node-certificate.jpg",
                pdfUrl: "/certificates/node-certificate.pdf",
                description: "Node.js va Express.js bilan backend API yaratish, ma'lumotlar bazasi bilan ishlash haqida bilim olganingiz uchun berilgan sertifikat.",
                skills: ["Node.js", "Express.js", "RESTful API", "MongoDB", "Authentication", "JWT"],
                completionDate: "2024-02-28",
                courseDuration: "18 soat",
                totalVideos: 30,
                completedVideos: 30
            },
            {
                id: 5,
                title: "Full Stack Development Sertifikati",
                courseTitle: "Full Stack Development",
                courseId: 5,
                instructor: "Malika Tosheva",
                instructorAvatar: "/instructor2.jpg",
                issuer: "ZiyoFlex Academy",
                issueDate: null,
                expiryDate: null,
                certificateId: null,
                score: null,
                grade: null,
                status: "in_progress",
                thumbnail: "/certificates/fullstack-course.jpg",
                pdfUrl: null,
                description: "Frontend va Backend texnologiyalarini o'rganib, to'liq web ilovalar yaratish haqida bilim olish.",
                skills: ["React", "Node.js", "MongoDB", "Express.js", "Authentication", "Deployment"],
                completionDate: null,
                courseDuration: "40 soat",
                totalVideos: 50,
                completedVideos: 35,
                progress: 70
            }
        ]
        setCertificates(mockCertificates)
    }

    const filteredCertificates = certificates.filter(certificate => {
        const matchesFilter = filter === "all" || certificate.status === filter
        const matchesSearch = certificate.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            certificate.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            certificate.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            certificate.issuer.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const handleViewCertificate = (certificate) => {
        setSelectedCertificate(certificate)
        setShowCertificateModal(true)
    }

    const handleDownloadCertificate = (certificate) => {
        if (certificate.pdfUrl) {
            // In a real app, this would download the actual PDF
            const link = document.createElement('a')
            link.href = certificate.pdfUrl
            link.download = `${certificate.title}.pdf`
            link.click()
        } else {
            alert("Sertifikat hali tayyor emas!")
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Noma'lum"
        return new Date(dateString).toLocaleDateString('uz-UZ')
    }

    const getStatusText = (status) => {
        switch (status) {
            case "completed":
                return "Tugallangan"
            case "in_progress":
                return "Davom etmoqda"
            default:
                return "Noma'lum"
        }
    }

    const getStatusClass = (status) => {
        switch (status) {
            case "completed":
                return "status-completed"
            case "in_progress":
                return "status-in-progress"
            default:
                return ""
        }
    }

    const getGradeClass = (grade) => {
        if (!grade) return ""
        if (grade.startsWith('A+')) return "grade-excellent"
        if (grade.startsWith('A')) return "grade-very-good"
        if (grade.startsWith('B+')) return "grade-good"
        if (grade.startsWith('B')) return "grade-average"
        return "grade-poor"
    }

    return (
        <div className="user-certificates">
            <div className="certificates-header">
                <div className="header-info">
                    <h1>Olgan sertifikatlar</h1>
                    <p>Kurslarni tugatganingizda olgan sertifikatlaringiz</p>
                </div>
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-number">{certificates.filter(c => c.status === 'completed').length}</span>
                        <span className="stat-label">Tugallangan</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{certificates.filter(c => c.status === 'in_progress').length}</span>
                        <span className="stat-label">Davom etmoqda</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{certificates.length}</span>
                        <span className="stat-label">Jami kurslar</span>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="certificates-controls">
                <div className="search-section">
                    <div className="search-box">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Sertifikatlarni qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        Barchasi ({certificates.length})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Tugallangan ({certificates.filter(c => c.status === 'completed').length})
                    </button>
                    <button
                        className={`filter-tab ${filter === 'in_progress' ? 'active' : ''}`}
                        onClick={() => setFilter('in_progress')}
                    >
                        Davom etmoqda ({certificates.filter(c => c.status === 'in_progress').length})
                    </button>
                </div>
            </div>

            {/* Certificates Grid */}
            <div className="certificates-grid">
                {filteredCertificates.map((certificate) => (
                    <div key={certificate.id} className="certificate-card">
                        <div className="certificate-thumbnail">
                            <img src={certificate.thumbnail} alt={certificate.title} />
                            <div className="certificate-overlay">
                                <div className="certificate-status">
                                    <span className={`status-badge ${getStatusClass(certificate.status)}`}>
                                        {getStatusText(certificate.status)}
                                    </span>
                                </div>
                                <div className="certificate-actions">
                                    <button
                                        className="action-btn"
                                        onClick={() => handleViewCertificate(certificate)}
                                    >
                                        <FiEye />
                                    </button>
                                    {certificate.status === 'completed' && (
                                        <button
                                            className="action-btn"
                                            onClick={() => handleDownloadCertificate(certificate)}
                                        >
                                            <FiDownload />
                                        </button>
                                    )}
                                </div>
                            </div>
                            {certificate.status === 'in_progress' && (
                                <div className="progress-overlay">
                                    <div className="progress-circle">
                                        <span>{certificate.progress}%</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="certificate-content">
                            <div className="certificate-header">
                                <h3>{certificate.title}</h3>
                                {certificate.status === 'completed' && (
                                    <div className="certificate-grade">
                                        <span className={`grade ${getGradeClass(certificate.grade)}`}>
                                            {certificate.grade}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="certificate-course">
                                <span className="course-title">{certificate.courseTitle}</span>
                            </div>

                            <div className="certificate-instructor">
                                <img
                                    src={certificate.instructorAvatar}
                                    alt={certificate.instructor}
                                    className="instructor-avatar"
                                />
                                <span>{certificate.instructor}</span>
                            </div>

                            <p className="certificate-description">{certificate.description}</p>

                            <div className="certificate-meta">
                                <div className="meta-item">
                                    <FiAward />
                                    <span>{certificate.issuer}</span>
                                </div>
                                <div className="meta-item">
                                    <FiCalendar />
                                    <span>
                                        {certificate.status === 'completed' ? 'Berilgan' : 'Kurs davomiyligi'}: {formatDate(certificate.issueDate || certificate.completionDate)}
                                    </span>
                                </div>
                                {certificate.expiryDate && (
                                    <div className="meta-item">
                                        <FiCalendar />
                                        <span>Muddati: {formatDate(certificate.expiryDate)}</span>
                                    </div>
                                )}
                            </div>

                            {certificate.status === 'completed' && (
                                <div className="certificate-scores">
                                    <div className="score-item">
                                        <span className="score-label">Ball:</span>
                                        <span className="score-value">{certificate.score}/100</span>
                                    </div>
                                    <div className="score-item">
                                        <span className="score-label">Baholash:</span>
                                        <span className={`score-value ${getGradeClass(certificate.grade)}`}>
                                            {certificate.grade}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {certificate.status === 'in_progress' && (
                                <div className="certificate-progress">
                                    <div className="progress-info">
                                        <span>Jarayon: {certificate.progress}%</span>
                                        <span>{certificate.completedVideos}/{certificate.totalVideos} video</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${certificate.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <div className="certificate-skills">
                                <h4>O'rganilgan ko'nikmalar:</h4>
                                <div className="skills-list">
                                    {certificate.skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="certificate-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleViewCertificate(certificate)}
                                >
                                    <FiEye /> Ko'rish
                                </button>
                                {certificate.status === 'completed' && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleDownloadCertificate(certificate)}
                                    >
                                        <FiDownload /> Yuklab olish
                                    </button>
                                )}
                                <button className="btn btn-outline">
                                    <FiShare /> Ulashish
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCertificates.length === 0 && (
                <div className="empty-state">
                    <FiAward size={64} />
                    <h3>Sertifikatlar topilmadi</h3>
                    <p>Hozircha hech qanday kursni tugatmagan yoki qidiruv natijasi bo'sh</p>
                    <button className="btn btn-primary">
                        Kurslarni ko'rish
                    </button>
                </div>
            )}

            {/* Certificate Modal */}
            {showCertificateModal && selectedCertificate && (
                <div className="modal-overlay">
                    <div className="modal certificate-modal">
                        <div className="modal-header">
                            <h2>Sertifikat ma'lumotlari</h2>
                            <button onClick={() => setShowCertificateModal(false)}>×</button>
                        </div>
                        <div className="modal-content">
                            <div className="certificate-details">
                                <div className="certificate-image">
                                    <img src={selectedCertificate.thumbnail} alt={selectedCertificate.title} />
                                </div>
                                <div className="certificate-info">
                                    <h3>{selectedCertificate.title}</h3>
                                    <p className="course-name">{selectedCertificate.courseTitle}</p>
                                    <p className="instructor">O'qituvchi: {selectedCertificate.instructor}</p>
                                    <p className="issuer">Bergan: {selectedCertificate.issuer}</p>

                                    {selectedCertificate.status === 'completed' && (
                                        <div className="certificate-scores-modal">
                                            <div className="score-item">
                                                <span>Ball:</span>
                                                <span className="score-value">{selectedCertificate.score}/100</span>
                                            </div>
                                            <div className="score-item">
                                                <span>Baholash:</span>
                                                <span className={`score-value ${getGradeClass(selectedCertificate.grade)}`}>
                                                    {selectedCertificate.grade}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="certificate-dates">
                                        <div className="date-item">
                                            <span>Berilgan sana:</span>
                                            <span>{formatDate(selectedCertificate.issueDate || selectedCertificate.completionDate)}</span>
                                        </div>
                                        {selectedCertificate.expiryDate && (
                                            <div className="date-item">
                                                <span>Muddati:</span>
                                                <span>{formatDate(selectedCertificate.expiryDate)}</span>
                                            </div>
                                        )}
                                        <div className="date-item">
                                            <span>Sertifikat ID:</span>
                                            <span>{selectedCertificate.certificateId || 'Hali berilmagan'}</span>
                                        </div>
                                    </div>

                                    <div className="certificate-actions-modal">
                                        {selectedCertificate.status === 'completed' && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleDownloadCertificate(selectedCertificate)}
                                            >
                                                <FiDownload /> Yuklab olish
                                            </button>
                                        )}
                                        <button className="btn btn-outline">
                                            <FiShare /> Ulashish
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserCertificates
