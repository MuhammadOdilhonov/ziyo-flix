import React, { useEffect, useMemo, useState } from 'react';
import { FiCheckCircle, FiSearch, FiUsers, FiVideo, FiFilm, FiRefreshCw, FiShield } from 'react-icons/fi';
import { BaseUrlReels } from '../../api/apiService';
import { getChannels } from '../../api/apiChannels';
import * as directorAPI from '../../api/apiDirectorProfile';

const resolveImage = (url) => {
    if (!url) return null;
    if (typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;
    return `${BaseUrlReels}${url}`;
};

const DirectorChannels = () => {
    const [channels, setChannels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all'); // all | verified | unverified
    const [verifying, setVerifying] = useState(null); // slug in progress

    const loadChannels = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getChannels();
            const items = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : []);
            const mapped = items.map((it) => ({
                id: it.id,
                title: it.title || it.name || '',
                slug: it.slug,
                verified: !!it.verified,
                avatar: resolveImage(it.avatar),
                banner: resolveImage(it.banner),
                description: it.description || '',
                subscribers: it.subscriber_count ?? 0,
                videos: it.videos_count ?? 0,
                reels: it.reels_count ?? 0,
                rating: it.rating_avg ?? null,
                created_at: it.created_at,
            }));
            setChannels(mapped);
        } catch (e) {
            setError("Kanallarni yuklashda xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadChannels();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return channels.filter((c) => {
            const matchQ = !q ||
                (c.title || '').toLowerCase().includes(q) ||
                (c.slug || '').toLowerCase().includes(q) ||
                (c.description || '').toLowerCase().includes(q);
            const matchS = status === 'all' || (status === 'verified' ? c.verified : !c.verified);
            return matchQ && matchS;
        });
    }, [channels, query, status]);

    const handleVerify = async (slug) => {
        if (!slug || verifying) return;
        setVerifying(slug);
        try {
            await directorAPI.verifyChannel(slug, true);
            setChannels((prev) => prev.map((c) => (c.slug === slug ? { ...c, verified: true } : c)));
        } catch (e) {
            alert('Galichka berishda xatolik yuz berdi');
        } finally {
            setVerifying(null);
        }
    };

    return (
        <div className="director-channels">
            <div className="dc__header">
                <div>
                    <h1>Kanallar boshqaruvi</h1>
                    <p>Kanal ma'lumotlari va verifikatsiya</p>
                </div>
                <button className="dc__refresh" onClick={loadChannels} disabled={loading}>
                    <FiRefreshCw /> Yangilash
                </button>
            </div>

            <div className="dc__controls">
                <div className="dc__search">
                    <FiSearch />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Kanal nomi yoki slug..."
                    />
                </div>
                <select className="dc__filter" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="all">Barchasi</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                </select>
                <div className="dc__count">{loading ? 'Yuklanmoqda...' : `${filtered.length} ta kanal`}</div>
            </div>

            {loading ? (
                <div className="dc__loading"><div className="dc__spinner" /> Yuklanmoqda...</div>
            ) : error ? (
                <div className="dc__error">{error}</div>
            ) : filtered.length === 0 ? (
                <div className="dc__empty">Kanal topilmadi</div>
            ) : (
                <div className="dc__grid">
                    {filtered.map((c) => (
                        <div className="dc__card" key={c.id || c.slug}>
                            <div className="dc__banner">
                                {c.banner ? (
                                    <img src={c.banner} alt={`${c.title} banner`} />
                                ) : (
                                    <div className="dc__banner-placeholder" />
                                )}
                            </div>

                            <div className="dc__body">
                                <div className="dc__avatar-row">
                                    <div className="dc__avatar">
                                        {c.avatar ? <img src={c.avatar} alt={c.title} /> : <span>{(c.title || 'K').charAt(0)}</span>}
                                    </div>
                                    {c.verified ? (
                                        <span className="dc__verified"><FiCheckCircle /> Verified</span>
                                    ) : (
                                        <span className="dc__unverified"><FiShield /> Unverified</span>
                                    )}
                                </div>

                                <div className="dc__info">
                                    <h3 className="dc__title">{c.title || 'No name'}</h3>
                                    <div className="dc__slug">@{c.slug}</div>
                                    {c.description && <p className="dc__desc">{c.description}</p>}
                                </div>

                                <div className="dc__stats">
                                    <div className="dc__stat"><FiUsers /> <span>{c.subscribers}</span></div>
                                    <div className="dc__stat"><FiVideo /> <span>{c.videos}</span></div>
                                    <div className="dc__stat"><FiFilm /> <span>{c.reels}</span></div>
                                </div>

                                <div className="dc__actions">
                                    {c.verified ? (
                                        <button className="dc__btn dc__btn--verified" disabled>
                                            <FiCheckCircle /> Verified
                                        </button>
                                    ) : (
                                        <button
                                            className="dc__btn dc__btn--verify"
                                            onClick={() => handleVerify(c.slug)}
                                            disabled={verifying === c.slug}
                                            title="Galichka berish"
                                        >
                                            {verifying === c.slug ? 'Tasdiqlanmoqda...' : (<><FiCheckCircle /> Galichka berish</>)}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DirectorChannels;
