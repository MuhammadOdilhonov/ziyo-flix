import { useState, useRef, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import Hls from "hls.js"
import { getRandomFeed, buildHlsUrl, toggleLikeReel, toggleSaveReel, reportReel } from "../../api/apiReels"
import {
    BsHeart,
    BsHeartFill,
    BsChat,
    BsShare,
    BsThreeDotsVertical,
    BsPlayFill,
    BsPauseFill,
    BsVolumeUp,
    BsVolumeMute,
    BsBookmark,
    BsBookmarkFill,
    BsCopy,
    BsFlag,
    BsStar,
} from "react-icons/bs"
import ReelsComment from "./ReelsComment"
import Skeleton from "../common/Skeleton"

const Reels = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [currentReelIndex, setCurrentReelIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)
    const [isMuted, setIsMuted] = useState(true) // Default muted for autoplay
    const [showContextMenu, setShowContextMenu] = useState(null)
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
    const [showComments, setShowComments] = useState(false)
    const [activeReelId, setActiveReelId] = useState(null)
    // Report modal state
    const [showReportModal, setShowReportModal] = useState(false)
    const [reportingReelId, setReportingReelId] = useState(null)
    const [reportReason, setReportReason] = useState("")
    const [reportLoading, setReportLoading] = useState(false)
    const [reportError, setReportError] = useState("")

    // Refs
    const videoRefs = useRef([])
    const hlsInstances = useRef([])
    const containerRef = useRef()
    const observerRef = useRef()
    const previousVideoIndex = useRef(-1)

    // Data state
    const [reelsData, setReelsData] = useState([])
    const [nextUrl, setNextUrl] = useState(null)
    const [seed, setSeed] = useState(() => {
        try {
            return localStorage.getItem("reels_seed") || null
        } catch (error) {
            console.error("localStorage access error:", error)
            return null
        }
    })
    const [isFetching, setIsFetching] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    // Debug logs
    const debugLog = (message, data) => {
        console.log(`[REELS DEBUG] ${message}`, data)
    }

    // URL o'zgarishlarini kuzatish
    useEffect(() => {
        const currentReel = reelsData[currentReelIndex]
        if (currentReel?.slug) {
            const newUrl = `/reels/${currentReel.slug}`
            if (location.pathname !== newUrl) {
                window.history.replaceState(null, "", newUrl)
            }
        }
    }, [currentReelIndex, reelsData, location.pathname])

    // HLS instance larni tozalash funksiyasi
    const cleanupHlsInstance = useCallback((index) => {
        if (hlsInstances.current[index]) {
            try {
                hlsInstances.current[index].destroy()
            } catch (error) {
                console.error("HLS cleanup error:", error)
            }
            hlsInstances.current[index] = null
        }
    }, [])

    // Video setup funksiyasi
    const setupVideo = useCallback((videoElement, hlsUrl, index, forceReload = false) => {
        if (!videoElement || !hlsUrl) return

        // Agar video allaqachon o'rnatilgan bo'lsa va qayta yuklash talab qilinmasa, o'tkazib yuborish
        if (!forceReload && hlsInstances.current[index] && videoElement.src) {
            return
        }

        // Eski HLS instance ni tozalash
        cleanupHlsInstance(index)

        if (Hls.isSupported()) {
            const hls = new Hls({
                debug: false,
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90,
                maxBufferLength: 30,
                maxMaxBufferLength: 60,
                maxBufferSize: 60 * 1000 * 1000,
                maxBufferHole: 0.1,
                autoStartLoad: false,
                startLevel: -1,
                capLevelToPlayerSize: true,
            })

            // Error handling
            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error(`HLS Error [${index}]:`, data)

                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            console.log('Network error, trying to recover...')
                            hls.startLoad()
                            break
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            console.log('Media error, trying to recover...')
                            hls.recoverMediaError()
                            break
                        default:
                            console.log('Fatal error, destroying HLS instance')
                            cleanupHlsInstance(index)
                            break
                    }
                }
            })

            // Media attached
            hls.on(Hls.Events.MEDIA_ATTACHED, () => {
                hls.loadSource(hlsUrl)
                hls.startLoad()
            })

            // Manifest parsed
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                debugLog(`Video ${index} manifest parsed`)

                // Video elementiga mute holatini o'rnatish
                videoElement.muted = isMuted

                // Agar bu joriy video bo'lsa, autoplay qilish
                if (index === currentReelIndex && isPlaying) {
                    videoElement.play().catch(console.error)
                }
            })

            hls.attachMedia(videoElement)
            hlsInstances.current[index] = hls

        } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            videoElement.src = hlsUrl
            videoElement.muted = isMuted

            // Autoplay for Safari
            if (index === currentReelIndex && isPlaying) {
                videoElement.play().catch(console.error)
            }
        }
    }, [cleanupHlsInstance, currentReelIndex, isPlaying, isMuted])

    // Barcha videolarni to'xtatish funksiyasi
    const pauseAllVideos = useCallback(() => {
        videoRefs.current.forEach((video, index) => {
            if (video && !video.paused) {
                video.pause()
                debugLog(`Paused video ${index}`)
            }
        })
    }, [])

    // Joriy videoni play qilish funksiyasi
    const playCurrentVideo = useCallback(() => {
        const currentVideo = videoRefs.current[currentReelIndex]
        if (currentVideo && isPlaying) {
            // Mute holatini o'rnatish
            currentVideo.muted = isMuted
            currentVideo.play().catch((error) => {
                console.error(`Play error for video ${currentReelIndex}:`, error)
            })
            debugLog(`Playing video ${currentReelIndex}`)
        }
    }, [currentReelIndex, isPlaying, isMuted])

    // Intersection Observer sozlash
    useEffect(() => {
        if (reelsData.length === 0 || !isInitialized) return

        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: 0.7,
        }

        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const videoIndex = parseInt(entry.target.dataset.index, 10)

                if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
                    debugLog(`Video ${videoIndex} intersecting`)

                    // Agar yangi video bo'lsa
                    if (videoIndex !== currentReelIndex) {
                        debugLog(`Switching from video ${currentReelIndex} to ${videoIndex}`)

                        // Barcha videolarni to'xtatish
                        pauseAllVideos()

                        // Yangi indexni o'rnatish
                        setCurrentReelIndex(videoIndex)

                        // Yangi videoni play qilish
                        setTimeout(() => {
                            const newVideo = videoRefs.current[videoIndex]
                            if (newVideo && isPlaying) {
                                newVideo.muted = isMuted
                                newVideo.currentTime = 0 // Yangi video boshidan boshlansin
                                newVideo.play().catch(console.error)
                                debugLog(`Started playing video ${videoIndex}`)
                            }
                        }, 100)
                    }
                } else if (!entry.isIntersecting) {
                    // Video ko'rinishdan chiqsa, uni to'xtatish
                    const video = videoRefs.current[videoIndex]
                    if (video && !video.paused) {
                        video.pause()
                        debugLog(`Paused video ${videoIndex} (out of view)`)
                    }
                }
            })
        }, options)

        // Observe all video containers
        const videoContainers = document.querySelectorAll(".reel")
        videoContainers.forEach((container) => {
            if (observerRef.current && container.dataset.index !== undefined) {
                observerRef.current.observe(container)
            }
        })

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [reelsData, isInitialized, currentReelIndex, pauseAllVideos])

    // Current video o'zgarganda play qilish
    useEffect(() => {
        if (isInitialized) {
            debugLog(`Current reel index changed to: ${currentReelIndex}`)
            previousVideoIndex.current = currentReelIndex
        }
    }, [currentReelIndex, isInitialized])

    // Data yuklash funksiyasi
    const loadReelsData = useCallback(async (isFirstLoad = false) => {
        if (isFetching) {
            debugLog("Already fetching, skipping...")
            return
        }

        debugLog("Loading reels data", { isFirstLoad, nextUrl, seed, currentDataLength: reelsData.length })
        setIsFetching(true)

        try {
            let params = {}

            if (isFirstLoad || !nextUrl) {
                // Birinchi yuklash yoki seed yangilash
                params = { page: 1 }
                if (seed && !isFirstLoad) {
                    params.seed = seed
                }
            } else {
                // Keyingi sahifa
                params = { next: nextUrl, seed }
            }

            debugLog("API params", params)
            const response = await getRandomFeed(params)
            debugLog("API response", response)

            const results = Array.isArray(response?.results) ? response.results : []

            // Seed ni saqlash
            if (response?.seed && (isFirstLoad || !seed)) {
                const newSeed = String(response.seed)
                setSeed(newSeed)
                try {
                    localStorage.setItem("reels_seed", newSeed)
                    debugLog("Seed saved", newSeed)
                } catch (error) {
                    console.error("Seed save error:", error)
                }
            }

            // Next URL ni saqlash
            setNextUrl(response?.next || null)
            debugLog("Next URL set", response?.next)

            // Ma'lumotlarni formatlash
            const formattedData = results.map((item) => ({
                id: item.id,
                title: item.title || `Video ${item.id}`,
                description: item.caption || "",
                hls: buildHlsUrl(item.hls_url),
                author: {
                    id: item.user?.id || 0,
                    name: item.user?.username || "Unknown",
                    username: `@${item.user?.username || "user"}`,
                    avatar: item.user?.avatar ? buildHlsUrl(item.user.avatar) : "",
                    verified: item.user?.verified || false
                },
                stats: {
                    likes: item.likes_count || 0,
                    comments: item.comments_count || 0,
                    shares: item.shares_count || 0
                },
                isLiked: !!item.liked,
                isBookmarked: !!item.saved,  // API dan saved field
                hashtags: item.hashtags || [],
                slug: String(item.id),
                type: item.type || null,
                isAd: item.isAd || false,
            }))

            debugLog("Formatted data", { count: formattedData.length })

            // Ma'lumotlarni qo'shish
            setReelsData(prev => {
                const newData = [...prev, ...formattedData]
                debugLog("Total reels after update", newData.length)
                return newData
            })

        } catch (error) {
            console.error("Load reels error:", error)
        } finally {
            setIsFetching(false)
        }
    }, [isFetching, nextUrl, seed, reelsData.length])

    // Birinchi yuklash
    useEffect(() => {
        if (!isInitialized) {
            debugLog("Initial load starting...")
            loadReelsData(true).then(() => {
                setIsInitialized(true)
                debugLog("Initialization complete")
            })
        }
    }, [isInitialized, loadReelsData])

    // Keyingi sahifani yuklash logikasi
    useEffect(() => {
        if (!isInitialized || isFetching || !nextUrl) return

        const remaining = reelsData.length - currentReelIndex - 1
        debugLog("Checking pagination", {
            remaining,
            currentIndex: currentReelIndex,
            totalReels: reelsData.length,
            hasNextUrl: !!nextUrl
        })

        if (remaining <= 4) {
            debugLog("Loading next page...")
            loadReelsData(false)
        }
    }, [currentReelIndex, reelsData.length, isInitialized, isFetching, nextUrl, loadReelsData])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            hlsInstances.current.forEach((hls, index) => {
                if (hls) {
                    try {
                        hls.destroy()
                    } catch (error) {
                        console.error(`Cleanup error for HLS ${index}:`, error)
                    }
                }
            })
            hlsInstances.current = []
        }
    }, [])

    // Context menu yopish
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showContextMenu && !event.target.closest(".reel__context-menu")) {
                setShowContextMenu(null)
            }
        }

        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [showContextMenu])

    const ensureAuthOrRedirect = useCallback(() => {
        const access = localStorage.getItem("access")
        if (!access) {
            navigate("/login")
            return false
        }
        return true
    }, [navigate])

    // Report handlers
    const openReportModal = useCallback((reelId) => {
        if (!ensureAuthOrRedirect()) return
        setReportingReelId(reelId)
        setReportReason("")
        setReportError("")
        setShowReportModal(true)
    }, [ensureAuthOrRedirect])

    const closeReportModal = useCallback(() => {
        setShowReportModal(false)
        setReportingReelId(null)
        setReportReason("")
        setReportError("")
        setReportLoading(false)
    }, [])

    const submitReport = useCallback(async () => {
        if (!reportingReelId) return
        setReportLoading(true)
        setReportError("")
        try {
            const reason = (reportReason && reportReason.trim()) || "yoqmadi"
            await reportReel(reportingReelId, reason)
            closeReportModal()
            alert("Jalba yuborildi")
        } catch (e) {
            setReportError("Jalba yuborishda xatolik yuz berdi")
        } finally {
            setReportLoading(false)
        }
    }, [reportingReelId, reportReason, closeReportModal])

    // Event handlers
    const handleLike = useCallback(async (reelId) => {
        if (!ensureAuthOrRedirect()) return
        try {
            const res = await toggleLikeReel(reelId)
            setReelsData((prev) => prev.map((reel) =>
                reel.id === reelId
                    ? { ...reel, isLiked: res.message === "Liked", stats: { ...reel.stats, likes: res.likes_count || 0 } }
                    : reel
            ))
        } catch (e) {
            console.error("toggle like error", e)
        }
    }, [ensureAuthOrRedirect])

    const handleBookmark = useCallback(async (reelId) => {
        if (!ensureAuthOrRedirect()) return

        // Optimistic update
        const currentReel = reelsData.find(r => r.id === reelId)
        if (!currentReel) return

        const newBookmarkState = !currentReel.isBookmarked

        setReelsData((prev) =>
            prev.map((reel) => (reel.id === reelId ? { ...reel, isBookmarked: newBookmarkState } : reel)),
        )

        try {
            // API ga jo'natish: currentReel.isBookmarked (eski holat)
            await toggleSaveReel(reelId, currentReel.isBookmarked)
            console.log(`Reel ${reelId} ${newBookmarkState ? 'saqlandi' : 'o\'chirildi'}`, { saved: newBookmarkState })
        } catch (e) {
            console.error("toggle save error", e)
            // Revert on error
            setReelsData((prev) =>
                prev.map((reel) => (reel.id === reelId ? { ...reel, isBookmarked: !newBookmarkState } : reel)),
            )
        }
    }, [ensureAuthOrRedirect, reelsData])

    const handleShare = useCallback((reel) => {
        if (navigator.share) {
            navigator.share({
                title: reel.title,
                text: reel.description,
                url: window.location.href,
            }).catch(console.error)
        }
    }, [])

    const handleComment = useCallback((reelId) => {
        setActiveReelId(reelId)
        setShowComments(true)
    }, [])

    const handleCloseComments = useCallback(() => {
        setShowComments(false)
        setActiveReelId(null)
    }, [])

    // Play/Pause handler - video vaqtini saqlab qolish
    const handlePlayPause = useCallback((index) => {
        if (index === currentReelIndex) {
            const video = videoRefs.current[index]
            if (video) {
                if (isPlaying) {
                    // Video to'xtatish - vaqt saqlanib qoladi
                    video.pause()
                    setIsPlaying(false)
                    debugLog(`Video ${index} paused at time:`, video.currentTime)
                } else {
                    // Video to'xtatilgan joydan davom ettirish - currentTime o'zgarmaydi
                    video.muted = isMuted
                    video.play().catch((error) => {
                        console.error(`Play error for video ${currentReelIndex}:`, error)
                    })
                    setIsPlaying(true)
                    debugLog(`Video ${index} resumed from time:`, video.currentTime)
                }
            }
        }
    }, [currentReelIndex, isPlaying])

    // Mute handler - faqat ovozni boshqarish, video vaqtiga ta'sir qilmaslik
    const handleMute = useCallback(() => {
        const newMutedState = !isMuted
        setIsMuted(newMutedState)

        // Barcha videolarning mute holatini yangilash
        videoRefs.current.forEach((video) => {
            if (video) {
                video.muted = newMutedState
            }
        })

        debugLog(`All videos muted state changed to:`, newMutedState)
    }, [isMuted])

    const handleAuthorClick = useCallback((authorId, authorName) => {
        const authorSlug = authorName
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
        navigate(`/channels/${authorSlug}`)
    }, [navigate])

    const handleSpecialAction = useCallback((reel) => {
        if (reel.type === "tutorial" && reel.tutorialLink) {
            const tutorialSlug = reel.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
            navigate(`/tutorials/${tutorialSlug}`)
        } else if (reel.type === "movie" && reel.movieLink) {
            const movieSlug = reel.title
                .toLowerCase()
                .replace(/\s+/g, "-")
                .replace(/[^a-z0-9-]/g, "")
            navigate(`/movies/${movieSlug}`)
        } else if (reel.type === "advertisement" && reel.adLink) {
            window.open(reel.adLink, "_blank")
        }
    }, [navigate])

    const handleThreeDotsClick = useCallback((event, reelId) => {
        event.stopPropagation()
        const rect = event.target.getBoundingClientRect()

        setContextMenuPosition({
            x: Math.min(rect.left - 150, window.innerWidth - 180),
            y: Math.max(rect.top - 20, 20),
        })
        setShowContextMenu(reelId)
    }, [])

    const handleContextMenuAction = useCallback((action, reel) => {
        switch (action) {
            case "copy":
                navigator.clipboard.writeText(window.location.href).catch(console.error)
                break
            case "interests":
                console.log("Add to interests:", reel.id)
                break
            case "ban":
                // Open report modal
                openReportModal(reel.id)
                break
            default:
                break
        }
        setShowContextMenu(null)
    }, [openReportModal])

    const formatCount = useCallback((count) => {
        if (count >= 1000000) {
            return Math.floor(count / 100000) / 10 + "M"
        } else if (count >= 1000) {
            return Math.floor(count / 100) / 10 + "K"
        }
        return count.toString()
    }, [])

    const activeReel = reelsData.find(reel => reel.id === activeReelId)

    // Loading state
    if (!isInitialized && reelsData.length === 0) {
        return (
            <div className="reels-container" style={{ padding: 16 }}>
                <div style={{ display: 'grid', gap: 16 }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="skeleton-card" style={{ height: 480, display: 'grid', gridTemplateRows: '1fr auto', gap: 12 }}>
                            <Skeleton height={360} rounded={16} />
                            <div style={{ display: 'grid', gap: 8 }}>
                                <Skeleton width="60%" height={18} />
                                <Skeleton lines={2} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="reels-container">
            <div className="reels" ref={containerRef}>
                <div className="reels__container">
                    {reelsData.map((reel, index) => (
                        <div key={`reel-${reel.id}-${index}`} className="reel" data-index={index}>
                            <div className="reel__video-container">
                                <video
                                    ref={(el) => {
                                        if (el) {
                                            videoRefs.current[index] = el
                                            // Faqat video element yangi bo'lsa yoki HLS URL o'zgargan bo'lsa setup qilish
                                            if (!el.dataset.hlsSetup || el.dataset.hlsUrl !== reel.hls) {
                                                setupVideo(el, reel.hls, index, true)
                                                el.dataset.hlsSetup = 'true'
                                                el.dataset.hlsUrl = reel.hls
                                            }
                                        }
                                    }}
                                    className="reel__video"
                                    loop
                                    muted={isMuted}
                                    playsInline
                                    preload="metadata"
                                    onClick={() => handlePlayPause(index)}
                                />

                                <div className="reel__video-controls">
                                    {index === currentReelIndex && (
                                        <button
                                            className={`reel__play-pause-btn ${!isPlaying ? "show" : ""}`}
                                            onClick={() => handlePlayPause(index)}
                                        >
                                            {isPlaying ? <BsPauseFill size={40} /> : <BsPlayFill size={40} />}
                                        </button>
                                    )}

                                    <button className="reel__mute-btn" onClick={handleMute}>
                                        {isMuted ? <BsVolumeMute size={20} /> : <BsVolumeUp size={20} />}
                                    </button>
                                </div>

                                {reel.isAd && <div className="reel__ad-label">Reklama</div>}
                            </div>

                            <div className="reel__content">
                                <div className="reel__author" onClick={() => handleAuthorClick(reel.author.id, reel.author.name)}>
                                    <img
                                        src={reel.author.avatar || "/placeholder.svg"}
                                        alt={reel.author.name}
                                        className="reel__author-avatar"
                                    />
                                    <div className="reel__author-info">
                                        <h4 className="reel__author-name">
                                            {reel.author.name}
                                            {reel.author.verified && <span className="reel__verified">✓</span>}
                                        </h4>
                                        <p className="reel__author-username">{reel.author.username}</p>
                                    </div>
                                </div>

                                <div className="reel__description">
                                    <p className="reel__text">{reel.description}</p>
                                    <div className="reel__hashtags">
                                        {reel.hashtags?.map((hashtag, idx) => (
                                            <span key={`hashtag-${idx}`} className="reel__hashtag">
                                                {hashtag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {(reel.type === "tutorial" || reel.type === "movie" || reel.type === "advertisement") && (
                                    <button
                                        className={`reel__special-btn reel__special-btn--${reel.type}`}
                                        onClick={() => handleSpecialAction(reel)}
                                    >
                                        {reel.type === "tutorial" && "Darslikni ko'rish"}
                                        {reel.type === "movie" && "Filmni ko'rish"}
                                        {reel.type === "advertisement" && "Batafsil"}
                                    </button>
                                )}
                            </div>

                            <div className="reel__actions">
                                <button
                                    className={`reel__action-btn ${reel.isLiked ? "active" : ""}`}
                                    onClick={() => handleLike(reel.id)}
                                >
                                    {reel.isLiked ? <BsHeartFill size={24} color="#ef4444" /> : <BsHeart size={24} />}
                                    <span className="reel__action-count">{formatCount(reel.stats.likes)}</span>
                                </button>

                                <button className="reel__action-btn" onClick={() => handleComment(reel.id)}>
                                    <BsChat size={24} />
                                    <span className="reel__action-count">{formatCount(reel.stats.comments)}</span>
                                </button>

                                <button
                                    className={`reel__action-btn ${reel.isBookmarked ? "bookmark-active" : ""}`}
                                    onClick={() => handleBookmark(reel.id)}
                                    title={reel.isBookmarked ? "Saqlangandan olib tashla" : "Saqlash"}
                                >
                                    {reel.isBookmarked ? (
                                        <BsBookmarkFill size={24} style={{ color: "#ffd700" }} />
                                    ) : (
                                        <BsBookmark size={24} style={{ color: "white" }} />
                                    )}
                                </button>

                                <button className="reel__action-btn" onClick={() => handleShare(reel)}>
                                    <BsShare size={24} />
                                    <span className="reel__action-count">{formatCount(reel.stats.shares)}</span>
                                </button>

                                <button className="reel__action-btn" onClick={(e) => handleThreeDotsClick(e, reel.id)}>
                                    <BsThreeDotsVertical size={24} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Yuklash indikatori */}
                {isFetching && (
                    <div className="reels__loading" style={{ padding: 16 }}>
                        <Skeleton height={10} rounded={999} />
                    </div>
                )}

                {showContextMenu && (
                    <div
                        className="reel__context-menu"
                        style={{
                            position: "fixed",
                            left: `${contextMenuPosition.x}px`,
                            top: `${contextMenuPosition.y}px`,
                            zIndex: 1000,
                        }}
                    >
                        <button
                            className="reel__context-menu-item"
                            onClick={() =>
                                handleContextMenuAction(
                                    "copy",
                                    reelsData.find((r) => r.id === showContextMenu),
                                )
                            }
                        >
                            <BsCopy size={16} />
                            Copy link
                        </button>
                        <button
                            className="reel__context-menu-item"
                            onClick={() =>
                                handleContextMenuAction(
                                    "interests",
                                    reelsData.find((r) => r.id === showContextMenu),
                                )
                            }
                        >
                            <BsStar size={16} />
                            Not interested
                        </button>
                        <button
                            className="reel__context-menu-item reel__context-menu-item--danger"
                            onClick={() => handleContextMenuAction("ban", reelsData.find((r) => r.id === showContextMenu))}
                        >
                            <BsFlag size={16} />
                            Report
                        </button>
                    </div>
                )}
            </div>

            {showComments && activeReel && (
                <ReelsComment
                    reel={activeReel}
                    isOpen={showComments}
                    onClose={handleCloseComments}
                />
            )}

            {/* Report Modal */}
            {showReportModal && (
                <div className="reel-report__overlay" onClick={closeReportModal}>
                    <div className="reel-report__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="reel-report__header">
                            <h3>Jalba yuborish</h3>
                            <button className="reel-report__close" onClick={closeReportModal}>×</button>
                        </div>
                        <div className="reel-report__body">
                            <label>Sabab (majburiy emas)</label>
                            <textarea
                                className="reel-report__input"
                                rows={3}
                                placeholder="yoqmadi"
                                value={reportReason}
                                onChange={(e) => setReportReason(e.target.value)}
                            />
                            {reportError && <div className="reel-report__error">{reportError}</div>}
                        </div>
                        <div className="reel-report__actions">
                            <button className="reel-report__btn reel-report__btn--ghost" onClick={closeReportModal}>Bekor qilish</button>
                            <button className="reel-report__btn reel-report__btn--primary" onClick={submitReport} disabled={reportLoading}>
                                {reportLoading ? 'Yuborilmoqda...' : 'Yuborish'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Debug info (development only) */}
            {process.env.NODE_ENV === 'development' && (
                <div style={{ position: 'fixed', top: 10, left: 10, background: 'rgba(0,0,0,0.8)', color: 'white', padding: 10, fontSize: 12, zIndex: 9999 }}>
                    <div>Current: {currentReelIndex}</div>
                    <div>Total: {reelsData.length}</div>
                    <div>Remaining: {reelsData.length - currentReelIndex - 1}</div>
                    <div>Fetching: {isFetching ? 'Yes' : 'No'}</div>
                    <div>Has Next: {nextUrl ? 'Yes' : 'No'}</div>
                    <div>Seed: {seed}</div>
                    <div>Playing: {isPlaying ? 'Yes' : 'No'}</div>
                    <div>Muted: {isMuted ? 'Yes' : 'No'}</div>
                    <div>Current Video Time: {videoRefs.current[currentReelIndex]?.currentTime?.toFixed(2) || 0}s</div>
                </div>
            )}
        </div>
    )
}

export default Reels