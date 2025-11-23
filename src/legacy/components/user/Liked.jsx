"use client"

import { useState, useEffect } from "react"
import { FiPlay, FiClock, FiHeart, FiMessageCircle, FiEye, FiDownload, FiShare, FiFilter, FiSearch, FiThumbsUp, FiThumbsDown } from "react-icons/fi"

const UserLiked = () => {
    const [likedItems, setLikedItems] = useState([])
    const [activeTab, setActiveTab] = useState("liked") // liked, commented
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("date") // date, title, duration, type

    useEffect(() => {
        fetchLikedItems()
    }, [])

    const fetchLikedItems = async () => {
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
                likedDate: "2024-03-20",
                isLiked: true,
                isBookmarked: false,
                courseId: 1,
                courseTitle: "JavaScript Asoslari",
                comments: [
                    {
                        id: 1,
                        text: "Ajoyib dars! Juda foydali bo'ldi",
                        date: "2024-03-20",
                        isLiked: true
                    }
                ]
            },
            {
                id: 2,
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
                likedDate: "2024-03-18",
                isLiked: true,
                isBookmarked: false,
                isReel: true,
                comments: [
                    {
                        id: 2,
                        text: "Grid va Flexbox farqini endi tushundim, rahmat!",
                        date: "2024-03-18",
                        isLiked: false
                    },
                    {
                        id: 3,
                        text: "Qachon Grid, qachon Flexbox ishlatish kerakligini ko'rsatganingiz uchun katta rahmat!",
                        date: "2024-03-19",
                        isLiked: true
                    }
                ]
            },
            {
                id: 3,
                type: "video",
                title: "React Hooks Tutorial",
                description: "useState, useEffect va boshqa React Hooks haqida to'liq ma'lumot",
                thumbnail: "/video3.jpg",
                duration: "35:20",
                instructor: "Malika Tosheva",
                instructorAvatar: "/instructor2.jpg",
                category: "Programming",
                views: 2100,
                likes: 156,
                likedDate: "2024-03-15",
                isLiked: true,
                isBookmarked: true,
                courseId: 2,
                courseTitle: "React Development",
                comments: [
                    {
                        id: 4,
                        text: "Hooks haqida eng yaxshi tushuntirish!",
                        date: "2024-03-15",
                        isLiked: true
                    }
                ]
            },
            {
                id: 4,
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
                likedDate: "2024-03-12",
                isLiked: true,
                isBookmarked: false,
                isReel: true,
                comments: [
                    {
                        id: 5,
                        text: "Bu tip va tricklar juda foydali!",
                        date: "2024-03-12",
                        isLiked: true
                    }
                ]
            },
            {
                id: 5,
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
                likedDate: "2024-03-10",
                isLiked: false,
                isBookmarked: true,
                courseId: 2,
                courseTitle: "Full Stack Development",
                comments: [
                    {
                        id: 6,
                        text: "Backend development haqida yaxshi ma'lumot berdingiz",
                        date: "2024-03-10",
                        isLiked: false
                    },
                    {
                        id: 7,
                        text: "Express.js ni qanday ishlatishni ko'rsatganingiz uchun rahmat!",
                        date: "2024-03-11",
                        isLiked: true
                    }
                ]
            }
        ]
        setLikedItems(mockItems)
    }

    const filteredItems = likedItems.filter(item => {
        const matchesTab = activeTab === "liked" ? item.isLiked : item.comments && item.comments.length > 0
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesTab && matchesSearch
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
                return new Date(b.likedDate) - new Date(a.likedDate)
        }
    })

    const handleToggleLike = (itemId) => {
        setLikedItems(likedItems.map(item =>
            item.id === itemId
                ? { ...item, isLiked: !item.isLiked, likes: item.isLiked ? item.likes - 1 : item.likes + 1 }
                : item
        ))
    }

    const handleToggleCommentLike = (itemId, commentId) => {
        setLikedItems(likedItems.map(item =>
            item.id === itemId
                ? {
                    ...item,
                    comments: item.comments.map(comment =>
                        comment.id === commentId
                            ? { ...comment, isLiked: !comment.isLiked }
                            : comment
                    )
                }
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
            case "reel":
                return "Reel"
            default:
                return "Kontent"
        }
    }

    return (
        <div className="user-liked">
            <div className="liked-header">
                <div className="header-info">
                    <h1>Like & Comment</h1>
                    <p>Like bosgan va comment yozgan kontentlaringiz</p>
                </div>
                <div className="header-stats">
                    <div className="stat-item">
                        <span className="stat-number">{likedItems.filter(item => item.isLiked).length}</span>
                        <span className="stat-label">Like bosgan</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{likedItems.filter(item => item.comments && item.comments.length > 0).length}</span>
                        <span className="stat-label">Comment yozgan</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{likedItems.filter(item => item.type === 'video').length}</span>
                        <span className="stat-label">Videolar</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{likedItems.filter(item => item.type === 'reel').length}</span>
                        <span className="stat-label">Reels</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="liked-tabs">
                <button
                    className={`tab-button ${activeTab === 'liked' ? 'active' : ''}`}
                    onClick={() => setActiveTab('liked')}
                >
                    <FiHeart />
                    Like bosgan ({likedItems.filter(item => item.isLiked).length})
                </button>
                <button
                    className={`tab-button ${activeTab === 'commented' ? 'active' : ''}`}
                    onClick={() => setActiveTab('commented')}
                >
                    <FiMessageCircle />
                    Comment yozgan ({likedItems.filter(item => item.comments && item.comments.length > 0).length})
                </button>
            </div>

            {/* Controls */}
            <div className="liked-controls">
                <div className="search-section">
                    <div className="search-box">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Kontentlarni qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="filter-section">
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

            {/* Liked Items Grid */}
            <div className="liked-grid">
                {sortedItems.map((item) => (
                    <div key={item.id} className="liked-item">
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
                                </div>
                            </div>
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

                            {item.courseTitle && (
                                <div className="video-course">
                                    <span className="course-link">Kurs: {item.courseTitle}</span>
                                </div>
                            )}

                            <div className="item-meta">
                                <span className="liked-date">
                                    {activeTab === 'liked' ? 'Like bosilgan' : 'Comment yozilgan'}: {formatDate(item.likedDate)}
                                </span>
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

                        {/* Comments Section */}
                        {activeTab === 'commented' && item.comments && item.comments.length > 0 && (
                            <div className="comments-section">
                                <h4>Mening commentlarim</h4>
                                <div className="comments-list">
                                    {item.comments.map((comment) => (
                                        <div key={comment.id} className="comment-item">
                                            <div className="comment-content">
                                                <p>{comment.text}</p>
                                                <div className="comment-meta">
                                                    <span className="comment-date">{formatDate(comment.date)}</span>
                                                    <button
                                                        className={`comment-like ${comment.isLiked ? 'liked' : ''}`}
                                                        onClick={() => handleToggleCommentLike(item.id, comment.id)}
                                                    >
                                                        <FiThumbsUp />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {sortedItems.length === 0 && (
                <div className="empty-state">
                    {activeTab === 'liked' ? (
                        <>
                            <FiHeart size={64} />
                            <h3>Like bosgan kontentlar topilmadi</h3>
                            <p>Hozircha hech narsaga like bosmagan yoki qidiruv natijasi bo'sh</p>
                        </>
                    ) : (
                        <>
                            <FiMessageCircle size={64} />
                            <h3>Comment yozgan kontentlar topilmadi</h3>
                            <p>Hozircha hech narsaga comment yozmagan yoki qidiruv natijasi bo'sh</p>
                        </>
                    )}
                    <button className="btn btn-primary">
                        Kontentlarni ko'rish
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserLiked
