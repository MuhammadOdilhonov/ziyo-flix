import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
    FiPlay, 
    FiHeart, 
    FiEye, 
    FiMessageCircle, 
    FiCalendar,
    FiMoreVertical,
    FiEdit,
    FiTrash2,
    FiBarChart,
    FiPlus,
    FiSearch,
    FiFilter,
    FiGrid,
    FiList,
    FiUpload
} from 'react-icons/fi'
import { teacherReelsAPI } from '../../api/apiTeacherReels'
import useSelectedChannel from '../../hooks/useSelectedChannel'
import ReelViewModal from './ReelViewModal'
import ReelCreateModal from './ReelCreateModal'
import { BaseUrlReels } from '../../api/apiService'

const TeacherReels = () => {
    const { selectedChannel } = useSelectedChannel()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [reelsData, setReelsData] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState('grid') // grid, list
    const [sortBy, setSortBy] = useState('created_at') // created_at, likes, views, comments
    const [filterBy, setFilterBy] = useState('all') // all, popular, recent
    
    // Modal states
    const [showViewModal, setShowViewModal] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [selectedReel, setSelectedReel] = useState(null)
    const [reelMenuOpen, setReelMenuOpen] = useState(null)

    useEffect(() => {
        if (selectedChannel?.slug) {
            fetchReels()
        }
    }, [selectedChannel])

    const fetchReels = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await teacherReelsAPI.getChannelReels(selectedChannel.slug)
            setReelsData(response)
            
        } catch (error) {
            console.error('Error fetching reels:', error)
            setError('Reelslarni yuklashda xatolik yuz berdi!')
        } finally {
            setLoading(false)
        }
    }

    const handleReelView = async (reel) => {
        try {
            const response = await teacherReelsAPI.getReelSummary(selectedChannel.slug, reel.id)
            setSelectedReel(response)
            setShowViewModal(true)
            setReelMenuOpen(null)
        } catch (error) {
            console.error('Error fetching reel summary:', error)
            setError('Reel ma\'lumotlarini yuklashda xatolik!')
        }
    }

    const handleReelEdit = (reel) => {
        setSelectedReel(reel)
        setShowCreateModal(true)
        setReelMenuOpen(null)
    }

    const handleReelDelete = async (reel) => {
        if (window.confirm(`"${reel.title}" reelini o'chirishni xohlaysizmi?`)) {
            try {
                await teacherReelsAPI.deleteReel(selectedChannel.slug, reel.id)
                fetchReels() // Ro'yxatni yangilash
                setReelMenuOpen(null)
            } catch (error) {
                console.error('Error deleting reel:', error)
                setError('Reel o\'chirishda xatolik!')
            }
        }
    }

    const handleReelCreated = (newReel) => {
        console.log('Reel yaratildi:', newReel)
        fetchReels() // Ro'yxatni yangilash
        setShowCreateModal(false)
        setSelectedReel(null)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatDuration = (seconds) => {
        if (!seconds) return 'N/A'
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    // Filter va sort reels
    const filteredReels = reelsData?.reels?.filter(reel => {
        const matchesSearch = reel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             reel.caption.toLowerCase().includes(searchTerm.toLowerCase())
        
        if (filterBy === 'popular') {
            return matchesSearch && (reel.likes > 0 || reel.views > 0)
        } else if (filterBy === 'recent') {
            const reelDate = new Date(reel.created_at)
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            return matchesSearch && reelDate > weekAgo
        }
        
        return matchesSearch
    }).sort((a, b) => {
        switch (sortBy) {
            case 'likes':
                return b.likes - a.likes
            case 'views':
                return b.views - a.views
            case 'comments':
                return b.comments_count - a.comments_count
            default:
                return new Date(b.created_at) - new Date(a.created_at)
        }
    })

    if (!selectedChannel) {
        return (
            <div className="no-channel-selected">
                <h3>Kanal tanlanmagan</h3>
                <p>Reelslarni ko'rish uchun kanalni tanlang</p>
            </div>
        )
    }

    return (
        <div className="teacher-reels">
            <div className="teacher-reels-header">
                <div className="header-main">
                    <h1>Reels</h1>
                    <p className="channel-info">
                        {reelsData?.channel?.title} - {reelsData?.count || 0} ta reel
                    </p>
                </div>
                
                <div className="header-actions">
                    <button 
                        className="btn btn-primary"
                        onClick={() => navigate(`/profile/teacher/${selectedChannel?.slug}/reels/upload`)}
                    >
                        <FiUpload /> Reel Yuklash
                    </button>
                </div>
            </div>

            <div className="reels-controls">
                <div className="search-filter-section">
                    <div className="search-box">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Reels qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="filter-controls">
                        <select 
                            value={filterBy} 
                            onChange={(e) => setFilterBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">Barchasi</option>
                            <option value="popular">Mashhur</option>
                            <option value="recent">So'nggi</option>
                        </select>
                        
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="sort-select"
                        >
                            <option value="created_at">Sana bo'yicha</option>
                            <option value="likes">Like bo'yicha</option>
                            <option value="views">Ko'rishlar bo'yicha</option>
                            <option value="comments">Izohlar bo'yicha</option>
                        </select>
                    </div>
                </div>

                <div className="view-controls">
                    <button 
                        className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        <FiGrid />
                    </button>
                    <button 
                        className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        <FiList />
                    </button>
                </div>
            </div>

            <div className="reels-content">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Reels yuklanmoqda...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                        <button 
                            className="btn btn-primary"
                            onClick={fetchReels}
                        >
                            Qayta urinish
                        </button>
                    </div>
                ) : filteredReels && filteredReels.length > 0 ? (
                    <div className={`reels-${viewMode}`}>
                        {filteredReels.map((reel) => (
                            <div key={reel.id}  className="reel-card">
                                <div style={{ backgroundImage: `url(${BaseUrlReels + reel.poster})`, backgroundSize: 'cover', backgroundPosition: 'center' }} className="reel-thumbnail">
                                    <div className="play-overlay" onClick={() => handleReelView(reel)}>
                                        <FiPlay className="play-icon" />
                                    </div>
                                    <div className="reel-duration">
                                        {formatDuration(reel.duration)}
                                    </div>
                                    <div className="reel-menu">
                                        <button 
                                            className="menu-trigger"
                                            onClick={() => setReelMenuOpen(reelMenuOpen === reel.id ? null : reel.id)}
                                        >
                                            <FiMoreVertical />
                                        </button>
                                        {reelMenuOpen === reel.id && (
                                            <div className="menu-dropdown">
                                                <button onClick={() => handleReelView(reel)}>
                                                    <FiEye /> Ko'rish
                                                </button>
                                                <button onClick={() => handleReelEdit(reel)}>
                                                    <FiEdit /> Tahrirlash
                                                </button>
                                                <button onClick={() => handleReelDelete(reel)}>
                                                    <FiTrash2 /> O'chirish
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="reel-info">
                                    <h3 className="reel-title">{reel.title}</h3>
                                    <p className="reel-caption">{reel.caption}</p>
                                    
                                    <div className="reel-stats">
                                        <div className="stat-item">
                                            <FiHeart className="stat-icon" />
                                            <span>{reel.likes}</span>
                                        </div>
                                        <div className="stat-item">
                                            <FiEye className="stat-icon" />
                                            <span>{reel.views}</span>
                                        </div>
                                        <div className="stat-item">
                                            <FiMessageCircle className="stat-icon" />
                                            <span>{reel.comments_count}</span>
                                        </div>
                                        <div className="stat-item">
                                            <FiCalendar className="stat-icon" />
                                            <span>{formatDate(reel.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <FiPlay />
                        </div>
                        <h3>Reels topilmadi</h3>
                        <p>Hali birorta reel yaratilmagan yoki qidiruv natijasida hech narsa topilmadi</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <FiPlus /> Birinchi Reel yaratish
                        </button>
                    </div>
                )}
            </div>

            {/* Reel View Modal */}
            <ReelViewModal
                isOpen={showViewModal}
                onClose={() => {
                    setShowViewModal(false)
                    setSelectedReel(null)
                }}
                reelData={selectedReel}
                channelSlug={selectedChannel?.slug}
            />

            {/* Reel Create/Edit Modal */}
            <ReelCreateModal
                isOpen={showCreateModal}
                onClose={() => {
                    setShowCreateModal(false)
                    setSelectedReel(null)
                }}
                reelData={selectedReel}
                channelSlug={selectedChannel?.slug}
                onReelCreated={handleReelCreated}
            />
        </div>
    )
}

export default TeacherReels
