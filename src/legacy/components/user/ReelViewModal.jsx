import { useState, useRef, useEffect } from "react"
import { BaseUrlReels } from "../../api/apiService"
import { getReelComments, addReelComment } from "../../api/apiUserProfile"
import { toggleLikeReel } from "../../api/apiReels"
import Hls from "hls.js"
import {
    BsX,
    BsPlayFill,
    BsPauseFill,
    BsVolumeUp,
    BsVolumeMute,
    BsHeart,
    BsHeartFill,
    BsChat,
    BsChatFill,
    BsSend,
} from "react-icons/bs"

const ReelViewModal = ({ reel, loading, onClose }) => {
    const videoRef = useRef(null)
    const hlsRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [showComments, setShowComments] = useState(false)
    const [comments, setComments] = useState([])
    const [commentText, setCommentText] = useState("")
    const [loadingComments, setLoadingComments] = useState(false)

    useEffect(() => {
        if (!reel || !reel.hls_playlist_url) return

        setIsLiked(!!reel.liked)
        setLikesCount(reel.likes || 0)

        const video = videoRef.current
        if (!video) return

        const hlsUrl = `${BaseUrlReels}${reel.hls_playlist_url}`

        if (Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            })
            hlsRef.current = hls

            hls.loadSource(hlsUrl)
            hls.attachMedia(video)

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("HLS manifest parsed")
                video.play()
                setIsPlaying(true)
            })

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS error:", data)
            })
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = hlsUrl
            video.play()
            setIsPlaying(true)
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy()
            }
        }
    }, [reel])

    const togglePlay = () => {
        const video = videoRef.current
        if (!video) return

        if (isPlaying) {
            video.pause()
        } else {
            video.play()
        }
        setIsPlaying(!isPlaying)
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return

        video.muted = !isMuted
        setIsMuted(!isMuted)
    }

    const handleLike = async () => {
        if (!reel) return
        
        try {
            const response = await toggleLikeReel(reel.id)
            setIsLiked(response.message === "Liked")
            setLikesCount(response.likes_count || 0)
        } catch (error) {
            console.error("Like error:", error)
        }
    }

    const handleCommentClick = async () => {
        if (!showComments && comments.length === 0) {
            await fetchComments()
        }
        setShowComments(!showComments)
    }

    const fetchComments = async () => {
        if (!reel) return
        
        try {
            setLoadingComments(true)
            const data = await getReelComments(reel.id)
            // API response: { count, next, previous, results: [...] }
            const commentsList = data.results || data.comments || []
            setComments(commentsList)
            console.log("Comments fetched:", commentsList)
        } catch (error) {
            console.error("Fetch comments error:", error)
        } finally {
            setLoadingComments(false)
        }
    }

    const handleSendComment = async () => {
        if (!commentText.trim() || !reel) return
        
        try {
            const response = await addReelComment(reel.id, commentText)
            // Response: { id, user, text, created_at, replies }
            const newComment = response.results ? response.results[0] : response
            setComments([newComment, ...comments])
            setCommentText("")
            console.log("Comment added:", newComment)
        } catch (error) {
            console.error("Send comment error:", error)
        }
    }

    const formatCount = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
        return count
    }

    if (loading) {
        return (
            <div className="user-reel-view-modal">
                <div className="user-reel-view-modal__backdrop" onClick={onClose}></div>
                <div className="user-reel-view-modal__content">
                    <div className="user-reel-view-modal__loading">
                        <div className="spinner"></div>
                        <p>Yuklanmoqda...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!reel) return null

    return (
        <div className="user-reel-view-modal">
            <div className="user-reel-view-modal__backdrop" onClick={onClose}></div>
            <div className="user-reel-view-modal__content">
                <button className="user-reel-view-modal__close" onClick={onClose}>
                    <BsX size={32} />
                </button>

                <div className="user-reel-view-modal__video-wrapper">
                    <video
                        ref={videoRef}
                        className="user-reel-view-modal__video"
                        onClick={togglePlay}
                        playsInline
                        loop
                    />

                    {/* Play/Pause overlay */}
                    <div className="user-reel-view-modal__play-overlay" onClick={togglePlay}>
                        {!isPlaying && <BsPlayFill size={64} />}
                    </div>

                    {/* Mute button */}
                    <button className="user-reel-view-modal__mute-btn" onClick={toggleMute}>
                        {isMuted ? <BsVolumeMute size={24} /> : <BsVolumeUp size={24} />}
                    </button>

                    {/* Info overlay */}
                    <div className="user-reel-view-modal__info-overlay">
                        <h3 className="reel-title">{reel.title}</h3>
                        {reel.caption && <p className="reel-caption">{reel.caption}</p>}
                    </div>

                    {/* Action buttons */}
                    <div className="user-reel-view-modal__actions">
                        <button 
                            className={`action-btn ${isLiked ? 'liked' : ''}`}
                            onClick={handleLike}
                        >
                            {isLiked ? <BsHeartFill size={28} /> : <BsHeart size={28} />}
                            <span>{formatCount(likesCount)}</span>
                        </button>

                        <button 
                            className={`action-btn ${showComments ? 'active' : ''}`}
                            onClick={handleCommentClick}
                        >
                            {showComments ? <BsChatFill size={28} /> : <BsChat size={28} />}
                            <span>{formatCount(comments.length)}</span>
                        </button>
                    </div>
                </div>

                {/* Comments section */}
                {showComments && (
                    <div className="user-reel-view-modal__comments">
                        <div className="comments-header">
                            <h3>Izohlar</h3>
                            <button onClick={() => setShowComments(false)}>
                                <BsX size={24} />
                            </button>
                        </div>

                        <div className="comments-list">
                            {loadingComments ? (
                                <div className="comments-loading">
                                    <div className="spinner"></div>
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="comments-empty">
                                    <BsChat size={48} />
                                    <p>Hali izohlar yo'q</p>
                                </div>
                            ) : (
                                comments.map((comment, index) => (
                                    <div key={index} className="comment-item">
                                        <div className="comment-avatar">
                                            {comment.user?.avatar ? (
                                                <img src={`${BaseUrlReels}${comment.user.avatar}`} alt={comment.user.full_name} />
                                            ) : (
                                                <div className="avatar-placeholder">{comment.user?.full_name?.[0] || 'U'}</div>
                                            )}
                                        </div>
                                        <div className="comment-content">
                                            <div className="comment-header">
                                                <span className="comment-author">{comment.user?.full_name || 'User'}</span>
                                                <span className="comment-time">{comment.created_at}</span>
                                            </div>
                                            <p className="comment-text">{comment.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="comments-input">
                            <input
                                type="text"
                                placeholder="Izoh yozing..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendComment()}
                            />
                            <button onClick={handleSendComment} disabled={!commentText.trim()}>
                                <BsSend size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReelViewModal
