import React, { useState, useEffect } from 'react';
import { FiImage, FiPlus, FiEdit2, FiTrash2, FiMonitor, FiTablet, FiSmartphone, FiExternalLink, FiCalendar, FiToggleLeft, FiToggleRight, FiTag, FiEye, FiFilm } from 'react-icons/fi';
import * as directorAPI from '../../api/apiDirectorProfile';

import { useNavigate } from 'react-router-dom';

const SiteManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('banners');
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewBanner, setPreviewBanner] = useState(null);
    const [editingBanner, setEditingBanner] = useState(null);
    const [deviceView, setDeviceView] = useState('desktop'); // desktop, tablet, mobile
    const [previewDevice, setPreviewDevice] = useState('desktop');
    const [formData, setFormData] = useState({
        title: '',
        alt_text: '',
        position: 'hero',
        order: 1,
        target_url: '',
        is_active: true,
        start_at: '',
        end_at: '',
    });
    const [imageFiles, setImageFiles] = useState({
        image: null,
        image_mobile: null,
        image_tablet: null,
    });
    const [imagePreviews, setImagePreviews] = useState({
        image: null,
        image_mobile: null,
        image_tablet: null,
    });

    // Categories State
    const [categories, setCategories] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showCategoryPreview, setShowCategoryPreview] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [previewCategory, setPreviewCategory] = useState(null);
    const [categoryFormData, setCategoryFormData] = useState({
        name: '',
        slug: '',
        description: '',
        color: '#00DF3E',
    });
    const [categoryImageFiles, setCategoryImageFiles] = useState({
        category_img: null,
        category_banner: null,
    });
    const [categoryImagePreviews, setCategoryImagePreviews] = useState({
        category_img: null,
        category_banner: null,
    });

    // Movie Categories State
    const [movieCategories, setMovieCategories] = useState([]);
    const [showMovieCategoryModal, setShowMovieCategoryModal] = useState(false);
    const [showMovieCategoryPreview, setShowMovieCategoryPreview] = useState(false);
    const [editingMovieCategory, setEditingMovieCategory] = useState(null);
    const [previewMovieCategory, setPreviewMovieCategory] = useState(null);
    const [movieCategoryFormData, setMovieCategoryFormData] = useState({
        name: '',
        slug: '',
        description: '',
    });
    const [movieCategoryImageFiles, setMovieCategoryImageFiles] = useState({
        category_img: null,
        category_banner: null,
    });
    const [movieCategoryImagePreviews, setMovieCategoryImagePreviews] = useState({
        category_img: null,
        category_banner: null,
    });

    useEffect(() => {
        fetchBanners();
        fetchCategories();
        fetchMovieCategories();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const data = await directorAPI.getBanners();
            setBanners(data);
        } catch (error) {
            console.error('Error fetching banners:', error);
            alert('Bannerlarni yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setImageFiles(prev => ({ ...prev, [type]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) {
                data.append(key, formData[key]);
            }
        });

        Object.keys(imageFiles).forEach(key => {
            if (imageFiles[key]) {
                data.append(key, imageFiles[key]);
            }
        });

        try {
            if (editingBanner) {
                await directorAPI.updateBanner(editingBanner.id, data);
                alert('Banner muvaffaqiyatli yangilandi!');
            } else {
                await directorAPI.createBanner(data);
                alert('Banner muvaffaqiyatli yaratildi!');
            }
            fetchBanners();
            closeModal();
        } catch (error) {
            console.error('Error saving banner:', error);
            alert('Bannerni saqlashda xatolik yuz berdi');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bannerni o\'chirmoqchimisiz?')) {
            try {
                await directorAPI.deleteBanner(id);
                alert('Banner muvaffaqiyatli o\'chirildi!');
                fetchBanners();
            } catch (error) {
                console.error('Error deleting banner:', error);
                alert('Bannerni o\'chirishda xatolik yuz berdi');
            }
        }
    };

    const openModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                title: banner.title,
                alt_text: banner.alt_text,
                position: banner.position,
                order: banner.order,
                target_url: banner.target_url || '',
                is_active: banner.is_active,
                start_at: banner.start_at ? banner.start_at.split('Z')[0] : '',
                end_at: banner.end_at ? banner.end_at.split('Z')[0] : '',
            });
            setImagePreviews({
                image: banner.image,
                image_mobile: banner.image_mobile,
                image_tablet: banner.image_tablet,
            });
        } else {
            setEditingBanner(null);
            setFormData({
                title: '',
                alt_text: '',
                position: 'hero',
                order: 1,
                target_url: '',
                is_active: true,
                start_at: '',
                end_at: '',
            });
            setImagePreviews({
                image: null,
                image_mobile: null,
                image_tablet: null,
            });
        }
        setImageFiles({
            image: null,
            image_mobile: null,
            image_tablet: null,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBanner(null);
    };

    const getCurrentImage = (banner, device = deviceView) => {
        if (device === 'mobile') return banner.image_mobile;
        if (device === 'tablet') return banner.image_tablet;
        return banner.image;
    };

    const getDeviceWidth = (device = deviceView) => {
        if (device === 'mobile') return '375px';
        if (device === 'tablet') return '768px';
        return '100%';
    };

    const openPreviewModal = (banner) => {
        setPreviewBanner(banner);
        setPreviewDevice('desktop');
        setShowPreviewModal(true);
    };

    // ==================== Categories Functions ====================

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await directorAPI.getCourseCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert('Kategoriyalarni yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleCategoryNameChange = (name) => {
        setCategoryFormData({
            ...categoryFormData,
            name: name,
            slug: generateSlug(name)
        });
    };

    const handleCategoryImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setCategoryImageFiles(prev => ({ ...prev, [type]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setCategoryImagePreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(categoryFormData).forEach(key => {
            if (categoryFormData[key]) {
                data.append(key, categoryFormData[key]);
            }
        });

        Object.keys(categoryImageFiles).forEach(key => {
            if (categoryImageFiles[key]) {
                data.append(key, categoryImageFiles[key]);
            }
        });

        try {
            if (editingCategory) {
                await directorAPI.updateCourseCategory(editingCategory.slug, data);
                alert('Kategoriya muvaffaqiyatli yangilandi!');
            } else {
                await directorAPI.createCourseCategory(data);
                alert('Kategoriya muvaffaqiyatli yaratildi!');
            }
            fetchCategories();
            closeCategoryModal();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Kategoriyani saqlashda xatolik yuz berdi');
        }
    };

    const handleCategoryDelete = async (id) => {
        if (window.confirm('Kategoriyani o\'chirmoqchimisiz?')) {
            try {
                await directorAPI.deleteCourseCategory(id);
                alert('Kategoriya muvaffaqiyatli o\'chirildi!');
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Kategoriyani o\'chirishda xatolik yuz berdi');
            }
        }
    };

    const openCategoryModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setCategoryFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
                color: category.color || '#00DF3E',
            });
            setCategoryImagePreviews({
                category_img: category.category_img,
                category_banner: category.category_banner,
            });
        } else {
            setEditingCategory(null);
            setCategoryFormData({
                name: '',
                slug: '',
                description: '',
                color: '#00DF3E',
            });
            setCategoryImagePreviews({
                category_img: null,
                category_banner: null,
            });
        }
        setCategoryImageFiles({
            category_img: null,
            category_banner: null,
        });
        setShowCategoryModal(true);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setEditingCategory(null);
    };

    const openCategoryPreview = (category) => {
        setPreviewCategory(category);
        setShowCategoryPreview(true);
    };

    // ==================== Movie Categories Functions ====================

    const fetchMovieCategories = async () => {
        try {
            setLoading(true);
            const data = await directorAPI.getMovieCategories();
            setMovieCategories(data);
        } catch (error) {
            console.error('Error fetching movie categories:', error);
            alert('Kino kategoriyalarini yuklashda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const handleMovieCategoryNameChange = (name) => {
        setMovieCategoryFormData({
            ...movieCategoryFormData,
            name: name,
            slug: generateSlug(name)
        });
    };

    const handleMovieCategoryImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            setMovieCategoryImageFiles(prev => ({ ...prev, [type]: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setMovieCategoryImagePreviews(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMovieCategorySubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(movieCategoryFormData).forEach(key => {
            if (movieCategoryFormData[key]) {
                data.append(key, movieCategoryFormData[key]);
            }
        });

        Object.keys(movieCategoryImageFiles).forEach(key => {
            if (movieCategoryImageFiles[key]) {
                data.append(key, movieCategoryImageFiles[key]);
            }
        });

        try {
            if (editingMovieCategory) {
                await directorAPI.updateMovieCategory(editingMovieCategory.slug, data);
                alert('Kino kategoriyasi muvaffaqiyatli yangilandi!');
            } else {
                await directorAPI.createMovieCategory(data);
                alert('Kino kategoriyasi muvaffaqiyatli yaratildi!');
            }
            fetchMovieCategories();
            closeMovieCategoryModal();
        } catch (error) {
            console.error('Error saving movie category:', error);
            alert('Kino kategoriyasini saqlashda xatolik yuz berdi');
        }
    };

    const handleMovieCategoryDelete = async (slug) => {
        if (window.confirm('Kino kategoriyasini o\'chirmoqchimisiz?')) {
            try {
                await directorAPI.deleteMovieCategory(slug);
                alert('Kino kategoriyasi muvaffaqiyatli o\'chirildi!');
                fetchMovieCategories();
            } catch (error) {
                console.error('Error deleting movie category:', error);
                alert('Kino kategoriyasini o\'chirishda xatolik yuz berdi');
            }
        }
    };

    const openMovieCategoryModal = (category = null) => {
        if (category) {
            setEditingMovieCategory(category);
            setMovieCategoryFormData({
                name: category.name,
                slug: category.slug,
                description: category.description || '',
            });
            setMovieCategoryImagePreviews({
                category_img: category.category_img,
                category_banner: category.category_banner,
            });
        } else {
            setEditingMovieCategory(null);
            setMovieCategoryFormData({
                name: '',
                slug: '',
                description: '',
            });
            setMovieCategoryImagePreviews({
                category_img: null,
                category_banner: null,
            });
        }
        setMovieCategoryImageFiles({
            category_img: null,
            category_banner: null,
        });
        setShowMovieCategoryModal(true);
    };

    const closeMovieCategoryModal = () => {
        setShowMovieCategoryModal(false);
        setEditingMovieCategory(null);
    };

    const openMovieCategoryPreview = (category) => {
        setPreviewMovieCategory(category);
        setShowMovieCategoryPreview(true);
    };

    return (
        <div className="sm">
            <div className="sm__header">
                <div className="sm__header-content">
                    <h1>Sayt Boshqaruvi</h1>
                    <p>Sayt elementlarini boshqaring va sozlang</p>
                </div>
            </div>

            <div className="sm__tabs">
                <button
                    className={`sm__tab ${activeTab === 'banners' ? 'sm__tab--active' : ''}`}
                    onClick={() => setActiveTab('banners')}
                >
                    <FiImage />
                    <span>Bannerlar</span>
                </button>
                <button
                    className={`sm__tab ${activeTab === 'categories' ? 'sm__tab--active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    <FiTag />
                    <span>Kurs Kategoriyalari</span>
                </button>
                <button
                    className={`sm__tab ${activeTab === 'movie-categories' ? 'sm__tab--active' : ''}`}
                    onClick={() => setActiveTab('movie-categories')}
                >
                    <FiFilm />
                    <span>Kino Kategoriyalari</span>
                </button>
            </div>

            <div className="sm__content">
                {activeTab === 'banners' && (
                    <div className="sm__banners">
                        <div className="sm__banners-header">
                            <button className="sm__add-btn" onClick={() => openModal()}>
                                <FiPlus />
                                <span>Banner Qo'shish</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="sm__loading">
                                <div className="sm__spinner"></div>
                                <p>Yuklanmoqda...</p>
                            </div>
                        ) : banners.length === 0 ? (
                            <div className="sm__empty">
                                <FiImage />
                                <h3>Bannerlar yo'q</h3>
                                <p>Yangi banner qo'shish uchun yuqoridagi tugmani bosing</p>
                            </div>
                        ) : (
                            <div className="sm__banners-grid">
                                {banners.map(banner => (
                                    <div key={banner.id} className="sm__banner-card" onClick={() => openPreviewModal(banner)}>
                                        <div className="sm__banner-image">
                                            <img src={banner.image} alt={banner.alt_text} />
                                            <div className="sm__banner-badge">
                                                <span className={`sm__status ${banner.is_active ? 'sm__status--active' : 'sm__status--inactive'}`}>
                                                    {banner.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                                                    {banner.is_active ? 'Faol' : 'Nofaol'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="sm__banner-info">
                                            <h4>{banner.title}</h4>
                                            <div className="sm__banner-meta-row">
                                                <span className="sm__position-badge">{banner.position}</span>
                                                <span className="sm__order">#{banner.order}</span>
                                            </div>
                                        </div>
                                        <div className="sm__banner-actions" onClick={(e) => e.stopPropagation()}>
                                            <button className="sm__action-btn sm__action-btn--edit" onClick={() => openModal(banner)}>
                                                <FiEdit2 />
                                            </button>
                                            <button className="sm__action-btn sm__action-btn--delete" onClick={() => handleDelete(banner.id)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="sm__categories">
                        <div className="sm__categories-header">
                            <button className="sm__add-btn" onClick={() => openCategoryModal()}>
                                <FiPlus />
                                <span>Kategoriya Qo'shish</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="sm__loading">
                                <div className="sm__spinner"></div>
                                <p>Yuklanmoqda...</p>
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="sm__empty">
                                <FiTag />
                                <h3>Kategoriyalar yo'q</h3>
                                <p>Yangi kategoriya qo'shish uchun yuqoridagi tugmani bosing</p>
                            </div>
                        ) : (
                            <div className="sm__categories-grid">
                                {categories.map(category => (
                                    <div key={category.id} className="sm__category-card">
                                        <div className="sm__category-banner">
                                            <img src={category.category_img} alt={category.name} />
                                        </div>
                                        <div className="sm__category-info">
                                            <h4>{category.name}</h4>
                                            <p className="sm__category-slug">{category.slug}</p>

                                            <div className="sm__category-meta">
                                                <div className="sm__category-color" style={{ backgroundColor: category.color }}>
                                                    <span>{category.color}</span>
                                                </div>
                                                <span className="sm__category-count">
                                                    {category.course_count} ta kurs
                                                </span>
                                            </div>
                                        </div>
                                        <div className="sm__category-actions">
                                            <button
                                                className="sm__action-btn sm__action-btn--view"
                                                onClick={() => openCategoryPreview(category)}
                                                title="Ko'rish"
                                            >
                                                <FiEye />
                                            </button>
                                            <button
                                                className="sm__action-btn sm__action-btn--edit"
                                                onClick={() => openCategoryModal(category)}
                                                title="Tahrirlash"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                className="sm__action-btn sm__action-btn--delete"
                                                onClick={() => handleCategoryDelete(category.slug)}
                                                title="O'chirish"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'movie-categories' && (
                    <div className="sm__categories">
                        <div className="sm__categories-header">
                            <button className="sm__add-btn" onClick={() => openMovieCategoryModal()}>
                                <FiPlus />
                                <span>Kategoriyasi Qo'shish</span>
                            </button>
                        </div>

                        {loading ? (
                            <div className="sm__loading">
                                <div className="sm__spinner"></div>
                                <p>Yuklanmoqda...</p>
                            </div>
                        ) : movieCategories.length === 0 ? (
                            <div className="sm__empty">
                                <FiFilm />
                                <h3>Kino kategoriyalari yo'q</h3>
                                <p>Yangi kino kategoriyasi qo'shish uchun yuqoridagi tugmani bosing</p>
                            </div>
                        ) : (
                            <div className="sm__categories-grid">
                                {movieCategories.map(category => (
  <div
    key={category.id}
    className="sm__category-card sm__category-card--clickable"
    onClick={e => {
      if (!e.target.closest('.sm__category-actions')) {
        navigate(`/profile/director/category-movies/${category.slug}`);
      }
    }}
    style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
    tabIndex={0}
    onKeyDown={e => {
      if (e.key === 'Enter') navigate(`/profile/director/category-movies/${category.slug}`);
    }}
  >
    <div className="sm__category-banner">
      <img src={category.category_img} alt={category.name} />
    </div>
    <div className="sm__category-info">
      <h4>{category.name}</h4>
      <p className="sm__category-slug">{category.slug}</p>
    </div>
    <div className="sm__category-actions">
      <button
        className="sm__action-btn sm__action-btn--view"
        onClick={e => { e.stopPropagation(); openMovieCategoryPreview(category); }}
        title="Ko'rish"
      >
        <FiEye />
      </button>
      <button
        className="sm__action-btn sm__action-btn--edit"
        onClick={e => { e.stopPropagation(); openMovieCategoryModal(category); }}
        title="Tahrirlash"
      >
        <FiEdit2 />
      </button>
      <button
        className="sm__action-btn sm__action-btn--delete"
        onClick={e => { e.stopPropagation(); handleMovieCategoryDelete(category.slug); }}
        title="O'chirish"
      >
        <FiTrash2 />
      </button>
    </div>
  </div>
))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="sm__modal-overlay" onClick={closeModal}>
                    <div className="sm__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="sm__modal-header">
                            <h3>{editingBanner ? 'Bannerni Tahrirlash' : 'Yangi Banner Qo\'shish'}</h3>
                            <button className="sm__modal-close" onClick={closeModal}>×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="sm__modal-body">
                            <div className="sm__form-row">
                                <div className="sm__form-group">
                                    <label>Sarlavha *</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="sm__form-group">
                                    <label>Alt Text *</label>
                                    <input
                                        type="text"
                                        value={formData.alt_text}
                                        onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="sm__form-row">
                                <div className="sm__form-group">
                                    <label>Pozitsiya *</label>
                                    <select
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        required
                                    >
                                        <option value="hero">Hero</option>
                                        <option value="advertisement">Reklama</option>
                                        <option value="sidebar">Sidebar</option>
                                    </select>
                                </div>
                                <div className="sm__form-group">
                                    <label>Tartib *</label>
                                    <input
                                        type="number"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="sm__form-group">
                                <label>Havola URL</label>
                                <input
                                    type="url"
                                    value={formData.target_url}
                                    onChange={(e) => setFormData({ ...formData, target_url: e.target.value })}
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div className="sm__form-row">
                                <div className="sm__form-group">
                                    <label>Boshlanish vaqti</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.start_at}
                                        onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                                    />
                                </div>
                                <div className="sm__form-group">
                                    <label>Tugash vaqti</label>
                                    <input
                                        type="datetime-local"
                                        value={formData.end_at}
                                        onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="sm__form-group sm__form-group--checkbox">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    />
                                    <span>Faol</span>
                                </label>
                            </div>

                            <div className="sm__images-section">
                                <h4>Rasmlar</h4>
                                <div className="sm__images-grid">
                                    <div className="sm__image-upload">
                                        <label>
                                            <FiMonitor />
                                            <span>Desktop (992px+)</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, 'image')}
                                            />
                                        </label>
                                        {imagePreviews.image && (
                                            <div className="sm__image-preview">
                                                <img src={imagePreviews.image} alt="Desktop preview" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="sm__image-upload">
                                        <label>
                                            <FiTablet />
                                            <span>Planshet (576-992px)</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, 'image_tablet')}
                                            />
                                        </label>
                                        {imagePreviews.image_tablet && (
                                            <div className="sm__image-preview">
                                                <img src={imagePreviews.image_tablet} alt="Tablet preview" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="sm__image-upload">
                                        <label>
                                            <FiSmartphone />
                                            <span>Mobil (0-576px)</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, 'image_mobile')}
                                            />
                                        </label>
                                        {imagePreviews.image_mobile && (
                                            <div className="sm__image-preview">
                                                <img src={imagePreviews.image_mobile} alt="Mobile preview" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="sm__modal-footer">
                                <button type="button" className="sm__btn sm__btn--secondary" onClick={closeModal}>
                                    Bekor qilish
                                </button>
                                <button type="submit" className="sm__btn sm__btn--primary">
                                    {editingBanner ? 'Yangilash' : 'Yaratish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showPreviewModal && previewBanner && (
                <div className="sm__modal-overlay" onClick={() => setShowPreviewModal(false)}>
                    <div className="sm__modal sm__modal--preview" onClick={(e) => e.stopPropagation()}>
                        <div className="sm__modal-header">
                            <h3>{previewBanner.title}</h3>
                            <button className="sm__modal-close" onClick={() => setShowPreviewModal(false)}>×</button>
                        </div>
                        <div className="sm__modal-body">
                            <div className="sm__preview-controls">
                                <div className="sm__device-selector">
                                    <button
                                        className={`sm__device-btn ${previewDevice === 'desktop' ? 'sm__device-btn--active' : ''}`}
                                        onClick={() => setPreviewDevice('desktop')}
                                    >
                                        <FiMonitor />
                                        <span>Desktop</span>
                                    </button>
                                    <button
                                        className={`sm__device-btn ${previewDevice === 'tablet' ? 'sm__device-btn--active' : ''}`}
                                        onClick={() => setPreviewDevice('tablet')}
                                    >
                                        <FiTablet />
                                        <span>Planshet</span>
                                    </button>
                                    <button
                                        className={`sm__device-btn ${previewDevice === 'mobile' ? 'sm__device-btn--active' : ''}`}
                                        onClick={() => setPreviewDevice('mobile')}
                                    >
                                        <FiSmartphone />
                                        <span>Mobil</span>
                                    </button>
                                </div>
                            </div>

                            <div className="sm__preview-container">
                                <div className="sm__preview-frame" style={{ maxWidth: getDeviceWidth(previewDevice) }}>
                                    <img src={getCurrentImage(previewBanner, previewDevice)} alt={previewBanner.alt_text} />
                                    <div className="sm__preview-label">
                                        {previewDevice === 'mobile' && '375px (Mobile)'}
                                        {previewDevice === 'tablet' && '768px (Planshet)'}
                                        {previewDevice === 'desktop' && '992px+ (Desktop)'}
                                    </div>
                                </div>
                            </div>

                            <div className="sm__preview-details">
                                <div className="sm__detail-grid">
                                    <div className="sm__detail-item">
                                        <label>Pozitsiya:</label>
                                        <span className="sm__position-badge">{previewBanner.position}</span>
                                    </div>
                                    <div className="sm__detail-item">
                                        <label>Tartib:</label>
                                        <span>#{previewBanner.order}</span>
                                    </div>
                                    <div className="sm__detail-item">
                                        <label>Status:</label>
                                        <span className={`sm__status ${previewBanner.is_active ? 'sm__status--active' : 'sm__status--inactive'}`}>
                                            {previewBanner.is_active ? <FiToggleRight /> : <FiToggleLeft />}
                                            {previewBanner.is_active ? 'Faol' : 'Nofaol'}
                                        </span>
                                    </div>
                                    {previewBanner.target_url && (
                                        <div className="sm__detail-item">
                                            <label>Havola:</label>
                                            <a href={previewBanner.target_url} target="_blank" rel="noopener noreferrer">
                                                <FiExternalLink /> Ko'rish
                                            </a>
                                        </div>
                                    )}
                                    {previewBanner.start_at && (
                                        <div className="sm__detail-item">
                                            <label>Boshlanish:</label>
                                            <span><FiCalendar /> {new Date(previewBanner.start_at).toLocaleDateString('uz-UZ')}</span>
                                        </div>
                                    )}
                                    {previewBanner.end_at && (
                                        <div className="sm__detail-item">
                                            <label>Tugash:</label>
                                            <span><FiCalendar /> {new Date(previewBanner.end_at).toLocaleDateString('uz-UZ')}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="sm__modal-footer">
                            <button className="sm__btn sm__btn--secondary" onClick={() => setShowPreviewModal(false)}>
                                Yopish
                            </button>
                            <button className="sm__btn sm__btn--primary" onClick={() => {
                                setShowPreviewModal(false);
                                openModal(previewBanner);
                            }}>
                                <FiEdit2 /> Tahrirlash
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="sm__modal-overlay" onClick={closeCategoryModal}>
                    <div className="sm__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="sm__modal-header">
                            <h3>{editingCategory ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya Qo\'shish'}</h3>
                            <button className="sm__modal-close" onClick={closeCategoryModal}>×</button>
                        </div>
                        <form onSubmit={handleCategorySubmit} className="sm__modal-body">
                            <div className="sm__form-row">
                                <div className="sm__form-group">
                                    <label>Kategoriya nomi *</label>
                                    <input
                                        type="text"
                                        value={categoryFormData.name}
                                        onChange={(e) => handleCategoryNameChange(e.target.value)}
                                        required
                                        placeholder="Masalan: Dasturlash"
                                    />
                                </div>
                                <div className="sm__form-group">
                                    <label>Slug *</label>
                                    <input
                                        type="text"
                                        value={categoryFormData.slug}
                                        onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                                        required
                                        placeholder="dasturlash"
                                    />
                                </div>
                            </div>

                            <div className="sm__form-group">
                                <label>Tavsif</label>
                                <textarea
                                    value={categoryFormData.description}
                                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                                    rows="3"
                                    placeholder="Kategoriya haqida qisqacha ma'lumot"
                                />
                            </div>

                            <div className="sm__form-group">
                                <label>Rang *</label>
                                <div className="sm__color-picker">
                                    <input
                                        type="color"
                                        value={categoryFormData.color}
                                        onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        value={categoryFormData.color}
                                        onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                                        placeholder="#00DF3E"
                                        className="sm__color-input"
                                    />
                                    <div className="sm__color-preview" style={{ backgroundColor: categoryFormData.color }}></div>
                                </div>
                            </div>

                            <div className="sm__images-section">
                                <h4>Rasmlar</h4>
                                <div className="sm__images-grid sm__images-grid--two">
                                    <div className="sm__image-upload">
                                        <label>
                                            <FiImage />
                                            <span>Kategoriya Icon</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleCategoryImageChange(e, 'category_img')}
                                            />
                                        </label>
                                        {categoryImagePreviews.category_img && (
                                            <div className="sm__image-preview">
                                                <img src={categoryImagePreviews.category_img} alt="Icon preview" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="sm__image-upload">
                                        <label>
                                            <FiImage />
                                            <span>Kategoriya Banner</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleCategoryImageChange(e, 'category_banner')}
                                            />
                                        </label>
                                        {categoryImagePreviews.category_banner && (
                                            <div className="sm__image-preview">
                                                <img src={categoryImagePreviews.category_banner} alt="Banner preview" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="sm__modal-footer">
                                <button type="button" className="sm__btn sm__btn--secondary" onClick={closeCategoryModal}>
                                    Bekor qilish
                                </button>
                                <button type="submit" className="sm__btn sm__btn--primary">
                                    {editingCategory ? 'Yangilash' : 'Yaratish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Preview Modal */}
            {showCategoryPreview && previewCategory && (
                <div className="sm__modal-overlay" onClick={() => setShowCategoryPreview(false)}>
                    <div className="sm__modal sm__modal--preview" onClick={(e) => e.stopPropagation()}>
                        <div className="sm__modal-header">
                            <h3>{previewCategory.name}</h3>
                            <button className="sm__modal-close" onClick={() => setShowCategoryPreview(false)}>×</button>
                        </div>
                        <div className="sm__modal-body">
                            <div className="sm__category-preview">
                                <div className="sm__category-preview-left">
                                    <div className="sm__category-preview-icon">
                                        <img src={previewCategory.category_img} alt={previewCategory.name} />
                                    </div>
                                </div>

                                <div className="sm__category-preview-right">
                                    <div className="sm__category-preview-banner">
                                        <img src={previewCategory.category_banner} alt={previewCategory.name} />
                                    </div>

                                    <div className="sm__preview-details">
                                        <div className="sm__detail-grid">
                                            <div className="sm__detail-item">
                                                <label>Slug:</label>
                                                <span className="sm__slug-badge">{previewCategory.slug}</span>
                                            </div>
                                            <div className="sm__detail-item">
                                                <label>Rang:</label>
                                                <div className="sm__color-display">
                                                    <div className="sm__color-box" style={{ backgroundColor: previewCategory.color }}></div>
                                                    <span>{previewCategory.color}</span>
                                                </div>
                                            </div>
                                            <div className="sm__detail-item">
                                                <label>Kurslar soni:</label>
                                                <span className="sm__count-badge">{previewCategory.course_count} ta kurs</span>
                                            </div>
                                        </div>
                                        {previewCategory.description && (
                                            <div className="sm__detail-full">
                                                <label>Tavsif:</label>
                                                <p>{previewCategory.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="sm__modal-footer">
                            <button className="sm__btn sm__btn--secondary" onClick={() => setShowCategoryPreview(false)}>
                                Yopish
                            </button>
                            <button className="sm__btn sm__btn--primary" onClick={() => {
                                setShowCategoryPreview(false);
                                openCategoryModal(previewCategory);
                            }}>
                                <FiEdit2 /> Tahrirlash
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Movie Category Modal */}
            {showMovieCategoryModal && (
                <div className="sm__modal-overlay" onClick={closeMovieCategoryModal}>
                    <div className="sm__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="sm__modal-header">
                            <h3>{editingMovieCategory ? 'Kino Kategoriyasini Tahrirlash' : 'Yangi Kino Kategoriyasi Qo\'shish'}</h3>
                            <button className="sm__modal-close" onClick={closeMovieCategoryModal}>×</button>
                        </div>
                        <form onSubmit={handleMovieCategorySubmit} className="sm__modal-body">
                            <div className="sm__form-row">
                                <div className="sm__form-group">
                                    <label>Kategoriya nomi *</label>
                                    <input
                                        type="text"
                                        value={movieCategoryFormData.name}
                                        onChange={(e) => handleMovieCategoryNameChange(e.target.value)}
                                        required
                                        placeholder="Masalan: Islomiy"
                                    />
                                </div>
                                <div className="sm__form-group">
                                    <label>Slug *</label>
                                    <input
                                        type="text"
                                        value={movieCategoryFormData.slug}
                                        onChange={(e) => setMovieCategoryFormData({ ...movieCategoryFormData, slug: e.target.value })}
                                        required
                                        placeholder="islomiy"
                                    />
                                </div>
                            </div>

                            <div className="sm__form-group">
                                <label>Tavsif</label>
                                <textarea
                                    value={movieCategoryFormData.description}
                                    onChange={(e) => setMovieCategoryFormData({ ...movieCategoryFormData, description: e.target.value })}
                                    rows="3"
                                    placeholder="Kino kategoriyasi haqida qisqacha ma'lumot"
                                />
                            </div>

                            <div className="sm__images-section">
                                <h4>Rasmlar</h4>
                                <div className="sm__images-grid sm__images-grid--two">
                                    <div className="sm__image-upload">
                                        <label>
                                            <FiImage />
                                            <span>Kategoriya Icon</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleMovieCategoryImageChange(e, 'category_img')}
                                            />
                                        </label>
                                        {movieCategoryImagePreviews.category_img && (
                                            <div className="sm__image-preview">
                                                <img src={movieCategoryImagePreviews.category_img} alt="Icon preview" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="sm__image-upload">
                                        <label>
                                            <FiImage />
                                            <span>Kategoriya Banner</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleMovieCategoryImageChange(e, 'category_banner')}
                                            />
                                        </label>
                                        {movieCategoryImagePreviews.category_banner && (
                                            <div className="sm__image-preview">
                                                <img src={movieCategoryImagePreviews.category_banner} alt="Banner preview" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="sm__modal-footer">
                                <button type="button" className="sm__btn sm__btn--secondary" onClick={closeMovieCategoryModal}>
                                    Bekor qilish
                                </button>
                                <button type="submit" className="sm__btn sm__btn--primary">
                                    {editingMovieCategory ? 'Yangilash' : 'Yaratish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Movie Category Preview Modal */}
            {showMovieCategoryPreview && previewMovieCategory && (
                <div className="sm__modal-overlay" onClick={() => setShowMovieCategoryPreview(false)}>
                    <div className="sm__modal sm__modal--preview" onClick={(e) => e.stopPropagation()}>
                        <div className="sm__modal-header">
                            <h3>{previewMovieCategory.name}</h3>
                            <button className="sm__modal-close" onClick={() => setShowMovieCategoryPreview(false)}>×</button>
                        </div>
                        <div className="sm__modal-body">
                            <div className="sm__category-preview">
                                <div className="sm__category-preview-left">
                                    <div className="sm__category-preview-icon">
                                        <img src={previewMovieCategory.category_img} alt={previewMovieCategory.name} />
                                    </div>
                                </div>

                                <div className="sm__category-preview-right">
                                    <div className="sm__category-preview-banner">
                                        <img src={previewMovieCategory.category_banner} alt={previewMovieCategory.name} />
                                    </div>

                                    <div className="sm__preview-details">
                                        <div className="sm__detail-grid">
                                            <div className="sm__detail-item">
                                                <label>Slug:</label>
                                                <span className="sm__slug-badge">{previewMovieCategory.slug}</span>
                                            </div>
                                            <div className="sm__detail-item">
                                                <label>Kurslar soni:</label>
                                                <span className="sm__count-badge">{previewMovieCategory.course_count} ta kurs</span>
                                            </div>
                                        </div>
                                        {previewMovieCategory.description && (
                                            <div className="sm__detail-full">
                                                <label>Tavsif:</label>
                                                <p>{previewMovieCategory.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sm__modal-footer">
                            <button className="sm__btn sm__btn--secondary" onClick={() => setShowMovieCategoryPreview(false)}>
                                Yopish
                            </button>
                            <button className="sm__btn sm__btn--primary" onClick={() => {
                                setShowMovieCategoryPreview(false);
                                openMovieCategoryModal(previewMovieCategory);
                            }}>
                                <FiEdit2 /> Tahrirlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SiteManagement;
