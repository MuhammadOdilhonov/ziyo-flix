"use client"

import { useState, useEffect } from "react"
import { setSeoTags, setRobots } from "../../utils/seo"
import { useNavigate } from "react-router-dom"
import { BsSearch, BsX, BsClock, BsPlayFill, BsPeople, BsStar } from "react-icons/bs"

export default function Search() {
    const navigate = useNavigate()
    const [query, setQuery] = useState("")
    const [results, setResults] = useState({
        movies: [],
        channels: [],
        tutorials: [],
        reels: [],
    })
    const [recentSearches, setRecentSearches] = useState([
        "React dasturlash",
        "Spider-Man",
        "Matematika darslari",
        "Ingliz tili",
    ])
    const [isSearching, setIsSearching] = useState(false)
    const [activeTab, setActiveTab] = useState("all")

    // Mock search data
    const searchData = {
        movies: [
            {
                id: 1,
                title: "Spider-Man: No Way Home",
                type: "movie",
                image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=300&h=400&fit=crop",
                rating: 8.4,
                year: 2021,
                genre: ["Jangari", "Fantastika"],
            },
            {
                id: 2,
                title: "Payg'ambar (s.a.v) Hayoti",
                type: "series",
                image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=300&h=400&fit=crop",
                rating: 9.2,
                year: 2020,
                genre: ["Islomiy", "Tarixiy"],
            },
        ],
        channels: [
            {
                id: 1,
                name: "Akmal Usmonov",
                username: "@akmal_dev",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                subscribers: 125000,
                verified: true,
                specialization: "Frontend Development",
            },
            {
                id: 2,
                name: "Dilnoza Karimova",
                username: "@math_teacher",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                subscribers: 89000,
                verified: true,
                specialization: "Matematika o'qituvchisi",
            },
        ],
        tutorials: [
            {
                id: 1,
                title: "React Hooks asoslari",
                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
                author: "Akmal Usmonov",
                duration: "2:30:45",
                lessons: 15,
                rating: 4.8,
            },
            {
                id: 2,
                title: "Matematika 9-sinf",
                image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop",
                author: "Dilnoza Karimova",
                duration: "5:45:20",
                lessons: 24,
                rating: 4.6,
            },
        ],
        reels: [
            {
                id: 1,
                title: "React Hooks asoslari",
                thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=200&h=300&fit=crop",
                author: "Akmal Usmonov",
                likes: 1250,
                views: "15K",
            },
            {
                id: 2,
                title: "Kulgili video",
                thumbnail: "https://images.unsplash.com/photo-1489599162810-1e666c2c3e3b?w=200&h=300&fit=crop",
                author: "Jasur Alimov",
                likes: 567,
                views: "8.2K",
            },
        ],
    }

    const tabs = [
        { id: "all", name: "Barchasi", count: 0 },
        { id: "movies", name: "Kinolar", count: 0 },
        { id: "channels", name: "Kanallar", count: 0 },
        { id: "tutorials", name: "Darsliklar", count: 0 },
        { id: "reels", name: "Reels", count: 0 },
    ]

    useEffect(() => {
        setSeoTags({
            title: "Qidiruv — ZiyoFlix",
            description: "Kinolar, kanallar va darsliklarni izlang. Kalit so'zni kiriting va natijalarni ko'ring.",
            image: '/Ziyo-Flix-Logo.png',
            type: 'website'
        })
        setRobots('noindex, nofollow')
    }, [])

    useEffect(() => {
        if (query.length > 0) {
            setIsSearching(true)
            // Simulate search delay
            const timer = setTimeout(() => {
                performSearch(query)
                setIsSearching(false)
            }, 300)
            return () => clearTimeout(timer)
        } else {
            setResults({ movies: [], channels: [], tutorials: [], reels: [] })
        }
    }, [query])

    const performSearch = (searchQuery) => {
        const searchResults = {
            movies: searchData.movies.filter(
                (item) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())),
            ),
            channels: searchData.channels.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.specialization.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
            tutorials: searchData.tutorials.filter(
                (item) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.author.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
            reels: searchData.reels.filter(
                (item) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.author.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        }
        setResults(searchResults)
    }

    const handleSearch = (searchQuery) => {
        setQuery(searchQuery)
        if (searchQuery && !recentSearches.includes(searchQuery)) {
            setRecentSearches((prev) => [searchQuery, ...prev.slice(0, 4)])
        }
    }

    const clearSearch = () => {
        setQuery("")
        setResults({ movies: [], channels: [], tutorials: [], reels: [] })
    }

    const handleItemClick = (type, id) => {
        navigate(`/${type}/${id}`)
    }

    const formatSubscribers = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K`
        }
        return count.toString()
    }

    const getTotalResults = () => {
        return Object.values(results).reduce((total, arr) => total + arr.length, 0)
    }

    const getFilteredResults = () => {
        if (activeTab === "all") {
            return results
        }
        return { [activeTab]: results[activeTab] }
    }

    return (
        <div className="search">
            <div className="search__container">
                {/* Search Header */}
                <div className="search__header">
                    <div className="search__input-container">
                        <BsSearch className="search__input-icon" />
                        <input
                            type="text"
                            placeholder="Kinolar, kanallar, darsliklar qidirish..."
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="search__input"
                            autoFocus
                        />
                        {query && (
                            <button onClick={clearSearch} className="search__clear-btn">
                                <BsX size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Recent Searches */}
                {!query && recentSearches.length > 0 && (
                    <div className="search__recent">
                        <h3 className="search__recent-title">So'nggi qidiruvlar</h3>
                        <div className="search__recent-list">
                            {recentSearches.map((search, index) => (
                                <button key={index} onClick={() => handleSearch(search)} className="search__recent-item">
                                    <BsClock size={16} />
                                    <span>{search}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search Results */}
                {query && (
                    <div className="search__results">
                        {isSearching ? (
                            <div className="search__loading">
                                <div className="search__spinner"></div>
                                <p>Qidirilmoqda...</p>
                            </div>
                        ) : getTotalResults() > 0 ? (
                            <>
                                {/* Results Tabs */}
                                <div className="search__tabs">
                                    {tabs.map((tab) => {
                                        const count = tab.id === "all" ? getTotalResults() : results[tab.id]?.length || 0
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`search__tab ${activeTab === tab.id ? "active" : ""}`}
                                            >
                                                {tab.name}
                                                <span className="search__tab-count">({count})</span>
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Results Content */}
                                <div className="search__content">
                                    {Object.entries(getFilteredResults()).map(
                                        ([type, items]) =>
                                            items.length > 0 && (
                                                <div key={type} className="search__section">
                                                    {activeTab === "all" && (
                                                        <h3 className="search__section-title">
                                                            {type === "movies" && "Kinolar"}
                                                            {type === "channels" && "Kanallar"}
                                                            {type === "tutorials" && "Darsliklar"}
                                                            {type === "reels" && "Reels"}
                                                        </h3>
                                                    )}

                                                    <div className={`search__items search__items--${type}`}>
                                                        {items.map((item) => (
                                                            <div
                                                                key={item.id}
                                                                onClick={() => handleItemClick(type, item.id)}
                                                                className={`search__item search__item--${type}`}
                                                            >
                                                                {type === "movies" && (
                                                                    <>
                                                                        <img
                                                                            src={item.image || "/placeholder.svg"}
                                                                            alt={item.title}
                                                                            className="search__item-image"
                                                                        />
                                                                        <div className="search__item-info">
                                                                            <h4 className="search__item-title">{item.title}</h4>
                                                                            <div className="search__item-meta">
                                                                                <span>{item.year}</span>
                                                                                <span>{item.type === "series" ? "Serial" : "Film"}</span>
                                                                                <div className="search__item-rating">
                                                                                    <BsStar size={12} />
                                                                                    <span>{item.rating}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="search__item-genres">
                                                                                {item.genre.map((g, i) => (
                                                                                    <span key={i} className="search__item-genre">
                                                                                        {g}
                                                                                    </span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {type === "channels" && (
                                                                    <>
                                                                        <img
                                                                            src={item.avatar || "/placeholder.svg"}
                                                                            alt={item.name}
                                                                            className="search__item-avatar"
                                                                        />
                                                                        <div className="search__item-info">
                                                                            <h4 className="search__item-title">
                                                                                {item.name}
                                                                                {item.verified && <span className="search__verified">✓</span>}
                                                                            </h4>
                                                                            <p className="search__item-username">{item.username}</p>
                                                                            <p className="search__item-specialization">{item.specialization}</p>
                                                                            <div className="search__item-meta">
                                                                                <BsPeople size={12} />
                                                                                <span>{formatSubscribers(item.subscribers)} obunachi</span>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {type === "tutorials" && (
                                                                    <>
                                                                        <img
                                                                            src={item.image || "/placeholder.svg"}
                                                                            alt={item.title}
                                                                            className="search__item-image"
                                                                        />
                                                                        <div className="search__item-info">
                                                                            <h4 className="search__item-title">{item.title}</h4>
                                                                            <p className="search__item-author">{item.author}</p>
                                                                            <div className="search__item-meta">
                                                                                <span>{item.lessons} dars</span>
                                                                                <span>{item.duration}</span>
                                                                                <div className="search__item-rating">
                                                                                    <BsStar size={12} />
                                                                                    <span>{item.rating}</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}

                                                                {type === "reels" && (
                                                                    <>
                                                                        <img
                                                                            src={item.thumbnail || "/placeholder.svg"}
                                                                            alt={item.title}
                                                                            className="search__item-thumbnail"
                                                                        />
                                                                        <div className="search__item-overlay">
                                                                            <BsPlayFill size={24} />
                                                                        </div>
                                                                        <div className="search__item-info">
                                                                            <h4 className="search__item-title">{item.title}</h4>
                                                                            <p className="search__item-author">{item.author}</p>
                                                                            <div className="search__item-meta">
                                                                                <span>{item.likes} like</span>
                                                                                <span>{item.views} ko'rishlar</span>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ),
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="search__empty">
                                <div className="search__empty-icon">
                                    <BsSearch size={48} />
                                </div>
                                <h3>Hech narsa topilmadi</h3>
                                <p>"{query}" bo'yicha natija yo'q. Boshqa kalit so'zlar bilan qidiring.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
