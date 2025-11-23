"use client"

import { useState, useRef, useEffect } from "react"
import Hls from "hls.js"
import { BaseUrlReels } from "../../api/apiService"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { getVideoProgress, updateVideoProgress } from "../../api/apiProgress"
import {
    BsPlayFill,
    BsPauseFill,
    BsVolumeUp,
    BsVolumeMute,
    BsFullscreen,
    BsArrowLeft,
    BsSkipBackward,
    BsSkipForward,
    BsFullscreenExit
} from "react-icons/bs"

const VideoPlayer = () => {
    const { tutorialSlug, lessonId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const videoRef = useRef(null)
    const containerRef = useRef(null)

    const { lesson: lessonData, tutorialTitle, monthName } = location.state || {}

    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [watchProgress, setWatchProgress] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [videoEnded, setVideoEnded] = useState(false)
    const [showWatchAgainPrompt, setShowWatchAgainPrompt] = useState(false)
    const [maxWatchedTime, setMaxWatchedTime] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [playbackRate, setPlaybackRate] = useState(1)
    const lastPatchRef = useRef(0)
    const seekingRef = useRef(false)
    const lastSavedOnExitRef = useRef(0)
    const exitOverridePosRef = useRef(null) // when set, use this exact position on exit save
    const lastKnownPosRef = useRef(0)

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleLoadStart = () => setIsLoading(true)
        const handleCanPlay = () => setIsLoading(false)
        const handleWaiting = () => setIsLoading(true)
        const handlePlaying = () => setIsLoading(false)

        const updateTime = () => {
            setCurrentTime(video.currentTime)
            const progress = (video.currentTime / video.duration) * 100
            setWatchProgress(progress)
            if (video.currentTime > maxWatchedTime) {
                setMaxWatchedTime(video.currentTime)
            }
            // Track last known position in seconds to avoid sending 0 on exit
            lastKnownPosRef.current = Math.floor(video.currentTime)

            // Throttled progress PATCH every ~10s while playing
            const now = Date.now()
            if (!video.paused && now - lastPatchRef.current >= 10000) {
                lastPatchRef.current = now
                const payload = {
                    last_position: Math.floor(video.currentTime),
                }
                updateVideoProgress(lessonId, payload).catch(() => { })
            }
        }

        const updateDuration = () => setDuration(video.duration)

        const handleVideoEnd = () => {
            setVideoEnded(true)
            setShowWatchAgainPrompt(true)
            setIsPlaying(false)

            // Finalize progress: only mark completed if >=90% and duration is valid
            const dur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0
            const lastPos = Math.floor(video.currentTime || 0)
            const payload = { last_position: lastPos }
            if (dur > 0 && lastPos >= Math.floor(dur * 0.9)) {
                payload.completed = true
                payload.last_position = Math.floor(dur)
            }
            updateVideoProgress(lessonId, payload).catch(() => { })
        }

        const handlePause = () => {
            // Immediate save on pause
            const payload = {
                last_position: Math.floor(video.currentTime || 0),
            }
            lastKnownPosRef.current = payload.last_position
            updateVideoProgress(lessonId, payload).catch(() => { })
        }

        const handleSeeked = () => {
            if (!seekingRef.current) return
            seekingRef.current = false
            const payload = {
                last_position: Math.floor(video.currentTime || 0),
            }
            lastKnownPosRef.current = payload.last_position
            updateVideoProgress(lessonId, payload).catch(() => { })
        }

        const handleSeeking = () => {
            seekingRef.current = true
        }

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        video.addEventListener("loadstart", handleLoadStart)
        video.addEventListener("canplay", handleCanPlay)
        video.addEventListener("waiting", handleWaiting)
        video.addEventListener("playing", handlePlaying)
        video.addEventListener("timeupdate", updateTime)
        video.addEventListener("loadedmetadata", updateDuration)
        video.addEventListener("ended", handleVideoEnd)
        video.addEventListener("pause", handlePause)
        video.addEventListener("seeked", handleSeeked)
        video.addEventListener("seeking", handleSeeking)
        document.addEventListener("fullscreenchange", handleFullscreenChange)

        return () => {
            video.removeEventListener("loadstart", handleLoadStart)
            video.removeEventListener("canplay", handleCanPlay)
            video.removeEventListener("waiting", handleWaiting)
            video.removeEventListener("playing", handlePlaying)
            video.removeEventListener("timeupdate", updateTime)
            video.removeEventListener("loadedmetadata", updateDuration)
            video.removeEventListener("ended", handleVideoEnd)
            video.removeEventListener("pause", handlePause)
            video.removeEventListener("seeked", handleSeeked)
            video.removeEventListener("seeking", handleSeeking)
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
        }
    }, [lessonId, maxWatchedTime])

    // Save progress when tab is hidden or page is unloading
    useEffect(() => {
        const saveNow = () => {
            const now = Date.now()
            // Avoid spamming if already saved very recently
            if (now - lastSavedOnExitRef.current < 1500) return
            lastSavedOnExitRef.current = now
            const video = videoRef.current
            // If override is set (e.g., after ended + back), honor it even if 0
            if (exitOverridePosRef.current !== null) {
                updateVideoProgress(lessonId, { last_position: exitOverridePosRef.current }).catch(() => { })
                return
            }
            const current = video && Math.floor(video.currentTime)
            const pos = Math.max(current, Math.floor(lastKnownPosRef.current))
            // Do not send zero on normal exit; skip if still zero
            if (pos > 0) {
                updateVideoProgress(lessonId, { last_position: pos }).catch(() => { })
            }
        }

        const onVisibility = () => {
            if (document.hidden) saveNow()
        }

        window.addEventListener('beforeunload', saveNow)
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
            saveNow()
            window.removeEventListener('beforeunload', saveNow)
            document.removeEventListener('visibilitychange', onVisibility)
        }
    }, [lessonId])

    // Initialize HLS source if provided
    useEffect(() => {
        const video = videoRef.current
        if (!video || !lessonData) return

        const playlist = lessonData.hls_playlist_url
        if (playlist) {
            const src = `${BaseUrlReels}${playlist.startsWith('/') ? '' : '/'}${playlist}`
            const token = localStorage.getItem('access')
            
            if (Hls.isSupported()) {
                const hls = new Hls({
                    maxBufferLength: 60,
                    xhrSetup: (xhr) => {
                        if (token) {
                            xhr.setRequestHeader('Authorization', `Bearer ${token}`)
                        }
                    }
                })
                hls.loadSource(src)
                hls.attachMedia(video)
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    setIsLoading(false)
                })
                return () => {
                    hls.destroy()
                }
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src
            }
        } else if (lessonData.videoUrl) {
            // fallback to direct file if exists
            video.src = lessonData.videoUrl
        }
    }, [lessonData])

    // Resume from saved position (always fetch fresh from API and override state; always use last_position from API)
    useEffect(() => {
        const video = videoRef.current
        if (!video || !lessonData) return
        const trySetResume = async () => {
            let resumeFromState = Number(lessonData.resume_position || 0)
            let resume = resumeFromState
            try {
                const vp = await getVideoProgress(lessonData.id)
                const apiPos = Number(vp?.last_position || 0)
                // Prefer the server last_position; if state has greater (rare), take max
                resume = Math.max(apiPos, resumeFromState)
            } catch (_) {
                // fallback to state
            }

            const applyResume = () => {
                try {
                    const dur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0
                    if (resume > 0) {
                        // Clamp within duration if available
                        video.currentTime = Math.min(resume, Math.floor(dur || resume))
                        setCurrentTime(video.currentTime)
                        // Autoplay from the resume position
                        video.play().then(() => setIsPlaying(true)).catch(() => { })
                    }
                } catch { /* ignore */ }
            }

            if (isFinite(video.duration) && video.duration > 0) {
                applyResume()
            } else {
                const setWhenReady = () => {
                    applyResume()
                    video.removeEventListener('loadedmetadata', setWhenReady)
                }
                video.addEventListener('loadedmetadata', setWhenReady)
            }
        }
        trySetResume()
    }, [lessonData])

    // Always show controls for better usability
    useEffect(() => {
        setShowControls(true)
    }, [])

    useEffect(() => {
        // Auto enter fullscreen when video starts
        const enterFullscreen = async () => {
            if (containerRef.current && !isFullscreen) {
                try {
                    await toggleFullscreen()
                } catch (error) {
                    console.log("Could not enter fullscreen:", error)
                }
            }
        }

        if (lessonData && !isFullscreen) {
            enterFullscreen()
        }
    }, [lessonData])
    const handlePlayPause = () => {
        const video = videoRef.current
        if (!video) return

        if (isPlaying) {
            video.pause()
        } else {
            video.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleSeek = (e) => {
        const video = videoRef.current
        if (!video) return

        const rect = e.currentTarget.getBoundingClientRect()
        const pos = (e.clientX - rect.left) / rect.width
        const newTime = pos * duration
        video.currentTime = newTime
        setCurrentTime(newTime)
        // Save after manual seek
        const lp = Math.floor(newTime)
        lastKnownPosRef.current = lp
        updateVideoProgress(lessonId, { last_position: lp }).catch(() => { })
    }

    const handleSkipBackward = () => {
        const video = videoRef.current
        if (!video) return

        const newTime = Math.max(0, currentTime - 10)
        video.currentTime = newTime
        setCurrentTime(newTime)
        const lp = Math.floor(newTime)
        lastKnownPosRef.current = lp
        updateVideoProgress(lessonId, { last_position: lp }).catch(() => { })
    }

    const handleSkipForward = () => {
        const video = videoRef.current
        if (!video) return

        const newTime = Math.min(duration || currentTime + 10, currentTime + 10)
        video.currentTime = newTime
        setCurrentTime(newTime)
        const lp = Math.floor(newTime)
        lastKnownPosRef.current = lp
        updateVideoProgress(lessonId, { last_position: lp }).catch(() => { })
    }
    const handleVolumeChange = (e) => {
        const video = videoRef.current
        if (!video) return

        const newVolume = Number.parseFloat(e.target.value)
        video.volume = newVolume
        setVolume(newVolume)
        setIsMuted(newVolume === 0)
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return

        if (isMuted) {
            video.volume = volume
            setIsMuted(false)
        } else {
            video.volume = 0
            setIsMuted(true)
        }
    }

    const handlePlaybackRateChange = (rate) => {
        const video = videoRef.current
        if (!video) return

        video.playbackRate = rate
        setPlaybackRate(rate)
    }
    const toggleFullscreen = async () => {
        const container = containerRef.current
        if (!container) return

        try {
            if (!isFullscreen) {
                if (container.requestFullscreen) {
                    await container.requestFullscreen()
                } else if (container.webkitRequestFullscreen) {
                    await container.webkitRequestFullscreen()
                } else if (container.mozRequestFullScreen) {
                    await container.mozRequestFullScreen()
                }
            } else {
                if (document.exitFullscreen) {
                    await document.exitFullscreen()
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen()
                } else if (document.mozCancelFullScreen) {
                    await document.mozCancelFullScreen()
                }
            }
        } catch (error) {
            console.log("[v0] Fullscreen error:", error)
        }
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    const handleWatchAgain = () => {
        const video = videoRef.current
        if (!video) return

        // Restart from 1 second and report it
        const restartAt = 1
        video.currentTime = restartAt
        setCurrentTime(restartAt)
        setWatchProgress(0)
        setVideoEnded(false)
        setShowWatchAgainPrompt(false)
        updateVideoProgress(lessonId, { last_position: restartAt }).catch(() => { })
        video.play()
        setIsPlaying(true)
    }

    const handleGoBack = async () => {
        // If video ended modal is shown and user chooses to go back, send last_position: 0
        if (videoEnded) {
            try {
                exitOverridePosRef.current = 0
                await updateVideoProgress(lessonId, { last_position: 0 })
            } catch { /* ignore */ }
        }
        navigate(`/tutorials/${tutorialSlug}`)
    }

    if (!lessonData) {
        return (
            <div className="video-player-error">
                <h2>Dars topilmadi</h2>
                <button onClick={handleGoBack}>Orqaga qaytish</button>
            </div>
        )
    }

    return (
        <div className="video-player-page">
            <div className="video-player-container" ref={containerRef}>
                {!isFullscreen && (
                    <div className="video-player-header">
                        <button className="video-player-back" onClick={handleGoBack}>
                            <BsArrowLeft size={20} />
                            Orqaga
                        </button>
                        <div className="video-player-breadcrumb">
                            <span>{tutorialTitle}</span>
                            <span>/</span>
                            <span>{monthName}</span>
                            <span>/</span>
                            <span>{lessonData.title}</span>
                        </div>
                    </div>
                )}

                <div
                    className="video-player-wrapper"
                    onMouseMove={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(true)}
                >
                    <video
                        ref={videoRef}
                        className="video-player-video"
                        src={lessonData?.videoUrl || ''}
                        poster={lessonData.thumbnail}
                        onClick={handlePlayPause}
                    />

                    {isLoading && (
                        <div className="video-player-loading">
                            <div className="video-player-spinner"></div>
                            <p>Video yuklanmoqda...</p>
                        </div>
                    )}

                    {true && (
                        <div className="video-player-controls">
                            <div className="video-player-progress-container">
                                <div className="video-player-progress-bar" onClick={handleSeek}>
                                    {/* Make watched bar reflect currentTime so it moves forward/back */}
                                    <div
                                        className="video-player-progress-watched"
                                        style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                    />
                                    {/* Secondary bar shows max watched historically (optional) */}
                                    <div className="video-player-progress-fill" style={{ width: `${(maxWatchedTime / (duration || 1)) * 100}%` }} />
                                </div>
                            </div>

                            <div className="video-player-controls-bottom">
                                <div className="video-player-controls-left">
                                    <button onClick={handleSkipBackward} title="10 soniya orqaga">
                                        <BsSkipBackward size={20} />
                                    </button>

                                    <button onClick={handlePlayPause}>
                                        {isPlaying ? <BsPauseFill size={24} /> : <BsPlayFill size={24} />}
                                    </button>

                                    <button
                                        onClick={handleSkipForward}
                                        title="10 soniya oldinga"
                                    >
                                        <BsSkipForward size={20} />
                                    </button>

                                    <button onClick={toggleMute}>
                                        {isMuted ? <BsVolumeMute size={20} /> : <BsVolumeUp size={20} />}
                                    </button>

                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        className="video-player-volume"
                                    />

                                    <span className="video-player-time">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </span>
                                </div>

                                <div className="video-player-controls-right">
                                    <div className="video-player-speed">
                                        <select
                                            value={playbackRate}
                                            onChange={(e) => handlePlaybackRateChange(Number(e.target.value))}
                                            className="video-player-speed-select"
                                        >
                                            <option value={0.5}>0.5x</option>
                                            <option value={0.75}>0.75x</option>
                                            <option value={1}>1x</option>
                                            <option value={1.25}>1.25x</option>
                                            <option value={1.5}>1.5x</option>
                                            <option value={2}>2x</option>
                                        </select>
                                    </div>

                                    <button onClick={toggleFullscreen}>
                                        {isFullscreen ? <BsFullscreenExit size={20} /> : <BsFullscreen size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showWatchAgainPrompt && (
                        <div className="video-player-prompt">
                            <div className="video-player-prompt-content">
                                <h3>Video tugadi!</h3>
                                <p>Videoni qayta ko'rishni xohlaysizmi?</p>
                                <div className="video-player-prompt-actions">
                                    <button className="video-player-prompt-btn primary" onClick={handleWatchAgain}>
                                        Qayta ko'rish
                                    </button>
                                    <button className="video-player-prompt-btn secondary" onClick={handleGoBack}>
                                        Orqaga qaytish
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {!isFullscreen && (
                    <div className="video-player-info">
                        <h2>{lessonData.title}</h2>
                        <p>{lessonData.description}</p>
                        <div className="video-player-meta">
                            <span>Davomiyligi: {lessonData.duration}</span>
                            <span>Ko'rildi: {Math.round(watchProgress)}%</span>
                            <span>Tezlik: {playbackRate}x</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoPlayer
