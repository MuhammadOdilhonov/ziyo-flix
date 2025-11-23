import React, { useState, useEffect } from 'react';
import Skeleton from "../../common/Skeleton";
import ErrorFallback from "../../common/ErrorFallback";
import { ImShare2 } from "react-icons/im";
import { Link } from 'react-router-dom';
import { getHomepageBanners } from '../../../api/apiHomepageBanners';

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [timeLeft, setTimeLeft] = useState(5);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch banners from API
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const list = await getHomepageBanners();
                if (mounted) {
                    setBanners(Array.isArray(list) ? list : []);
                }
            } catch (e) {
                if (mounted) {
                    setBanners([]);
                    setError(e?.message || "");
                }
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false };
    }, []);

    // Auto carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setCurrentSlide((prevSlide) =>
                        banners.length > 0 ? (prevSlide === banners.length - 1 ? 0 : prevSlide + 1) : 0
                    );
                    return 5;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [banners.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setTimeLeft(5);
    };

    // pick responsive image by viewport width
    const pickImage = (banner) => {
        if (!banner) return '';
        const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
        if (w <= 576) return banner.image_mobile || banner.image_tablet || banner.image || '';
        if (w <= 992) return banner.image_tablet || banner.image || banner.image_mobile || '';
        return banner.image || banner.image_tablet || banner.image_mobile || '';
    };

    const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    useEffect(() => {
        const onResize = () => setVw(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const currentBanner = banners.length > 0 ? banners[currentSlide] : null;

    return (
        <div className="banner">
            <div className="banner__container">
                {/* Content based on state */}
                {loading ? (
                    <>
                        <div className="skeleton-card" style={{ height: 320 }}>
                            <Skeleton height={320} />
                        </div>
                        <div className="banner__content">
                            <div className="banner__info">
                                <div style={{ display: 'grid', gap: 12 }}>
                                    <Skeleton width="60%" height={28} />
                                    <Skeleton lines={2} />
                                    <div style={{ display: 'grid', gridAutoFlow: 'column', gap: 12, width: 280 }}>
                                        <Skeleton height={36} rounded={12} />
                                        <Skeleton height={36} rounded={12} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (!currentBanner || error) ? (
                    <div style={{ gridColumn: '1 / -1', padding: '16px' }}>
                        <ErrorFallback message={"Bannerlar yuklanmadi"} details={error || "Serverdan ma'lumot kelmadi."} />
                    </div>
                ) : (
                    <>
                        <div
                            className="banner__background"
                            style={{ backgroundImage: `url(${pickImage(currentBanner) || 'https://ipswichacademy.paradigmtrust.org/wp-content/uploads/2024/05/placeholder-1000x500.png'})` }}
                        >
                            <div className="banner__overlay"></div>
                        </div>
                        <div className="banner__content">
                            <div className="banner__info">
                                <h1 className="banner__title">{currentBanner?.title || 'Banner'}</h1>
                                <p className="banner__description">{currentBanner?.alt_text || ''}</p>
                                <div className="banner__buttons">
                                    <Link className="banner__btn banner__btn--primary" to={currentBanner?.target_url || '#'}>
                                        {currentBanner?.position === 'hero' ? "Ko'rish" : 'batafsil'}
                                    </Link>
                                    {currentBanner?.position === 'hero' && (
                                        <button className="banner__btn banner__btn--secondary" type="button">
                                            <ImShare2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="banner__dots">
                            {banners.map((_, index) => {
                                const hsl = 120 + (index * 30);
                                const isActive = index === currentSlide;
                                return (
                                    <button
                                        key={index}
                                        className={`banner__dot ${isActive ? 'banner__dot--active' : ''}`}
                                        onClick={() => goToSlide(index)}
                                        style={isActive ? {
                                            background: `linear-gradient(90deg, hsl(120, 100%, 50%), hsl(240, 100%, 50%))`,
                                            color: 'white'
                                        } : {
                                            backgroundColor: 'transparent',
                                            border: `2px solid hsl(${hsl}, 100%, 50%)`
                                        }}
                                    >
                                        {isActive ? timeLeft : ''}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
    ;

export default Banner;