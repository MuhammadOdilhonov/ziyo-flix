"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { BsPlayFill, BsStar, BsSearch, BsArrowLeft, BsEye, BsClock, BsCalendar, BsCollection } from "react-icons/bs"
import { getMoviesByCategory } from "../../api/apiMovies"
import { getCategoryBySlug } from "../../api/apiCategory"
import { BaseUrlReels } from "../../api/apiService"
import { setSeoTags, setJsonLd } from "../../utils/seo"

const MovieCategory = () => {
    const { categoryName } = useParams()
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [movies, setMovies] = useState([])
    const [nextUrl, setNextUrl] = useState(null)
    const [categoryBanner, setCategoryBanner] = useState(null)
    const [categoryTitle, setCategoryTitle] = useState("")
    const [categoryDescription, setCategoryDescription] = useState("")

    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                // Fetch movies and category data in parallel
                const [moviesData, categoryData] = await Promise.all([
                    getMoviesByCategory({ slug: categoryName }),
                    getCategoryBySlug(categoryName)
                ])

                if (!mounted) return

                // Set movies data
                setMovies(moviesData.results || [])
                setNextUrl(moviesData.next || null)

                // Set category data
                if (categoryData) {
                    setCategoryBanner(categoryData.category_banner || null)
                    setCategoryTitle(categoryData.name || categoryName)
                    setCategoryDescription(categoryData.description || "")
                }
            } catch (error) {
                console.error("Error loading data:", error)
                if (!mounted) return
                setMovies([])
                setNextUrl(null)
                setCategoryBanner(null)
                setCategoryTitle(categoryName)
                setCategoryDescription("")
            }
        }
        load()
        return () => { mounted = false }
    }, [categoryName])

    useEffect(() => {
        if (!categoryTitle) return
        const image = categoryBanner ? (categoryBanner.startsWith("http") ? categoryBanner : `${BaseUrlReels}${categoryBanner}`) : "/Ziyo-Flix-Logo.png"
        const desc = categoryDescription || `${categoryTitle} kategoriyasidagi kinolar va seriallar.`
        setSeoTags({
            title: `${categoryTitle} — Kinolar — ZiyoFlix`,
            description: desc,
            image,
            type: "website"
        })
        try {
            const list = (movies || []).slice(0, 12).map((m, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                url: `${window.location.origin}/movies/${m.slug}`,
                name: m.title
            }))
            const jsonLd = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: `${categoryTitle} — Kinolar — ZiyoFlix`,
                description: desc,
                hasPart: {
                    "@type": "ItemList",
                    itemListElement: list
                }
            }
            setJsonLd(jsonLd)
        } catch { }
    }, [categoryTitle, categoryDescription, categoryBanner, movies])

    const filteredMovies = movies.filter((movie) => {
        const title = (movie.title || "").toLowerCase()
        const description = (movie.description || "").toLowerCase()
        const q = searchQuery.toLowerCase()
        return title.includes(q) || description.includes(q)
    })

    const handleMovieClick = (slug) => {
        console.log(slug);

        navigate(`/movies/${slug}`)
    }

    return (
        <div className="movie-category">
            {/* Hero Section */}
            <div className="movie-category__hero">
                <div className="movie-category__banner">
                    <img src={categoryBanner || "/placeholder.svg"} alt={categoryTitle || categoryName} />
                    <div className="movie-category__banner-overlay"></div>
                </div>
                <div className="movie-category__hero-content">
                    <button className="movie-category__back-btn" onClick={() => navigate("/movies")}>
                        <BsArrowLeft size={20} />
                        Kinolarga qaytish
                    </button>
                    <div className="movie-category__hero-info">
                        <h1 className="movie-category__title">{categoryTitle || categoryName}</h1>
                        <p className="movie-category__description">{categoryDescription
                            ? categoryDescription.length > 100
                                ? categoryDescription.slice(0, 100) + '...'
                                : categoryDescription
                            : 'Tavsif mavjud emas'}</p>
                        <div className="movie-category__stats">
                            <span className="movie-category__stat">
                                <BsCollection size={16} />
                                {filteredMovies.length} ta kontent
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="movie-category__container">
                <div className="movie-category__controls">
                    <div className="movie-category__search">
                        <BsSearch className="movie-category__search-icon" />
                        <input
                            type="text"
                            placeholder={`${categoryName} ichida qidirish...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="movie-category__search-input"
                        />
                    </div>
                </div>

                <div className="movie-category__content">
                    {filteredMovies.length > 0 ? (
                        filteredMovies.map((movie) => (
                            <div key={movie.id} onClick={() => handleMovieClick(movie.slug)} className="movie-playlist">
                                {movie.type === "serial" && (
                                    <>
                                        <div className="movie-playlist__overlay movie-playlist__overlay--list-1"></div>
                                        <div className="movie-playlist__overlay movie-playlist__overlay--list-2"></div>
                                        <div className="movie-playlist__overlay movie-playlist__overlay--list-3"></div>
                                    </>
                                )}
                                <div className="movie-playlist-card">
                                    <div className="movie-playlist-card__thumbnail">
                                        <div className="movie-playlist-card__type-indicator">
                                            {movie.type === "serial" ? "Serial" : "Movie"}
                                        </div>
                                        <img
                                            src={movie.poster || "/placeholder.svg"}
                                            alt={movie.title}
                                            className="movie-playlist-card__image"
                                        />
                                        <div className="movie-playlist-card__overlay">
                                            <button className="movie-playlist-card__play-btn">
                                                <BsPlayFill size={28} />
                                            </button>
                                        </div>
                                        {movie.type === "serial" && (
                                            <div className="movie-playlist-card__episodes">
                                                {movie.max_season} fasillar {movie.files_count} qisimlar
                                            </div>
                                        )}
                                        <div className="movie-playlist-card__duration">
                                            <BsClock size={12} />
                                            {movie.duration} min
                                        </div>
                                    </div>

                                    <div className="movie-playlist-card__content">
                                        <div className="movie-playlist-card__header">
                                            <h3 className="movie-playlist-card__title">{movie.title}</h3>
                                            <div className="movie-playlist-card__rating">
                                                <BsStar className="movie-playlist-card__star" />
                                                <span>{movie.average_rating ?? 5}</span>
                                            </div>
                                        </div>

                                        <div className="movie-playlist-card__meta">
                                            <span className="movie-playlist-card__year">
                                                <BsCalendar size={12} />
                                                {movie.release_date}
                                            </span>
                                        </div>

                                        <p className="movie-playlist-card__description">{movie.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="movie-category__empty">
                            <div className="movie-category__empty-icon">
                                <BsSearch size={48} />
                            </div>
                            <h3>Hech narsa topilmadi</h3>
                            <p>Bu kategoriyada sizning qidiruv so'rovingiz bo'yicha hech qanday kontent topilmadi</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MovieCategory