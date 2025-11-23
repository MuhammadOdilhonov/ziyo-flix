import { useState, useEffect } from "react"
import { getSavedReels, getReelDetail } from "../../api/apiUserProfile"
import { BaseUrlReels } from "../../api/apiService"
import { BsPlayFill, BsClock, BsCalendar3 } from "react-icons/bs"
import ReelViewModal from "./ReelViewModal"

const UserSavedReels = () => {
    const [savedReels, setSavedReels] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedReel, setSelectedReel] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [loadingDetail, setLoadingDetail] = useState(false)

    useEffect(() => {
        fetchSavedReels()
    }, [])

    const fetchSavedReels = async () => {
        try {
            setLoading(true)
            const response = await getSavedReels()
            setSavedReels(response.saved_reels || [])
        } catch (error) {
            console.error("Error fetching saved reels:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleReelClick = async (reelId) => {
        try {
            setLoadingDetail(true)
            setShowModal(true)
            const reelDetail = await getReelDetail(reelId)
            setSelectedReel(reelDetail)
        } catch (error) {
            console.error("Error fetching reel detail:", error)
            setShowModal(false)
        } finally {
            setLoadingDetail(false)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setSelectedReel(null)
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("uz-UZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (loading) {
        return (
            <div className="user-saved-reels">
                <div className="user-saved-reels__header">
                    <h1>Saqlangan Reels</h1>
                </div>
                <div className="user-saved-reels__loading">
                    <div className="spinner"></div>
                    <p>Yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    if (savedReels.length === 0) {
        return (
            <div className="user-saved-reels">
                <div className="user-saved-reels__header">
                    <h1>Saqlangan Reels</h1>
                </div>
                <div className="user-saved-reels__empty">
                    <BsPlayFill size={64} />
                    <h2>Saqlangan reels yo'q</h2>
                    <p>Sizga yoqqan reelslarni saqlang va bu yerda ko'ring</p>
                </div>
            </div>
        )
    }

    return (
        <div className="user-saved-reels">
            <div className="user-saved-reels__header">
                <h1>Saqlangan Reels</h1>
                <p className="user-saved-reels__count">{savedReels.length} ta reel</p>
            </div>

            <div className="user-saved-reels__grid">
                {savedReels.map((reel) => (
                    <div
                        key={reel.save_id}
                        className="user-saved-reels__card"
                        onClick={() => handleReelClick(reel.reel_id)}
                    >
                        <div className="user-saved-reels__card-thumbnail">
                            {reel.hls_playlist_url ? (
                                <img
                                    src={`${BaseUrlReels}${reel.poster}`}
                                    className="user-saved-reels__card-video"
                                />
                            ) : (
                                <div className="user-saved-reels__card-placeholder">
                                    <BsPlayFill size={48} />
                                </div>
                            )}
                            <div className="user-saved-reels__card-overlay">
                                <BsPlayFill size={48} className="play-icon" />
                            </div>
                            {reel.duration && (
                                <div className="user-saved-reels__card-duration">
                                    <BsClock size={12} />
                                    <span>{reel.duration}</span>
                                </div>
                            )}
                        </div>

                        <div className="user-saved-reels__card-content">
                            <h3 className="user-saved-reels__card-title">{reel.title}</h3>
                            <div className="user-saved-reels__card-meta">
                                <BsCalendar3 size={14} />
                                <span>{formatDate(reel.saved_at)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <ReelViewModal
                    reel={selectedReel}
                    loading={loadingDetail}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    )
}

export default UserSavedReels
