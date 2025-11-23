"use client"

import { useState, useEffect } from "react"
import { FiBookmark, FiPlay, FiClock, FiUser, FiTrash2, FiSearch, FiFilter } from "react-icons/fi"

const UserSaved = () => {
    const [savedItems, setSavedItems] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setFilterType] = useState("all")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Mock data - replace with API call
        setTimeout(() => {
            setSavedItems([
                {
                    id: 1,
                    type: "video",
                    title: "JavaScript Asoslari - 1-dars",
                    description: "JavaScript dasturlash tilining asosiy tushunchalari",
                    thumbnail: "/javascript-tutorial.png",
                    duration: "45:30",
                    teacher: "Aziz Karimov",
                    category: "Dasturlash",
                    savedDate: "2024-03-10",
                    progress: 75,
                    price: 50000,
                },
                {
                    id: 2,
                    type: "reel",
                    title: "React Hooks qisqacha",
                    description: "React Hooks haqida qisqa va foydali ma'lumot",
                    thumbnail: "/react-hooks-concept.png",
                    duration: "2:15",
                    teacher: "Malika Tosheva",
                    category: "Frontend",
                    savedDate: "2024-03-09",
                    progress: 100,
                    price: 0,
                },
                {
                    id: 3,
                    type: "video",
                    title: "Python ma'lumotlar bazasi",
                    description: "Python bilan ma'lumotlar bazasi bilan ishlash",
                    thumbnail: "/python-database.jpg",
                    duration: "1:20:45",
                    teacher: "Bobur Aliyev",
                    category: "Backend",
                    savedDate: "2024-03-08",
                    progress: 30,
                    price: 75000,
                },
            ])
            setLoading(false)
        }, 1000)
    }, [])

    const handleRemoveFromSaved = (id) => {
        if (window.confirm("Saqlangan ro'yxatdan o'chirishni tasdiqlaysizmi?")) {
            setSavedItems(savedItems.filter((item) => item.id !== id))
        }
    }

    const filteredItems = savedItems.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.teacher.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterType === "all" || item.type === filterType
        return matchesSearch && matchesFilter
    })

    const formatDuration = (duration) => {
        return duration
    }

    const formatPrice = (price) => {
        return price === 0 ? "Bepul" : `${price.toLocaleString()} so'm`
    }

    if (loading) {
        return (
            <div className="user-saved">
                <div className="user-saved__loading">
                    <div className="user-saved__spinner"></div>
                    <p>Saqlanganlar yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="user-saved">
            <div className="user-saved__header">
                <div className="user-saved__title">
                    <h1>Saqlanganlar</h1>
                    <p>Siz saqlagan video darsliklar va reels</p>
                </div>
            </div>

            <div className="user-saved__controls">
                <div className="user-saved__search">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Saqlangan kontent qidirish..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="user-saved__filter">
                    <FiFilter />
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">Barcha turlar</option>
                        <option value="video">Video darsliklar</option>
                        <option value="reel">Reels</option>
                    </select>
                </div>
            </div>

            <div className="user-saved__stats">
                <div className="user-saved__stat">
                    <h3>{savedItems.filter((item) => item.type === "video").length}</h3>
                    <p>Video darsliklar</p>
                </div>
                <div className="user-saved__stat">
                    <h3>{savedItems.filter((item) => item.type === "reel").length}</h3>
                    <p>Reels</p>
                </div>
                <div className="user-saved__stat">
                    <h3>{savedItems.length}</h3>
                    <p>Jami saqlangan</p>
                </div>
            </div>

            {filteredItems.length === 0 ? (
                <div className="user-saved__empty">
                    <FiBookmark size={64} />
                    <h3>Hech narsa saqlanmagan</h3>
                    <p>Siz hali hech qanday video yoki reel saqlamagansiz</p>
                </div>
            ) : (
                <div className="user-saved__grid">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="user-saved__card">
                            <div className="user-saved__card-header">
                                <img src={item.thumbnail || "/placeholder.svg"} alt={item.title} className="user-saved__thumbnail" />
                                <div className="user-saved__overlay">
                                    <button className="user-saved__play-btn">
                                        <FiPlay />
                                    </button>
                                    <div className="user-saved__duration">
                                        <FiClock />
                                        {formatDuration(item.duration)}
                                    </div>
                                </div>
                                <div className="user-saved__type">{item.type === "video" ? "Video" : "Reel"}</div>
                            </div>

                            <div className="user-saved__card-body">
                                <h3 className="user-saved__card-title">{item.title}</h3>
                                <p className="user-saved__card-description">{item.description}</p>

                                <div className="user-saved__card-meta">
                                    <div className="user-saved__teacher">
                                        <FiUser />
                                        {item.teacher}
                                    </div>
                                    <div className="user-saved__category">{item.category}</div>
                                </div>

                                {item.progress > 0 && (
                                    <div className="user-saved__progress">
                                        <div className="user-saved__progress-bar">
                                            <div className="user-saved__progress-fill" style={{ width: `${item.progress}%` }}></div>
                                        </div>
                                        <span className="user-saved__progress-text">{item.progress}% ko'rilgan</span>
                                    </div>
                                )}

                                <div className="user-saved__card-footer">
                                    <div className="user-saved__price">{formatPrice(item.price)}</div>
                                    <div className="user-saved__saved-date">Saqlangan: {item.savedDate}</div>
                                </div>
                            </div>

                            <div className="user-saved__card-actions">
                                <button
                                    className="user-saved__remove-btn"
                                    onClick={() => handleRemoveFromSaved(item.id)}
                                    title="Saqlanganlardan o'chirish"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default UserSaved
