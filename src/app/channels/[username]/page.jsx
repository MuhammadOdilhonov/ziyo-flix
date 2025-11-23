
const API_BASE = 'https://ziyo-flix-service.uz/api'
const MEDIA_BASE = 'https://ziyo-flix-service.uz'

export const dynamic = 'force-dynamic'

async function fetchChannel(username) {
    try {
        const res = await fetch(`${API_BASE}/channels/${encodeURIComponent(username)}/about/`, { cache: 'no-store' })
        if (!res.ok) return null
        return await res.json()
    } catch {
        return null
    }
}

export async function generateMetadata({ params }) {
    const raw = params?.username ?? ''
    const username = typeof raw === 'string' ? raw : String(raw)
    const ch = await fetchChannel(username)
    const siteName = 'ZiyoFlix'

    if (!ch) {
        return {
            title: `${siteName}`,
            description: 'ZiyoFlix — kanallar va darsliklar platformasi',
        }
    }

    const title = `${ch.title || ch.name || username} — Kanal — ${siteName}`
    const description = ch.description || 'ZiyoFlix kanali'
    const rawImg = ch.banner || ch.avatar || '/Ziyo-Flix-Logo.png'
    const image = typeof rawImg === 'string' && rawImg.startsWith('http') ? rawImg : `${MEDIA_BASE}${rawImg?.startsWith('/') ? rawImg : `/${rawImg}`}`

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            siteName,
            type: 'profile',
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

export default async function ChannelDetailPage({ params }) {
    const raw = params?.username ?? ''
    const username = typeof raw === 'string' ? raw : String(raw)
    const ch = await fetchChannel(username)

    if (!ch) {
        return <div style={{ padding: 24 }}>Kanal topilmadi</div>
    }

    const banner = ch.banner || '/placeholder.svg'
    const avatar = ch.avatar || '/placeholder.svg'
    const title = ch.title || ch.name || username
    const subs = Number(ch.subscribers || ch.followers || 0)

    return (
        <div className="channel-detail">
            <div className="channel-detail__header">
                <div className="channel-detail__banner">
                    <img src={banner} alt={title} />
                </div>
                <div className="channel-detail__profile">
                    <img className="channel-detail__avatar" src={avatar} alt={title} />
                    <div className="channel-detail__info">
                        <h1 className="channel-detail__title">{title}</h1>
                        <p className="channel-detail__meta">{subs.toLocaleString('uz-UZ')} obunachi</p>
                    </div>
                </div>
            </div>
            <div className="channel-detail__content">
                <p>{ch.description}</p>
            </div>
        </div>
    )
}
