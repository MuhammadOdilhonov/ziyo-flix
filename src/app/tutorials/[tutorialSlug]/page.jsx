import Link from 'next/link'

const API_BASE = 'https://ziyo-flix-service.uz/api'
const MEDIA_BASE = 'https://ziyo-flix-service.uz'

export const dynamic = 'force-dynamic'

async function fetchCourse(slug) {
    try {
        const res = await fetch(`${API_BASE}/courses/${encodeURIComponent(slug)}`, { cache: 'no-store' })
        if (!res.ok) return null
        return await res.json()
    } catch {
        return null
    }
}

async function fetchCourseTypes(slug) {
    try {
        const res = await fetch(`${API_BASE}/get-course-type/${encodeURIComponent(slug)}/`, { cache: 'no-store' })
        if (!res.ok) return { results: [] }
        return await res.json()
    } catch {
        return { results: [] }
    }
}

async function fetchCourseVideos(courseSlug, courseTypeSlug) {
    try {
        const res = await fetch(`${API_BASE}/get-course-videos/${encodeURIComponent(courseSlug)}/${encodeURIComponent(courseTypeSlug)}/`, { cache: 'no-store' })
        if (!res.ok) return { results: [] }
        return await res.json()
    } catch {
        return { results: [] }
    }
}

export async function generateMetadata({ params }) {
    const raw = params?.tutorialSlug ?? ''
    const slug = typeof raw === 'string' ? raw : String(raw)
    const course = await fetchCourse(slug)
    const siteName = 'ZiyoFlix'

    if (!course) {
        return {
            title: `${siteName}`,
            description: 'ZiyoFlix — darsliklar va onlayn kurslar platformasi',
        }
    }

    const title = `${course.title} — Darslik — ${siteName}`
    const description = course.description || "ZiyoFlix: O'zbek tilida professional video darsliklar."
    const rawImg = course.cover || course.thumbnail || '/Ziyo-Flix-Logo.png'
    const image = rawImg.startsWith('http') ? rawImg : `${MEDIA_BASE}${rawImg.startsWith('/') ? rawImg : `/${rawImg}`}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            siteName,
            type: 'website',
            images: [{ url: image }],
            locale: 'uz_UZ',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    }
}

export default async function TutorialDetailPage({ params }) {
    const raw = params?.tutorialSlug ?? ''
    const slug = typeof raw === 'string' ? raw : String(raw)

    const [course, typesRes] = await Promise.all([fetchCourse(slug), fetchCourseTypes(slug)])
    if (!course) return <div className="tutorial-detail__error">Darslik topilmadi</div>;

    const types = Array.isArray(typesRes?.results) ? typesRes.results : []
    const firstType = types[0]
    const videosRes = firstType ? await fetchCourseVideos(slug, firstType.slug) : { results: [] }
    const lessons = Array.isArray(videosRes?.results) ? videosRes.results : []

    const title = course.title
    const description = course.description
    const image = course.thumbnail || course.cover || '/placeholder.svg'
    const instructor = course.channel_info

    return (
        <div className="tutorial-detail">
            <div className="tutorial-detail__header">
                <div className="tutorial-detail__container">
                    <div className="tutorial-detail__hero">
                        <div className="tutorial-detail__image">
                            <img src={image} alt={title} />
                            <div className="tutorial-detail__play-overlay">▶</div>
                        </div>

                        <div className="tutorial-detail__info">
                            <div className="tutorial-detail__breadcrumb">
                                <span>Darsliklar</span>
                                <span>/</span>
                                <span>{course.category || ''}</span>
                            </div>

                            <h1 className="tutorial-detail__title">{title}</h1>
                            <p className="tutorial-detail__description">{description}</p>

                            {instructor && (
                                <Link href={`/channels/${instructor.slug}`} className="tutorial-detail__instructor">
                                    <img src={instructor.avatar || '/placeholder.svg'} alt={instructor.title} />
                                    <div className="tutorial-detail__instructor-info">
                                        <h4>{instructor.title}</h4>
                                        <h6>{instructor.slug}</h6>
                                        <p>{instructor.description}</p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="tutorial-detail__content">
                <div className="tutorial-detail__container">
                    {/* Months (course types) */}
                    <div className="tutorial-detail__months">
                        {(types || []).map((ct) => (
                            <Link key={ct.id} href={`/tutorials/${slug}/month/${ct.id}/test`} className="tutorial-detail__month">
                                <div className="tutorial-detail__month-name">{ct.name}</div>
                                <div className="tutorial-detail__month-desc">{ct.description}</div>
                            </Link>
                        ))}
                    </div>

                    {/* Lessons of first month (preview) */}
                    {lessons.length > 0 && (
                        <div className="tutorial-detail__lessons">
                            <h2 style={{ margin: '16px 0' }}>Darslar</h2>
                            <div className="episodes-grid">
                                {lessons.map((l) => (
                                    <Link key={l.id} className="episode-card" href={`/tutorials/${slug}/video/${l.id}`}>
                                        <div className="episode-card__thumbnail">
                                            <div className="episode-card__number">{l.order ?? l.id}</div>
                                            <div className="episode-card__duration">⏱ {l.duration ?? '—'}</div>
                                        </div>
                                        <div className="episode-card__info">
                                            <h4>{l.title}</h4>
                                            <p className="episode-card__date">{String(l.created_at || '').slice(0, 10)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
