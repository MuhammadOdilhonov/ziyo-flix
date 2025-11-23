"use client"

import { useState, useEffect } from "react"
import { FiSave, FiEdit, FiEye, FiEyeOff, FiUpload, FiUser, FiMail, FiPhone, FiMapPin, FiGlobe, FiLock, FiBell, FiShield, FiTrash2, FiHeart, FiBookmark } from "react-icons/fi"

const UserSettings = () => {
    const [activeTab, setActiveTab] = useState("profile")
    const [settings, setSettings] = useState({
        profile: {
            firstName: "Ahmadjon",
            lastName: "Karimov",
            email: "ahmadjon@example.com",
            phone: "+998901234567",
            bio: "Web dasturlashni o'rganuvchi talaba",
            location: "Toshkent, O'zbekiston",
            website: "",
            avatar: null,
            dateOfBirth: "1998-05-15",
            gender: "male"
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
            showOnlineStatus: true,
            showLearningProgress: true
        },
        notifications: {
            newCourse: true,
            courseUpdates: true,
            assignmentDeadline: true,
            certificateEarned: true,
            systemUpdates: true,
            marketingEmails: false,
            weeklyProgress: true
        },
        preferences: {
            language: "uz",
            timezone: "Asia/Tashkent",
            theme: "light",
            currency: "USD",
            dateFormat: "DD/MM/YYYY",
            autoPlay: false,
            videoQuality: "auto"
        },
        learning: {
            learningGoals: "web_development",
            experienceLevel: "beginner",
            preferredSchedule: "evening",
            studyTime: "2-3 hours per week",
            interests: ["JavaScript", "React", "Node.js", "UI/UX"]
        }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        // Mock data - replace with actual API call
        console.log("Fetching user settings...")
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
            console.log("Deleting user account...")
            alert("Hisob o'chirish so'rovi yuborildi!")
        }
    }

    const tabs = [
        { id: "profile", label: "Profil", icon: FiUser },
        { id: "account", label: "Hisob", icon: FiLock },
        { id: "privacy", label: "Maxfiylik", icon: FiShield },
        { id: "notifications", label: "Bildirishnomalar", icon: FiBell },
        { id: "preferences", label: "Sozlamalar", icon: FiEdit },
        { id: "learning", label: "O'rganish", icon: FiBookmark }
    ]

    return (
        <div className="user-settings" data-theme={localStorage.getItem("theme") || "light"}>
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
                                        <label>Tug'ilgan sana</label>
                                        <input
                                            type="date"
                                            value={settings.profile.dateOfBirth}
                                            onChange={(e) => handleInputChange('profile', 'dateOfBirth', e.target.value)}
                                            className="form-input"
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Jins</label>
                                        <select
                                            value={settings.profile.gender}
                                            onChange={(e) => handleInputChange('profile', 'gender', e.target.value)}
                                            className="form-select"
                                            disabled={!isEditing}
                                        >
                                            <option value="male">Erkak</option>
                                            <option value="female">Ayol</option>
                                            <option value="other">Boshqa</option>
                                        </select>
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
                                        <h4>O'rganish jarayonini ko'rsatish</h4>
                                        <p>Boshqa foydalanuvchilar sizning o'rganish jarayoningizni ko'rishi mumkin</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.privacy.showLearningProgress}
                                            onChange={(e) => handleInputChange('privacy', 'showLearningProgress', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
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
                                    <h3>Kurslar</h3>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>Yangi kurs</h4>
                                            <p>Qiziqish sohalaringizda yangi kurs paydo bo'lganda</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.newCourse}
                                                onChange={(e) => handleInputChange('notifications', 'newCourse', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>Kurs yangilanishlari</h4>
                                            <p>O'rganayotgan kurslaringizda yangi material qo'shilganda</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.courseUpdates}
                                                onChange={(e) => handleInputChange('notifications', 'courseUpdates', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="notification-category">
                                    <h3>Vazifalar</h3>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>Vazifa muddati</h4>
                                            <p>Vazifa muddati yaqinlashganda eslatma</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.assignmentDeadline}
                                                onChange={(e) => handleInputChange('notifications', 'assignmentDeadline', e.target.checked)}
                                            />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div className="notification-category">
                                    <h3>Yutuqlar</h3>
                                    <div className="notification-item">
                                        <div className="notification-info">
                                            <h4>Sertifikat olganda</h4>
                                            <p>Kursni tugatib sertifikat olganda</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.certificateEarned}
                                                onChange={(e) => handleInputChange('notifications', 'certificateEarned', e.target.checked)}
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
                                            <h4>Haftalik progress</h4>
                                            <p>Haftalik o'rganish hisoboti</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.notifications.weeklyProgress}
                                                onChange={(e) => handleInputChange('notifications', 'weeklyProgress', e.target.checked)}
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
                                        <h4>Video avtomatik o'ynatish</h4>
                                        <p>Videolarni avtomatik o'ynatish</p>
                                    </div>
                                    <label className="toggle-switch">
                                        <input
                                            type="checkbox"
                                            checked={settings.preferences.autoPlay}
                                            onChange={(e) => handleInputChange('preferences', 'autoPlay', e.target.checked)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </div>

                                <div className="preference-item">
                                    <div className="preference-info">
                                        <h4>Video sifati</h4>
                                        <p>Videolarni qanday sifatta ko'rish</p>
                                    </div>
                                    <select
                                        value={settings.preferences.videoQuality}
                                        onChange={(e) => handleInputChange('preferences', 'videoQuality', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="auto">Avtomatik</option>
                                        <option value="720p">720p</option>
                                        <option value="1080p">1080p</option>
                                        <option value="480p">480p</option>
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

                    {/* Learning Settings */}
                    {activeTab === "learning" && (
                        <div className="settings-section">
                            <div className="section-header">
                                <h2>O'rganish sozlamalari</h2>
                            </div>

                            <div className="learning-section">
                                <div className="learning-item">
                                    <div className="learning-info">
                                        <h4>O'rganish maqsadi</h4>
                                        <p>Qaysi sohada o'rganishni xohlaysiz</p>
                                    </div>
                                    <select
                                        value={settings.learning.learningGoals}
                                        onChange={(e) => handleInputChange('learning', 'learningGoals', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="web_development">Web dasturlash</option>
                                        <option value="mobile_development">Mobil dasturlash</option>
                                        <option value="data_science">Data Science</option>
                                        <option value="ui_ux">UI/UX Dizayn</option>
                                        <option value="digital_marketing">Digital Marketing</option>
                                        <option value="other">Boshqa</option>
                                    </select>
                                </div>

                                <div className="learning-item">
                                    <div className="learning-info">
                                        <h4>Tajriba darajasi</h4>
                                        <p>Hozirgi bilim darajangiz</p>
                                    </div>
                                    <select
                                        value={settings.learning.experienceLevel}
                                        onChange={(e) => handleInputChange('learning', 'experienceLevel', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="beginner">Boshlang'ich</option>
                                        <option value="intermediate">O'rta</option>
                                        <option value="advanced">Yuqori</option>
                                        <option value="expert">Ekspert</option>
                                    </select>
                                </div>

                                <div className="learning-item">
                                    <div className="learning-info">
                                        <h4>Qulay vaqt</h4>
                                        <p>Qachon o'rganishni afzal ko'rasiz</p>
                                    </div>
                                    <select
                                        value={settings.learning.preferredSchedule}
                                        onChange={(e) => handleInputChange('learning', 'preferredSchedule', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="morning">Ertalab (6:00-12:00)</option>
                                        <option value="afternoon">Tushdan keyin (12:00-18:00)</option>
                                        <option value="evening">Kechqurun (18:00-24:00)</option>
                                        <option value="night">Tungi (24:00-6:00)</option>
                                        <option value="flexible">Moslashuvchan</option>
                                    </select>
                                </div>

                                <div className="learning-item">
                                    <div className="learning-info">
                                        <h4>O'rganish vaqti</h4>
                                        <p>Haftasiga qancha vaqt ajratasiz</p>
                                    </div>
                                    <select
                                        value={settings.learning.studyTime}
                                        onChange={(e) => handleInputChange('learning', 'studyTime', e.target.value)}
                                        className="form-select"
                                    >
                                        <option value="1-2 hours per week">1-2 soat/hafta</option>
                                        <option value="2-3 hours per week">2-3 soat/hafta</option>
                                        <option value="3-5 hours per week">3-5 soat/hafta</option>
                                        <option value="5-10 hours per week">5-10 soat/hafta</option>
                                        <option value="10+ hours per week">10+ soat/hafta</option>
                                    </select>
                                </div>

                                <div className="learning-item full-width">
                                    <div className="learning-info">
                                        <h4>Qiziqish sohalari</h4>
                                        <p>Qaysi texnologiyalar sizni qiziqtiradi</p>
                                    </div>
                                    <div className="interests-grid">
                                        {["JavaScript", "Python", "React", "Vue.js", "Node.js", "PHP", "Java", "C#", "Swift", "Kotlin", "Figma", "Adobe XD", "Photoshop", "Illustrator", "SEO", "Google Ads", "Facebook Ads", "Analytics"].map((interest) => (
                                            <label key={interest} className="interest-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={settings.learning.interests.includes(interest)}
                                                    onChange={(e) => {
                                                        const newInterests = e.target.checked
                                                            ? [...settings.learning.interests, interest]
                                                            : settings.learning.interests.filter(i => i !== interest)
                                                        handleInputChange('learning', 'interests', newInterests)
                                                    }}
                                                />
                                                <span>{interest}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary"
                                onClick={() => handleSave('learning')}
                            >
                                <FiBookmark /> O'rganish sozlamalarini saqlash
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

export default UserSettings
