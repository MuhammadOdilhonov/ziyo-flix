import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { teacherAPI } from "../../api/apiTeacher"
import { BaseUrlReels } from "../../api/apiService"
import useSelectedChannel from "../../hooks/useSelectedChannel"
import {
    FiPlus,
    FiSearch,
    FiUsers,
    FiCalendar,
    FiGlobe,
    FiUser,
    FiCheck,
    FiStar,
    FiChevronRight,
    FiEdit,
    FiTrash2,
    FiEye,
    FiImage,
    FiX,
    FiExternalLink,
    FiMapPin,
    FiAward,
    FiClock
} from 'react-icons/fi'

function getStoredUser() {
    try {
        const raw = localStorage.getItem("user")
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

const ChannelSelector = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const user = getStoredUser()
    const { selectedChannel, selectChannel } = useSelectedChannel()

    const [query, setQuery] = useState("")
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [showGalleryModal, setShowGalleryModal] = useState(false)
    const [selectedChannelDetails, setSelectedChannelDetails] = useState(null)
    const [currentImage, setCurrentImage] = useState(null)

    useEffect(() => {
        fetchChannels()
    }, [])

    const fetchChannels = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await teacherAPI.getChannels()
            setChannels(response.data || [])
        } catch (error) {
            console.error('Kanallarni yuklashda xatolik:', error)
            setError('Kanallarni yuklashda xatolik yuz berdi')
        } finally {
            setLoading(false)
        }
    }

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return channels
        return channels.filter(c =>
            c.title?.toLowerCase().includes(q) ||
            c.slug?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q)
        )
    }, [channels, query])

    const handleSelect = (channel) => {
        // Store selected channel in localStorage and context
        const channelData = {
            id: channel.id,
            title: channel.title,
            slug: channel.slug,
            username: channel.slug, // Using slug as username for compatibility
            avatar: channel.avatar,
            banner: channel.banner,
            verified: channel.verified,
            description: channel.description
        }

        selectChannel(channelData)
        localStorage.setItem('selectedChannel', JSON.stringify(channelData))

        // Navigate to teacher dashboard with channel slug
        navigate(`/profile/teacher/${channel.slug}/dashboard`, { replace: true })
    }

    const handleAdd = () => {
        navigate("/profile/teacher/channel/edit")
    }

    const handleViewDetails = (channel) => {
        setSelectedChannelDetails(channel)
        setShowDetailsModal(true)
    }

    const handleViewGallery = (channel, imageType = 'banner') => {
        const imageUrl = imageType === 'banner' ? channel.banner : channel.avatar
        if (imageUrl) {
            setCurrentImage({
                url: getImageUrl(imageUrl),
                title: channel.title,
                type: imageType
            })
            setShowGalleryModal(true)
        }
    }

    const handleEdit = (channelId) => {
        navigate(`/profile/teacher/channel/edit?id=${channelId}`)
    }

    const handleDelete = async (channelId) => {
        if (!window.confirm("Kanal o'chirilsinmi?")) return

        try {
            // API call to delete channel would go here
            // await teacherAPI.deleteChannel(channelId)

            // For now, just refresh the list
            await fetchChannels()
        } catch (error) {
            console.error('Kanalni o\'chirishda xatolik:', error)
            alert('Kanalni o\'chirishda xatolik yuz berdi')
        }
    }

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null
        if (imagePath.startsWith('http')) return imagePath
        return `${BaseUrlReels}${imagePath}`
    }

    const formatDate = (dateString) => {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="teacher-channel-selector">
                <div className="tcs__loading">
                    <div className="spinner"></div>
                    <p>Kanallar yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="teacher-channel-selector">
                <div className="tcs__error">
                    <h3>Xatolik yuz berdi</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={fetchChannels}>
                        Qayta urinish
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="teacher-channel-selector">
            <div className="tcs__header">
                <div className="tcs__header-content">
                    <h1>Kanalni tanlang</h1>
                    <p>O'qituvchi paneliga kirish uchun kanalni tanlang yoki yangisini yarating</p>
                </div>
                <div className="tcs__header-stats">
                    <div className="stat-item">
                        <FiUsers size={20} />
                        <span>{channels.length} ta kanal</span>
                    </div>
                </div>
            </div>

            <div className="tcs__toolbar">
                <div className="tcs__search">
                    <FiSearch size={18} />
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Kanal nomi, slug yoki tavsif bo'yicha qidiring..."
                    />
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>
                    <FiPlus size={18} />
                    Yangi kanal yaratish
                </button>
            </div>

            {filtered.length === 0 && !loading ? (
                <div className="tcs__empty">
                    <FiSearch size={48} />
                    <h3>Kanal topilmadi</h3>
                    <p>
                        {query ?
                            "Qidiruv bo'yicha hech qanday kanal topilmadi" :
                            "Hozircha sizda kanal yo'q"
                        }
                    </p>
                    {!query && (
                        <button className="btn btn-primary" onClick={handleAdd}>
                            <FiPlus size={18} />
                            Birinchi kanalni yarating
                        </button>
                    )}
                </div>
            ) : (
                <div className="tcs__grid">
                    {filtered.map(channel => (
                        <div
                            key={channel.id}
                            className={`tcs__card ${selectedChannel?.id === channel.id ? "tcs__card--active" : ""}`}
                        >
                            {/* Banner */}
                            <div className="tcs__banner">
                                {channel.banner ? (
                                    <img
                                        src={getImageUrl(channel.banner)}
                                        alt={`${channel.title} banner`}
                                        onError={(e) => {
                                            e.target.style.display = 'none'
                                        }}
                                    />
                                ) : (
                                    <div className="tcs__banner-placeholder">
                                        <FiGlobe size={32} />
                                    </div>
                                )}

                                {/* Banner Actions */}
                                <div className="tcs__banner-actions">
                                    {channel.banner && (
                                        <button
                                            className="tcs__gallery-btn"
                                            onClick={() => handleViewGallery(channel, 'banner')}
                                            title="Rasmni kattalashtirish"
                                        >
                                            <FiImage size={16} />
                                        </button>
                                    )}
                                </div>

                                    {/* Verified Badge - O'ng burchakda */}
                                    {channel.verified ? (
                                        <div className="tcs__verified-badge">
                                            <FiCheck size={14} />
                                        </div>
                                    ) : (
                                        <div className="tcs__verified-badge-x">
                                            <FiX size={14} />
                                        </div>
                                    )}
                                     
                            </div>

                            {/* Content */}
                            <div className="tcs__content">
                                {/* Avatar and basic info */}
                                <div className="tcs__profile">
                                    <div className="tcs__avatar">
                                        {channel.avatar ? (
                                            <img
                                                src={getImageUrl(channel.avatar)}
                                                alt={`${channel.title} avatar`}
                                                onError={(e) => {
                                                    e.target.style.display = 'none'
                                                    e.target.nextSibling.style.display = 'flex'
                                                }}
                                            />
                                        ) : null}
                                        <div className="tcs__avatar-placeholder" style={{ display: channel.avatar ? 'none' : 'flex' }}>
                                            <FiUser size={24} />
                                        </div>


                                        {/* Avatar Gallery Button */}
                                        {channel.avatar && (
                                            <button
                                                className="tcs__avatar-gallery-btn"
                                                onClick={() => handleViewGallery(channel, 'avatar')}
                                                title="Avatar rasmini ko'rish"
                                            >
                                                <FiImage size={12} />
                                            </button>
                                        )}

                                        {channel.verified && (
                                            <div className="tcs__verified-badge">
                                                <FiCheck size={16} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="tcs__profile-info">
                                        <div className="tcs__title">
                                            {channel.title}
                                            {channel.verified && (
                                                <FiStar className="verified-icon" size={16} />
                                            )}
                                        </div>
                                        <div className="tcs__slug">@{channel.slug}</div>
                                        {channel.badge && (
                                            <div className="tcs__badge">
                                                {channel.badge}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                {channel.description && (
                                    <div className="tcs__description">
                                        {channel.description}
                                    </div>
                                )}

                                {/* Stats */}
                                <div className="tcs__stats">
                                    <div className="stat-item">
                                        <FiUsers size={14} />
                                        <span>{channel.subscribers?.length || 0} obunachi</span>
                                    </div>
                                    <div className="stat-item">
                                        <FiCalendar size={14} />
                                        <span>{formatDate(channel.created_at)}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="tcs__actions">
                                    <button
                                        className={`tcs__actions_btn ${selectedChannel?.id === channel.id ? 'tcs__actions_btn-success' : 'tcs__actions_btn-primary'}`}
                                        onClick={() => handleSelect(channel)}
                                    >
                                        {selectedChannel?.id === channel.id ? (
                                            <>
                                                <FiCheck size={16} />
                                                Tanlangan
                                            </>
                                        ) : (
                                            <>
                                                <FiChevronRight size={16} />
                                                Tanlash
                                            </>
                                        )}
                                    </button>
                                    <div className="tcs__action-menu">
                                        <button
                                            className="tcs__actions_btn btn-outline btn-sm"
                                            onClick={() => handleViewDetails(channel)}
                                            title="Ma'lumotlarni ko'rish"
                                        >
                                            <FiEye size={14} />
                                        </button>
                                        <button
                                            className="tcs__actions_btn btn-outline btn-sm"
                                            onClick={() => navigate(`/profile/teacher/channel/edit?slug=${channel.slug}`)}
                                            title="Tahrirlash"
                                        >
                                            <FiEdit size={14} />
                                        </button>
                                        <button
                                            className="tcs__actions_btn btn-outline btn-sm btn-danger"
                                            onClick={() => handleDelete(channel.id)}
                                            title="O'chirish"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedChannelDetails && (
                <div className="tcs__modal-overlay" onClick={() => setShowDetailsModal(false)}>
                    <div className="tcs__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tcs__modal-header">
                            <h3>Kanal ma'lumotlari</h3>
                            <button
                                className="tcs__modal-close"
                                onClick={() => setShowDetailsModal(false)}
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="tcs__modal-content">
                            <div className="tcs__details-grid">
                                {/* Basic Info */}
                                <div className="tcs__detail-section">
                                    <h4>Asosiy ma'lumotlar</h4>
                                    <div className="tcs__detail-item">
                                        <span className="label">Kanal nomi:</span>
                                        <span className="value">{selectedChannelDetails.title}</span>
                                    </div>
                                    <div className="tcs__detail-item">
                                        <span className="label">Slug:</span>
                                        <span className="value">@{selectedChannelDetails.slug}</span>
                                    </div>
                                    {selectedChannelDetails.badge && (
                                        <div className="tcs__detail-item">
                                            <span className="label">Mutaxassislik:</span>
                                            <span className="value badge">{selectedChannelDetails.badge}</span>
                                        </div>
                                    )}
                                    <div className="tcs__detail-item">
                                        <span className="label">Tasdiqlangan:</span>
                                        <span className={`value ${selectedChannelDetails.verified ? 'verified' : 'not-verified'}`}>
                                            {selectedChannelDetails.verified ? 'Ha' : 'Yo\'q'}
                                            {selectedChannelDetails.verified && <FiCheck size={16} />}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                {selectedChannelDetails.description && (
                                    <div className="tcs__detail-section">
                                        <h4>Ta'rif</h4>
                                        <p className="tcs__description-full">{selectedChannelDetails.description}</p>
                                    </div>
                                )}

                                {/* Social Links */}
                                {(selectedChannelDetails.website || selectedChannelDetails.telegram ||
                                    selectedChannelDetails.instagram || selectedChannelDetails.github ||
                                    selectedChannelDetails.linkedin) && (
                                        <div className="tcs__detail-section">
                                            <h4>Ijtimoiy tarmoqlar</h4>
                                            {selectedChannelDetails.website && (
                                                <div className="tcs__detail-item">
                                                    <span className="label">Veb-sayt:</span>
                                                    <a href={selectedChannelDetails.website} target="_blank" rel="noopener noreferrer" className="value link">
                                                        {selectedChannelDetails.website} <FiExternalLink size={14} />
                                                    </a>
                                                </div>
                                            )}
                                            {selectedChannelDetails.telegram && (
                                                <div className="tcs__detail-item">
                                                    <span className="label">Telegram:</span>
                                                    <span className="value">{selectedChannelDetails.telegram}</span>
                                                </div>
                                            )}
                                            {selectedChannelDetails.instagram && (
                                                <div className="tcs__detail-item">
                                                    <span className="label">Instagram:</span>
                                                    <span className="value">{selectedChannelDetails.instagram}</span>
                                                </div>
                                            )}
                                            {selectedChannelDetails.github && (
                                                <div className="tcs__detail-item">
                                                    <span className="label">GitHub:</span>
                                                    <span className="value">{selectedChannelDetails.github}</span>
                                                </div>
                                            )}
                                            {selectedChannelDetails.linkedin && (
                                                <div className="tcs__detail-item">
                                                    <span className="label">LinkedIn:</span>
                                                    <span className="value">{selectedChannelDetails.linkedin}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                {/* Location & Experience */}
                                {(selectedChannelDetails.location_country || selectedChannelDetails.location_city ||
                                    selectedChannelDetails.years_experience) && (
                                        <div className="tcs__detail-section">
                                            <h4>Joylashuv va tajriba</h4>
                                            {(selectedChannelDetails.location_country || selectedChannelDetails.location_city) && (
                                                <div className="tcs__detail-item">
                                                    <span className="label"><FiMapPin size={16} /> Joylashuv:</span>
                                                    <span className="value">
                                                        {[selectedChannelDetails.location_city, selectedChannelDetails.location_country]
                                                            .filter(Boolean).join(', ')}
                                                    </span>
                                                </div>
                                            )}
                                            {selectedChannelDetails.years_experience && (
                                                <div className="tcs__detail-item">
                                                    <span className="label"><FiClock size={16} /> Tajriba:</span>
                                                    <span className="value">{selectedChannelDetails.years_experience} yil</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                {/* Stats */}
                                <div className="tcs__detail-section">
                                    <h4>Statistika</h4>
                                    <div className="tcs__detail-item">
                                        <span className="label"><FiUsers size={16} /> Obunachi:</span>
                                        <span className="value">{selectedChannelDetails.subscribers?.length || 0} ta</span>
                                    </div>
                                    <div className="tcs__detail-item">
                                        <span className="label"><FiCalendar size={16} /> Yaratilgan:</span>
                                        <span className="value">{formatDate(selectedChannelDetails.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Gallery Modal */}
            {showGalleryModal && currentImage && (
                <div className="tcs__gallery-overlay" onClick={() => setShowGalleryModal(false)}>
                    <div className="tcs__gallery-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tcs__gallery-header">
                            <h3>{currentImage.title} - {currentImage.type === 'banner' ? 'Banner' : 'Avatar'}</h3>
                            <button
                                className="tcs__gallery-close"
                                onClick={() => setShowGalleryModal(false)}
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        <div className="tcs__gallery-content">
                            <img
                                src={currentImage.url}
                                alt={`${currentImage.title} ${currentImage.type}`}
                                className="tcs__gallery-image"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChannelSelector
