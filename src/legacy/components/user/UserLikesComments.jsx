import { useState, useEffect } from "react"
import { getLikesAndComments, getReelDetail } from "../../api/apiUserProfile"
import { BaseUrlReels } from "../../api/apiService"
import ReelViewModal from "./ReelViewModal"
import { BsHeart, BsHeartFill, BsChat, BsChatFill, BsPlayFill } from "react-icons/bs"

const UserLikesComments = () => {
    const [activeTab, setActiveTab] = useState("likes") // likes | comments
    const [likes, setLikes] = useState([])
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedReel, setSelectedReel] = useState(null)
    const [reelDetail, setReelDetail] = useState(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchLikesAndComments()
    }, [])

    const fetchLikesAndComments = async () => {
        try {
            setLoading(true)
            const data = await getLikesAndComments()
            setLikes(data.likes || [])
            setComments(data.comments || [])
            console.log("Likes and comments fetched:", data)
        } catch (error) {
            console.error("Error fetching likes and comments:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleLikeClick = async (reelId) => {
        try {
            const detail = await getReelDetail(reelId)
            setReelDetail(detail)
            setSelectedReel(detail)
            setShowModal(true)
        } catch (error) {
            console.error("Error fetching reel detail:", error)
        }
    }

    const handleCommentClick = async (reelId) => {
        try {
            const detail = await getReelDetail(reelId)
            setReelDetail(detail)
            setSelectedReel(detail)
            setShowModal(true)
        } catch (error) {
            console.error("Error fetching reel detail:", error)
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })
        } else if (date.toDateString() === yesterday.toDateString()) {
            return "Kecha"
        } else {
            return date.toLocaleDateString("uz-UZ")
        }
    }

    return (
        <div className="user-likes-comments">
            {/* Tab Navigation */}
            <div className="likes-comments__tabs">
                <button
                    className={`tab-btn ${activeTab === "likes" ? "active" : ""}`}
                    onClick={() => setActiveTab("likes")}
                >
                    <BsHeartFill size={20} />
                    <span>Yoqtirganlar ({likes.length})</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === "comments" ? "active" : ""}`}
                    onClick={() => setActiveTab("comments")}
                >
                    <BsChatFill size={20} />
                    <span>Izohlar ({comments.length})</span>
                </button>
            </div>

            {/* Content */}
            <div className="likes-comments__content">
                {loading ? (
                    <div className="likes-comments__loading">
                        <div className="spinner"></div>
                        <p>Yuklanmoqda...</p>
                    </div>
                ) : activeTab === "likes" ? (
                    <div className="likes-comments__grid">
                        {likes.length === 0 ? (
                            <div className="likes-comments__empty">
                                <BsHeart size={48} />
                                <p>Hali yoqtirgan reellar yo'q</p>
                            </div>
                        ) : (
                            likes.map((like) => (
                                <div
                                    key={like.id}
                                    className="likes-comments__reel-card"
                                    onClick={() => handleLikeClick(like.reel_id)}
                                >
                                    <div className="reel-card__thumbnail">
                                        {like.reel__poster ? (
                                            <img
                                                src={`${BaseUrlReels}${like.reel__poster}`}
                                                alt="Reel"
                                                className="reel-card__image"
                                            />
                                        ) : (
                                            <div className="reel-card__placeholder">
                                                <BsPlayFill size={48} />
                                            </div>
                                        )}
                                        <div className="reel-card__overlay">
                                            <BsPlayFill size={48} className="play-icon" />
                                        </div>
                                        <div className="reel-card__like-badge">
                                            <BsHeartFill size={16} />
                                        </div>
                                    </div>
                                    <div className="reel-card__content">
                                        <p className="reel-card__time">{formatDate(like.created_at)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="likes-comments__list">
                        {comments.length === 0 ? (
                            <div className="likes-comments__empty">
                                <BsChat size={48} />
                                <p>Hali izohlar yo'q</p>
                            </div>
                        ) : (
                            comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="likes-comments__item comment-item"
                                    onClick={() => handleCommentClick(comment.reel_id)}
                                >
                                    <div className="item__icon">
                                        <BsChatFill size={24} />
                                    </div>
                                    <div className="item__content">
                                        <p className="item__title">{comment.text}</p>
                                        <p className="item__subtitle">Reel #{comment.reel_id}</p>
                                        <p className="item__time">{formatDate(comment.created_at)}</p>
                                    </div>
                                    <div className="item__arrow">→</div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <ReelViewModal
                    reel={selectedReel}
                    loading={!reelDetail}
                    onClose={() => {
                        setShowModal(false)
                        setSelectedReel(null)
                        setReelDetail(null)
                    }}
                />
            )}
        </div>
    )
}

export default UserLikesComments
