"use client"

import { useState, useEffect } from "react"
import { FiPlay, FiClock, FiHeart, FiBookmark, FiTrash2, FiEye, FiDownload, FiShare, FiFilter, FiSearch } from "react-icons/fi"

const UserSaved = () => {
    const [savedItems, setSavedItems] = useState([])
    const [activeCategory, setActiveCategory] = useState("all") // all, videos, courses, reels
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("date") // date, title, duration, type

    useEffect(() => {
        fetchSavedItems()
    }, [])

    const fetchSavedItems = async () => {
        // Mock data - replace with actual API call
        const mockItems = [
            {
                id: 1,
                type: "video",
                title: "JavaScript Asoslari - 1-dars",
                description: "JavaScript tilining asosiy tushunchalari va o'zgaruvchilar",
                thumbnail: "/video1.jpg",
                duration: "25:30",
                instructor: "Ahmadjon Karimov",
                instructorAvatar: "/instructor1.jpg",
                category: "Programming",
                views: 1250,
                likes: 89,
                savedDate: "2024-03-20",
                isLiked: true,
                isBookmarked: true,
                courseId: 1,
                courseTitle: "JavaScript Asoslari"
            },
            {
                id: 2,
                type: "course",
                title: "React Development",
                description: "React.js bilan zamonaviy web ilovalar yaratish",
                thumbnail: "/react-course.jpg",
                duration: "15 soat",
                instructor: "Malika Tosheva",
                instructorAvatar: "/instructor2.jpg",
                category: "Programming",
                views: 3200,
                likes: 245,
                savedDate: "2024-03-18",
                isLiked: true,
                isBookmarked: true,
                totalVideos: 20,
                progress: 75
            },
            {
                id: 3,
                type: "reel",
                title: "CSS Grid vs Flexbox",
                description: "CSS Grid va Flexbox orasidagi farq va qachon qaysi birini ishlatish kerak",
                thumbnail: "/reel1.jpg",
                duration: "2:45",
                instructor: "Sardor Rahimov",
                instructorAvatar: "/instructor3.jpg",
                category: "Design",
                views: 5600,
                likes: 420,
                savedDate: "2024-03-15",
                isLiked: true,
                isBookmarked: true,
                isReel: true
            },
            {
                id: 4,
                type: "video",
                title: "Node.js Backend Development",
                description: "Node.js va Express.js bilan backend API yaratish",
                thumbnail: "/video2.jpg",
                duration: "45:20",
                instructor: "Ahmadjon Karimov",
                instructorAvatar: "/instructor1.jpg",
                category: "Programming",
                views: 890,
                likes: 67,
                savedDate: "2024-03-12",
                isLiked: false,
                isBookmarked: true,
                courseId: 2,
                courseTitle: "Full Stack Development"
            },
            {
                id: 5,
                type: "reel",
                title: "JavaScript Tips & Tricks",
                description: "JavaScript dasturlashda foydali maslahatlar va ajoyib usullar",
                thumbnail: "/reel2.jpg",
                duration: "3:20",
                instructor: "Malika Tosheva",
                instructorAvatar: "/instructor2.jpg",
                category: "Programming",
                views: 4200,
                likes: 380,
                savedDate: "2024-03-10",
                isLiked: true,
                isBookmarked: true,
                isReel: true
            },
            {
                id: 6,
                type: "course",
                title: "UI/UX Dizayn",
                description: "Figma, Adobe XD va boshqa dizayn vositalari bilan ishlash",
                thumbnail: "/ui-course.jpg",
                duration: "10 soat",
                instructor: "Sardor Rahimov",
                instructorAvatar: "/instructor3.jpg",
                category: "Design",
                views: 1800,
                likes: 156,
                savedDate: "2024-03-08",
                isLiked: false,
                isBookmarked: true,
                totalVideos: 16,
                progress: 0
            }
        ]
        setSavedItems(mockItems)
    }

    const filteredItems = savedItems.filter(item => {
        const matchesCategory = activeCategory === "all" || item.type === activeCategory
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const sortedItems = [...filteredItems].sort((a, b) => {
        switch (sortBy) {
            case "title":
                return a.title.localeCompare(b.title)
            case "duration":
                return b.duration.localeCompare(a.duration)
            case "type":
                return a.type.localeCompare(b.type)
            case "date":
            default:
                return new Date(b.savedDate) - new Date(a.savedDate)
        }
    })

    const handleRemoveSaved = (itemId) => {
        if (window.confirm("Saqlanganlar ro'yxatidan o'chirishni xohlaysizmi?")) {
            setSavedItems(savedItems.filter(item => item.id !== itemId))
        }
    }

    const handleToggleLike = (itemId) => {
        setSavedItems(savedItems.map(item =>
            item.id === itemId
                ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
                : item
        ))
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ')
    }

    const getTypeIcon = (type) => {
        switch (type) {
            case "video":
                return <FiPlay />
            case "course":
                return <FiBookmark />
            case "reel":
                return <FiHeart />
            default:
                return <FiEye />
        }
    }

    const getTypeText = (type) => {
        switch (type) {
            case "video":
                return "Video"
            case "course":
                return "Kurs"
            case "reel":
                return "Reel"
            default:
                return "Kontent"
        }
    }

    return (
        <div className="user-saved">
            <div className="saved-header">
                <div className="header-info">
                    <h1>Saqlanganlar</h1>
                    <p>Saqlagan kontentlaringiz va kurslaringiz</p>
                </div>
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-number">{savedItems.length}</span>
                        <span className="stat-label">Jami saqlangan</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{savedItems.filter(item => item.type === 'video').length}</span>
                        <span className="stat-label">Videolar</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{savedItems.filter(item => item.type === 'course').length}</span>
                        <span className="stat-label">Kurslar</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{savedItems.filter(item => item.type === 'reel').length}</span>
                        <span className="stat-label">Reels</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="saved-controls">
                <div className="search-section">
                    <div className="search-box">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Saqlanganlarni qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="filter-section">
                    <div className="category-tabs">
                        <button
                            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('all')}
                        >
                            Barchasi ({savedItems.length})
                        </button>
                        <button
                            className={`category-tab ${activeCategory === 'video' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('video')}
                        >
                            Videolar ({savedItems.filter(item => item.type === 'video').length})
                        </button>
                        <button
                            className={`category-tab ${activeCategory === 'course' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('course')}
                        >
                            Kurslar ({savedItems.filter(item => item.type === 'course').length})
                        </button>
                        <button
                            className={`category-tab ${activeCategory === 'reel' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('reel')}
                        >
                            Reels ({savedItems.filter(item => item.type === 'reel').length})
                        </button>
                    </div>

                    <div className="sort-section">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="date">Sana bo'yicha</option>
                            <option value="title">Nomi bo'yicha</option>
                            <option value="duration">Davomiyligi bo'yicha</option>
                            <option value="type">Turi bo'yicha</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Saved Items Grid */}
            <div className="saved-grid">
                {sortedItems.map((item) => (
                    <div key={item.id} className="saved-item">
                        <div className="item-thumbnail">
                            <img src={item.thumbnail} alt={item.title} />
                            <div className="item-overlay">
                                <div className="item-type">
                                    <span className="type-badge">
                                        {getTypeIcon(item.type)}
                                        {getTypeText(item.type)}
                                    </span>
                                </div>
                                <div className="item-duration">
                                    <FiClock />
                                    <span>{item.duration}</span>
                                </div>
                                <div className="item-actions">
                                    <button
                                        className={`action-btn ${item.isLiked ? 'liked' : ''}`}
                                        onClick={() => handleToggleLike(item.id)}
                                    >
                                        <FiHeart />
                                    </button>
                                    <button className="action-btn">
                                        <FiShare />
                                    </button>
                                    <button
                                        className="action-btn remove"
                                        onClick={() => handleRemoveSaved(item.id)}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                            {item.type === 'course' && (
                                <div className="course-progress">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${item.progress}%` }}
                                        ></div>
                                    </div>
                                    <span className="progress-text">{item.progress}%</span>
                                </div>
                            )}
                        </div>

                        <div className="item-content">
                            <div className="item-header">
                                <h3>{item.title}</h3>
                                <div className="item-rating">
                                    <FiHeart className="heart-icon" />
                                    <span>{item.likes}</span>
                                </div>
                            </div>

                            <div className="item-instructor">
                                <img
                                    src={item.instructorAvatar}
                                    alt={item.instructor}
                                    className="instructor-avatar"
                                />
                                <span>{item.instructor}</span>
                            </div>

                            <p className="item-description">{item.description}</p>

                            <div className="item-stats">
                                <div className="stat">
                                    <FiEye />
                                    <span>{item.views.toLocaleString()}</span>
                                </div>
                                <div className="stat">
                                    <FiHeart />
                                    <span>{item.likes}</span>
                                </div>
                                <div className="stat">
                                    <span className="category-tag">{item.category}</span>
                                </div>
                            </div>

                            {item.type === 'course' && (
                                <div className="course-info">
                                    <div className="course-meta">
                                        <span>{item.totalVideos} video</span>
                                        <span>•</span>
                                        <span>{item.duration}</span>
                                    </div>
                                </div>
                            )}

                            {item.type === 'video' && item.courseTitle && (
                                <div className="video-course">
                                    <span className="course-link">Kurs: {item.courseTitle}</span>
                                </div>
                            )}

                            <div className="item-meta">
                                <span className="saved-date">Saqlangan: {formatDate(item.savedDate)}</span>
                            </div>

                            <div className="item-actions-bottom">
                                <button className="btn btn-primary">
                                    <FiPlay /> Ko'rish
                                </button>
                                <button className="btn btn-outline">
                                    <FiDownload /> Yuklab olish
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {sortedItems.length === 0 && (
                <div className="empty-state">
                    <FiBookmark size={64} />
                    <h3>Saqlanganlar topilmadi</h3>
                    <p>Hozircha hech narsa saqlamagansiz yoki qidiruv natijasi bo'sh</p>
                    <button className="btn btn-primary">
                        Kontentlarni ko'rish
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserSaved
