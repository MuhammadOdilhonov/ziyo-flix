import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPercent, FiDollarSign, FiCalendar, FiUsers, FiToggleLeft, FiToggleRight, FiCopy, FiCheck, FiX } from 'react-icons/fi';
import * as directorAPI from '../../api/apiDirectorProfile';

const PromoCodesManagement = () => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [editingPromo, setEditingPromo] = useState(null);
    const [copiedCode, setCopiedCode] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discount_type: 'percent',
        value: '',
        max_uses: '',
        valid_from: '',
        valid_to: '',
        is_active: true,
    });

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const fetchPromoCodes = async () => {
        try {
            setLoading(true);
            const data = await directorAPI.getPromoCodes();
            setPromoCodes(data);
        } catch (error) {
            console.error('Error fetching promo codes:', error);
            alert('Promo kodlarni yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (promo = null) => {
        if (promo) {
            setEditingPromo(promo);
            setFormData({
                code: promo.code,
                discount_type: promo.discount_type,
                value: promo.value,
                max_uses: promo.max_uses,
                valid_from: promo.valid_from ? new Date(promo.valid_from).toISOString().slice(0, 16) : '',
                valid_to: promo.valid_to ? new Date(promo.valid_to).toISOString().slice(0, 16) : '',
                is_active: promo.is_active,
            });
        } else {
            setEditingPromo(null);
            setFormData({
                code: '',
                discount_type: 'percent',
                value: '',
                max_uses: '',
                valid_from: '',
                valid_to: '',
                is_active: true,
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPromo(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            code: formData.code.toUpperCase(),
            discount_type: formData.discount_type,
            value: formData.value,
            max_uses: parseInt(formData.max_uses),
            valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : null,
            valid_to: formData.valid_to ? new Date(formData.valid_to).toISOString() : null,
            is_active: formData.is_active,
        };

        try {
            if (editingPromo) {
                await directorAPI.updatePromoCode(editingPromo.id, data);
                alert('Promo kod muvaffaqiyatli yangilandi!');
            } else {
                await directorAPI.createPromoCode(data);
                alert('Promo kod muvaffaqiyatli yaratildi!');
            }
            closeModal();
            fetchPromoCodes();
        } catch (error) {
            console.error('Error saving promo code:', error);
            alert('Promo kodni saqlashda xatolik yuz berdi');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Promo kodni o\'chirmoqchimisiz?')) return;

        try {
            await directorAPI.deletePromoCode(id);
            alert('Promo kod muvaffaqiyatli o\'chirildi!');
            fetchPromoCodes();
        } catch (error) {
            console.error('Error deleting promo code:', error);
            alert('Promo kodni o\'chirishda xatolik yuz berdi');
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const openDetailModal = (promo) => {
        setSelectedPromo(promo);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedPromo(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getUsagePercentage = (uses, maxUses) => {
        if (!maxUses) return 0;
        return (uses / maxUses) * 100;
    };

    const isExpired = (validTo) => {
        if (!validTo) return false;
        return new Date(validTo) < new Date();
    };

    return (
        <div className="pcm">
            <div className="pcm__header">
                <div className="pcm__header-content">
                    <h1>Promokod Boshqaruvi</h1>
                    <p>Chegirma promokodlarini yarating va boshqaring</p>
                </div>
                <button className="pcm__add-btn" onClick={() => openModal()}>
                    <FiPlus />
                    Yangi Promokod
                </button>
            </div>

            {loading ? (
                <div className="pcm__loading">
                    <div className="pcm__spinner"></div>
                    <p>Yuklanmoqda...</p>
                </div>
            ) : promoCodes.length === 0 ? (
                <div className="pcm__empty">
                    <FiPercent />
                    <h3>Promokodlar yo'q</h3>
                    <p>Yangi promokod qo'shish uchun yuqoridagi tugmani bosing</p>
                </div>
            ) : (
                <div className="pcm__grid">
                    {promoCodes.map(promo => (
                        <div 
                            key={promo.id} 
                            className={`pcm__card ${!promo.is_active || isExpired(promo.valid_to) ? 'pcm__card--inactive' : ''}`}
                            onClick={() => openDetailModal(promo)}
                        >
                            <div className="pcm__card-header">
                                <div className="pcm__code-section">
                                    <div className="pcm__code-badge">
                                        {promo.discount_type === 'percent' ? <FiPercent /> : <FiDollarSign />}
                                        <span className="pcm__code">{promo.code}</span>
                                    </div>
                                    <button
                                        className="pcm__copy-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copyToClipboard(promo.code);
                                        }}
                                        title="Nusxa olish"
                                    >
                                        {copiedCode === promo.code ? <FiCheck /> : <FiCopy />}
                                    </button>
                                </div>
                                <div className="pcm__status-badges">
                                    {isExpired(promo.valid_to) && (
                                        <span className="pcm__badge pcm__badge--expired">Muddati o'tgan</span>
                                    )}
                                    <span className={`pcm__badge ${promo.is_active ? 'pcm__badge--active' : 'pcm__badge--inactive'}`}>
                                        {promo.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                                        {promo.is_active ? 'Faol' : 'Nofaol'}
                                    </span>
                                </div>
                            </div>

                            <div className="pcm__card-body">
                                <div className="pcm__discount">
                                    <span className="pcm__discount-value">
                                        {promo.value}
                                        {promo.discount_type === 'percent' ? '%' : ' coin'}
                                    </span>
                                    <span className="pcm__discount-label">Chegirma</span>
                                </div>

                                <div className="pcm__stats">
                                    <div className="pcm__stat">
                                        <FiUsers />
                                        <div className="pcm__stat-content">
                                            <span className="pcm__stat-value">{promo.uses} / {promo.max_uses}</span>
                                            <span className="pcm__stat-label">Foydalanish</span>
                                        </div>
                                    </div>

                                    <div className="pcm__usage-bar">
                                        <div
                                            className="pcm__usage-fill"
                                            style={{ width: `${getUsagePercentage(promo.uses, promo.max_uses)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="pcm__dates">
                                    <div className="pcm__date">
                                        <FiCalendar />
                                        <div className="pcm__date-content">
                                            <span className="pcm__date-label">Boshlanish</span>
                                            <span className="pcm__date-value">{formatDate(promo.valid_from)}</span>
                                        </div>
                                    </div>
                                    <div className="pcm__date">
                                        <FiCalendar />
                                        <div className="pcm__date-content">
                                            <span className="pcm__date-label">Tugash</span>
                                            <span className="pcm__date-value">{formatDate(promo.valid_to)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pcm__card-actions" onClick={(e) => e.stopPropagation()}>
                                <button className="pcm__action-btn pcm__action-btn--edit" onClick={() => openModal(promo)}>
                                    <FiEdit2 />
                                    Tahrirlash
                                </button>
                                <button className="pcm__action-btn pcm__action-btn--delete" onClick={() => handleDelete(promo.id)}>
                                    <FiTrash2 />
                                    O'chirish
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="pcm__modal-overlay" onClick={closeModal}>
                    <div className="pcm__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="pcm__modal-header">
                            <h2>{editingPromo ? 'Promokodni Tahrirlash' : 'Yangi Promokod'}</h2>
                            <button className="pcm__close-btn" onClick={closeModal}>
                                <FiX />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="pcm__form">
                            <div className="pcm__form-body">
                                <div className="pcm__form-row">
                                    <div className="pcm__form-group">
                                        <label>Promokod *</label>
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                            placeholder="WELCOME10"
                                            required
                                        />
                                    </div>

                                    <div className="pcm__form-group">
                                        <label>Chegirma Turi *</label>
                                        <select
                                            value={formData.discount_type}
                                            onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                                            required
                                        >
                                            <option value="percent">Foiz (%)</option>
                                            <option value="coins">Coin</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pcm__form-row">
                                    <div className="pcm__form-group">
                                        <label>Chegirma Qiymati *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            placeholder="10.00"
                                            required
                                        />
                                    </div>

                                    <div className="pcm__form-group">
                                        <label>Maksimal Foydalanish *</label>
                                        <input
                                            type="number"
                                            value={formData.max_uses}
                                            onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                                            placeholder="100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pcm__form-row">
                                    <div className="pcm__form-group">
                                        <label>Boshlanish Sanasi</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.valid_from}
                                            onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                                        />
                                    </div>

                                    <div className="pcm__form-group">
                                        <label>Tugash Sanasi</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.valid_to}
                                            onChange={(e) => setFormData({ ...formData, valid_to: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pcm__form-group">
                                    <label className="pcm__checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        />
                                        <span>Promokod faol</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pcm__modal-footer">
                                <button type="button" className="pcm__btn pcm__btn--secondary" onClick={closeModal}>
                                    Bekor qilish
                                </button>
                                <button type="submit" className="pcm__btn pcm__btn--primary">
                                    {editingPromo ? 'Yangilash' : 'Yaratish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDetailModal && selectedPromo && (
                <div className="pcm__modal-overlay" onClick={closeDetailModal}>
                    <div className="pcm__modal pcm__modal--detail" onClick={(e) => e.stopPropagation()}>
                        <div className="pcm__modal-header">
                            <h2>Promokod Ma'lumotlari</h2>
                            <button className="pcm__close-btn" onClick={closeDetailModal}>
                                <FiX />
                            </button>
                        </div>

                        <div className="pcm__modal-body">
                            <div className="pcm__detail-hero">
                                <div className="pcm__detail-code">
                                    {selectedPromo.discount_type === 'percent' ? <FiPercent /> : <FiDollarSign />}
                                    <span>{selectedPromo.code}</span>
                                </div>
                                <div className="pcm__detail-discount">
                                    <span className="pcm__detail-value">
                                        {selectedPromo.value}
                                        {selectedPromo.discount_type === 'percent' ? '%' : ' coin'}
                                    </span>
                                    <span className="pcm__detail-label">Chegirma miqdori</span>
                                </div>
                            </div>

                            <div className="pcm__detail-status">
                                {isExpired(selectedPromo.valid_to) && (
                                    <span className="pcm__badge pcm__badge--expired">Muddati o'tgan</span>
                                )}
                                <span className={`pcm__badge ${selectedPromo.is_active ? 'pcm__badge--active' : 'pcm__badge--inactive'}`}>
                                    {selectedPromo.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                                    {selectedPromo.is_active ? 'Faol' : 'Nofaol'}
                                </span>
                            </div>

                            <div className="pcm__detail-grid">
                                <div className="pcm__detail-item">
                                    <div className="pcm__detail-icon">
                                        <FiUsers />
                                    </div>
                                    <div className="pcm__detail-content">
                                        <span className="pcm__detail-title">Foydalanish</span>
                                        <span className="pcm__detail-text">{selectedPromo.uses} / {selectedPromo.max_uses}</span>
                                        <div className="pcm__detail-progress">
                                            <div 
                                                className="pcm__detail-progress-fill" 
                                                style={{ width: `${getUsagePercentage(selectedPromo.uses, selectedPromo.max_uses)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pcm__detail-item">
                                    <div className="pcm__detail-icon">
                                        {selectedPromo.discount_type === 'percent' ? <FiPercent /> : <FiDollarSign />}
                                    </div>
                                    <div className="pcm__detail-content">
                                        <span className="pcm__detail-title">Chegirma turi</span>
                                        <span className="pcm__detail-text">
                                            {selectedPromo.discount_type === 'percent' ? 'Foiz (%)' : 'Coin'}
                                        </span>
                                    </div>
                                </div>

                                <div className="pcm__detail-item">
                                    <div className="pcm__detail-icon">
                                        <FiCalendar />
                                    </div>
                                    <div className="pcm__detail-content">
                                        <span className="pcm__detail-title">Boshlanish sanasi</span>
                                        <span className="pcm__detail-text">{formatDate(selectedPromo.valid_from)}</span>
                                    </div>
                                </div>

                                <div className="pcm__detail-item">
                                    <div className="pcm__detail-icon">
                                        <FiCalendar />
                                    </div>
                                    <div className="pcm__detail-content">
                                        <span className="pcm__detail-title">Tugash sanasi</span>
                                        <span className="pcm__detail-text">{formatDate(selectedPromo.valid_to)}</span>
                                    </div>
                                </div>

                                <div className="pcm__detail-item">
                                    <div className="pcm__detail-icon">
                                        <FiCalendar />
                                    </div>
                                    <div className="pcm__detail-content">
                                        <span className="pcm__detail-title">Yaratilgan sana</span>
                                        <span className="pcm__detail-text">{formatDate(selectedPromo.created_at)}</span>
                                    </div>
                                </div>

                                <div className="pcm__detail-item">
                                    <div className="pcm__detail-icon">
                                        <FiUsers />
                                    </div>
                                    <div className="pcm__detail-content">
                                        <span className="pcm__detail-title">Maksimal foydalanish</span>
                                        <span className="pcm__detail-text">{selectedPromo.max_uses} marta</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pcm__modal-footer">
                            <button 
                                className="pcm__btn pcm__btn--secondary" 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    copyToClipboard(selectedPromo.code);
                                }}
                            >
                                <FiCopy />
                                {copiedCode === selectedPromo.code ? 'Nusxa olindi!' : 'Kodni nusxalash'}
                            </button>
                            <button 
                                className="pcm__btn pcm__btn--primary" 
                                onClick={() => {
                                    closeDetailModal();
                                    openModal(selectedPromo);
                                }}
                            >
                                <FiEdit2 />
                                Tahrirlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoCodesManagement;
