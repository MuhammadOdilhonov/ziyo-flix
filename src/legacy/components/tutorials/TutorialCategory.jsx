"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    BsBook,
    BsPlayFill,
    BsPeople,
    BsSearch,
    BsGrid,
    BsList,
    BsStarFill,
    BsClock,
    BsCheckCircle,
    BsShield,
    BsTrophy,
    BsArrowLeft,
} from "react-icons/bs"
import { setSeoTags } from "../../utils/seo"
import { BaseUrlReels } from "../../api/apiService"

const TutorialCategory = () => {
    const { categorySlug } = useParams()
    const navigate = useNavigate()
    const [selectedLevel, setSelectedLevel] = useState("all")
    const [viewMode, setViewMode] = useState("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("popular")
    const [currentCategory, setCurrentCategory] = useState(null)
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [nextPage, setNextPage] = useState(null)

    useEffect(() => {
        let mounted = true
            ; (async () => {
                try {
                    const { getCourseCategories, getCoursesByCategory } = await import("../../api/apiCourses")
                    const cats = await getCourseCategories()
                    const category = Array.isArray(cats) ? cats.find(c => c.slug === categorySlug) : null
                    if (mounted) setCurrentCategory(category || null)

                    const list = await getCoursesByCategory({ categorySlug })
                    if (!mounted) return
                    setCourses(Array.isArray(list.results) ? list.results : [])
                    setNextPage(list.next || null)
                } catch (e) {
                    if (mounted) {
                        setCourses([])
                        setNextPage(null)
                    }
                } finally {
                    if (mounted) setLoading(false)
                }
            })()
        return () => { mounted = false }
    }, [categorySlug])

    useEffect(() => {
        if (!currentCategory) return
        const image = currentCategory.category_banner || currentCategory.category_img || "/Ziyo-Flix-Logo.png"
        const abs = (img) => (img?.startsWith?.("http") ? img : `${BaseUrlReels}${img || ''}`)
        const desc = currentCategory.description || `${currentCategory.name} kategoriyasidagi kurslar.`
        setSeoTags({
            title: `${currentCategory.name} — Darsliklar — ZiyoFlix`,
            description: desc,
            image: abs(image),
            type: "website"
        })
    }, [currentCategory])

    if (!currentCategory) {
        return (
            <div className="tutorial-category-error">
                <h2>Kategoriya topilmadi</h2>
                <button onClick={() => navigate("/tutorials")}>Orqaga qaytish</button>
            </div>
        )
    }

    const levels = [
        { id: "all", name: "Barchasi" },
        { id: "beginner", name: "Boshlang'ich" },
        { id: "intermediate", name: "O'rta" },
        { id: "advanced", name: "Yuqori" },
    ]

    const filteredTutorials = (courses || []).filter((tutorial) => {
        const matchesLevel = selectedLevel === "all" || tutorial.difficulty === selectedLevel
        const matchesSearch =
            (tutorial.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (tutorial.description || "").toLowerCase().includes(searchQuery.toLowerCase())
        return matchesLevel && matchesSearch
    })

    const handleTutorialClick = (tutorialSlug) => {
        navigate(`/tutorials/${tutorialSlug}`)
    }

    return (
        <div className="tutorial-category">
            <div className="tutorial-category__container">
                <div className="tutorial-category__header">
                    <button className="tutorial-category__back-btn" onClick={() => navigate("/tutorials")}>
                        <BsArrowLeft size={20} />
                        Orqaga
                    </button>

                    <div className="tutorial-category__hero">
                        <div className="tutorial-category__hero-bg" style={{ backgroundImage: currentCategory?.category_banner ? `url(${currentCategory.category_banner})` : undefined, backgroundColor: currentCategory?.color || undefined, opacity: 0.9, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                            <div className="tutorial-category__hero-content" >
                                <h1 className="tutorial-category__title">{currentCategory.name}</h1>
                                <p className="tutorial-category__description"> {currentCategory?.description
                                    ? currentCategory.description.length > 100
                                        ? currentCategory.description.slice(0, 150) + '...'
                                        : currentCategory.description
                                    : 'Tavsif mavjud emas'}</p>
                                <div className="tutorial-category__stats">
                                    <div className="tutorial-category__stat">
                                        <BsBook size={16} />
                                        <span>{currentCategory.course_count || 0} ta kurs</span>
                                    </div>
                                    <div className="tutorial-category__stat">
                                        <BsPeople size={16} />
                                        <span>
                                            {/* Aggregated students not provided; placeholder */}
                                            0 o'quvchi
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tutorial-category__controls">
                    <div className="tutorial-category__filters">
                        <div className="tutorial-category__levels">
                            {levels.map((level) => (
                                <button
                                    key={level.id}
                                    className={`tutorial-category__level ${selectedLevel === level.id ? "active" : ""}`}
                                    onClick={() => setSelectedLevel(level.id)}
                                    style={
                                        selectedLevel === level.id
                                            ? {
                                                backgroundColor: currentCategory?.color,
                                                borderColor: currentCategory?.color,
                                            }
                                            : {}
                                    }
                                >
                                    {level.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="tutorial-category__actions">
                        <div className="tutorial-category__search">
                            <BsSearch className="tutorial-category__search-icon" />
                            <input
                                type="text"
                                placeholder="Kurs qidirish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="tutorial-category__search-input"
                            />
                        </div>
                    </div>
                </div>

                <div className="tutorial-category__courses-grid">
                    {filteredTutorials.length > 0 ? (
                        filteredTutorials.map((tutorial) => (
                            <div key={tutorial.id} onClick={() => handleTutorialClick(tutorial.slug)} className="tutorial-course-card">
                                <div className="tutorial-course-card__thumbnail">
                                    <img
                                        src={tutorial.thumbnail || tutorial.cover || "/placeholder.svg"}
                                        alt={tutorial.title}
                                        className="tutorial-course-card__image"
                                    />
                                    <div className="tutorial-course-card__overlay">
                                        <button className="tutorial-course-card__play-btn">
                                            <BsPlayFill size={32} />
                                        </button>
                                    </div>

                                    <div className="tutorial-course-card__badges">
                                        {tutorial.is_new && <span className="tutorial-course-card__badge tutorial-course-card__badge--new">YANGI</span>}
                                        {tutorial.is_bestseller && (
                                            <span className="tutorial-course-card__badge tutorial-course-card__badge--bestseller">
                                                <BsTrophy size={12} />
                                                BESTSELLER
                                            </span>
                                        )}
                                    </div>

                                    <div className="tutorial-course-card__duration">
                                        <BsClock size={12} />
                                        {tutorial.total_duration_minutes ? `${tutorial.total_duration_minutes} min` : ""}
                                    </div>
                                </div>

                                <div className="tutorial-course-card__content">
                                    <h3 className="tutorial-course-card__title">{tutorial.title}</h3>
                                    <p className="tutorial-course-card__description">
                                        {tutorial.description?.length > 150
                                            ? `${tutorial.description.substring(0, 150)}...`
                                            : tutorial.description}
                                    </p>

                                    <div className="tutorial-course-card__meta">
                                        <div className="tutorial-course-card__rating">
                                            <BsStarFill className="tutorial-course-card__star" />
                                            <span>{tutorial.rating_avg || 0} ({tutorial.rating_count || 0})</span>
                                        </div>
                                        <div className="tutorial-course-card__level">{tutorial.level}</div>
                                    </div>

                                    <div className="tutorial-course-card__stats">
                                        <div className="tutorial-course-card__stat">
                                            <BsBook size={14} />
                                            <span>{tutorial.lessons_count || 0} dars</span>
                                        </div>
                                        <div className="tutorial-course-card__stat">
                                            <BsCheckCircle size={14} />
                                            <span>Sertifikat</span>
                                        </div>
                                    </div>

                                    <div className="tutorial-course-card__footer">
                                        <div className="tutorial-course-card__price-info">
                                            <span className="tutorial-course-card__price">
                                                {new Intl.NumberFormat("uz-UZ").format(Number(tutorial.price || 0))} so'm
                                            </span>
                                            {tutorial.purchase_scope === "course_type" && (
                                                <span className="tutorial-course-card__payment-type">Oylik to'lov</span>
                                            )}
                                            {tutorial.purchase_scope === "course" && (
                                                <span className="tutorial-course-card__payment-type">Butun kurs</span>
                                            )}
                                        </div>

                                        {tutorial.isPurchased ? (
                                            <button className="tutorial-course-card__btn tutorial-course-card__btn--continue">
                                                <BsCheckCircle size={16} />
                                                Davom etish
                                            </button>
                                        ) : (
                                            <button className="tutorial-course-card__btn tutorial-course-card__btn--buy">
                                                Sotib olish
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="tutorial-category__empty">
                            <div className="tutorial-category__empty-icon">
                                <img src="/images_and_gif/loading.gif" alt="ziyo-flix" />
                            </div>
                            <h3>Hech qanday kurs topilmadi</h3>
                            <p>Boshqa filtrlarni sinab ko'ring yoki qidiruv so'zini o'zgartiring</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TutorialCategory
