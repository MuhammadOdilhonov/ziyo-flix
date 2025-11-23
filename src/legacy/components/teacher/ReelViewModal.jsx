import React, { useState, useEffect, useRef } from 'react'
import Hls from 'hls.js'
import { FiX, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiHeart, FiMessageCircle, FiSend, FiEye, FiCalendar, FiMoreVertical, FiCornerDownRight, FiShare2, FiRepeat, FiTrash2, FiFlag, FiEdit3, FiCopy } from 'react-icons/fi'
import { BaseUrlReels } from '../../api/apiService'
import apiService from '../../api/apiService'

const ReelViewModal = ({ isOpen, onClose, reelData, channelSlug }) => {
    // Helper function for date formatting
    const formatDate = (dateString) => {
        if (!dateString) return 'Unknown'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const videoRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Comments state
    const [comments, setComments] = useState([])
    const [commentsLoading, setCommentsLoading] = useState(false)
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState(null)
    const [replyText, setReplyText] = useState('')
    const [showComments, setShowComments] = useState(false)
    const [activeModal, setActiveModal] = useState(null)
    const [commentMenuOpen, setCommentMenuOpen] = useState(null)
    const [likedComments, setLikedComments] = useState(new Set())
    const [expandedReplies, setExpandedReplies] = useState(new Set())

    useEffect(() => {
        if (isOpen && reelData?.reel?.id) {
            fetchComments()
        }
    }, [isOpen, reelData?.reel?.id])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (commentMenuOpen && !event.target.closest('.menu-container')) {
                setCommentMenuOpen(null)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [commentMenuOpen])

    // Video URL setup
    const videoUrl = reelData?.reel?.hls_playlist_url
        ? `${BaseUrlReels}${reelData.reel.hls_playlist_url}`
        : null

    console.log('Video URL:', videoUrl)
    console.log('Reel data:', reelData)

    // HLS setup va auto-play
    useEffect(() => {
        const video = videoRef.current
        if (!video || !videoUrl) return

        let hls = null

        const setupVideo = () => {
            if (videoUrl.includes('.m3u8')) {
                if (Hls.isSupported()) {
                    hls = new Hls({
                        maxBufferLength: 60,
                        maxMaxBufferLength: 120,
                        autoStartLoad: true,
                    })

                    hls.loadSource(videoUrl)
                    hls.attachMedia(video)

                    hls.on(Hls.Events.MANIFEST_PARSED, () => {
                        console.log('HLS manifest parsed successfully')
                        video.play().then(() => {
                            setIsPlaying(true)
                        }).catch(error => {
                            console.log('Auto-play prevented:', error)
                        })
                    })

                    hls.on(Hls.Events.ERROR, (event, data) => {
                        console.error('HLS error:', data)
                    })
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = videoUrl
                    video.addEventListener('loadedmetadata', () => {
                        video.play().then(() => {
                            setIsPlaying(true)
                        }).catch(error => {
                            console.log('Auto-play prevented:', error)
                        })
                    })
                }
            } else {
                video.src = videoUrl
                video.addEventListener('loadedmetadata', () => {
                    video.play().then(() => {
                        setIsPlaying(true)
                    }).catch(error => {
                        console.log('Auto-play prevented:', error)
                    })
                })
            }
        }

        setupVideo()

        return () => {
            if (hls) {
                hls.destroy()
            }
        }
    }, [videoUrl])

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const fetchComments = async () => {
        try {
            setCommentsLoading(true)
            const response = await apiService.get(`/reel/${reelData.reel.id}/comments/`)
            setComments(response.data.results || [])
        } catch (error) {
            console.error('Error fetching comments:', error)
        } finally {
            setCommentsLoading(false)
        }
    }

    const handlePlay = () => {
        const video = videoRef.current
        if (!video) return

        if (isPlaying) {
            video.pause()
            setIsPlaying(false)
        } else {
            video.play().then(() => {
                setIsPlaying(true)
            }).catch(error => {
                console.error('Play error:', error)
            })
        }
    }

    const handleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value)
        setVolume(newVolume)
        if (videoRef.current) {
            videoRef.current.volume = newVolume
            setIsMuted(newVolume === 0)
        }
    }

    const handleSkipForward = () => {
        const video = videoRef.current
        if (!video) return
        video.currentTime = Math.min(video.currentTime + 10, video.duration)
    }

    const handleSkipBackward = () => {
        const video = videoRef.current
        if (!video) return
        video.currentTime = Math.max(video.currentTime - 10, 0)
    }

    const toggleFullscreen = () => {
        const video = videoRef.current
        if (!video) return

        if (!isFullscreen) {
            if (video.requestFullscreen) {
                video.requestFullscreen()
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen()
            }
            setIsFullscreen(true)
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            }
            setIsFullscreen(false)
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration)
        }
    }

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const newTime = (clickX / rect.width) * duration

        if (videoRef.current) {
            videoRef.current.currentTime = newTime
            setCurrentTime(newTime)
        }
    }

    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        try {
            await apiService.post(`/reel/${reelData.reel.id}/comments/`, {
                text: newComment.trim()
            })
            setNewComment('')
            fetchComments()
        } catch (error) {
            console.error('Error posting comment:', error)
        }
    }

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault()
        if (!replyText.trim()) return

        try {
            await apiService.post(`/reel/${reelData.reel.id}/comments/`, {
                text: replyText.trim(),
                parent_id: commentId
            })
            setReplyText('')
            setReplyingTo(null)
            fetchComments()
        } catch (error) {
            console.error('Error posting reply:', error)
        }
    }

    const handleLikeComment = async (commentId) => {
        try {
            const isLiked = likedComments.has(commentId)
            
            if (isLiked) {
                await apiService.delete(`/reel/${reelData.reel.id}/comments/${commentId}/like/`)
                setLikedComments(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(commentId)
                    return newSet
                })
            } else {
                await apiService.post(`/reel/${reelData.reel.id}/comments/${commentId}/like/`)
                setLikedComments(prev => new Set(prev).add(commentId))
            }
            
            fetchComments() // Refresh to get updated like count
        } catch (error) {
            console.error('Error liking comment:', error)
        }
    }

    const handleDeleteComment = async (commentId) => {
        // Professional confirmation dialog
        const confirmDelete = window.confirm(
            '⚠️ Izohni o\'chirish\n\n' +
            'Haqiqatan ham bu izohni o\'chirmoqchimisiz?\n' +
            'Bu amal qaytarib bo\'lmaydi.'
        )
        
        if (!confirmDelete) {
            return
        }

        try {
            // Show loading state
            setCommentMenuOpen(null)
            
            await apiService.delete(`/reel/${reelData.reel.id}/comments/${commentId}/`)
            
            // Success feedback
            const successMessage = '✅ Izoh muvaffaqiyatli o\'chirildi'
            
            // Create temporary success notification
            const notification = document.createElement('div')
            notification.textContent = successMessage
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 500;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            `
            document.body.appendChild(notification)
            
            setTimeout(() => {
                notification.remove()
            }, 3000)
            
            fetchComments() // Refresh comments
        } catch (error) {
            console.error('Error deleting comment:', error)
            
            // Error feedback
            const errorMessage = '❌ Izohni o\'chirishda xatolik yuz berdi'
            
            const notification = document.createElement('div')
            notification.textContent = errorMessage
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: 500;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            `
            document.body.appendChild(notification)
            
            setTimeout(() => {
                notification.remove()
            }, 3000)
        }
    }

    const handleReportComment = async (commentId) => {
        try {
            await apiService.post(`/reel/${reelData.reel.id}/comments/${commentId}/report/`, {
                reason: 'inappropriate_content'
            })
            alert('Izoh muvaffaqiyatli shikoyat qilindi')
            setCommentMenuOpen(null)
        } catch (error) {
            console.error('Error reporting comment:', error)
            alert('Shikoyat yuborishda xatolik yuz berdi')
        }
    }

    const handleCopyComment = (commentText) => {
        navigator.clipboard.writeText(commentText).then(() => {
            alert('Izoh nusxalandi')
            setCommentMenuOpen(null)
        }).catch(() => {
            alert('Nusxalashda xatolik yuz berdi')
        })
    }

    const toggleReplies = (commentId) => {
        setExpandedReplies(prev => {
            const newSet = new Set(prev)
            if (newSet.has(commentId)) {
                newSet.delete(commentId)
            } else {
                newSet.add(commentId)
            }
            return newSet
        })
    }

    const renderComment = (comment, isReply = false) => (
        <div key={comment.id} className={`comment-item ${isReply ? 'reply' : ''}`}>
            <div className="comment-card">
                <div className="comment-header">
                    <div className="comment-avatar">
                        <img
                            src={comment.user.avatar ? `${BaseUrlReels}${comment.user.avatar}` : '/default-avatar.png'}
                            alt={comment.user.username}
                        />
                        {!isReply && <div className="avatar-badge"></div>}
                    </div>
                    <div className="comment-info">
                        <div className="comment-username">
                            {comment.user.username}
                            {comment.user.is_verified && <span className="verified-badge">✓</span>}
                        </div>
                        <div className="comment-time">{formatDate(comment.created_at)}</div>
                    </div>
                    <div className="comment-actions">
                        <button 
                            className={`action-btn like-btn ${likedComments.has(comment.id) ? 'liked' : ''}`}
                            onClick={() => handleLikeComment(comment.id)}
                            title="Like"
                        >
                            <FiHeart />
                            <span className="action-count">{comment.likes_count || 0}</span>
                        </button>
                        <div className="menu-container">
                            <button 
                                className="action-btn menu-btn" 
                                onClick={() => setCommentMenuOpen(commentMenuOpen === comment.id ? null : comment.id)}
                                title="More options"
                            >
                                <FiMoreVertical />
                            </button>
                            {commentMenuOpen === comment.id && (
                                <div className="comment-dropdown-menu">
                                    <button 
                                        className="menu-item copy-item"
                                        onClick={() => handleCopyComment(comment.text)}
                                    >
                                        <FiCopy />
                                        <span>Nusxalash</span>
                                    </button>
                                    <button 
                                        className="menu-item report-item"
                                        onClick={() => handleReportComment(comment.id)}
                                    >
                                        <FiFlag />
                                        <span>Shikoyat qilish</span>
                                    </button>
                                    <div className="menu-divider"></div>
                                    <button 
                                        className="menu-item edit-item"
                                        onClick={() => console.log('Edit comment:', comment.id)}
                                    >
                                        <FiEdit3 />
                                        <span>Tahrirlash</span>
                                    </button>
                                    <button 
                                        className="menu-item delete-item"
                                        onClick={() => handleDeleteComment(comment.id)}
                                    >
                                        <FiTrash2 />
                                        <span>O'chirish</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="comment-text">{comment.text}</div>

                <div className="comment-footer">
                    <div className="comment-interactions">
                        <button
                            className={`interaction-btn like-interaction ${likedComments.has(comment.id) ? 'liked' : ''}`}
                            onClick={() => handleLikeComment(comment.id)}
                        >
                            <FiHeart />
                            <span>Like</span>
                        </button>
                        <button
                            className={`interaction-btn reply-interaction ${replyingTo === comment.id ? 'active' : ''}`}
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        >
                            <span>{replyingTo === comment.id ? 'Bekor qilish' : 'Javob berish'}</span>
                        </button>
                        {comment.likes_count > 0 && (
                            <span className="likes-count">{comment.likes_count} like</span>
                        )}
                        {comment.replies && comment.replies.length > 0 && !isReply && (
                            <button 
                                className={`view-replies-btn ${expandedReplies.has(comment.id) ? 'expanded' : ''}`}
                                onClick={() => toggleReplies(comment.id)}
                            >
                                {expandedReplies.has(comment.id) 
                                    ? `${comment.replies.length} javobni yashirish` 
                                    : `${comment.replies.length} javobni ko'rish`
                                }
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {replyingTo === comment.id && (
                <div className="reply-form">
                    <div className="reply-form-container">
                        <div className="reply-avatar">
                            <img src="/default-avatar.png" alt="You" />
                        </div>
                        <div className="reply-input-container">
                            <input
                                type="text"
                                placeholder="Javob yozing..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && replyText.trim()) {
                                        handleReplySubmit(e, comment.id)
                                    }
                                }}
                                autoFocus
                            />
                            <div className="reply-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => {
                                        setReplyingTo(null)
                                        setReplyText('')
                                    }}
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="button"
                                    className="submit-btn"
                                    onClick={(e) => handleReplySubmit(e, comment.id)}
                                    disabled={!replyText.trim()}
                                >
                                    <FiSend />
                                    <span>Yuborish</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {comment.replies && comment.replies.length > 0 && expandedReplies.has(comment.id) && (
                <div className="replies">
                    <div className="replies-header">
                        <div className="replies-line"></div>
                        <span className="replies-count">{comment.replies.length} javob</span>
                    </div>
                    <div className="replies-list">
                        {comment.replies.map(reply => renderComment(reply, true))}
                    </div>
                </div>
            )}
        </div>
    )

    if (!isOpen || !reelData) return null

    return (
        <>
            <div className="teacher-reel-view-modal-overlay" onClick={onClose}>
                <div className="teacher-reel-view-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <div className="header-content">
                            <div className="reel-icon">
                                <FiPlay />
                            </div>
                            <div className="header-info">
                                <h2>{reelData.reel.title}</h2>
                                <div className="channel-info">
                                    <span className="channel-name">{reelData.channel.title}</span>
                                    <span className="channel-badge">Verified</span>
                                </div>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="action-btn">
                                <FiHeart />
                            </button>
                            <button className="action-btn">
                                <FiMoreVertical />
                            </button>
                            <button className="action-btn close-btn" onClick={onClose}>
                                <FiX />
                            </button>
                        </div>
                    </div>

                    <div className="modal-body">
                        {/* Left Statistics Panel */}
                        <div className="left-statistics">
                            <div className="stat-button" onClick={() => setActiveModal('likes')}>
                                <div className="stat-icon">
                                    <FiHeart />
                                </div>
                                <span className="stat-number">{reelData?.reel?.likes_count || 0}</span>
                                <span className="stat-text">Likes</span>
                            </div>

                            <div className="stat-button" onClick={() => setActiveModal('views')}>
                                <div className="stat-icon">
                                    <FiEye />
                                </div>
                                <span className="stat-number">{reelData?.reel?.views_count || 0}</span>
                                <span className="stat-text">Views</span>
                            </div>

                            <div className="stat-button" onClick={() => setActiveModal('comments')}>
                                <div className="stat-icon">
                                    <FiMessageCircle />
                                </div>
                                <span className="stat-number">{comments.length}</span>
                                <span className="stat-text">Comments</span>
                            </div>

                            <div className="stat-button" onClick={() => setActiveModal('info')}>
                                <div className="stat-icon">
                                    <FiCalendar />
                                </div>
                                <span className="stat-text">Created</span>
                            </div>

                            <div className="stat-button" onClick={() => setActiveModal('menu')}>
                                <div className="stat-icon">
                                    <FiMoreVertical />
                                </div>
                                <span className="stat-text">Menu</span>
                            </div>
                        </div>

                        {/* Main Video Section */}
                        <div className="main-video-section">
                            <div className="video-container">
                                {videoUrl ? (
                                    <div className="video-player">
                                        <video
                                            ref={videoRef}
                                            onTimeUpdate={handleTimeUpdate}
                                            onLoadedMetadata={handleLoadedMetadata}
                                            onPlay={() => setIsPlaying(true)}
                                            onPause={() => setIsPlaying(false)}
                                            onClick={handlePlay}
                                            className="video-element"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                aspectRatio: '9/16'
                                            }}
                                            controls={false}
                                            playsInline
                                            muted={isMuted}
                                            loop
                                            autoPlay
                                        >
                                            <p>Sizning brauzeringiz video formatini qo'llab-quvvatlamaydi.</p>
                                        </video>

                                        <div className="video-overlay">
                                            {!isPlaying && (
                                                <div className="center-play-btn" onClick={handlePlay}>
                                                    <FiPlay />
                                                </div>
                                            )}

                                            <div className="top-controls">
                                                <div className="volume-controls">
                                                    <button className="control-btn" onClick={handleMute}>
                                                        {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                                                    </button>
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1"
                                                        step="0.1"
                                                        value={isMuted ? 0 : volume}
                                                        onChange={handleVolumeChange}
                                                        className="volume-slider"
                                                    />
                                                </div>
                                                <button className="control-btn" onClick={toggleFullscreen}>
                                                    <FiMaximize />
                                                </button>
                                            </div>

                                            <div className="bottom-controls">
                                                <div className="playback-controls">
                                                    <button className="control-btn skip-btn" onClick={handleSkipBackward} title="10 soniya orqaga">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
                                                            <text x="12" y="15" fontSize="8" textAnchor="middle" fill="white">10</text>
                                                        </svg>
                                                    </button>

                                                    <button className="control-btn play-btn" onClick={handlePlay}>
                                                        {isPlaying ? <FiPause /> : <FiPlay />}
                                                    </button>

                                                    <button className="control-btn skip-btn" onClick={handleSkipForward} title="10 soniya oldinga">
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12.01 19V23l5-5-5-5v4c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6h2c0-4.42-3.58-8-8-8s-8 3.58-8 8 3.58 8 8 8z" />
                                                            <text x="12" y="15" fontSize="8" textAnchor="middle" fill="white">10</text>
                                                        </svg>
                                                    </button>
                                                </div>

                                                <div className="progress-container">
                                                    <div className="progress-bar" onClick={handleSeek}>
                                                        <div
                                                            className="progress-fill"
                                                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                                        />
                                                        <div
                                                            className="progress-handle"
                                                            style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                <span className="time-display">
                                                    {formatTime(currentTime)} / {formatTime(duration)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="no-video">
                                        <div className="no-video-content">
                                            <FiPlay className="no-video-icon" />
                                            <h3>Video mavjud emas</h3>
                                            <p>Bu reel uchun video fayl topilmadi yoki yuklanmagan</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Comments Section */}
                        <div className="comments-section">
                            <div className="comments-header">
                                <div className="header-content">
                                    <div className="comments-icon">
                                        <FiMessageCircle />
                                    </div>
                                    <h4>Izohlar ({comments.length})</h4>
                                </div>
                            </div>

                            <div className="comment-form">
                                <form onSubmit={handleCommentSubmit} className="form-container">
                                    <input
                                        type="text"
                                        placeholder="Izoh yozing..."
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button type="submit" disabled={!newComment.trim()}>
                                        <FiSend />
                                    </button>
                                </form>
                            </div>

                            <div className="comments-list">
                                {commentsLoading ? (
                                    <div className="comments-loading">
                                        <div className="spinner"></div>
                                        <p>Izohlar yuklanmoqda...</p>
                                    </div>
                                ) : comments.length === 0 ? (
                                    <div className="empty-comments">
                                        <div className="empty-icon">
                                            <FiMessageCircle />
                                        </div>
                                        <h3>Hali izohlar yo'q</h3>
                                        <p>Birinchi bo'lib izoh qoldiring!</p>
                                    </div>
                                ) : (
                                    comments.map(comment => renderComment(comment))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Modals */}
            {activeModal && (
                <div className="stats-modal-overlay" onClick={() => setActiveModal(null)}>
                    <div className="stats-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="stats-modal-header">
                            <h3>
                                {activeModal === 'likes' && 'Likes'}
                                {activeModal === 'views' && 'Views'}
                                {activeModal === 'comments' && 'Comments'}
                                {activeModal === 'info' && 'Reel Information'}
                                {activeModal === 'menu' && 'Menu Options'}
                            </h3>
                            <button className="close-stats-modal" onClick={() => setActiveModal(null)}>
                                <FiX />
                            </button>
                        </div>

                        <div className="stats-modal-content">
                            {activeModal === 'likes' && (
                                <div className="likes-content">
                                    <div className="stat-display">
                                        <FiHeart className="stat-icon-large" />
                                        <h2>{reelData?.reel?.likes_count || 0}</h2>
                                        <p>People liked this reel</p>
                                    </div>
                                    <div className="action-buttons">
                                        <button className="action-btn primary">
                                            <FiHeart /> Like This Reel
                                        </button>
                                        <button className="action-btn secondary">
                                            <FiShare2 /> Share
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'views' && (
                                <div className="views-content">
                                    <div className="stat-display">
                                        <FiEye className="stat-icon-large" />
                                        <h2>{reelData?.reel?.views_count || 0}</h2>
                                        <p>Total views on this reel</p>
                                    </div>
                                    <div className="view-details">
                                        <div className="detail-item">
                                            <span>Today:</span>
                                            <span>{Math.floor((reelData?.reel?.views_count || 0) * 0.1)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span>This week:</span>
                                            <span>{Math.floor((reelData?.reel?.views_count || 0) * 0.3)}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span>This month:</span>
                                            <span>{Math.floor((reelData?.reel?.views_count || 0) * 0.7)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'comments' && (
                                <div className="comments-content">
                                    <div className="stat-display">
                                        <FiMessageCircle className="stat-icon-large" />
                                        <h2>{comments.length}</h2>
                                        <p>Comments on this reel</p>
                                    </div>
                                    <div className="comments-preview">
                                        {comments.slice(0, 3).map((comment, index) => (
                                            <div key={index} className="comment-preview">
                                                <div className="comment-avatar">
                                                    <img
                                                        src={comment.user?.avatar ? `${BaseUrlReels}${comment.user.avatar}` : '/default-avatar.png'}
                                                        alt={comment.user?.username || 'User'}
                                                    />
                                                </div>
                                                <div className="comment-content">
                                                    <strong>{comment.user?.username || 'Anonymous'}</strong>
                                                    <p>{comment.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="action-btn primary" onClick={() => { setActiveModal(null); setShowComments(true) }}>
                                        <FiMessageCircle /> View All Comments
                                    </button>
                                </div>
                            )}

                            {activeModal === 'info' && (
                                <div className="info-content">
                                    <div className="info-grid">
                                        <div className="info-item">
                                            <FiCalendar className="info-icon" />
                                            <div>
                                                <strong>Created</strong>
                                                <p>{formatDate(reelData?.reel?.created_at)}</p>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <FiEye className="info-icon" />
                                            <div>
                                                <strong>Views</strong>
                                                <p>{reelData?.reel?.views_count || 0}</p>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <FiHeart className="info-icon" />
                                            <div>
                                                <strong>Likes</strong>
                                                <p>{reelData?.reel?.likes_count || 0}</p>
                                            </div>
                                        </div>
                                        <div className="info-item">
                                            <FiMessageCircle className="info-icon" />
                                            <div>
                                                <strong>Comments</strong>
                                                <p>{comments.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="reel-description">
                                        <h4>Description</h4>
                                        <p>{reelData?.reel?.caption || 'No description available'}</p>
                                    </div>
                                </div>
                            )}

                            {activeModal === 'menu' && (
                                <div className="menu-content">
                                    <div className="menu-items">
                                        <button className="menu-item">
                                            <FiShare2 className="menu-icon" />
                                            <span>Share Reel</span>
                                        </button>
                                        <button className="menu-item">
                                            <FiRepeat className="menu-icon" />
                                            <span>Repost</span>
                                        </button>
                                        <button className="menu-item">
                                            <FiHeart className="menu-icon" />
                                            <span>Add to Favorites</span>
                                        </button>
                                        <button className="menu-item">
                                            <FiEye className="menu-icon" />
                                            <span>View Analytics</span>
                                        </button>
                                        <button className="menu-item danger">
                                            <FiX className="menu-icon" />
                                            <span>Report Content</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ReelViewModal