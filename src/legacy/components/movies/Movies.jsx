"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Skeleton from "../common/Skeleton"
import ErrorFallback from "../common/ErrorFallback"
import { BsPlayFill, BsStar, BsGrid, BsList, BsSearch, BsEye } from "react-icons/bs"
import { getCategories } from "../../api/apiCategory"
import { setSeoTags } from "../../utils/seo"

const Movies = () => {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState([
    { id: "all", name: "Barchasi", count: 0, image: "", description: "Barcha kategoriyalar" },
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    getCategories()
      .then((data) => {
        if (!mounted) return
        const mapped = [{ id: "all", name: "Barchasi", count: 0, image: "https://lefilms394.wordpress.com/wp-content/uploads/2015/08/cc059-old-and-new-movies1.jpg", description: "Barcha kategoriyalar" }].concat(
          (Array.isArray(data) ? data : []).map((c) => ({ id: c.slug, name: c.name, count: 0, image: c.category_img, description: c.description }))
        )
        setCategories(mapped)
        setError(null)
      })
      .catch(() => { if (mounted) setError("Kategoriyalarni yuklashda xatolik yuz berdi") })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    setSeoTags({
      title: "Kinolar — ZiyoFlix",
      description: "ZiyoFlix: eng yaxshi kinolar va seriallar to'plami. Kategoriyalar bo'yicha HD kontentni toping va tomosha qiling.",
      image: "/Ziyo-Flix-Logo.png",
      type: "website"
    })
  }, [])

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "all") {
      setSelectedCategory(categoryId)
    } else {
      navigate(`/movies/category/${categoryId}`)
    }
  }

  const filteredCategories = categories.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="movies">
      <div style={{ display: "none" }}>
        <h1>ZiyoFlix - Eng Yaxshi Kinolar va Seriallar</h1>
        <p>Bepul kinolar, seriallar, anime va islomiy filmlarni tomosha qiling. HD sifatda, reklamasiz.</p>
      </div>

      <div className="movies__container">
        {/* Header */}
        <div className="movies__header">
          <h1 className="movies__title">Kinolar</h1>
          <p className="movies__subtitle">
            Kategoriyalar bo‘yicha eng yaxshi kinolar va seriallar. HD sifatda, reklamasiz tomosha qiling.
          </p>
          <div className="movies__controls">
            <div className="movies__search">
              <BsSearch className="movies__search-icon" />
              <input
                type="text"
                placeholder="Kino qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="movies__search-input"
              />
            </div>
          </div>
        </div>

        <div className="movies__categories-section">
          <div className="movies__categories-grid">
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
            ) : filteredCategories.length === 0 ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <ErrorFallback message={"Hech narsa topilmadi"} details={"Qidiruv so'zini o'zgartirib ko'ring"} />
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className={`category-card`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="category-card__image">
                    <img src={category.image || "/placeholder.svg"} alt={category.name} />
                    <div className="category-card__overlay">
                      <BsEye className="category-card__icon" />
                    </div>
                  </div>
                  <div className="category-card__info">
                    <h3 className="category-card__name">{category.name}</h3>
                    {category.count ? (
                      <p className="category-card__count">{category.count} ta video</p>
                    ) : null}
                    <p className="category-card__description"> {category?.description
                      ? category.description.length > 100
                        ? category.description.slice(0, 100) + '...'
                        : category.description
                      : 'Tavsif mavjud emas'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>


      </div>
    </div>
  )
}

export default Movies
