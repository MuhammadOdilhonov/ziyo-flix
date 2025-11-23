"use client"
import { useEffect, useState } from "react"
import Skeleton from "../../common/Skeleton"
import ErrorFallback from "../../common/ErrorFallback"
import { useNavigate } from "react-router-dom"
import { BsPlayFill, BsStar } from "react-icons/bs"
import { getHomepageMovies } from "../../../api/apiHomepageMovies"

const MoviesRow = () => {
    const navigate = useNavigate()
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                const list = await getHomepageMovies()
                if (mounted) setMovies(Array.isArray(list) ? list : [])
            } catch (e) {
                if (mounted) {
                    setMovies([])
                    setError(e?.message || "")
                }
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => { mounted = false }
    }, [])

    const handleMovieClick = (movie) => {
        const slug = movie?.slug || movie?.id
        navigate(`/movies/${slug}`)
    }

    const handleViewAll = () => {
        navigate("/movies")
    }

    return (
        <section className="movies-row">
            <div className="movies-row__container">
                <div className="movies-row__header">
                    <h2 className="movies-row__title">Mashhur Kinolar</h2>
                    <button className="movies-row__view-all" onClick={handleViewAll}>
                        Barchasini ko'rish
                    </button>
                </div>

                <div className="movies-row__grid">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton-card">
                                <Skeleton height={140} rounded={12} />
                                <div style={{ padding:12 }}>
                                    <Skeleton width="70%" height={16} />
                                    <div style={{ marginTop:8 }}>
                                        <Skeleton width="40%" height={12} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (error || movies.length === 0) ? (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <ErrorFallback message={"Kinolar yuklanmadi"} details={error || "Serverdan ma'lumot kelmadi."} />
                        </div>
                    ) : (
                    movies.map((movie) => (
                        <div key={movie.id || movie.slug} className="movie-card" onClick={() => handleMovieClick(movie)}>
                            <div className="movie-card__image-container">
                                <img src={movie.poster || movie.cover || "/placeholder.svg"} alt={movie.title} className="movie-card__image" />
                                <div className="movie-card__overlay">
                                    <button className="movie-card__play-btn">
                                        <BsPlayFill size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="movie-card__info">
                                <h3 className="movie-card__title">{movie.title}</h3>
                                <div className="movie-card__meta">
                                    <span className="movie-card__genre">{movie.type}</span>
                                    <span className="movie-card__year">{movie.release_date?.slice(0,4) || ''}</span>
                                </div>
                                <div className="movie-card__rating">
                                    <BsStar className="movie-card__star" />
                                    <span>{movie.average_rating ?? '-'}</span>
                                </div>
                            </div>
                        </div>
                    ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default MoviesRow
