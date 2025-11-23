import React, { useEffect, useState } from 'react';
import Skeleton from "../common/Skeleton";
import ErrorFallback from "../common/ErrorFallback";
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Play,
    CheckCircle,
    Search,
    Plus,
    Star,
    Clock,
    TrendingUp,
    DollarSign,
    Calendar
} from 'lucide-react';
import { getChannels } from '../../api/apiChannels';
import { setSeoTags, setJsonLd } from '../../utils/seo';

const Channels = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load channels from API
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getChannels();
                // Expecting shape: { count, next, previous, results: [...] }
                const items = Array.isArray(data?.results) ? data.results : [];
                // Map API fields to UI-friendly structure
                const mapped = items.map((it) => ({
                    id: it.id,
                    name: it.title,
                    username: it.slug,
                    category: it.category || 'all',
                    subscribers: it.subscriber_count ?? 0,
                    videos: it.videos_count ?? 0,
                    reels: it.reels_count ?? 0,
                    verified: !!it.verified,
                    avatar: it.avatar,
                    banner: it.banner,
                    description: it.description,
                    specialization: it.badge || '',
                    isSubscribed: false,
                    lastActive: '',
                    rating: it.rating_avg ?? 0,
                    trending: false,
                    level: 'Beginner'
                }));
                setChannels(mapped);
            } catch (e) {
                setError('Kanallarni yuklashda xatolik yuz berdi');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    useEffect(() => {
        setSeoTags({
            title: 'Kanallar — ZiyoFlix',
            description: "O‘qituvchi kanallari: video darsliklar, kurslar va reels. Obuna bo‘ling va yangiliklardan xabardor bo‘ling.",
            image: '/Ziyo-Flix-Logo.png',
            type: 'website'
        })
    }, [])

    // JSON-LD for channels listing (first 12 items)
    useEffect(() => {
        try {
            const origin = typeof window !== 'undefined' ? window.location.origin : ''
            const list = (channels || []).slice(0, 12).map((c, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                url: `${origin}/channels/${c.username}`,
                name: c.name
            }))
            const jsonLd = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: "Kanallar — ZiyoFlix",
                description: "O‘qituvchi kanallari: video darsliklar, kurslar va reels.",
                hasPart: { "@type": "ItemList", itemListElement: list }
            }
            setJsonLd(jsonLd)
        } catch { }
    }, [channels])

    const filteredChannels = channels.filter((channel) => {
        const matchesCategory = selectedCategory === "all" || channel.category === selectedCategory;
        const matchesSearch =
            (channel.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (channel.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (channel.specialization || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (channel.username || '').toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleChannelClick = (username) => {
        // username is actually slug from API
        navigate(`/channels/${username}`);
    };

    const handleSubscribe = (channelId, e) => {
        e.stopPropagation();
        console.log("Subscribe to channel:", channelId);
    };

    const formatSubscribers = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K`;
        }
        return count.toString();
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Beginner': return 'bg-green-100 text-green-800';
            case 'Intermediate': return 'bg-blue-100 text-blue-800';
            case 'Advanced': return 'bg-purple-100 text-purple-800';
            case 'Professional': return 'bg-orange-100 text-orange-800';
            case 'Expert': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="channels">
            <div className="channels__container">
                {/* Header */}
                <div className="channels__header">
                    <div className="channels__title-section">
                        <h1 className="channels__title">
                            <span className="channels__title-icon">📚</span>
                            Kanallar
                        </h1>
                        <p className="channels__subtitle">
                            O‘qituvchi kanallari: video darsliklar, kurslar va reels. Obuna bo‘ling va yangiliklardan xabardor bo‘ling.
                        </p>
                    </div>

                    <div className="channels__search">
                        <Search className="channels__search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Kanal yoki mavzu qidiring..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="channels__search-input"
                        />
                    </div>
                </div>

                {/* Results Info */}
                <div className="channels__results-info">
                    <span className="channels__results-count">
                        {loading ? 'Yuklanmoqda...' : `${filteredChannels.length} ta kanal topildi`}
                    </span>
                    {error && (
                        <span className="channels__error" style={{ color: 'red', marginLeft: 12 }}>{error}</span>
                    )}
                </div>

                {/* Channels Grid */}
                <div className="channels__content">
                    {loading ? (
                        // channels__grid classini o‘chirdik!
                        <>
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="channel-item skeleton-card"> {/* channel-item qoldirdik */}
                                    <Skeleton height={140} borderRadius="1.5rem" />
                                    <div style={{ padding: '1.5rem', position: 'relative' }}>
                                        {/* Avatar */}
                                        <div style={{
                                            position: 'absolute',
                                            top: -35,
                                            left: 24,
                                            zIndex: 5
                                        }}>
                                            <Skeleton circle width={70} height={70} />
                                        </div>

                                        <div style={{ marginTop: 50 }}>
                                            <Skeleton width="75%" height={28} style={{ marginBottom: 8 }} />
                                            <Skeleton width="55%" height={18} style={{ marginBottom: 16 }} />
                                            <Skeleton height={32} borderRadius={12} style={{ marginBottom: 16 }} />

                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(3,1fr)',
                                                gap: 12,
                                                marginBottom: 16
                                            }}>
                                                <Skeleton height={20} />
                                                <Skeleton height={20} />
                                                <Skeleton height={20} />
                                            </div>

                                            <Skeleton count={2} style={{ marginBottom: 16 }} />
                                            <Skeleton height={48} borderRadius={12} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : error ? (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <ErrorFallback message="Kanallar yuklanmadi" details={error || "Serverdan ma'lumot kelmadi."} />
                        </div>
                    ) : filteredChannels.length > 0 ? (
                        filteredChannels.map((channel) => (
                            <div
                                key={channel.id}
                                className={`channel-item`}
                                onClick={() => handleChannelClick(channel.username)}
                            >
                                {/* Trending Badge */}
                                {channel.trending && (
                                    <div className="channel-item__trending-badge">
                                        <TrendingUp size={14} />
                                        <span>Trending</span>
                                    </div>
                                )}

                                {/* Banner */}
                                <div className="channel-item__banner">
                                    <img
                                        src={channel.banner || "/placeholder.svg"}
                                        alt={`${channel.name} banner`}
                                        className="channel-item__banner-image"
                                    />
                                    <div className="channel-item__banner-overlay"></div>
                                </div>

                                {/* Content */}
                                <div className="channel-item__content">
                                    {/* Avatar */}
                                    <div className="channel-item__avatar-container">
                                        <img
                                            src={channel.avatar || "/placeholder.svg"}
                                            alt={channel.name}
                                            className="channel-item__avatar"
                                        />
                                        {channel.verified && (
                                            <CheckCircle className="channel-item__verified" size={20} />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="channel-item__info">
                                        <h3 className="channel-item__name">{channel.name}</h3>
                                        <p className="channel-item__username">@{channel.username}</p>
                                        <div className="channel-item__specialization">{channel.specialization}</div>
                                        <div className="channel-item__stats">
                                            <div className="channel-item__stat">
                                                <Users size={14} />
                                                <span>{formatSubscribers(channel.subscribers)} obunachi</span>
                                            </div>
                                            <div className="channel-item__stat">
                                                <Play size={14} />
                                                <span>{channel.videos} video</span>
                                            </div>
                                            <div className="channel-item__stat">
                                                <span>{channel.reels} reels</span>
                                            </div>
                                            <div className="channel-item__rating">
                                                <Star size={12} fill="currentColor" />
                                                <span>{channel.rating ?? 0}</span>
                                            </div>
                                        </div>

                                        <p className="channel-item__description">{channel.description}</p>

                                        {/* Actions */}
                                        <div className="channel-item__actions">
                                            <button
                                                className={`channel-item__subscribe-btn ${channel.isSubscribed ? "subscribed" : ""}`}
                                                onClick={(e) => handleSubscribe(channel.id, e)}
                                            >
                                                {channel.isSubscribed ? (
                                                    <>
                                                        <CheckCircle size={16} />
                                                        Obuna
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus size={16} />
                                                        Obuna bo'lish
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1 / -1' }}>
                            <ErrorFallback message="Hech qanday kanal topilmadi" details="Qidiruv so'zingizni o'zgartiring yoki boshqa kategoriyani tanlang" />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Channels;