import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
    Users,
    Play,
    CheckCircle,
    ArrowLeft,
    Plus,
    Share,
    Bell,
    BellRing,
    Star,
    Clock,
    Eye,
    Heart,
    BookOpen,
    Award,
    MapPin,
    Globe,
    Calendar,
    TrendingUp,
    DollarSign,
    X,
    AlertTriangle
} from 'lucide-react';
import { getChannelAbout, getChannelCourses, getChannelReels } from '../../api/apiChannels';
import { BaseUrlReels } from '../../api/apiService';
import { setSeoTags, setJsonLd } from '../../utils/seo';

const ChannelDetail = () => {
    const { username } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("lessons");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
    const [showUnsubscribeModal, setShowUnsubscribeModal] = useState(false);
    const [about, setAbout] = useState(null);
    const [courses, setCourses] = useState([]);
    const [reels, setReels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const slug = (username || '').replace(/^@/, '');
        if (!slug) return;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [aboutRes, coursesRes, reelsRes] = await Promise.all([
                    getChannelAbout(slug),
                    getChannelCourses(slug),
                    getChannelReels(slug),
                ]);
                setAbout(aboutRes || null);
                setCourses(Array.isArray(coursesRes?.results) ? coursesRes.results : []);
                setReels(Array.isArray(reelsRes?.results) ? reelsRes.results : []);
            } catch (e) {
                setError("Kanal ma'lumotlarini yuklashda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [username]);

    // SEO for channel detail
    useEffect(() => {
        if (!about) return;
        const name = about?.title || '';
        const description = about?.description || '';
        const rawImg = about?.banner || about?.avatar || '/Ziyo-Flix-Logo.png';
        const image = (typeof rawImg === 'string' && rawImg.startsWith('http'))
            ? rawImg
            : `${BaseUrlReels}${rawImg?.startsWith('/') ? rawImg : `/${rawImg}`}`;
        setSeoTags({
            title: `${name} — Kanal — ZiyoFlix`,
            description,
            image,
            type: 'profile'
        });

        try {
            const sameAs = [];
            if (about?.website) sameAs.push(about.website);
            if (about?.telegram) sameAs.push(`https://t.me/${about.telegram}`);
            if (about?.instagram) sameAs.push(`https://instagram.com/${about.instagram}`);
            if (about?.github) sameAs.push(`https://github.com/${about.github}`);

            const jsonLd = {
                "@context": "https://schema.org",
                "@type": "ProfilePage",
                name: `${name} — Kanal — ZiyoFlix`,
                description: description,
                url: typeof window !== 'undefined' ? window.location.href : '',
                primaryImageOfPage: { "@type": "ImageObject", url: image },
                about: {
                    "@type": "Organization",
                    name: name,
                    ...(sameAs.length ? { sameAs } : {}),
                    ...(about?.website ? { url: about.website } : {})
                }
            };
            setJsonLd(jsonLd);
        } catch { }
    }, [about]);

    const channel = useMemo(() => {
        if (!about) return null;
        const locationParts = [about?.location_city, about?.location_country].filter(Boolean);
        return {
            id: about.id,
            name: about.title,
            username: about.slug,
            category: about.category || '',
            subscribers: about.subscriber_count ?? 0,
            videos: courses?.reduce((acc, c) => acc + (c.lessons_count ?? 0), 0),
            reels: (reels?.length ?? 0),
            verified: !!about.verified,
            avatar: about.avatar,
            banner: about.banner,
            description: about.description,
            fullBio: about.description,
            specialization: about.badge || '',
            joinDate: about.created_at,
            location: locationParts.join(', '),
            website: about.website,
            socialLinks: {
                telegram: about.telegram || '',
                instagram: about.instagram || '',
                github: about.github || '',
            },
            rating: about.rating_avg ?? 0,
            totalStudents: about.students_count ?? 0,
            achievements: [],
            level: '',
            languages: [],
            responseTime: '',
            completionRate: 0,
            certificates: [],
        };
    }, [about, courses, reels]);

    const handleSubscribe = () => {
        if (isSubscribed) {
            setShowUnsubscribeModal(true);
        } else {
            setIsSubscribed(true);
        }
    };

    const handleUnsubscribe = () => {
        setIsSubscribed(false);
        setShowUnsubscribeModal(false);
        setIsNotificationEnabled(false);
    };

    const handleNotification = () => {
        setIsNotificationEnabled(!isNotificationEnabled);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: channel.name,
                text: channel.description,
                url: window.location.href,
            });
        }
    };

    const handleLessonClick = (course) => {
        navigate(`/tutorials/${course.slug}`);
    };

    const handleReelClick = (reel) => {
        const slug = reel.slug || String(reel.id);
        navigate(`/reels/${slug}`);
    };

    const formatSubscribers = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K`;
        }
        return count.toString();
    };

    const formatViews = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(0)}K`;
        }
        return count.toString();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return 'difficulty-beginner';
            case 'Intermediate': return 'difficulty-intermediate';
            case 'Advanced': return 'difficulty-advanced';
            default: return 'difficulty-beginner';
        }
    };

    return (
        <div className="channel-detail">
            {error && (
                <div className="channel-detail__container" style={{ color: 'red', padding: 12 }}>{error}</div>
            )}
            {loading && (
                <div className="channel-detail__container" style={{ padding: 12 }}>Yuklanmoqda...</div>
            )}
            {!channel && !loading && (
                <div className="channel-detail__container" style={{ padding: 12 }}>Kanal topilmadi</div>
            )}
            {channel && (
                <div>
                    {/* Header */}
                    <div className="channel-detail__header">
                        <div className="channel-detail__banner">
                            <img src={channel.banner} alt={`${channel.name} banner`} />
                            <div className="channel-detail__banner-overlay"></div>

                            {/* Back Button */}
                            <button className="channel-detail__back-btn" onClick={() => navigate(-1)}>
                                <ArrowLeft size={20} />
                                <span>Orqaga</span>
                            </button>
                        </div>

                        <div className="channel-detail__profile-section">
                            <div className="channel-detail__container">
                                <div className="channel-detail__profile">
                                    <div className="channel-detail__avatar-container">
                                        <img src={channel.avatar} alt={channel.name} />
                                        {channel.verified && <CheckCircle className="channel-detail__verified" />}
                                    </div>

                                    <div className="channel-detail__main-info">
                                        <div className="channel-detail__name-section">
                                            <h1 className="channel-detail__name">{channel.name}</h1>
                                            <p className="channel-detail__username">@{channel.username}</p>
                                            <div className="channel-detail__specialization">
                                                <Award size={16} />
                                                {channel.specialization}
                                            </div>
                                        </div>

                                        <div className="channel-detail__stats-grid">
                                            <div className="channel-detail__stat">
                                                <Users size={18} />
                                                <div>
                                                    <span className="stat-number">{formatSubscribers(channel.subscribers)}</span>
                                                    <span className="stat-label">Obunachi</span>
                                                </div>
                                            </div>
                                            <div className="channel-detail__stat">
                                                <Play size={18} />
                                                <div>
                                                    <span className="stat-number">{channel.videos}</span>
                                                    <span className="stat-label">Video</span>
                                                </div>
                                            </div>
                                            <div className="channel-detail__stat">
                                                <BookOpen size={18} />
                                                <div>
                                                    <span className="stat-number">{channel.reels}</span>
                                                    <span className="stat-label">Reels</span>
                                                </div>
                                            </div>
                                            <div className="channel-detail__stat">
                                                <Star size={18} />
                                                <div>
                                                    <span className="stat-number">{channel.rating}</span>
                                                    <span className="stat-label">Reyting</span>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="channel-detail__description">{channel.description}</p>

                                        <div className="channel-detail__actions">
                                            <button
                                                className={`channel-detail__subscribe-btn ${isSubscribed ? "subscribed" : ""}`}
                                                onClick={handleSubscribe}
                                            >
                                                {isSubscribed ? (
                                                    <>
                                                        <CheckCircle size={18} />
                                                        Obuna
                                                    </>
                                                ) : (
                                                    <>
                                                        <Plus size={18} />
                                                        Obuna bo'lish
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                className={`channel-detail__notification-btn ${isNotificationEnabled ? "active" : ""}`}
                                                onClick={handleNotification}
                                                title="Bildirishnomalar"
                                            >
                                                {isNotificationEnabled ? <BellRing size={18} /> : <Bell size={18} />}
                                            </button>

                                            <button
                                                className="channel-detail__share-btn"
                                                onClick={handleShare}
                                                title="Ulashish"
                                            >
                                                <Share size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="channel-detail__content">
                        <div className="channel-detail__container">
                            {/* Tabs */}
                            <div className="channel-detail__tabs">
                                <button
                                    className={`channel-detail__tab ${activeTab === "lessons" ? "active" : ""}`}
                                    onClick={() => setActiveTab("lessons")}
                                >
                                    <Play size={18} />
                                    <span>Video Darsliklar ({channel.videos})</span>
                                </button>
                                <button
                                    className={`channel-detail__tab ${activeTab === "reels" ? "active" : ""}`}
                                    onClick={() => setActiveTab("reels")}
                                >
                                    <BookOpen size={18} />
                                    <span>Reels ({channel.reels})</span>
                                </button>
                                <button
                                    className={`channel-detail__tab ${activeTab === "about" ? "active" : ""}`}
                                    onClick={() => setActiveTab("about")}
                                >
                                    <Users size={18} />
                                    <span>Haqida</span>
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="channel-detail__tab-content">
                                {activeTab === "lessons" && (
                                    <div className="channel-detail__lessons">
                                        <div className="lessons-grid">
                                            {courses.map((course) => (
                                                <div
                                                    key={course.id}
                                                    className={`lesson-card`}
                                                    onClick={() => handleLessonClick(course)}
                                                >
                                                    <div className="lesson-card__thumbnail">
                                                        <img src={course.thumbnail || course.cover} alt={course.title} />
                                                        <div className="lesson-card__video-count">{course.lessons_count ?? 0} dars</div>
                                                        <div className={`lesson-card__difficulty ${getDifficultyColor(course.level)}`}>
                                                            {course.level}
                                                        </div>
                                                        <div className="lesson-card__play-overlay">
                                                            <Play size={32} fill="currentColor" />
                                                        </div>
                                                    </div>
                                                    <div className="lesson-card__info">
                                                        <h4 className="lesson-card__title">{course.title}</h4>
                                                        <p className="lesson-card__description">{course.description}</p>

                                                        <div className="lesson-card__course-info">
                                                            <div className="lesson-card__duration">
                                                                <Calendar size={14} />
                                                                <span>{(course.total_duration_minutes ?? 0)} daqiqa</span>
                                                            </div>
                                                            <div className="lesson-card__price">
                                                                <DollarSign size={14} />
                                                                <span>{course.is_free ? 'Bepul' : `${formatPrice(Number(course.price))} so'm`}</span>
                                                            </div>
                                                        </div>

                                                        <div className="lesson-card__meta">
                                                            <div className="lesson-card__stats">
                                                                <span className="stat">
                                                                    <Eye size={14} />
                                                                    {formatViews(course.students_count ?? 0)}
                                                                </span>
                                                                <span className="stat">
                                                                    <Heart size={14} />
                                                                    {course.rating_count ?? 0}
                                                                </span>
                                                                <span className="stat">
                                                                    <Clock size={14} />
                                                                    {course.rating_avg ?? '0.0'} reyting
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "reels" && (
                                    <div className="channel-detail__reels">
                                        <div className="reels-grid">
                                            {reels.map((reel) => (
                                                <div key={reel.id} className="reel-card" onClick={() => handleReelClick(reel)}>
                                                    <div className="reel-card__thumbnail">
                                                        {reel.poster ? (
                                                            <img
                                                                src={`${reel.poster}`}
                                                                alt={reel.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="reel-card__placeholder">
                                                                <Play size={48} />
                                                            </div>
                                                        )}
                                                        <div className="reel-card__duration">{reel.duration ?? ''}</div>
                                                        <div className="reel-card__stats">
                                                            <div className="reel-stat">
                                                                <Eye size={14} />
                                                                <span>{formatViews(reel.views ?? 0)}</span>
                                                            </div>
                                                            <div className="reel-stat">
                                                                <Heart size={14} />
                                                                <span>{reel.likes ?? 0}</span>
                                                            </div>
                                                        </div>
                                                        <div className="reel-card__play-overlay">
                                                            <Play size={24} fill="currentColor" />
                                                        </div>
                                                    </div>
                                                    <div className="reel-card__info">
                                                        <h4 className="reel-card__title">{reel.title}</h4>
                                                        <p className="reel-card__date">{reel.caption}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "about" && (
                                    <div className="channel-detail__about">
                                        <div className="about-grid">
                                            <div className="about-section">
                                                <h3>
                                                    <Users size={20} />
                                                    Haqida
                                                </h3>
                                                <p>{channel.fullBio}</p>
                                            </div>

                                            <div className="about-section">
                                                <h3>
                                                    <Award size={20} />
                                                    Ma'lumotlar
                                                </h3>
                                                <div className="about-details">
                                                    <div className="about-detail">
                                                        <Calendar size={16} />
                                                        <div>
                                                            <strong>Qo'shilgan sana:</strong>
                                                            <span>{channel.joinDate ? new Date(channel.joinDate).toLocaleDateString('uz-UZ') : '-'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="about-detail">
                                                        <MapPin size={16} />
                                                        <div>
                                                            <strong>Joylashuv:</strong>
                                                            <span>{channel.location || '-'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="about-detail">
                                                        <TrendingUp size={16} />
                                                        <div>
                                                            <strong>Jami o'quvchilar:</strong>
                                                            <span>{(channel.totalStudents ?? 0).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="about-detail">
                                                        <Globe size={16} />
                                                        <div>
                                                            <strong>Veb-sayt:</strong>
                                                            {channel.website ? (
                                                                <a href={channel.website} target="_blank" rel="noopener noreferrer">
                                                                    {channel.website}
                                                                </a>
                                                            ) : (
                                                                <span>-</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="about-detail">
                                                        <Clock size={16} />
                                                        <div>
                                                            <strong>Javob berish vaqti:</strong>
                                                            <span>{channel.responseTime || '-'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {Array.isArray(channel.achievements) && channel.achievements.length > 0 && (
                                                <div className="about-section">
                                                    <h3>
                                                        <Award size={20} />
                                                        Yutuqlar va Sertifikatlar
                                                    </h3>
                                                    <div className="achievements">
                                                        {channel.achievements.map((achievement, index) => (
                                                            <div key={index} className="achievement-badge">
                                                                <Award size={16} />
                                                                {achievement}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="about-section">
                                                <h3>
                                                    <Share size={20} />
                                                    Ijtimoiy tarmoqlar
                                                </h3>
                                                <div className="social-links">
                                                    {channel.socialLinks.telegram && (
                                                        <a href={`https://t.me/${channel.socialLinks.telegram}`} target="_blank" rel="noopener noreferrer">
                                                            <div className="social-icon telegram">📱</div>
                                                            <div>
                                                                <strong>Telegram</strong>
                                                                <span>@{channel.socialLinks.telegram}</span>
                                                            </div>
                                                        </a>
                                                    )}
                                                    {channel.socialLinks.instagram && (
                                                        <a href={`https://instagram.com/${channel.socialLinks.instagram}`} target="_blank" rel="noopener noreferrer">
                                                            <div className="social-icon instagram">📷</div>
                                                            <div>
                                                                <strong>Instagram</strong>
                                                                <span>@{channel.socialLinks.instagram}</span>
                                                            </div>
                                                        </a>
                                                    )}
                                                    {channel.socialLinks.github && (
                                                        <a href={`https://github.com/${channel.socialLinks.github}`} target="_blank" rel="noopener noreferrer">
                                                            <div className="social-icon github">💻</div>
                                                            <div>
                                                                <strong>GitHub</strong>
                                                                <span>@{channel.socialLinks.github}</span>
                                                            </div>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Unsubscribe Modal */}
                    {showUnsubscribeModal && (
                        <div className="modal-overlay" onClick={() => setShowUnsubscribeModal(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <AlertTriangle size={24} className="modal-icon" />
                                    <h3>Obunani bekor qilish</h3>
                                    <button
                                        className="modal-close"
                                        onClick={() => setShowUnsubscribeModal(false)}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Rostdan ham <strong>{channel.name}</strong> kanalidan obunani bekor qilmoqchimisiz?</p>
                                    <p className="modal-warning">Bu amal orqali siz barcha premium kontentlarga kirishni yo'qotasiz.</p>
                                </div>
                                <div className="modal-actions">
                                    <button
                                        className="modal-btn modal-btn--cancel"
                                        onClick={() => setShowUnsubscribeModal(false)}
                                    >
                                        Bekor qilish
                                    </button>
                                    <button
                                        className="modal-btn modal-btn--confirm"
                                        onClick={handleUnsubscribe}
                                    >
                                        Ha, obunani bekor qilish
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChannelDetail;