"use client"

import { useState, useEffect } from "react"
import { FiSave, FiEdit, FiEye, FiEyeOff, FiUpload, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiLock, FiBell, FiShield, FiTrash2 } from "react-icons/fi"

const DirectorSettings = () => {
    const [activeTab, setActiveTab] = useState("profile")
    const [settings, setSettings] = useState({
        profile: {
            firstName: "Director",
            lastName: "User",
            email: "director@example.com",
            phone: "+998901234567",
            bio: "Platforma direktori",
            location: "Toshkent, O'zbekiston",
            website: "",
            avatar: null
        },
        account: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            twoFactorEnabled: false,
            emailNotifications: true,
            smsNotifications: false,
            marketingEmails: false
        },
        privacy: {
            profileVisibility: "public",
            showEmail: false,
            showPhone: false,
            showLocation: true,
            allowMessages: true,
            showOnlineStatus: true
        },
        notifications: {
            newUser: true,
            newTeacher: true,
            newAdmin: true,
            newVideo: true,
            systemUpdates: true,
            marketingEmails: false,
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

    const [showPassword, setShowPassword] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        // Mock data - replace with actual API call
        console.log("Fetching director settings...")
    }

    const handleInputChange = (section, field, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }))
    }

    const handleSave = async (section) => {
        console.log(`Saving ${section} settings:`, settings[section])
        // API call to save settings
        alert(`${section} sozlamalari saqlandi!`)
        setIsEditing(false)
    }

    const handleDeleteAccount = () => {
        if (window.confirm("Hisobingizni o'chirishni xohlaysizmi? Bu amal qaytarib bo'lmaydi!")) {
            console.log("Deleting director account...")
            alert("Hisob o'chirish so'rovi yuborildi!")
        }
    }

    const tabs = [
        { id: "profile", label: "Profil", icon: FiUser },
        { id: "account", label: "Hisob", icon: FiLock },
        { id: "privacy", label: "Maxfiylik", icon: FiShield },
        { id: "notifications", label: "Bildirishnomalar", icon: FiBell },
        { id: "preferences", label: "Sozlamalar", icon: FiEdit }
    ]

    return (
        <div className="director-settings">
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
                                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
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
                    {/* Profile Settings */}
                    {activeTab === "profile" && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Profil ma'lumotlari</h2>
                                <div className="section-actions">
                                    {isEditing ? (
                                        <>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Bekor qilish
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleSave('profile')}
                                            >
                                                <FiSave /> Saqlash
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <FiEdit /> Tahrirlash
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="profile-section">
                                <div className="avatar-section">
                                    <div className="avatar">
                                        {settings.profile.avatar ? (
                                            <img src={settings.profile.avatar} alt="Avatar" />
                                        ) : (
                                            <FiUser size={48} />
                                        )}
                                    </div>
                                    {isEditing && (
                                        <div className="avatar-actions">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleInputChange('profile', 'avatar', e.target.files[0])}
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
                                            onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Familiya *</label>
                                        <input
                                            type="text"
                                            value={settings.profile.lastName}
                                            onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            value={settings.profile.email}
                                            onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Telefon</label>
                                        <input
                                            type="tel"
                                            value={settings.profile.phone}
                                            onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Joylashuv</label>
                                        <input
                                            type="text"
                                            value={settings.profile.location}
                                            onChange={(e) => handleInputChange('profile', 'location', e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Veb-sayt</label>
                                        <input
                                            type="url"
                                            value={settings.profile.website}
                                            onChange={(e) => handleInputChange('profile', 'website', e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Bio</label>
                                        <textarea
                                            value={settings.profile.bio}
                                            onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                                            className="form-textarea"
                                            rows="4"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Account Settings */}
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
                                                onChange={(e) => handleInputChange('account', 'currentPassword', e.target.value)}
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
                                            onChange={(e) => handleInputChange('account', 'newPassword', e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Yangi parolni tasdiqlang</label>
                                        <input
                                            type="password"
                                            value={settings.account.confirmPassword}
                                            onChange={(e) => handleInputChange('account', 'confirmPassword', e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleSave('account')}
                                    >
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
                                                onChange={(e) => handleInputChange('account', 'twoFactorEnabled', e.target.checked)}
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
                                                onChange={(e) => handleInputChange('account', 'emailNotifications', e.target.checked)}
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
                                                onChange={(e) => handleInputChange('account', 'smsNotifications', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Privacy Settings */}
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
                                        onChange={(e) => handleInputChange('privacy', 'profileVisibility', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="public">Ommaviy</option>
                                        <option value="private">Shaxsiy</option>
                                        <option value="friends">Do'stlar</option>
                                    </select>
                                </div>

                                <div className="privacy-item">
                                    <div className="privacy-info">
                                        <h4>Email ko'rsatish</h4>
                                        <p>Boshqa foydalanuvchilar emailingizni ko'rishi mumkin</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.privacy.showEmail}
                                            onChange={(e) => handleInputChange('privacy', 'showEmail', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="privacy-item">
                                    <div className="privacy-info">
                                        <h4>Telefon ko'rsatish</h4>
                                        <p>Boshqa foydalanuvchilar telefon raqamingizni ko'rishi mumkin</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.privacy.showPhone}
                                            onChange={(e) => handleInputChange('privacy', 'showPhone', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="privacy-item">
                                    <div className="privacy-info">
                                        <h4>Joylashuv ko'rsatish</h4>
                                        <p>Boshqa foydalanuvchilar joylashuvingizni ko'rishi mumkin</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.privacy.showLocation}
                                            onChange={(e) => handleInputChange('privacy', 'showLocation', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="privacy-item">
                                    <div className="privacy-info">
                                        <h4>Xabarlarga ruxsat</h4>
                                        <p>Boshqa foydalanuvchilar sizga xabar yuborishi mumkin</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.privacy.allowMessages}
                                            onChange={(e) => handleInputChange('privacy', 'allowMessages', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={() => handleSave('privacy')}
                            >
                                <FiShield /> Maxfiylik sozlamalarini saqlash
                            </button>
                        </div>
                    )}

                    {/* Notifications Settings */}
                    {activeTab === "notifications" && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Bildirishnoma sozlamalari</h2>
                            </div>

                            <div className="notifications-section">
                                <div className="notification-category">
                                    <h3>Foydalanuvchilar</h3>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>Yangi foydalanuvchi</h4>
                                            <p>Platformaga yangi foydalanuvchi ro'yxatdan o'tganda</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.newUser}
                                                onChange={(e) => handleInputChange('notifications', 'newUser', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="notification-category">
                                    <h3>O'qituvchilar</h3>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>Yangi o'qituvchi</h4>
                                            <p>Yangi o'qituvchi qo'shilganda</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.newTeacher}
                                                onChange={(e) => handleInputChange('notifications', 'newTeacher', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="notification-category">
                                    <h3>Administratorlar</h3>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>Yangi administrator</h4>
                                            <p>Yangi administrator qo'shilganda</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.newAdmin}
                                                onChange={(e) => handleInputChange('notifications', 'newAdmin', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="notification-category">
                                    <h3>Kontent</h3>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>Yangi video</h4>
                                            <p>Yangi video darslik qo'shilganda</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.newVideo}
                                                onChange={(e) => handleInputChange('notifications', 'newVideo', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="notification-category">
                                    <h3>Tizim</h3>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>Tizim yangilanishlari</h4>
                                            <p>Platforma yangilanishlari haqida</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.systemUpdates}
                                                onChange={(e) => handleInputChange('notifications', 'systemUpdates', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>Haftalik hisobot</h4>
                                            <p>Haftalik faoliyat hisoboti</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.weeklyReports}
                                                onChange={(e) => handleInputChange('notifications', 'weeklyReports', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={() => handleSave('notifications')}
                            >
                                <FiBell /> Bildirishnoma sozlamalarini saqlash
                            </button>
                        </div>
                    )}

                    {/* Preferences Settings */}
                    {activeTab === "preferences" && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>Umumiy sozlamalar</h2>
                            </div>

                            <div className="preferences-section">
                                <div className="preference-item">
                                    <div className="preference-info">
                                        <h4>Til</h4>
                                        <p>Platforma tilini tanlang</p>
                                    </div>
                                    <select
                                        value={settings.preferences.language}
                                        onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="uz">O'zbekcha</option>
                                        <option value="en">English</option>
                                        <option value="ru">Русский</option>
                                    </select>
                                </div>

                                <div className="preference-item">
                                    <div className="preference-info">
                                        <h4>Vaqt zonasi</h4>
                                        <p>Joylashuvingizga mos vaqt zonasi</p>
                                    </div>
                                    <select
                                        value={settings.preferences.timezone}
                                        onChange={(e) => handleInputChange('preferences', 'timezone', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="Asia/Tashkent">Toshkent (UTC+5)</option>
                                        <option value="UTC">UTC (UTC+0)</option>
                                        <option value="America/New_York">New York (UTC-5)</option>
                                    </select>
                                </div>

                                <div className="preference-item">
                                    <div className="preference-info">
                                        <h4>Tema</h4>
                                        <p>Platforma ko'rinishini tanlang</p>
                                    </div>
                                    <select
                                        value={settings.preferences.theme}
                                        onChange={(e) => handleInputChange('preferences', 'theme', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="light">Yorug'</option>
                                        <option value="dark">Qorong'u</option>
                                        <option value="auto">Avtomatik</option>
                                    </select>
                                </div>

                                <div className="preference-item">
                                    <div className="preference-info">
                                        <h4>Valyuta</h4>
                                        <p>Narxlarni ko'rsatish uchun valyuta</p>
                                    </div>
                                    <select
                                        value={settings.preferences.currency}
                                        onChange={(e) => handleInputChange('preferences', 'currency', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="UZS">UZS (so'm)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>

                                <div className="preference-item">
                                    <div className="preference-info">
                                        <h4>Sana formati</h4>
                                        <p>Sanalarni ko'rsatish formati</p>
                                    </div>
                                    <select
                                        value={settings.preferences.dateFormat}
                                        onChange={(e) => handleInputChange('preferences', 'dateFormat', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={() => handleSave('preferences')}
                            >
                                <FiEdit /> Sozlamalarni saqlash
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="danger-zone">
                <h3>Xavfli zona</h3>
                <div className="danger-item">
                    <div className="danger-info">
                        <h4>Hisobni o'chirish</h4>
                        <p>Hisobingizni butunlay o'chirish. Bu amal qaytarib bo'lmaydi!</p>
                    </div>
                    <button
                        className="btn btn-danger"
                        onClick={handleDeleteAccount}
                    >
                        <FiTrash2 /> Hisobni o'chirish
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DirectorSettings


