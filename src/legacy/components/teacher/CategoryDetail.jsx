"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FiArrowLeft, FiEye } from "react-icons/fi"

const mockLessons = (months, lessonsPerMonth) => {
    const data = []
    for (let m = 1; m <= months; m++) {
        const monthLessons = []
        for (let i = 1; i <= lessonsPerMonth; i++) {
            monthLessons.push({
                id: `${m}-${i}`,
                title: `Dars ${i}`,
                status: ["pending", "approved", "rejected"][Math.floor(Math.random() * 3)],
                reason: Math.random() > 0.7 ? "Kontent talablarga mos emas" : "",
                views: Math.floor(Math.random() * 500),
                likes: Math.floor(Math.random() * 100),
                price: Math.floor(Math.random() * 50) + 10,
            })
        }
        data.push({ month: m, lessons: monthLessons })
    }
    return data
}

const CategoryDetail = () => {
    const { categoryId } = useParams()
    const navigate = useNavigate()
    const [category, setCategory] = useState(null)

    useEffect(() => {
        // Fetch category detail; mocked here
        const cat = {
            id: categoryId,
            name: "JavaScript Asoslari",
            months: 3,
            lessonsPerMonth: 6,
        }
        setCategory(cat)
    }, [categoryId])

    const table = useMemo(() => {
        if (!category) return []
        return mockLessons(category.months, category.lessonsPerMonth)
    }, [category])

    if (!category) return null

    return (
        <div className="teacher-category-detail">
            <div className="detail-header">
                <button className="btn btn-secondary" onClick={() => navigate(-1)}><FiArrowLeft /> Ortga</button>
                <div>
                    <h1>{category.name}</h1>
                    <p>{category.months} oy • {category.lessonsPerMonth} dars/oy</p>
                </div>
            </div>

            <div className="months-table">
                {table.map((row) => (
                    <div key={row.month} className="month-block">
                        <h3>{row.month}-oy</h3>
                        <div className="lessons-table">
                            <div className="table-head">
                                <span>Sarlavha</span>
                                <span>Status</span>
                                <span>Sabab</span>
                                <span>Ko'rish</span>
                                <span>Like</span>
                                <span>Narx</span>
                                <span>Amal</span>
                            </div>
                            {row.lessons.map((ls) => (
                                <div key={ls.id} className="table-row">
                                    <span>{ls.title}</span>
                                    <span className={`status-badge status-${ls.status}`}>{ls.status}</span>
                                    <span className="reason">{ls.reason || '-'}</span>
                                    <span>{ls.views}</span>
                                    <span>{ls.likes}</span>
                                    <span>{ls.price} FC</span>
                                    <span>
                                        <button className="btn btn-secondary btn-sm"><FiEye /> Ko'rish</button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryDetail


