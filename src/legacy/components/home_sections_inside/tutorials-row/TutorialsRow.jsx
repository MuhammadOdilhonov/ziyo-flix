"use client"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Skeleton from "../../common/Skeleton"
import ErrorFallback from "../../common/ErrorFallback"
import { BsBook, BsPlayFill, BsPeople } from "react-icons/bs"

const TutorialsRow = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    // Mock data for tutorials
    const tutorials = [
        {
            id: 1,
            title: "React.js Asoslari",
            subject: "Dasturlash",
            instructor: "Akmal Usmonov",
            lessons: 24,
            students: 1250,
            level: "Boshlang'ich",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
            duration: "12 soat",
        },
        {
            id: 2,
            title: "Matematika Asoslari",
            subject: "Matematika",
            instructor: "Dilnoza Karimova",
            lessons: 18,
            students: 890,
            level: "O'rta",
            image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=200&fit=crop",
            duration: "8 soat",
        },
        {
            id: 3,
            title: "Fizika Qonunlari",
            subject: "Fizika",
            instructor: "Bobur Rahimov",
            lessons: 20,
            students: 675,
            level: "Yuqori",
            image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=300&h=200&fit=crop",
            duration: "10 soat",
        },
        {
            id: 4,
            title: "Python Dasturlash",
            subject: "Dasturlash",
            instructor: "Sardor Toshev",
            lessons: 30,
            students: 2100,
            level: "Boshlang'ich",
            image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=200&fit=crop",
            duration: "15 soat",
        },
        {
            id: 5,
            title: "Ingliz Tili",
            subject: "Til",
            instructor: "Malika Norova",
            lessons: 40,
            students: 1800,
            level: "O'rta",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop",
            duration: "20 soat",
        },
        {
            id: 6,
            title: "Grafik Dizayn",
            subject: "Dizayn",
            instructor: "Jasur Alimov",
            lessons: 25,
            students: 950,
            level: "O'rta",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop",
            duration: "12 soat",
        },
    ]

    useEffect(() => {
        // Simulate async load to keep UX consistent across Home sections
        const t = setTimeout(() => setLoading(false), 500)
        return () => clearTimeout(t)
    }, [])

    const handleTutorialClick = (tutorialId) => {
        navigate(`/tutorials/${tutorialId}`)
    }

    const handleViewAll = () => {
        navigate("/tutorials")
    }

    return (
        <section className="tutorials-row">
            <div className="tutorials-row__container">
                <div className="tutorials-row__header">
                    <h2 className="tutorials-row__title">Video Darsliklar</h2>
                    <button className="tutorials-row__view-all" onClick={handleViewAll}>
                        Barchasini ko'rish
                    </button>
                </div>

                <div className="tutorials-row__grid">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="skeleton-card">
                                <Skeleton height={120} rounded={12} />
                                <div style={{ padding:12 }}>
                                    <Skeleton width="65%" height={16} />
                                    <div style={{ marginTop:8 }}>
                                        <Skeleton width="50%" height={12} />
                                    </div>
                                    <div style={{ marginTop:10, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                                        <Skeleton height={12} />
                                        <Skeleton height={12} />
                                        <Skeleton height={12} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (tutorials.length === 0) ? (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <ErrorFallback message={"Darsliklar topilmadi"} details={"Serverdan ma'lumot kelmadi."} />
                        </div>
                    ) : (
                    tutorials.map((tutorial) => (
                        <div key={tutorial.id} className="tutorial-card" onClick={() => handleTutorialClick(tutorial.id)}>
                            <div className="tutorial-card__image-container">
                                <img src={tutorial.image || "/placeholder.svg"} alt={tutorial.title} className="tutorial-card__image" />
                                <div className="tutorial-card__overlay">
                                    <button className="tutorial-card__play-btn">
                                        <BsPlayFill size={24} />
                                    </button>
                                </div>
                                <div className="tutorial-card__level">{tutorial.level}</div>
                            </div>

                            <div className="tutorial-card__info">
                                <div className="tutorial-card__subject">
                                    <BsBook size={14} />
                                    {tutorial.subject}
                                </div>
                                <h3 className="tutorial-card__title">{tutorial.title}</h3>
                                <p className="tutorial-card__instructor">Ustoz: {tutorial.instructor}</p>

                                <div className="tutorial-card__stats">
                                    <div className="tutorial-card__stat">
                                        <span className="tutorial-card__stat-number">{tutorial.lessons}</span>
                                        <span className="tutorial-card__stat-label">Dars</span>
                                    </div>
                                    <div className="tutorial-card__stat">
                                        <BsPeople size={14} />
                                        <span className="tutorial-card__stat-number">{tutorial.students}</span>
                                    </div>
                                    <div className="tutorial-card__stat">
                                        <span className="tutorial-card__duration">{tutorial.duration}</span>
                                    </div>
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

export default TutorialsRow
