import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    BsPlayFill,
    BsStar,
    BsShare,
    BsHeart,
    BsBookmark,
    BsArrowLeft,
    BsEye,
    BsClock,
    BsCalendar,
    BsGlobe,
    BsCollection,
    BsCheckCircle,
    BsChevronDown,
    BsChevronUp
} from "react-icons/bs"
import { getMovieDetail } from "../../api/apiMovies"
import { BaseUrlReels } from "../../api/apiService"
import { setSeoTags, setJsonLd, setJsonLdById, setPreloadImage } from "../../utils/seo"

const toAbs = (path) => {
    if (!path) return ""
    if (path.startsWith("http")) return path
    return `${BaseUrlReels}${path.startsWith("/") ? path : `/${path}`}`
}

const MovieDetail = () => {
    const { movieSlug } = useParams()
    const navigate = useNavigate()
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [selectedSeason, setSelectedSeason] = useState(1)
    const [selectedEpisode, setSelectedEpisode] = useState(1)
    const [expandedSeason, setExpandedSeason] = useState(1)
    const [movie, setMovie] = useState(null)

    useEffect(() => {
        let mounted = true
        getMovieDetail(movieSlug).then((data) => {
            if (!mounted) return
            setMovie(data)
            const season = data?.grouped_files?.[0]?.season || 1
            setSelectedSeason(season)
            setExpandedSeason(season)
        })
        return () => { mounted = false }
    }, [movieSlug])

    useEffect(() => {
        if (!movie) return
        const title = `${movie.title} — ZiyoFlix`
        const description = movie.description || "ZiyoFlix - kinolar va seriallar."
        const image = movie.poster || movie.cover || "/Ziyo-Flix-Logo.png"
        setSeoTags({
            title,
            description,
            image: image?.startsWith("http") ? image : `${BaseUrlReels}${image?.startsWith("/") ? image : `/${image}`}`,
            type: movie.type === "movie" ? "video.movie" : "video.episode",
        })

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": movie.type === "movie" ? "Movie" : "TVSeries",
            "name": movie.title,
            "description": description,
            ...(image ? { "image": image?.startsWith("http") ? image : `${BaseUrlReels}${image?.startsWith("/") ? image : `/${image}`}` } : {}),
            ...(movie.release_date ? { "datePublished": movie.release_date } : {}),
            ...(movie.duration ? { "duration": `PT${Number(movie.duration)}M` } : {}),
        }
        setJsonLd(jsonLd)

        try {
            const origin = window.location.origin
            setJsonLdById('ld-breadcrumb', {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", position: 1, name: "Bosh sahifa", item: `${origin}/` },
                    { "@type": "ListItem", position: 2, name: "Kinolar", item: `${origin}/movies` },
                    { "@type": "ListItem", position: 3, name: movie.title, item: `${origin}/movies/${movie.slug}` }
                ]
            })
        } catch { }

        try {
            const abs = image?.startsWith("http") ? image : `${BaseUrlReels}${image?.startsWith("/") ? image : `/${image}`}`
            setPreloadImage(abs)
        } catch { }
    }, [movie])

    const handleWatch = () => {
        if (!movie) return
        if (movie.type === "serial") {
            navigate(`/watch/${movie.slug}?season=${selectedSeason}&episode=${selectedEpisode}`)
        } else {
            navigate(`/watch/${movie.slug}`)
        }
    }

    const handleEpisodeWatch = (seasonNum, episodeNum) => {
        if (!movie) return
        navigate(`/watch/${movie.slug}?season=${seasonNum}&episode=${episodeNum}`)
    }

    const toggleSeason = (seasonNumber) => {
        setExpandedSeason(expandedSeason === seasonNumber ? null : seasonNumber)
        setSelectedSeason(seasonNumber)
    }

    if (!movie) {
        return (
            <div className="movie-detail" style={{ padding: 24 }}>
                Yuklanmoqda...
            </div>
        )
    }

    return (
        <div className="movie-detail">
            {/* Hero Section */}
            <div className="movie-detail__hero">
                <div className="movie-detail__banner">
                    <img
                        src={movie.cover || movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        className="movie-detail__banner-image"
                    />
                    <div className="movie-detail__banner-overlay"></div>
                </div>

                <div className="movie-detail__hero-content">
                    <button
                        className="movie-detail__back-btn"
                        onClick={() => navigate(-1)}
                    >
                        <BsArrowLeft />
                        Orqaga
                    </button>

                    <div className="movie-detail__hero-info">
                        <div className="movie-detail__poster">
                            <img
                                src={movie.poster || "/placeholder.svg"}
                                alt={movie.title}
                                className="movie-detail__poster-image"
                            />
                            <div className="movie-detail__poster-overlay">
                                <button
                                    className="movie-detail__poster-play"
                                    onClick={handleWatch}
                                >
                                    <BsPlayFill size={32} />
                                </button>
                            </div>
                        </div>

                        <div className="movie-detail__main-info">
                            <div className="movie-detail__title-section">
                                <h1 className="movie-detail__title">{movie.title}</h1>
                                <div className="movie-detail__status">
                                    <span className={`movie-detail__status-badge ${movie.is_published ? 'completed' : 'ongoing'}`}>
                                        <BsCheckCircle />
                                        {movie.is_published ? 'Nashr etilgan' : 'Nashr etilmagan'}
                                    </span>
                                </div>
                            </div>

                            <div className="movie-detail__meta">
                                <div className="movie-detail__year">
                                    <BsCalendar />
                                    {movie.release_date}
                                </div>
                                {movie.duration && (
                                    <div className="movie-detail__duration">
                                        <BsClock />
                                        {movie.duration} min
                                    </div>
                                )}
                                <div className="movie-detail__rating">
                                    <BsStar className="movie-detail__star" />
                                    {movie.average_rating ?? '—'}
                                </div>
                            </div>

                            <div className="movie-detail__genres">
                                {movie.categories?.map((genre, index) => (
                                    <span key={index} className="movie-detail__genre">
                                        {genre}
                                    </span>
                                ))}
                            </div>

                            <p className="movie-detail__description">
                                {movie.description}
                            </p>

                            <div className="movie-detail__actions">
                                <button
                                    className="movie-detail__watch-btn"
                                    onClick={handleWatch}
                                >
                                    <BsPlayFill />
                                    {movie.type === "serial" ? `${selectedSeason}-fasl ${selectedEpisode}-qismni ko'rish` : "Ko'rish"}
                                </button>

                                <button
                                    className={`movie-detail__action-btn ${isLiked ? 'active' : ''}`}
                                    onClick={() => setIsLiked(!isLiked)}
                                    title="Yoqtirish"
                                >
                                    <BsHeart />
                                </button>

                                <button
                                    className={`movie-detail__action-btn ${isBookmarked ? 'active' : ''}`}
                                    onClick={() => setIsBookmarked(!isBookmarked)}
                                    title="Saqlash"
                                >
                                    <BsBookmark />
                                </button>

                                <button
                                    className="movie-detail__action-btn"
                                    onClick={() => {
                                        if (navigator.share) navigator.share({ title: movie.title, text: movie.description, url: window.location.href })
                                    }}
                                    title="Ulashish"
                                >
                                    <BsShare />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="movie-detail__content">
                <div className="movie-detail__container">
                    <div className="movie-detail__layout">
                        {/* Main Content */}
                        <div className="movie-detail__main-content">
                            {movie.type === "serial" && (
                                <div className="movie-detail__series-content">
                                    <div className="movie-detail__seasons">
                                        <h2>Fasllar va Qismlar</h2>
                                        <div className="seasons-accordion">
                                            {(movie.grouped_files || []).map((season) => {
                                                const isExpanded = expandedSeason === season.season
                                                return (
                                                    <div key={season.season} className={`season-accordion-item ${isExpanded ? 'expanded' : ''}`}>
                                                        <button className="season-accordion-header" onClick={() => toggleSeason(season.season)}>
                                                            <div className="season-accordion-info">
                                                                <div className="season-accordion-details">
                                                                    <h3>{season.season}-fasl</h3>
                                                                    <p className="season-meta">{season.episodes?.length || 0} qism</p>
                                                                </div>
                                                            </div>
                                                            <div className="season-accordion-icon">
                                                                <BsChevronDown />
                                                            </div>
                                                        </button>

                                                        <div className="season-accordion-content">
                                                            <div className="episodes-grid">
                                                                {(season.episodes || []).map((ep) => {
                                                                    const hls = toAbs(ep.hls_playlist_url)
                                                                    const sourceFile = toAbs(ep.upload_file)
                                                                    return (
                                                                        <div
                                                                            key={ep.id}
                                                                            className={`episode-card ${selectedEpisode === ep.episode && selectedSeason === season.season ? 'active' : ''}`}
                                                                            onClick={() => {
                                                                                setSelectedEpisode(ep.episode);
                                                                                setSelectedSeason(season.season);
                                                                                handleEpisodeWatch(season.season, ep.episode);
                                                                            }}
                                                                        >
                                                                            <div className="episode-card__thumbnail">
                                                                                <div className="episode-card__number">{ep.episode}</div>
                                                                                <div className="episode-card__duration"><BsClock />{ep.duration ?? '—'}</div>
                                                                            </div>
                                                                            <div className="episode-card__info">
                                                                                <h4>{ep.title || `${ep.episode}-qism`}</h4>
                                                                                <p className="episode-card__date">{ep.created_at?.slice(0, 10)}</p>
                                                                                <p className="episode-card__description">{sourceFile ? sourceFile.split('/').pop() : ''}</p>

                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar - Details */}
                        <div className="movie-detail__sidebar">
                            <div className="movie-detail__info-section">
                                <h2>Batafsil ma'lumot</h2>
                                <p className="movie-detail__full-description">{movie.description || '—'}</p>

                                <div className="movie-detail__details">
                                    <div className="movie-detail__detail-item">
                                        <strong>Chiqarilgan sana:</strong>
                                        <span>{movie.release_date || '—'}</span>
                                    </div>
                                    <div className="movie-detail__detail-item">
                                        <strong>Tur:</strong>
                                        <span>{movie.type === 'serial' ? 'Serial' : movie.type === 'movie' ? 'Film' : '—'}</span>
                                    </div>
                                    {movie.duration && (
                                        <div className="movie-detail__detail-item">
                                            <strong>Davomiyligi:</strong>
                                            <span>{movie.duration} min</span>
                                        </div>
                                    )}
                                    <div className="movie-detail__detail-item">
                                        <strong>Reyting:</strong>
                                        <span>
                                            <BsStar style={{ color: '#f59e0b', marginRight: '4px' }} />
                                            {movie.average_rating || '—'}
                                        </span>
                                    </div>
                                    {movie.categories && movie.categories.length > 0 && (
                                        <div className="movie-detail__detail-item">
                                            <strong>Kategoriyalar:</strong>
                                            <span>{movie.categories.join(', ')}</span>
                                        </div>
                                    )}
                                    {movie.type === 'serial' && movie.max_season && (
                                        <div className="movie-detail__detail-item">
                                            <strong>Fasllar:</strong>
                                            <span>{movie.max_season} ta fasl</span>
                                        </div>
                                    )}
                                    {movie.type === 'serial' && movie.files_count && (
                                        <div className="movie-detail__detail-item">
                                            <strong>Qismlar:</strong>
                                            <span>{movie.files_count} ta qism</span>
                                        </div>
                                    )}
                                    <div className="movie-detail__detail-item">
                                        <strong>Holat:</strong>
                                        <span className={movie.is_published ? 'status-published' : 'status-unpublished'}>
                                            {movie.is_published ? 'Nashr etilgan' : 'Nashr etilmagan'}
                                        </span>
                                    </div>
                                    {movie.created_at && (
                                        <div className="movie-detail__detail-item">
                                            <strong>Qo'shilgan:</strong>
                                            <span>{new Date(movie.created_at).toLocaleDateString('uz-UZ')}</span>
                                        </div>
                                    )}
                                    {movie.updated_at && (
                                        <div className="movie-detail__detail-item">
                                            <strong>Yangilangan:</strong>
                                            <span>{new Date(movie.updated_at).toLocaleDateString('uz-UZ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieDetail