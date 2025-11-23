import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { BsArrowLeft, BsHeart, BsBookmark, BsShare, BsList, BsPlay, BsPause, BsVolumeUp, BsVolumeMute, BsFullscreen, BsFullscreenExit } from "react-icons/bs"
import { getMovieDetail } from "../../api/apiMovies"
import { BaseUrlReels } from "../../api/apiService"
import Hls from "hls.js"

const toAbs = (path) => {
    if (!path) return ""
    if (path.startsWith("http")) return path
    return `${BaseUrlReels}${path.startsWith("/") ? path : `/${path}`}`
}

const WatchPage = () => {
    const { movieSlug } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const videoRef = useRef(null)
    const hlsRef = useRef(null)

    const [movie, setMovie] = useState(null)
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [watchProgress, setWatchProgress] = useState(0)
    const [currentEpisode, setCurrentEpisode] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [error, setError] = useState(null)

    // Get season and episode from URL params
    const searchParams = new URLSearchParams(location.search)
    const season = parseInt(searchParams.get('season')) || 1
    const episode = parseInt(searchParams.get('episode')) || 1

    useEffect(() => {
        console.log("id", movieSlug)
        console.log("season", season)
        console.log("episode", episode)
        let mounted = true
        const loadMovie = async () => {
            try {
                const data = await getMovieDetail(movieSlug)
                if (!mounted) return

                setMovie(data)

                // Find current episode for serials
                if (data?.type === "serial" && data.grouped_files) {
                    const seasonData = data.grouped_files.find(s => s.season === season)
                    const episodeData = seasonData?.episodes?.find(e => e.episode === episode)
                    setCurrentEpisode(episodeData)
                }

                setIsLoading(false)
            } catch (error) {
                console.error("Error loading movie:", error)
                setError("Video yuklanmadi")
                setIsLoading(false)
            }
        }

        loadMovie()
        return () => { mounted = false }
    }, [movieSlug, season, episode])

    useEffect(() => {
        if (!movie || !videoRef.current) return

        // Get video source
        let videoSource = null
        if (movie.type === "serial" && currentEpisode) {
            videoSource = toAbs(currentEpisode.hls_playlist_url)
        } else if (movie.type === "movie" && movie.grouped_files?.length > 0) {
            // For movies, use the first available file
            const firstFile = movie.grouped_files[0]?.episodes?.[0]
            if (firstFile) {
                videoSource = toAbs(firstFile.hls_playlist_url)
            }
        }

        if (!videoSource) {
            setError("Video fayli topilmadi")
            return
        }

        // Initialize HLS
        const video = videoRef.current
        if (Hls.isSupported()) {
            if (hlsRef.current) {
                hlsRef.current.destroy()
            }

            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            })

            hlsRef.current = hls

            hls.loadSource(videoSource)
            hls.attachMedia(video)

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("HLS manifest parsed")
                setError(null)
            })

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS error:", data)
                if (data.fatal) {
                    setError("Video oynatishda xatolik")
                }
            })
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS support (Safari)
            video.src = videoSource
        } else {
            setError("Video format qo'llab-quvvatlanmaydi")
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy()
                hlsRef.current = null
            }
        }
    }, [movie, currentEpisode])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime)
            const progress = (video.currentTime / video.duration) * 100
            setWatchProgress(progress)

            // Save progress to localStorage
            localStorage.setItem(`movie_${movieSlug}_progress`, video.currentTime.toString())
        }

        const handleDurationChange = () => {
            setDuration(video.duration)
        }

        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)
        const handleVolumeChange = () => {
            setVolume(video.volume)
            setIsMuted(video.muted)
        }

        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }

        video.addEventListener('timeupdate', handleTimeUpdate)
        video.addEventListener('durationchange', handleDurationChange)
        video.addEventListener('play', handlePlay)
        video.addEventListener('pause', handlePause)
        video.addEventListener('volumechange', handleVolumeChange)
        document.addEventListener('fullscreenchange', handleFullscreenChange)

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate)
            video.removeEventListener('durationchange', handleDurationChange)
            video.removeEventListener('play', handlePlay)
            video.removeEventListener('pause', handlePause)
            video.removeEventListener('volumechange', handleVolumeChange)
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
        }
    }, [movieSlug])

    const togglePlay = () => {
        const video = videoRef.current
        if (!video) return

        if (video.paused) {
            video.play()
        } else {
            video.pause()
        }
    }

    const handleSeek = (e) => {
        const video = videoRef.current
        if (!video) return

        const rect = e.currentTarget.getBoundingClientRect()
        const clickX = e.clientX - rect.left
        const newTime = (clickX / rect.width) * video.duration
        video.currentTime = newTime
    }

    const handleVolumeChange = (e) => {
        const video = videoRef.current
        if (!video) return

        const newVolume = parseFloat(e.target.value)
        video.volume = newVolume
        setVolume(newVolume)
    }

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return

        video.muted = !video.muted
        setIsMuted(video.muted)
    }

    const toggleFullscreen = () => {
        const video = videoRef.current
        if (!video) return

        if (!document.fullscreenElement) {
            video.requestFullscreen()
        } else {
            document.exitFullscreen()
        }
    }

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const handleVideoEnd = () => {
        // Mark as watched
        localStorage.setItem(`movie_${movieSlug}_watched`, "true")

        // For serials, try to go to next episode
        if (movie?.type === "serial" && movie.grouped_files) {
            const seasonData = movie.grouped_files.find(s => s.season === season)
            const nextEpisode = seasonData?.episodes?.find(e => e.episode === episode + 1)

            if (nextEpisode) {
                navigate(`/watch/${movieSlug}?season=${season}&episode=${episode + 1}`)
                return
            }
        }

        // Navigate back to movie detail
        navigate(`/movies/${movieSlug}`)
    }

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: movie?.title,
                text: movie?.description,
                url: window.location.href,
            })
        }
    }

    if (isLoading) {
        return (
            <div className="watch-page__loading">
                <div className="watch-page__spinner"></div>
                <p>Video yuklanmoqda...</p>
            </div>
        )
    }

    if (error || !movie) {
        return (
            <div className="watch-page__error">
                <h3>Xatolik</h3>
                <p>{error || "Video topilmadi"}</p>
                <button className="watch-page__back-btn" onClick={() => navigate(-1)}>
                    <BsArrowLeft />
                    Orqaga
                </button>
            </div>
        )
    }

    return (
        <div className="watch-page">
            {/* Video Player */}
            <div className="watch-page__player-container">
                <div
                    className="watch-page__video-wrapper"
                    onMouseMove={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                >
                    <video
                        ref={videoRef}
                        className="watch-page__video"
                        poster={movie.poster || movie.cover}
                        onEnded={handleVideoEnd}
                        onClick={togglePlay}
                    />

                    {/* Video Controls Overlay */}
                    <div className={`watch-page__controls ${showControls ? 'show' : ''}`}>
                        {/* Progress Bar */}
                        <div className="watch-page__progress-container" onClick={handleSeek}>
                            <div className="watch-page__progress-bar">
                                <div
                                    className="watch-page__progress-fill"
                                    style={{ width: `${(currentTime / duration) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Bottom Controls */}
                        <div className="watch-page__controls-bottom">
                            <div className="watch-page__controls-left">
                                <button
                                    className="watch-page__control-btn"
                                    onClick={togglePlay}
                                >
                                    {isPlaying ? <BsPause /> : <BsPlay />}
                                </button>

                                <div className="watch-page__time">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                            </div>

                            <div className="watch-page__controls-right">
                                <button
                                    className="watch-page__control-btn"
                                    onClick={toggleMute}
                                >
                                    {isMuted ? <BsVolumeMute /> : <BsVolumeUp />}
                                </button>

                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="watch-page__volume-slider"
                                />

                                <button
                                    className="watch-page__control-btn"
                                    onClick={toggleFullscreen}
                                >
                                    {isFullscreen ? <BsFullscreenExit /> : <BsFullscreen />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Movie Info */}
            <div className="watch-page__info">
                <div className="watch-page__header">
                    <div className="watch-page__actions">
                        <button
                            className={`watch-page__action-btn ${isLiked ? "active" : ""}`}
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <BsHeart size={18} />
                        </button>

                        <button
                            className={`watch-page__action-btn ${isBookmarked ? "active" : ""}`}
                            onClick={() => setIsBookmarked(!isBookmarked)}
                        >
                            <BsBookmark size={18} />
                        </button>

                        <button className="watch-page__action-btn" onClick={handleShare}>
                            <BsShare size={18} />
                        </button>

                        <button className="watch-page__action-btn" onClick={() => navigate(`/movies/${movieSlug}`)}>
                            <BsList size={18} />
                        </button>
                    </div>
                </div>

                <div className="watch-page__details">
                    <h1 className="watch-page__title">
                        {movie.title}
                        {movie.type === "serial" && currentEpisode && (
                            <span className="watch-page__episode-info">
                                - {season}-fasl {episode}-qism
                            </span>
                        )}
                    </h1>

                    {movie.type === "serial" && currentEpisode && (
                        <div className="watch-page__episode-title">
                            {currentEpisode.title || `${episode}-qism`}
                        </div>
                    )}

                    <div className="watch-page__meta">
                        <span>{movie.release_date}</span>
                        <span>{movie.categories?.join(", ")}</span>
                        {movie.duration && <span>{movie.duration} min</span>}
                    </div>

                    {movie.description && (
                        <p className="watch-page__description">{movie.description}</p>
                    )}

                    <div className="watch-page__progress">
                        <div className="watch-page__progress-bar">
                            <div className="watch-page__progress-fill" style={{ width: `${watchProgress}%` }}></div>
                        </div>
                        <span className="watch-page__progress-text">{Math.round(watchProgress)}% ko'rilgan</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WatchPage