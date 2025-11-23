"use client"

import { useEffect, useMemo, useState } from "react"
import Skeleton from "../common/Skeleton"
import ErrorFallback from "../common/ErrorFallback"
import { useNavigate } from "react-router-dom"
import {
    BsBook,
    BsPlayFill,
    BsPeople,
    BsSearch,
    BsStar,
    BsClock,
    BsShield,
    BsTrophy,
    BsArrowRight,
    BsCheckCircleFill,
} from "react-icons/bs"
import { setSeoTags } from "../../utils/seo"

const Tutorials = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let mounted = true
        import("../../api/apiCourses").then(({ getCourseCategories }) => {
            getCourseCategories().then((data) => {
                if (!mounted) return
                setCategories(Array.isArray(data) ? data : [])
                setError(null)
            }).catch(() => {
                if (mounted) setError("Kategoriyalarni yuklashda xatolik yuz berdi")
            }).finally(() => { if (mounted) setLoading(false) })
        })
        return () => { mounted = false }
    }, [])

    useEffect(() => {
        setSeoTags({
            title: "Video Darsliklar — ZiyoFlix",
            description: "ZiyoFlix: O'zbek tilida professional video darsliklar. Kurs kategoriyalarini ko'ring va o'rganishni boshlang.",
            image: "/Ziyo-Flix-Logo.png",
            type: "website"
        })
    }, [])

    const filteredCategories = useMemo(() => (categories || []).filter(
        (category) =>
            (category.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (category.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
    ), [categories, searchQuery])

    const handleCategoryClick = (categorySlug) => {
        navigate(`/tutorials/category/${categorySlug}`)
    }

    const totalVideos = useMemo(() => (categories || []).reduce((sum, cat) => sum + (cat.course_count || 0), 0), [categories])
    const totalHours = 0

    return (
        <div className="tutorials">
            <div className="tutorials__container">
                <div className="tutorials__header">
                    <div className="tutorials__title-section">
                        <h1 className="tutorials__title">Video Darsliklar</h1>
                        <p className="tutorials__subtitle">
                            Professional o'qituvchilar bilan sifatli ta'lim • {totalVideos} ta video • {totalHours} soat
                        </p>
                    </div>
                    <div className="tutorials__controls">
                        <div className="tutorials__search">
                            <BsSearch className="tutorials__search-icon" />
                            <input
                                type="text"
                                placeholder="Kategoriya qidirish..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="tutorials__search-input"
                            />
                        </div>
                    </div>
                </div>

                <div className="tutorial-categories">
                    <div className="tutorial-categories__grid">
                        {loading ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="skeleton-card">
                                    <Skeleton height={140} rounded={12} />
                                    <div style={{ padding: 12 }}>
                                        <Skeleton width="60%" height={18} />
                                        <div style={{ marginTop: 8 }}>
                                            <Skeleton lines={2} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : error ? (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <ErrorFallback message={"Kategoriyalar yuklanmadi"} details={error || "Serverdan ma'lumot kelmadi."} />
                            </div>
                        ) : filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <div
                                    key={category.id}
                                    className="tutorial-category-card"
                                    onClick={() => handleCategoryClick(category.slug)}
                                >
                                    <div className="tutorial-category-card__image-container">
                                        <img
                                            src={category.category_img || "/placeholder.svg"}
                                            alt={category.name}
                                            className="tutorial-category-card__image"
                                        />
                                        <div className="tutorial-category-card__overlay" style={{ background: category.color ? `linear-gradient(135deg, ${category.color}, ${category.color})` : undefined }}>
                                            <div className="tutorial-category-card__play-btn">
                                                <BsPlayFill size={24} />
                                            </div>
                                        </div>

                                        {Boolean(category.isPopular) && (
                                            <div className="tutorial-category-card__badge">
                                                <BsTrophy size={12} />
                                                MASHHUR
                                            </div>
                                        )}
                                    </div>

                                    <div className="tutorial-category-card__content">
                                        <div className="tutorial-category-card__header">
                                            <h3 className="tutorial-category-card__title">{category.name}</h3>
                                            <div className="tutorial-category-card__arrow">
                                                <BsArrowRight size={16} />
                                            </div>
                                        </div>

                                        <p className="tutorial-category-card__description"> {category?.description
                                            ? category.description.length > 100
                                                ? category.description.slice(0, 100) + '...'
                                                : category.description
                                            : 'Tavsif mavjud emas'}</p>

                                        <div className="tutorial-category-card__stats">
                                            <div className="tutorial-category-card__stat">
                                                <BsBook size={14} />
                                                <span>{category.course_count || 0} ta kurs</span>
                                            </div>
                                            <div className="tutorial-category-card__stat">
                                                <BsClock size={14} />
                                                <span>•</span>
                                            </div>
                                        </div>

                                        <div className="tutorial-category-card__footer">
                                            <div className="tutorial-category-card__difficulty" style={{ color: category.color }}>
                                                {category.color ? "" : ""}
                                            </div>
                                            <div
                                                className="tutorial-category-card__color-indicator"
                                                style={{ background: category.color || undefined }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1' }}>
                                <ErrorFallback message={"Hech qanday kategoriya topilmadi"} details={"Qidiruv so'zini o'zgartiring yoki boshqa kategoriyalarni ko'ring"} />
                            </div>
                        )}
                    </div>
                </div>

                {/* <div className="tutorial-instructors">
                    <h2 className="tutorial-instructors__title">Mashhur O'qituvchilar</h2>
                    <div className="tutorial-instructors__grid">
                        {[
                            {
                                id: 1,
                                name: "Akmal Usmonov",
                                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                                specialty: "React.js & JavaScript",
                                students: 12500,
                                rating: 4.9,
                                courses: 8,
                            },
                            {
                                id: 2,
                                name: "Dilnoza Karimova",
                                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                                specialty: "Matematika",
                                students: 8900,
                                rating: 4.7,
                                courses: 5,
                            },
                            {
                                id: 3,
                                name: "Bobur Rahimov",
                                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                                specialty: "Fizika",
                                students: 6750,
                                rating: 4.9,
                                courses: 4,
                            },
                            {
                                id: 4,
                                name: "Malika Norova",
                                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                                specialty: "Ingliz tili",
                                students: 9800,
                                rating: 4.6,
                                courses: 6,
                            },
                        ].map((instructor) => (
                            <div key={instructor.id} className="instructor-card">
                                <div className="instructor-card__avatar">
                                    <img src={instructor.avatar || "/placeholder.svg"} alt={instructor.name} />
                                    <div className="instructor-card__verified">
                                        <BsCheckCircleFill size={12} />
                                    </div>
                                </div>
                                <div className="instructor-card__info">
                                    <h4 className="instructor-card__name">{instructor.name}</h4>
                                    <p className="instructor-card__specialty">{instructor.specialty}</p>
                                    <div className="instructor-card__stats">
                                        <div className="instructor-card__stat">
                                            <BsStar size={12} />
                                            <span>{instructor.rating}</span>
                                        </div>
                                        <div className="instructor-card__stat">
                                            <BsPeople size={12} />
                                            <span>{instructor.students.toLocaleString()}</span>
                                        </div>
                                        <div className="instructor-card__stat">
                                            <BsBook size={12} />
                                            <span>{instructor.courses} kurs</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Tutorials
