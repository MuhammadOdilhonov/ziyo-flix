import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { teacherAPI } from "../../api/apiTeacher"
import { BaseUrlReels } from "../../api/apiService"
import useSelectedChannel from "../../hooks/useSelectedChannel"
import { 
    FiHash, 
    FiSave, 
    FiUpload, 
    FiImage, 
    FiEye, 
    FiX,
    FiCamera,
    FiGlobe,
    FiUser,
    FiStar,
    FiUsers,
    FiCalendar,
    FiArrowLeft,
    FiCheck,
    FiMonitor,
    FiTablet,
    FiSmartphone
} from "react-icons/fi"

const emptyForm = { 
    title: "", 
    slug: "", 
    description: "", 
    badge: "",
    avatar: null, 
    banner: null,
    website: "",
    telegram: "",
    instagram: "",
    github: "",
    linkedin: "",
    location_country: "",
    location_city: "",
    years_experience: ""
}

// Mutaxassislik ro'yxati
const SPECIALIZATIONS = [
    "Frontend Developer",
    "Backend Developer", 
    "FullStack Developer",
    "Mobile Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "UI/UX Designer",
    "Product Manager",
    "QA Engineer",
    "Cybersecurity Specialist",
    "Cloud Architect",
    "Database Administrator",
    "Game Developer",
    "Blockchain Developer",
    "AI Engineer",
    "Software Architect",
    "Technical Lead",
    "System Administrator",
    "Network Engineer"
]

const ChannelEditor = () => {
    const navigate = useNavigate()
    const [params] = useSearchParams()
    const [form, setForm] = useState(emptyForm)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [previewMode, setPreviewMode] = useState('desktop') // desktop, tablet, mobile
    const [showPreview, setShowPreview] = useState(false)
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const [avatarPreview, setAvatarPreview] = useState(null)
    const [bannerPreview, setBannerPreview] = useState(null)
    const { selectChannel } = useSelectedChannel()
    
    const slug = params.get('slug')
    const isEdit = Boolean(slug)

    useEffect(() => {
        if (isEdit) {
            fetchChannelData()
        }
    }, [slug, isEdit])

    const fetchChannelData = async () => {
        try {
            setLoading(true)
            const response = await teacherAPI.getChannels()
            const channels = response.data || []
            const found = channels.find(c => c.slug === slug)
            
            if (found) {
                setForm({
                    title: found.title || "",
                    slug: found.slug || "",
                    description: found.description || "",
                    badge: found.badge || "",
                    avatar: null,
                    banner: null,
                    website: found.website || "",
                    telegram: found.telegram || "",
                    instagram: found.instagram || "",
                    github: found.github || "",
                    linkedin: found.linkedin || "",
                    location_country: found.location_country || "",
                    location_city: found.location_city || "",
                    years_experience: found.years_experience || ""
                })
                
                if (found.avatar) {
                    setAvatarPreview(getImageUrl(found.avatar))
                }
                if (found.banner) {
                    setBannerPreview(getImageUrl(found.banner))
                }
            }
        } catch (error) {
            console.error('Kanal ma\'lumotlarini yuklashda xatolik:', error)
            setError('Kanal ma\'lumotlarini yuklashda xatolik yuz berdi')
        } finally {
            setLoading(false)
        }
    }

    const getImageUrl = (imagePath) => {
        if (!imagePath) return null
        if (imagePath.startsWith('http')) return imagePath
        return `${BaseUrlReels}${imagePath}`
    }

    const handleImageChange = (field, file) => {
        if (!file) return
        
        const url = URL.createObjectURL(file)
        setForm(prev => ({ ...prev, [field]: file }))
        
        if (field === 'avatar') {
            setAvatarPreview(url)
        } else if (field === 'banner') {
            setBannerPreview(url)
        }
    }

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-')
    }

    const handleTitleChange = (e) => {
        const title = e.target.value
        setForm(prev => ({
            ...prev,
            title,
            slug: generateSlug(title)
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const title = form.title.trim()
            const slug = form.slug.trim().toLowerCase()
            
            if (!title || !slug) {
                setError("Kanal nomi va slug majburiy")
                return
            }
            
            if (!/^[a-z0-9-]{3,50}$/.test(slug)) {
                setError("Slug 3-50 belgi, faqat kichik harf, raqam va tire")
                return
            }

            const formData = new FormData()
            formData.append('title', title)
            formData.append('slug', slug)
            formData.append('description', form.description)
            
            if (form.badge) {
                formData.append('badge', form.badge)
            }
            
            if (form.avatar) {
                formData.append('avatar', form.avatar)
            }
            if (form.banner) {
                formData.append('banner', form.banner)
            }
            
            // Optional fields
            if (form.website) formData.append('website', form.website)
            if (form.telegram) formData.append('telegram', form.telegram)
            if (form.instagram) formData.append('instagram', form.instagram)
            if (form.github) formData.append('github', form.github)
            if (form.linkedin) formData.append('linkedin', form.linkedin)
            if (form.location_country) formData.append('location_country', form.location_country)
            if (form.location_city) formData.append('location_city', form.location_city)
            if (form.years_experience) formData.append('years_experience', form.years_experience)

            let response
            if (isEdit) {
                // Slug orqali channel ID ni topish kerak
                const channelsResponse = await teacherAPI.getChannels()
                const channels = channelsResponse.data || []
                const currentChannel = channels.find(c => c.slug === slug)
                if (currentChannel) {
                    response = await teacherAPI.updateChannel(slug, formData)
                } else {
                    throw new Error('Kanal topilmadi')
                }
            } else {
                response = await teacherAPI.createChannel(formData)
            }

            if (response.data) {
                // Update selected channel if this is the current one
                const channelData = {
                    id: response.data.id,
                    title: response.data.title,
                    slug: response.data.slug,
                    username: response.data.slug,
                    avatar: response.data.avatar,
                    banner: response.data.banner,
                    verified: response.data.verified,
                    description: response.data.description
                }
                
                if (!isEdit) {
                    // Auto-select newly created channel
                    selectChannel(channelData)
                    localStorage.setItem('selectedChannel', JSON.stringify(channelData))
                }
            }

            navigate('/profile/teacher/channels', { replace: true })
        } catch (error) {
            console.error('Kanal saqlashda xatolik:', error)
            setError(error.response?.data?.message || 'Kanal saqlashda xatolik yuz berdi')
        } finally {
            setLoading(false)
        }
    }

    if (loading && isEdit) {
        return (
            <div className="teacher-channel-editor">
                <div className="tce__loading">
                    <div className="spinner"></div>
                    <p>Kanal ma'lumotlari yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="teacher-channel-editor">
            {/* Header */}
            <div className="tce__header">
                <div className="tce__header-content">
                    <button 
                        type="button" 
                        className="tce__back-btn"
                        onClick={() => navigate('/profile/teacher/channels')}
                    >
                        <FiArrowLeft size={20} />
                    </button>
                    <div>
                        <h1>{isEdit ? 'Kanalni tahrirlash' : 'Yangi kanal yaratish'}</h1>
                        <p>Kanal ma'lumotlarini to'ldiring va ko'rinishini oldindan ko'ring</p>
                    </div>
                </div>
                <div className="tce__header-actions">
                    <button 
                        type="button" 
                        className="btn btn-outline"
                        onClick={() => setShowPreviewModal(true)}
                    >
                        <FiEye size={16} />
                        Oldindan ko'rish
                    </button>
                </div>
            </div>

            <div className="tce__container">
                {/* Form Section */}
                <div className="tce__form-section">
                    <form className="tce__form" onSubmit={onSubmit}>
                        {/* Basic Information */}
                        <div className="tce__section">
                            <h3>Asosiy ma'lumotlar</h3>
                            
                            <div className="tce__field">
                                <label>
                                    <span>Kanal nomi *</span>
                                    <input 
                                        type="text"
                                        value={form.title} 
                                        onChange={handleTitleChange}
                                        placeholder="Kanal nomini kiriting"
                                        required
                                    />
                                </label>
                            </div>

                            <div className="tce__field">
                                <label>
                                    <span>Slug (URL) *</span>
                                    <div className="tce__input-prefix">
                                        <FiHash size={16} />
                                        <input 
                                            type="text"
                                            value={form.slug} 
                                            onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase() }))}
                                            placeholder="kanal-slug"
                                            required
                                        />
                                    </div>
                                    <small>URL da ko'rinadigan nom (faqat kichik harf, raqam va tire)</small>
                                </label>
                            </div>

                            <div className="tce__field">
                                <label>
                                    <span>Ta'rif</span>
                                    <textarea 
                                        rows={4} 
                                        value={form.description} 
                                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Kanal haqida qisqacha ma'lumot"
                                    />
                                </label>
                            </div>

                            <div className="tce__field">
                                <label>
                                    <span>Mutaxassislik</span>
                                    <select 
                                        value={form.badge} 
                                        onChange={(e) => setForm(prev => ({ ...prev, badge: e.target.value }))}
                                        className="tce__select"
                                    >
                                        <option value="">Mutaxassislikni tanlang</option>
                                        {SPECIALIZATIONS.map((spec, index) => (
                                            <option key={index} value={spec}>
                                                {spec}
                                            </option>
                                        ))}
                                    </select>
                                    <small>Sizning asosiy mutaxassisligingizni tanlang</small>
                                </label>
                            </div>
                        </div>

                        {/* Images */}
                        <div className="tce__section">
                            <h3>Rasmlar</h3>
                            
                            <div className="tce__images-grid">
                                {/* Avatar Upload */}
                                <div className="tce__image-upload">
                                    <label>
                                        <span>Avatar (150x150px)</span>
                                        <div className="tce__image-preview tce__image-preview--avatar">
                                            {avatarPreview ? (
                                                <>
                                                    <img src={avatarPreview} alt="Avatar preview" />
                                                    <div className="tce__image-overlay">
                                                        <FiCamera size={24} />
                                                        <span>O'zgartirish</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="tce__image-placeholder">
                                                    <FiUser size={32} />
                                                    <span>Avatar yuklash</span>
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={(e) => handleImageChange('avatar', e.target.files?.[0])}
                                            hidden
                                        />
                                    </label>
                                </div>

                                {/* Banner Upload */}
                                <div className="tce__image-upload">
                                    <label>
                                        <span>Banner (1200x300px)</span>
                                        <div className="tce__image-preview tce__image-preview--banner">
                                            {bannerPreview ? (
                                                <>
                                                    <img src={bannerPreview} alt="Banner preview" />
                                                    <div className="tce__image-overlay">
                                                        <FiCamera size={24} />
                                                        <span>O'zgartirish</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="tce__image-placeholder">
                                                    <FiImage size={32} />
                                                    <span>Banner yuklash</span>
                                                </div>
                                            )}
                                        </div>
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={(e) => handleImageChange('banner', e.target.files?.[0])}
                                            hidden
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="tce__section">
                            <h3>Ijtimoiy tarmoqlar</h3>
                            
                            <div className="tce__fields-grid">
                                <div className="tce__field">
                                    <label>
                                        <span>Website</span>
                                        <input 
                                            type="url"
                                            value={form.website} 
                                            onChange={(e) => setForm(prev => ({ ...prev, website: e.target.value }))}
                                            placeholder="https://example.com"
                                        />
                                    </label>
                                </div>

                                <div className="tce__field">
                                    <label>
                                        <span>Telegram</span>
                                        <input 
                                            type="text"
                                            value={form.telegram} 
                                            onChange={(e) => setForm(prev => ({ ...prev, telegram: e.target.value }))}
                                            placeholder="@username"
                                        />
                                    </label>
                                </div>

                                <div className="tce__field">
                                    <label>
                                        <span>Instagram</span>
                                        <input 
                                            type="text"
                                            value={form.instagram} 
                                            onChange={(e) => setForm(prev => ({ ...prev, instagram: e.target.value }))}
                                            placeholder="@username"
                                        />
                                    </label>
                                </div>

                                <div className="tce__field">
                                    <label>
                                        <span>GitHub</span>
                                        <input 
                                            type="text"
                                            value={form.github} 
                                            onChange={(e) => setForm(prev => ({ ...prev, github: e.target.value }))}
                                            placeholder="username"
                                        />
                                    </label>
                                </div>

                                <div className="tce__field">
                                    <label>
                                        <span>LinkedIn</span>
                                        <input 
                                            type="text"
                                            value={form.linkedin} 
                                            onChange={(e) => setForm(prev => ({ ...prev, linkedin: e.target.value }))}
                                            placeholder="username"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Location & Experience */}
                        <div className="tce__section">
                            <h3>Joylashuv va tajriba</h3>
                            
                            <div className="tce__fields-grid">
                                <div className="tce__field">
                                    <label>
                                        <span>Mamlakat</span>
                                        <input 
                                            type="text"
                                            value={form.location_country} 
                                            onChange={(e) => setForm(prev => ({ ...prev, location_country: e.target.value }))}
                                            placeholder="O'zbekiston"
                                        />
                                    </label>
                                </div>

                                <div className="tce__field">
                                    <label>
                                        <span>Shahar</span>
                                        <input 
                                            type="text"
                                            value={form.location_city} 
                                            onChange={(e) => setForm(prev => ({ ...prev, location_city: e.target.value }))}
                                            placeholder="Toshkent"
                                        />
                                    </label>
                                </div>

                                <div className="tce__field">
                                    <label>
                                        <span>Tajriba (yil)</span>
                                        <input 
                                            type="number"
                                            min="0"
                                            max="50"
                                            value={form.years_experience} 
                                            onChange={(e) => setForm(prev => ({ ...prev, years_experience: e.target.value }))}
                                            placeholder="5"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="tce__error">
                                <FiX size={16} />
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="tce__actions">
                            <button 
                                type="button" 
                                className="btn btn-outline"
                                onClick={() => navigate('/profile/teacher/channels')}
                                disabled={loading}
                            >
                                Bekor qilish
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner-sm"></div>
                                        Saqlanmoqda...
                                    </>
                                ) : (
                                    <>
                                        <FiSave size={16} />
                                        {isEdit ? 'Yangilash' : 'Yaratish'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            {/* Preview Modal */}
            {showPreviewModal && (
                <div className="tce__modal-overlay" onClick={() => setShowPreviewModal(false)}>
                    <div className="tce__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tce__modal-header">
                            <h3>Oldindan ko'rish</h3>
                            <div className="tce__preview-modes">
                                <button 
                                    type="button"
                                    className={`tce__preview-mode ${previewMode === 'desktop' ? 'active' : ''}`}
                                    onClick={() => setPreviewMode('desktop')}
                                >
                                    <FiMonitor size={16} />
                                </button>
                                <button 
                                    type="button"
                                    className={`tce__preview-mode ${previewMode === 'tablet' ? 'active' : ''}`}
                                    onClick={() => setPreviewMode('tablet')}
                                >
                                    <FiTablet size={16} />
                                </button>
                                <button 
                                    type="button"
                                    className={`tce__preview-mode ${previewMode === 'mobile' ? 'active' : ''}`}
                                    onClick={() => setPreviewMode('mobile')}
                                >
                                    <FiSmartphone size={16} />
                                </button>
                            </div>
                            <button 
                                type="button"
                                className="tce__modal-close"
                                onClick={() => setShowPreviewModal(false)}
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="tce__modal-content">
                            <div className={`tce__preview-container tce__preview-container--${previewMode}`}>
                                <div className="tce__preview-card">
                                    {/* Banner */}
                                    <div className="tce__preview-banner">
                                        {bannerPreview ? (
                                            <img src={bannerPreview} alt="Banner preview" />
                                        ) : (
                                            <div className="tce__preview-banner-placeholder">
                                                <FiGlobe size={32} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="tce__preview-content">
                                        {/* Profile */}
                                        <div className="tce__preview-profile">
                                            <div className="tce__preview-avatar">
                                                {avatarPreview ? (
                                                    <img src={avatarPreview} alt="Avatar preview" />
                                                ) : (
                                                    <div className="tce__preview-avatar-placeholder">
                                                        <FiUser size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="tce__preview-info">
                                                <div className="tce__preview-title">
                                                    {form.title || 'Kanal nomi'}
                                                    <FiStar className="verified-icon" size={16} />
                                                </div>
                                                <div className="tce__preview-slug">
                                                    @{form.slug || 'kanal-slug'}
                                                </div>
                                                {form.badge && (
                                                    <div className="tce__preview-badge">
                                                        {form.badge}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {form.description && (
                                            <div className="tce__preview-description">
                                                {form.description}
                                            </div>
                                        )}

                                        {/* Stats */}
                                        <div className="tce__preview-stats">
                                            <div className="stat-item">
                                                <FiUsers size={14} />
                                                <span>0 obunachi</span>
                                            </div>
                                            <div className="stat-item">
                                                <FiCalendar size={14} />
                                                <span>Bugun yaratildi</span>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="tce__preview-actions">
                                            <button className="btn btn-primary">
                                                <FiCheck size={16} />
                                                Tanlash
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChannelEditor
