import { useState, useRef, useEffect } from "react"
import {
    BsX,
    BsHeart,
    BsHeartFill,
    BsReply,
    BsThreeDotsVertical,
    BsEmojiSmile,
    BsSend,
    BsPin,
    BsFlag,
    BsTrash,
} from "react-icons/bs"
import { fetchComments, postComment, buildMediaUrl } from "../../api/apiComent"
import { toggleLikeReel } from "../../api/apiReels"
import { useNavigate } from "react-router-dom"

const ReelsComment = ({ reel, isOpen, onClose }) => {
    const navigate = useNavigate()
    const [comments, setComments] = useState([])
    const [nextUrl, setNextUrl] = useState(null)
    const [loading, setLoading] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [replyingTo, setReplyingTo] = useState(null)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const commentInputRef = useRef(null)
    const commentsContainerRef = useRef(null)


    // Load initial comments when opened or reel changes
    useEffect(() => {
        if (!isOpen || !reel?.id) return
        setComments([])
        setNextUrl(null)
        setLoading(true)
        fetchComments(reel.id)
            .then((data) => {
                setComments(data.results || [])
                setNextUrl(data.next || null)
            })
            .finally(() => setLoading(false))
    }, [isOpen, reel?.id])


    // Focus input on open
    useEffect(() => {
        if (isOpen && commentInputRef.current) {
            setTimeout(() => {
                commentInputRef.current.focus()
            }, 300)
        }
    }, [isOpen])

    // Infinite scroll
    useEffect(() => {
        const el = commentsContainerRef.current
        if (!el) return
        const onScroll = () => {
            if (!nextUrl || loading) return
            const threshold = 120
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - threshold) {
                setLoading(true)
                fetchComments(reel.id, nextUrl)
                    .then((data) => {
                        setComments((prev) => [...prev, ...(data.results || [])])
                        setNextUrl(data.next || null)
                    })
                    .finally(() => setLoading(false))
            }
        }
        el.addEventListener("scroll", onScroll)
        return () => el.removeEventListener("scroll", onScroll)
    }, [nextUrl, loading, reel?.id])

    const ensureAuthOrRedirect = () => {
        const access = localStorage.getItem("access")
        if (!access) {
            navigate("/login")
            return false
        }
        return true
    }

  

    const handleSubmitComment = async () => {
        if (!newComment.trim()) return
        if (!ensureAuthOrRedirect()) return
        try {
            const body = replyingTo ? { text: newComment, parent_id: replyingTo } : { text: newComment }
            const created = await postComment(reel.id, body)
            if (replyingTo) {
                setComments((prev) => prev.map((c) => (c.id === replyingTo ? { ...c, replies: [...(c.replies || []), created] } : c)))
                setReplyingTo(null)
            } else {
                setComments((prev) => [created, ...prev])
            }
            setNewComment("")
        } catch (err) {
            if (err?.code === "UNAUTHORIZED") navigate("/login")
        }
    }

    const handleReply = (commentId) => {
        setReplyingTo(commentId)
        commentInputRef.current?.focus()
    }

    const emojis = ["😀", "😂", "😍", "🥰", "😎", "🤔", "👍", "👏", "🔥", "❤️", "💯", "🚀"]

    if (!isOpen) return null

    return (
        <div className="reels-comment-overlay">
            <div className="reels-comment">
                <div className="reels-comment__header">
                    <h3 className="reels-comment__title">Izohlar ({reel?.comments_count ?? comments.length})</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        
                        <button className="reels-comment__close" onClick={onClose}>
                            <BsX size={24} />
                        </button>
                    </div>
                </div>

                <div className="reels-comment__content" ref={commentsContainerRef}>
                    {comments.map((comment) => (
                        <div key={comment.id} className="comment">
                            <div className="comment__main">
                                <img
                                    src={buildMediaUrl(comment.user.avatar)}
                                    alt={comment.user.username || comment.user.name}
                                    className="comment__avatar"
                                />
                                <div className="comment__content">
                                    <div className="comment__header">
                                        <span className="comment__name">
                                            {comment.user.username || comment.user.name}
                                        </span>
                                        <span className="comment__timestamp">{new Date(comment.created_at || Date.now()).toLocaleString()}</span>
                                    </div>
                                    <p className="comment__text">{comment.text}</p>
                                    <div className="comment__actions">
                                        <button className="comment__action" onClick={() => handleReply(comment.id)}>
                                            <BsReply size={14} />
                                            <span>Javob berish</span>
                                        </button>
                                        <button className="comment__action">
                                            <BsThreeDotsVertical size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {comment.replies && comment.replies.length > 0 && (
                                <div className="comment__replies">
                                    {comment.replies.map((reply) => (
                                        <div key={reply.id} className="comment comment--reply">
                                            <div className="comment__main">
                                                <img
                                                    src={buildMediaUrl(reply.user.avatar)}
                                                    alt={reply.user.username || reply.user.name}
                                                    className="comment__avatar"
                                                />
                                                <div className="comment__content">
                                                    <div className="comment__header">
                                                        <span className="comment__name">
                                                            {reply.user.username || reply.user.name}
                                                        </span>
                                                        <span className="comment__timestamp">{new Date(reply.created_at || Date.now()).toLocaleString()}</span>
                                                    </div>
                                                    <p className="comment__text">{reply.text}</p>
                                                    <div className="comment__actions">
                                                        <button className="comment__action" onClick={() => handleReply(comment.id)}>
                                                            <BsReply size={14} />
                                                            <span>Javob berish</span>
                                                        </button>
                                                        <button className="comment__action">
                                                            <BsThreeDotsVertical size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-secondary)' }}>Yuklanmoqda...</div>}
                </div>

                <div className="reels-comment__input-container">
                    {replyingTo && (
                        <div className="reels-comment__reply-indicator">
                            <span>Javob berilmoqda...</span>
                            <button onClick={() => setReplyingTo(null)}>
                                <BsX size={16} />
                            </button>
                        </div>
                    )}

                    {showEmojiPicker && (
                        <div className="reels-comment__emoji-picker">
                            {emojis.map((emoji, index) => (
                                <button
                                    key={index}
                                    className="emoji-btn"
                                    onClick={() => {
                                        setNewComment((prev) => prev + emoji)
                                        setShowEmojiPicker(false)
                                        commentInputRef.current?.focus()
                                    }}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="reels-comment__input-wrapper">
                        <img
                            src={buildMediaUrl(reel?.author?.avatar) || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"}
                            alt="Your avatar"
                            className="reels-comment__user-avatar"
                        />
                        <div className="reels-comment__input-group">
                            <input
                                ref={commentInputRef}
                                type="text"
                                placeholder="Izoh yozing..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSubmitComment()}
                                className="reels-comment__input"
                            />
                            <div className="reels-comment__input-actions">
                                <button
                                    className="reels-comment__emoji-btn"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                    <BsEmojiSmile size={20} />
                                </button>
                                <button
                                    className="reels-comment__send-btn"
                                    onClick={handleSubmitComment}
                                    disabled={!newComment.trim()}
                                >
                                    <BsSend size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReelsComment