import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiSearch, FiTrash2, FiEdit2, FiPlay, FiExternalLink, FiEye, FiClock, FiAlertCircle } from 'react-icons/fi';
import { BaseUrlReels } from '../../api/apiService';
import { getReelReports, getDirectorReels, updateDirectorReel, deleteDirectorReel } from '../../api/apiDirectorProfile';

const resolveUrl = (u) => {
    if (!u) return null;
    if (typeof u !== 'string') return null;
    if (u.startsWith('http')) return u;
    return `${BaseUrlReels}${u}`;
};

const DirectorReels = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('reports'); // reports | reels

    // Reports state
    const [reports, setReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [reportsError, setReportsError] = useState('');
    const [reportQuery, setReportQuery] = useState('');

    // Reels state
    const [reels, setReels] = useState([]);
    const [reelsLoading, setReelsLoading] = useState(false);
    const [reelsError, setReelsError] = useState('');
    const [reelsQuery, setReelsQuery] = useState('');

    // Edit modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingReel, setEditingReel] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', caption: '' });
    const [editSaving, setEditSaving] = useState(false);

    const loadReports = async () => {
        setReportsLoading(true);
        setReportsError('');
        try {
            const data = await getReelReports();
            const items = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : []);
            const mapped = items.map((r) => ({
                id: r.id,
                user: {
                    id: r.user?.id,
                    username: r.user?.username,
                    email: r.user?.email,
                    name: `${r.user?.first_name || ''} ${r.user?.last_name || ''}`.trim() || r.user?.username || 'User',
                    avatar: resolveUrl(r.user?.avatar),
                },
                reel: {
                    id: r.reel?.id,
                    title: r.reel?.title,
                    caption: r.reel?.caption,
                    poster: resolveUrl(r.reel?.poster),
                    hls: resolveUrl(r.reel?.hls_playlist_url),
                    likes: r.reel?.likes ?? 0,
                    views: r.reel?.views ?? 0,
                },
                reason: r.reason || '',
                created_at: r.created_at,
            }));
            setReports(mapped);
        } catch (e) {
            setReportsError('Reels jalbalarini yuklashda xatolik');
        } finally {
            setReportsLoading(false);
        }
    };

    const loadReels = async () => {
        setReelsLoading(true);
        setReelsError('');
        try {
            const data = await getDirectorReels();
            const items = Array.isArray(data?.results) ? data.results : (Array.isArray(data) ? data : []);
            const mapped = items.map((it) => ({
                id: it.id,
                title: it.title,
                caption: it.caption,
                poster: resolveUrl(it.poster),
                hls: resolveUrl(it.hls_playlist_url),
                likes: it.likes ?? 0,
                views: it.views ?? 0,
            }));
            setReels(mapped);
        } catch (e) {
            setReelsError('Reels ro\'yxatini yuklashda xatolik');
        } finally {
            setReelsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'reports') loadReports();
        if (activeTab === 'reels') loadReels();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    const filteredReports = useMemo(() => {
        const q = reportQuery.trim().toLowerCase();
        return reports.filter((r) => {
            return (
                !q ||
                (r.user?.username || '').toLowerCase().includes(q) ||
                (r.user?.name || '').toLowerCase().includes(q) ||
                (r.reel?.title || '').toLowerCase().includes(q) ||
                (r.reason || '').toLowerCase().includes(q)
            );
        });
    }, [reports, reportQuery]);

    const filteredReels = useMemo(() => {
        const q = reelsQuery.trim().toLowerCase();
        return reels.filter((it) => !q || (it.title || '').toLowerCase().includes(q) || (it.caption || '').toLowerCase().includes(q));
    }, [reels, reelsQuery]);

    const openEditModal = (item) => {
        setEditingReel(item);
        setEditForm({ title: item.title || '', caption: item.caption || '' });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingReel(null);
        setEditForm({ title: '', caption: '' });
        setEditSaving(false);
    };

    const saveEdit = async () => {
        if (!editingReel) return;
        setEditSaving(true);
        try {
            await updateDirectorReel(editingReel.id, { title: editForm.title, caption: editForm.caption });
            setReels((prev) => prev.map((r) => (r.id === editingReel.id ? { ...r, ...editForm } : r)));
            closeEditModal();
        } catch (e) {
            alert('Saqlashda xatolik');
        } finally {
            setEditSaving(false);
        }
    };

    const confirmDelete = (id) => {
        if (window.confirm('Reelni o\'chirmoqchimisiz?')) {
            deleteDirectorReel(id)
                .then(() => {
                    setReels((prev) => prev.filter((r) => r.id !== id));
                    setReports((prev) => prev.filter((rp) => rp.reel?.id !== id));
                })
                .catch(() => alert('O\'chirishda xatolik'));
        }
    };

    return (
        <div className="director-reels">
            <div className="dr__header">
                <div>
                    <h1>Reels boshqaruvi</h1>
                    <p>Jalbalar va reelslarni boshqaring</p>
                </div>
                <button className="dr__refresh" onClick={() => (activeTab === 'reports' ? loadReports() : loadReels())} disabled={reportsLoading || reelsLoading}>
                    <FiRefreshCw /> Yangilash
                </button>
            </div>

            <div className="dr__tabs">
                <button className={`dr__tab ${activeTab === 'reports' ? 'dr__tab--active' : ''}`} onClick={() => setActiveTab('reports')}>
                    <FiAlertCircle /> Jalbalar
                </button>
                <button className={`dr__tab ${activeTab === 'reels' ? 'dr__tab--active' : ''}`} onClick={() => setActiveTab('reels')}>
                    <FiPlay /> Reels
                </button>
            </div>

            {activeTab === 'reports' ? (
                <div className="dr__section">
                    <div className="dr__controls">
                        <div className="dr__search">
                            <FiSearch />
                            <input value={reportQuery} onChange={(e) => setReportQuery(e.target.value)} placeholder="Foydalanuvchi, sarlavha yoki sabab..." />
                        </div>
                        <div className="dr__count">{reportsLoading ? 'Yuklanmoqda...' : `${filteredReports.length} ta jalba`}</div>
                    </div>

                    {reportsLoading ? (
                        <div className="dr__loading"><div className="dr__spinner" /> Yuklanmoqda...</div>
                    ) : reportsError ? (
                        <div className="dr__error">{reportsError}</div>
                    ) : filteredReports.length === 0 ? (
                        <div className="dr__empty">Jalba topilmadi</div>
                    ) : (
                        <div className="dr__grid">
                            {filteredReports.map((r) => (
                                <div className="dr__card" key={r.id}>
                                    <div className="dr__card-body">
                                        <div className="dr__report-head">
                                            <div className="dr__user">
                                                <div className="dr__avatar">{r.user?.avatar ? <img src={r.user.avatar} alt={r.user?.username} /> : <span>{(r.user?.username || 'U')[0]}</span>}</div>
                                                <div className="dr__user-info">
                                                    <div className="dr__user-name">{r.user?.name}</div>
                                                    <div className="dr__user-username">@{r.user?.username}</div>
                                                </div>
                                            </div>
                                            <div className="dr__date"><FiClock /> {new Date(r.created_at).toLocaleString()}</div>
                                        </div>

                                        <div className="dr__reel-row">
                                            <div className="dr__thumb">
                                                {r.reel?.poster ? (<img src={r.reel.poster} alt={r.reel?.title} />) : (<div className="dr__thumb-placeholder" />)}
                                            </div>
                                            <div className="dr__reel-info">
                                                <div className="dr__title-row">
                                                    <h3 className="dr__title">{r.reel?.title || 'No title'}</h3>
                                                    <span className="dr__stats">❤ {r.reel?.likes} • 👁 {r.reel?.views}</span>
                                                </div>
                                                <p className="dr__caption">{r.reel?.caption}</p>
                                                <div className="dr__actions">
                                                    <button className="dr__btn" onClick={() => window.open(`/reels/${r.reel?.id}`, '_blank')} title="Ko'rish">
                                                        <FiEye /> Ko'rish
                                                    </button>
                                                    {r.reel?.hls && (
                                                        <a className="dr__btn dr__btn--ghost" href={r.reel.hls} target="_blank" rel="noreferrer">
                                                            <FiExternalLink /> HLS
                                                        </a>
                                                    )}
                                                    <button className="dr__btn dr__btn--danger" onClick={() => confirmDelete(r.reel?.id)}>
                                                        <FiTrash2 /> O'chirish
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="dr__reason">
                                            <span>Sabab:</span> {r.reason || 'yoqmadi'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="dr__section">
                    <div className="dr__controls">
                        <div className="dr__search">
                            <FiSearch />
                            <input value={reelsQuery} onChange={(e) => setReelsQuery(e.target.value)} placeholder="Sarlavha yoki caption..." />
                        </div>
                        <div className="dr__count">{reelsLoading ? 'Yuklanmoqda...' : `${filteredReels.length} ta reel`}</div>
                    </div>

                    {reelsLoading ? (
                        <div className="dr__loading"><div className="dr__spinner" /> Yuklanmoqda...</div>
                    ) : reelsError ? (
                        <div className="dr__error">{reelsError}</div>
                    ) : filteredReels.length === 0 ? (
                        <div className="dr__empty">Reel topilmadi</div>
                    ) : (
                        <div className="dr__grid">
                            {filteredReels.map((it) => (
                                <div className="dr__card" key={it.id}>
                                    <div className="dr__thumb dr__thumb--top">
                                        {it.poster ? (<img src={it.poster} alt={it.title} />) : (<div className="dr__thumb-placeholder" />)}
                                    </div>
                                    <div className="dr__card-body">
                                        <div className="dr__title-row">
                                            <h3 className="dr__title">{it.title || 'No title'}</h3>
                                            <span className="dr__stats">❤ {it.likes} • 👁 {it.views}</span>
                                        </div>
                                        <p className="dr__caption">{it.caption}</p>
                                        <div className="dr__actions">
                                            <button className="dr__btn" onClick={() => window.open(`/reels/${it.id}`, '_blank')} title="Ko'rish">
                                                <FiEye /> Ko'rish
                                            </button>
                                            <button className="dr__btn dr__btn--ghost" onClick={() => openEditModal(it)}>
                                                <FiEdit2 /> Tahrirlash
                                            </button>
                                            <button className="dr__btn dr__btn--danger" onClick={() => confirmDelete(it.id)}>
                                                <FiTrash2 /> O'chirish
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {showEditModal && (
                <div className="dr-modal__overlay" onClick={closeEditModal}>
                    <div className="dr-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="dr-modal__header">
                            <h3>Reelni tahrirlash</h3>
                            <button className="dr-modal__close" onClick={closeEditModal}>×</button>
                        </div>
                        <div className="dr-modal__body">
                            <div className="dr-modal__group">
                                <label>Sarlavha</label>
                                <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
                            </div>
                            <div className="dr-modal__group">
                                <label>Caption</label>
                                <textarea rows={4} value={editForm.caption} onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })} />
                            </div>
                        </div>
                        <div className="dr-modal__actions">
                            <button className="dr__btn dr__btn--ghost" onClick={closeEditModal}>Bekor qilish</button>
                            <button className="dr__btn dr__btn--primary" onClick={saveEdit} disabled={editSaving}>{editSaving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DirectorReels;
