import Link from 'next/link'

const API_BASE = 'https://ziyo-flix-service.uz/api'
const MEDIA_BASE = 'https://ziyo-flix-service.uz'

export const dynamic = 'force-dynamic'

async function fetchMovie(slug) {
    try {
        const res = await fetch(`${API_BASE}/get-movies/${encodeURIComponent(slug)}`, {
            // Avoid caching while developing; adjust to 'force-cache' or revalidate in prod
            cache: 'no-store',
        })
        if (!res.ok) return null
        return await res.json()
    } catch {
        return null
    }
}

export async function generateMetadata({ params }) {
    const raw = params?.movieSlug ?? ''
    const slug = typeof raw === 'string' ? raw : String(raw)
    const movie = await fetchMovie(slug)
    const siteName = 'ZiyoFlix'

    if (!movie) {
        return {
            title: `${siteName}`,
            description: 'ZiyoFlix — kinolar, seriallar va onlayn kurslar platformasi',
        }
    }

    const title = `${movie.title} — ${siteName}`
    const description = movie.description || 'ZiyoFlix - kinolar va seriallar.'
    const image = movie.poster || movie.cover || '/Ziyo-Flix-Logo.png'
    const absImage = image?.startsWith('http') ? image : `${MEDIA_BASE}${image?.startsWith('/') ? image : `/${image}`}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            siteName,
            type: movie.type === 'movie' ? 'video.movie' : 'video.episode',
            images: [{ url: absImage }],
            locale: 'uz_UZ',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [absImage],
        },
    }
}

export default async function MovieDetailPage({ params, searchParams }) {
    const raw = params?.movieSlug ?? ''
    const slug = typeof raw === 'string' ? raw : String(raw)
    const movie = await fetchMovie(slug)

    if (!movie) {
        return <div className="movie-detail" style={{ padding: 24 }}>Topilmadi</div>
    }

    const banner = movie.cover || movie.poster || '/placeholder.svg'
    const poster = movie.poster || '/placeholder.svg'
    const year = movie.release_date || ''
    const rating = movie.average_rating ?? '—'
    const duration = movie.duration ? `${movie.duration} min` : ''

    const firstSeason = Array.isArray(movie.grouped_files) ? movie.grouped_files[0] : null
    const episodes = firstSeason?.episodes || []
    const seasonNum = firstSeason?.season || 1

    return (
        <div className="movie-detail">
            <div className="movie-detail__hero">
                <div className="movie-detail__banner">
                    <img src={banner} alt={movie.title} className="movie-detail__banner-image" />
                    <div className="movie-detail__banner-overlay"></div>
                </div>

                <div className="movie-detail__hero-content">
                    <div className="movie-detail__poster">
                        <img src={poster} alt={movie.title} className="movie-detail__poster-image" />
                        <div className="movie-detail__poster-overlay">
                            <Link className="movie-detail__poster-play" href={`/watch/${movie.slug}`}>▶</Link>
                        </div>
                    </div>

                    <div className="movie-detail__main-info">
                        <div className="movie-detail__title-section">
                            <h1 className="movie-detail__title">{movie.title}</h1>
                        </div>

                        <div className="movie-detail__meta">
                            {!!year && (
                                <div className="movie-detail__year">📅 {year}</div>
                            )}
                            {!!duration && (
                                <div className="movie-detail__duration">⏱ {duration}</div>
                            )}
                            <div className="movie-detail__rating">⭐ {rating}</div>
                        </div>

                        <p className="movie-detail__description">{movie.description}</p>

                        <div className="movie-detail__actions">
                            <Link className="movie-detail__watch-btn" href={`/watch/${movie.slug}`}>▶ Tomosha qilish</Link>
                        </div>
                    </div>
                </div>
            </div>

            {movie.type === 'serial' && episodes.length > 0 && (
                <div className="movie-detail__content">
                    <div className="movie-detail__container">
                        <div className="movie-detail__layout">
                            <div className="movie-detail__main-content">
                                <h2>Fasllar va Qismlar</h2>
                                <div className="episodes-grid">
                                    {episodes.map((ep) => (
                                        <Link
                                            key={ep.id}
                                            className="episode-card"
                                            href={`/watch/${movie.slug}?season=${seasonNum}&episode=${ep.episode}`}
                                        >
                                            <div className="episode-card__thumbnail">
                                                <div className="episode-card__number">{ep.episode}</div>
                                                <div className="episode-card__duration">⏱ {ep.duration ?? '—'}</div>
                                            </div>
                                            <div className="episode-card__info">
                                                <h4>{ep.title || `${ep.episode}-qism`}</h4>
                                                <p className="episode-card__date">{ep.created_at?.slice(0, 10)}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
