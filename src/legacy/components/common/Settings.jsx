import { useEffect, useState } from "react"
import {
    FiSave,
    FiEdit,
    FiEye,
    FiEyeOff,
    FiUpload,
    FiUser,
    FiLock,
    FiBell,
    FiShield,
    FiTrash2,
    FiMonitor,
    FiSmartphone,
    FiTablet,
    FiLogOut,
    FiMapPin
} from "react-icons/fi"
import { useLocation } from "react-router-dom"

const Settings = () => {
    const location = useLocation()
    const [activeTab, setActiveTab] = useState("profile")
    const [showPassword, setShowPassword] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const [settings, setSettings] = useState({
        profile: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            bio: "",
            location: "",
            website: "",
            avatar: null
        },
        account: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            twoFactorEnabled: false,
            emailNotifications: true,
            smsNotifications: false
        },
        privacy: {
            profileVisibility: "public",
            showEmail: false,
            showPhone: false,
            showLocation: true,
            allowMessages: true
        },
        notifications: {
            newContent: true,
            assignments: true,
            systemUpdates: true,
            weeklyReports: true
        },
        preferences: {
            language: "uz",
            timezone: "Asia/Tashkent",
            theme: "light",
            currency: "USD",
            dateFormat: "DD/MM/YYYY"
        }
    })

    useEffect(() => {
        console.log("Settings page:", location.pathname)
    }, [location.pathname])

    const handleInputChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }))
    }

    const handleSave = async (section) => {
        console.log(`Saving ${section} settings:`, settings[section])
        alert(`${section} sozlamalari saqlandi!`)
        setIsEditing(false)
    }

    const handleDeleteAccount = () => {
        if (window.confirm("Hisobingizni o'chirishni xohlaysizmi? Bu amal qaytarib bo'lmaydi!")) {
            alert("Hisob o'chirish so'rovi yuborildi!")
        }
    }

    const tabs = [
        { id: "profile", label: "Profil", icon: FiUser },
        { id: "account", label: "Hisob", icon: FiLock },
        { id: "privacy", label: "Maxfiylik", icon: FiShield },
        { id: "notifications", label: "Bildirishnomalar", icon: FiBell },
        { id: "preferences", label: "Sozlamalar", icon: FiEdit },
        { id: "devices", label: "Qurilmalar", icon: FiMonitor } // YANGI TAB
    ]

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Sozlamalar</h1>
                <p>Shaxsiy ma'lumotlaringiz va platforma sozlamalarini boshqaring</p>
            </div>

            <div className="settings-container">
                {/* Sidebar */}
                <div className="settings-sidebar">
                    <nav className="settings-nav">
                        {tabs.map((tab) => {
                            const IconComponent = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    <IconComponent />
                                    <span>{tab.label}</span>
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Content */}
                <div className="settings-content">
                    {/* Profil */}
                    {activeTab === "profile" && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Profil ma'lumotlari</h2>
                                <div className="section-actions">
                                    {isEditing ? (
                                        <>
                                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                                Bekor qilish
                                            </button>
                                            <button className="btn btn-primary" onClick={() => handleSave("profile")}>
                                                <FiSave /> Saqlash
                                            </button>
                                        </>
                                    ) : (
                                        <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                                            <FiEdit /> Tahrirlash
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="profile-section">
                                <div className="avatar-section">
                                    <div className="avatar">
                                        {settings.profile.avatar ? (
                                            <img
                                                src={
                                                    typeof settings.profile.avatar === "string"
                                                        ? settings.profile.avatar
                                                        : URL.createObjectURL(settings.profile.avatar)
                                                }
                                                alt="Avatar"
                                            />
                                        ) : (
                                            <FiUser size={48} />
                                        )}
                                    </div>
                                    {isEditing && (
                                        <div className="avatar-actions">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleInputChange("profile", "avatar", e.target.files?.[0] || null)
                                                }
                                                className="avatar-upload"
                                                id="avatar-upload"
                                            />
                                            <label htmlFor="avatar-upload" className="btn btn-outline">
                                                <FiUpload /> Rasm yuklash
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Ism *</label>
                                        <input
                                            type="text"
                                            value={settings.profile.firstName}
                                            onChange={(e) => handleInputChange("profile", "firstName", e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Familiya *</label>
                                        <input
                                            type="text"
                                            value={settings.profile.lastName}
                                            onChange={(e) => handleInputChange("profile", "lastName", e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Foydalanuvchi nomi (Slug)</label>
                                        <input
                                            type="text"
                                            value={settings.profile.slug}
                                            onChange={(e) => handleInputChange("profile", "slug", e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Tug'ilgan sana</label>
                                        <input
                                            type="date"
                                            value={settings.profile.birthDate}
                                            onChange={(e) => handleInputChange("profile", "birthDate", e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            value={settings.profile.email}
                                            onChange={(e) => handleInputChange("profile", "email", e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Telefon</label>
                                        <input
                                            type="tel"
                                            value={settings.profile.phone}
                                            onChange={(e) => handleInputChange("profile", "phone", e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Joylashuv</label>
                                        <input
                                            type="text"
                                            value={settings.profile.location}
                                            onChange={(e) => handleInputChange("profile", "location", e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Bio</label>
                                        <textarea
                                            value={settings.profile.bio}
                                            onChange={(e) => handleInputChange("profile", "bio", e.target.value)}
                                            className="form-textarea"
                                            rows="4"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Hisob */}
                    {activeTab === "account" && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Hisob sozlamalari</h2>
                            </div>
                            <div className="account-section">
                                <div className="password-section">
                                    <h3>Parolni o'zgartirish</h3>
                                    <div className="form-group">
                                        <label>Joriy parol</label>
                                        <div className="password-input">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={settings.account.currentPassword}
                                                onChange={(e) => handleInputChange("account", "currentPassword", e.target.value)}
                                                className="form-input"
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Yangi parol</label>
                                        <input
                                            type="password"
                                            value={settings.account.newPassword}
                                            onChange={(e) => handleInputChange("account", "newPassword", e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Yangi parolni tasdiqlang</label>
                                        <input
                                            type="password"
                                            value={settings.account.confirmPassword}
                                            onChange={(e) => handleInputChange("account", "confirmPassword", e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <button className="btn btn-primary" onClick={() => handleSave("account")}>
                                        <FiLock /> Parolni o'zgartirish
                                    </button>
                                </div>

                                <div className="security-section">
                                    <h3>Xavfsizlik</h3>
                                    <div className="security-item">
                                        <div className="security-info">
                                            <h4>Ikki bosqichli autentifikatsiya</h4>
                                            <p>Hisobingizni qo'shimcha himoya qilish</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.account.twoFactorEnabled}
                                                onChange={(e) => handleInputChange("account", "twoFactorEnabled", e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="notifications-section">
                                    <h3>Bildirishnomalar</h3>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>Email bildirishnomalar</h4>
                                            <p>Muhim voqealar haqida email orqali xabar oling</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.account.emailNotifications}
                                                onChange={(e) => handleInputChange("account", "emailNotifications", e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>SMS bildirishnomalar</h4>
                                            <p>Telefon raqamingizga SMS yuborish</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.account.smsNotifications}
                                                onChange={(e) => handleInputChange("account", "smsNotifications", e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Maxfiylik */}
                    {activeTab === "privacy" && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Maxfiylik sozlamalari</h2>
                            </div>
                            <div className="privacy-section">
                                <div className="privacy-item">
                                    <div className="privacy-info">
                                        <h4>Profil ko'rinishi</h4>
                                        <p>Kim sizning profil ma'lumotlaringizni ko'rishi mumkin</p>
                                    </div>
                                    <select
                                        value={settings.privacy.profileVisibility}
                                        onChange={(e) => handleInputChange("privacy", "profileVisibility", e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="public">Ommaviy</option>
                                        <option value="private">Shaxsiy</option>
                                        <option value="friends">Do'stlar</option>
                                    </select>
                                </div>
                                {["showEmail", "showPhone", "showLocation", "allowMessages"].map((key) => (
                                    <div className="privacy-item" key={key}>
                                        <div className="privacy-info">
                                            <h4>
                                                {key === "showEmail" && "Email ko'rsatish"}
                                                {key === "showPhone" && "Telefon ko'rsatish"}
                                                {key === "showLocation" && "Joylashuv ko'rsatish"}
                                                {key === "allowMessages" && "Xabarlarga ruxsat"}
                                            </h4>
                                            <p>
                                                {key === "showEmail" && "Boshqa foydalanuvchilar emailingizni ko'rishi mumkin"}
                                                {key === "showPhone" && "Boshqa foydalanuvchilar telefon raqamingizni ko'rishi mumkin"}
                                                {key === "showLocation" && "Boshqa foydalanuvchilar joylashuvingizni ko'rishi mumkin"}
                                                {key === "allowMessages" && "Boshqa foydalanuvchilar sizga xabar yuborishi mumkin"}
                                            </p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.privacy[key]}
                                                onChange={(e) => handleInputChange("privacy", key, e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-primary" onClick={() => handleSave("privacy")}>
                                <FiShield /> Maxfiylik sozlamalarini saqlash
                            </button>
                        </div>
                    )}

                    {/* Bildirishnomalar */}
                    {activeTab === "notifications" && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Bildirishnoma sozlamalari</h2>
                            </div>
                            <div className="notifications-section">
                                {Object.keys(settings.notifications).map((key) => (
                                    <div className="notification-item" key={key}>
                                        <div className="notification-info">
                                            <h4>
                                                {key === "newContent" && "Yangi kontent"}
                                                {key === "assignments" && "Vazifalar"}
                                                {key === "systemUpdates" && "Tizim yangilanishlari"}
                                                {key === "weeklyReports" && "Haftalik hisobot"}
                                            </h4>
                                            <p>
                                                {key === "newContent" && "Yangi darslar, videolar yoki yangilanishlar"}
                                                {key === "assignments" && "Vazifalar bilan bog'liq bildirishnomalar"}
                                                {key === "systemUpdates" && "Platforma yangilanishlari haqida"}
                                                {key === "weeklyReports" && "Haftalik faoliyat hisoboti"}
                                            </p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications[key]}
                                                onChange={(e) => handleInputChange("notifications", key, e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <button className="btn btn-primary" onClick={() => handleSave("notifications")}>
                                <FiBell /> Bildirishnoma sozlamalarini saqlash
                            </button>
                        </div>
                    )}

                    {/* Sozlamalar */}
                    {activeTab === "preferences" && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Umumiy sozlamalar</h2>
                            </div>
                            <div className="preferences-section">
                                {/* Til, Vaqt zonasi, Tema, Valyuta, Sana formati */}
                                {/* Oldingi kodni saqlab qoldirdim, qisqartirdim */}
                                <div className="preference-item">
                                    <div className="preference-info">
                                        <h4>Til</h4>
                                        <p>Platforma tilini tanlang</p>
                                    </div>
                                    <select
                                        value={settings.preferences.language}
                                        onChange={(e) => handleInputChange("preferences", "language", e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="uz">O'zbekcha</option>
                                        <option value="en">English</option>
                                        <option value="ru">Русский</option>
                                    </select>
                                </div>
                                {/* Qolgan preferencelar ham xuddi shu tarzda... */}
                            </div>
                            <button className="btn btn-primary" onClick={() => handleSave("preferences")}>
                                <FiEdit /> Sozlamalarni saqlash
                            </button>
                        </div>
                    )}

                    {/* YANGI BO'LIM: Qurilmalar */}
                    {activeTab === "devices" && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Ulangan qurilmalar</h2>
                                <p>Hozirgi va oldin kirgan qurilmalaringiz ro'yxati</p>
                            </div>

                            <div className="devices-list">
                                {/* Hozirgi sessiya */}
                                <div className="device-item current">
                                    <div className="device-icon">
                                        <FiMonitor size={32} />
                                    </div>
                                    <div className="device-info">
                                        <h4>Hozirgi qurilma • Faol</h4>
                                        <p>Google Chrome • Windows 11 • Toshkent, O'zbekiston <FiMapPin /></p>
                                        <small>Oxirgi faollik: Hozir</small>
                                    </div>
                                    <div className="device-status">
                                        <span className="status-active">Faol</span>
                                    </div>
                                </div>

                                <div className="device-item">
                                    <div className="device-icon">
                                        <FiSmartphone size={28} />
                                    </div>
                                    <div className="device-info">
                                        <h4>Samsung Galaxy S23</h4>
                                        <p>Samsung Internet • Android 14 • Toshkent</p>
                                        <small>Oxirgi faollik: 3 soat oldin</small>
                                    </div>
                                    <button className="btn btn-outline btn-sm">
                                        <FiLogOut /> Chiqish
                                    </button>
                                </div>

                                <div className="device-item">
                                    <div className="device-icon">
                                        <FiMonitor size={32} />
                                    </div>
                                    <div className="device-info">
                                        <h4>MacBook Pro</h4>
                                        <p>Safari • macOS 15 • Samarqand</p>
                                        <small>Oxirgi faollik: 1 kun oldin</small>
                                    </div>
                                    <button className="btn btn-outline btn-sm">
                                        <FiLogOut /> Chiqish
                                    </button>
                                </div>

                                <div className="device-item">
                                    <div className="device-icon">
                                        <FiTablet size={30} />
                                    </div>
                                    <div className="device-info">
                                        <h4>iPad Pro 11"</h4>
                                        <p>Chrome • iPadOS 18 • Andijon</p>
                                        <small>Oxirgi faollik: 4 kun oldin</small>
                                    </div>
                                    <button className="btn btn-outline btn-sm">
                                        <FiLogOut /> Chiqish
                                    </button>
                                </div>
                            </div>

                            <div className="devices-actions">
                                <button className="btn btn-danger">
                                    <FiLogOut /> Barcha boshqa qurilmalardan chiqish
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Xavfli zona */}
            <div className="danger-zone">
                <h3>Xavfli zona</h3>
                <div className="danger-item">
                    <div className="danger-info">
                        <h4>Hisobni o'chirish</h4>
                        <p>Hisobingizni butunlay o'chirish. Bu amal qaytarib bo'lmaydi!</p>
                    </div>
                    <button className="btn btn-danger" onClick={handleDeleteAccount}>
                        <FiTrash2 /> Hisobni o'chirish
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Settings