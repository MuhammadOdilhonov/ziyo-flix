"use client"
import { useEffect, useState } from "react"
import Skeleton from "../../common/Skeleton"
import ErrorFallback from "../../common/ErrorFallback"
import { useNavigate } from "react-router-dom"
import { BsPeople, BsPlayFill, BsCheckCircleFill } from "react-icons/bs"
import { getHomepageChannels } from "../../../api/apiHomepageChannels"

const TopChannelsRow = () => {
    const navigate = useNavigate()
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        let mounted = true
        ;(async () => {
            try {
                const list = await getHomepageChannels()
                if (mounted) setChannels(Array.isArray(list) ? list : [])
            } catch (e) {
                if (mounted) {
                    setChannels([])
                    setError(e?.message || "")
                }
            } finally {
                if (mounted) setLoading(false)
            }
        })()
        return () => { mounted = false }
    }, [])

    const handleChannelClick = (channel) => {
        const slug = channel?.slug || channel?.id
        navigate(`/channels/${slug}`)
    }

    const handleViewAll = () => {
        navigate("/channels")
    }

    const formatSubscribers = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K`
        }
        return count.toString()
    }

    return (
        <section className="top-channels-row">
            <div className="top-channels-row__container">
                <div className="top-channels-row__header">
                    <h2 className="top-channels-row__title">Top Kanallar</h2>
                    <button className="top-channels-row__view-all" onClick={handleViewAll}>
                        Barchasini ko'rish
                    </button>
                </div>

                <div className="top-channels-row__grid">
                    {loading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="skeleton-card">
                                <Skeleton height={100} rounded={12} />
                                <div style={{ padding:12 }}>
                                    <Skeleton width="60%" height={16} />
                                    <div style={{ marginTop:8 }}>
                                        <Skeleton width="40%" height={12} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (error || channels.length === 0) ? (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <ErrorFallback message={"Kanallar yuklanmadi"} details={error || "Serverdan ma'lumot kelmadi."} />
                        </div>
                    ) : (
                    channels.slice(0, 10).map((channel) => (
                        <div key={channel.id || channel.slug} className="channel-card" onClick={() => handleChannelClick(channel)}>
                            <div className="channel-card__banner">
                                <img
                                    src={channel.banner || "/placeholder.svg"}
                                    alt={`${channel.title || channel.slug} banner`}
                                    className="channel-card__banner-image"
                                />
                            </div>

                            <div className="channel-card__content">
                                <div className="channel-card__avatar-container">
                                    <img src={channel.avatar || "/placeholder.svg"} alt={channel.title || channel.slug} className="channel-card__avatar" />
                                    {channel.verified && <BsCheckCircleFill className="channel-card__verified" />}
                                </div>

                                <div className="channel-card__info">
                                    <h3 className="channel-card__name">{channel.title || channel.slug}</h3>
                                    <p className="channel-card__username">@{channel.slug}</p>
                                    <div className="channel-card__category">{channel.specialty || ''}</div>
                                    <p className="channel-card__description">{channel.description || ''}</p>

                                    <div className="channel-card__stats">
                                        <div className="channel-card__stat">
                                            <BsPeople size={14} />
                                            <span>{formatSubscribers(channel.subscriber_count || 0)} obunachi</span>
                                        </div>
                                        <div className="channel-card__stat">
                                            <BsPlayFill size={14} />
                                            <span>{channel.videos || 0} video</span>
                                        </div>
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

export default TopChannelsRow
