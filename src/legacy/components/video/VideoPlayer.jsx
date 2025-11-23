"use client"

import { useState, useRef, useEffect } from "react"
import {
    BsPlay,
    BsPause,
    BsVolumeUp,
    BsVolumeMute,
    BsFullscreen,
    BsFullscreenExit,
    BsGear,
    BsSkipStart,
    BsSkipEnd,
} from "react-icons/bs"

const VideoPlayer = ({ src, poster, title, onTimeUpdate, onEnded }) => {
    const videoRef = useRef(null)
    const progressRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [quality, setQuality] = useState("1080p")
    const [showSettings, setShowSettings] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const qualities = ["480p", "720p", "1080p", "1440p"]

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleLoadedMetadata = () => {
            setDuration(video.duration)
            setIsLoading(false)
        }

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime)
            if (onTimeUpdate) {
                onTimeUpdate(video.currentTime, video.duration)
            }
        }

        const handleEnded = () => {
            setIsPlaying(false)
            if (onEnded) {
                onEnded()
            }
        }

        video.addEventListener("loadedmetadata", handleLoadedMetadata)
        video.addEventListener("timeupdate", handleTimeUpdate)
        video.addEventListener("ended", handleEnded)

        return () => {
            video.removeEventListener("loadedmetadata", handleLoadedMetadata)
            video.removeEventListener("timeupdate", handleTimeUpdate)
            video.removeEventListener("ended", handleEnded)
        }
    }, [onTimeUpdate, onEnded])

    const togglePlay = () => {
        const video = videoRef.current
        if (isPlaying) {
            video.pause()
        } else {
            video.play()
        }
        setIsPlaying(!isPlaying)
    }

    const handleProgressClick = (e) => {
        const video = videoRef.current
        const progressBar = progressRef.current
        const rect = progressBar.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const newTime = (clickX / rect.width) * duration
        video.currentTime = newTime
        setCurrentTime(newTime)
    }

    const handleVolumeChange = (e) => {
        const newVolume = Number.parseFloat(e.target.value)
        setVolume(newVolume)
        videoRef.current.volume = newVolume
        setIsMuted(newVolume === 0)
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (isMuted) {
            video.volume = volume
            setIsMuted(false)
        } else {
            video.volume = 0
            setIsMuted(true)
        }
    }

    const toggleFullscreen = () => {
        const container = videoRef.current.parentElement

        if (!isFullscreen) {
            if (container.requestFullscreen) {
                container.requestFullscreen()
            } else if (container.webkitRequestFullscreen) {
                container.webkitRequestFullscreen()
            } else if (container.mozRequestFullScreen) {
                container.mozRequestFullScreen()
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen()
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen()
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen()
            }
        }
        setIsFullscreen(!isFullscreen)
    }

    const skipTime = (seconds) => {
        const video = videoRef.current
        video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
    }

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600)
        const minutes = Math.floor((time % 3600) / 60)
        const seconds = Math.floor(time % 60)

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        }
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    return (
        <div
            className="video-player"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <video ref={videoRef} src={src} poster={poster} className="video-player__video" onClick={togglePlay} />

            {isLoading && (
                <div className="video-player__loading">
                    <div className="video-player__spinner"></div>
                    <p>Video yuklanmoqda...</p>
                </div>
            )}

            <div className={`video-player__controls ${showControls ? "video-player__controls--visible" : ""}`}>
                {/* Progress Bar */}
                <div className="video-player__progress" ref={progressRef} onClick={handleProgressClick}>
                    <div className="video-player__progress-filled" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                </div>

                {/* Control Buttons */}
                <div className="video-player__controls-row">
                    <div className="video-player__controls-left">
                        <button className="video-player__control-btn" onClick={togglePlay}>
                            {isPlaying ? <BsPause size={20} /> : <BsPlay size={20} />}
                        </button>

                        <button className="video-player__control-btn" onClick={() => skipTime(-10)}>
                            <BsSkipStart size={18} />
                        </button>

                        <button className="video-player__control-btn" onClick={() => skipTime(10)}>
                            <BsSkipEnd size={18} />
                        </button>

                        <div className="video-player__volume">
                            <button className="video-player__control-btn" onClick={toggleMute}>
                                {isMuted || volume === 0 ? <BsVolumeMute size={18} /> : <BsVolumeUp size={18} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="video-player__volume-slider"
                            />
                        </div>

                        <div className="video-player__time">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>

                    <div className="video-player__controls-right">
                        <div className="video-player__settings">
                            <button className="video-player__control-btn" onClick={() => setShowSettings(!showSettings)}>
                                <BsGear size={18} />
                            </button>

                            {showSettings && (
                                <div className="video-player__settings-menu">
                                    <div className="video-player__settings-item">
                                        <span>Sifat</span>
                                        <select
                                            value={quality}
                                            onChange={(e) => setQuality(e.target.value)}
                                            className="video-player__quality-select"
                                        >
                                            {qualities.map((q) => (
                                                <option key={q} value={q}>
                                                    {q}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className="video-player__control-btn" onClick={toggleFullscreen}>
                            {isFullscreen ? <BsFullscreenExit size={18} /> : <BsFullscreen size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Center Play Button */}
            {!isPlaying && !isLoading && (
                <div className="video-player__center-play" onClick={togglePlay}>
                    <BsPlay size={60} />
                </div>
            )}
        </div>
    )
}

export default VideoPlayer
