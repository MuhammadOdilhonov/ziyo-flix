"use client"

import { useState, useEffect } from "react"
import { FiEdit, FiSave, FiUpload, FiLink, FiMapPin, FiGlobe, FiClock, FiAward, FiUser, FiMail, FiPhone, FiInstagram, FiTwitter, FiYoutube, FiLinkedin, FiGithub } from "react-icons/fi"

const TeacherChannel = () => {
    const [channelData, setChannelData] = useState({
        channelName: "",
        displayName: "",
        firstName: "",
        lastName: "",
        about: "",
        bio: "",
        location: "",
        website: "",
        responseTime: "",
        achievements: [],
        certificates: [],
        socialLinks: {
            instagram: "",
            twitter: "",
            youtube: "",
            linkedin: "",
            github: ""
        },
        avatar: null,
        coverImage: null
    })

    const [isEditing, setIsEditing] = useState(false)
    const [showAchievementModal, setShowAchievementModal] = useState(false)
    const [showCertificateModal, setShowCertificateModal] = useState(false)
    const [newAchievement, setNewAchievement] = useState({ title: "", description: "", date: "", image: null })
    const [newCertificate, setNewCertificate] = useState({ title: "", issuer: "", date: "", image: null })

    useEffect(() => {
        fetchChannelData()
    }, [])

    const fetchChannelData = async () => {
        // Mock data - replace with actual API call
        const mockData = {
            channelName: "tech_teacher_uz",
            displayName: "Ahmadjon Karimov",
            firstName: "Ahmadjon",
            lastName: "Karimov",
            about: "Professional web developer va ta'lim sohasida 5 yillik tajribaga ega",
            bio: "Men JavaScript, React, Node.js va boshqa zamonaviy texnologiyalar bo'yicha o'quv kurslarini o'tkazaman. Mening maqsadim - o'quvchilarimga amaliy bilim berish va ularni professional darajaga yetkazish.",
            location: "Toshkent, O'zbekiston",
            website: "https://ahmadjon-dev.uz",
            responseTime: "2-4 soat",
            achievements: [
                {
                    id: 1,
                    title: "Eng yaxshi o'qituvchi 2023",
                    description: "ZiyoFlex platformasida eng ko'p o'quvchiga ega o'qituvchi",
                    date: "2023-12-15",
                    image: "/achievement1.jpg"
                },
                {
                    id: 2,
                    title: "1000+ o'quvchi",
                    description: "Platformada 1000 dan ortiq o'quvchini o'qitgan",
                    date: "2023-11-20",
                    image: "/achievement2.jpg"
                }
            ],
            certificates: [
                {
                    id: 1,
                    title: "React Developer Certificate",
                    issuer: "Meta",
                    date: "2023-10-15",
                    image: "/cert1.jpg"
                },
                {
                    id: 2,
                    title: "JavaScript Advanced",
                    issuer: "Mozilla Developer Network",
                    date: "2023-09-20",
                    image: "/cert2.jpg"
                }
            ],
            socialLinks: {
                instagram: "https://instagram.com/ahmadjon_dev",
                twitter: "https://twitter.com/ahmadjon_dev",
                youtube: "https://youtube.com/@ahmadjon_dev",
                linkedin: "https://linkedin.com/in/ahmadjon-karimov",
                github: "https://github.com/ahmadjon-dev"
            }
        }
        setChannelData(mockData)
    }

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.')
            setChannelData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }))
        } else {
            setChannelData(prev => ({
                ...prev,
                [field]: value
            }))
        }
    }

    const handleImageUpload = (field, file) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setChannelData(prev => ({
                ...prev,
                [field]: imageUrl
            }))
        }
    }

    const handleSave = async () => {
        console.log("Saving channel data:", channelData)
        // API call to save channel data
        setIsEditing(false)
        alert("Kanal ma'lumotlari saqlandi!")
    }

    const handleAddAchievement = () => {
        const achievement = {
            id: Date.now(),
            ...newAchievement,
            image: newAchievement.image ? URL.createObjectURL(newAchievement.image) : null
        }
        setChannelData(prev => ({
            ...prev,
            achievements: [...prev.achievements, achievement]
        }))
        setNewAchievement({ title: "", description: "", date: "", image: null })
        setShowAchievementModal(false)
    }

    const handleAddCertificate = () => {
        const certificate = {
            id: Date.now(),
            ...newCertificate,
            image: newCertificate.image ? URL.createObjectURL(newCertificate.image) : null
        }
        setChannelData(prev => ({
            ...prev,
            certificates: [...prev.certificates, certificate]
        }))
        setNewCertificate({ title: "", issuer: "", date: "", image: null })
        setShowCertificateModal(false)
    }

    const handleRemoveAchievement = (id) => {
        setChannelData(prev => ({
            ...prev,
            achievements: prev.achievements.filter(ach => ach.id !== id)
        }))
    }

    const handleRemoveCertificate = (id) => {
        setChannelData(prev => ({
            ...prev,
            certificates: prev.certificates.filter(cert => cert.id !== id)
        }))
    }

    return (
        <div className="teacher-channel">
            <div className="channel-header">
                <div className="channel-info">
                    <h1>Kanal sozlamalari</h1>
                    <p>Kanalingizni sozlang va ma'lumotlaringizni to'ldiring</p>
                </div>
                <div className="channel-actions">
                    {isEditing ? (
                        <button className="btn btn-primary" onClick={handleSave}>
                            <FiSave /> Saqlash
                        </button>
                    ) : (
                        <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                            <FiEdit /> Tahrirlash
                        </button>
                    )}
                </div>
            </div>

            <div className="channel-content">
                {/* Cover Image */}
                <div className="cover-section">
                    <div className="cover-image">
                        {channelData.coverImage ? (
                            <img src={channelData.coverImage} alt="Cover" />
                        ) : (
                            <div className="cover-placeholder">
                                <FiUpload size={48} />
                                <p>Kanal rasmini yuklang</p>
                            </div>
                        )}
                        {isEditing && (
                            <div className="cover-overlay">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload('coverImage', e.target.files[0])}
                                    className="cover-upload"
                                    id="cover-upload"
                                />
                                <label htmlFor="cover-upload" className="btn btn-white">
                                    <FiUpload /> Rasm yuklash
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Section */}
                <div className="profile-section">
                    <div className="profile-avatar">
                        {channelData.avatar ? (
                            <img src={channelData.avatar} alt="Avatar" />
                        ) : (
                            <div className="avatar-placeholder">
                                <FiUser size={48} />
                            </div>
                        )}
                        {isEditing && (
                            <div className="avatar-overlay">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload('avatar', e.target.files[0])}
                                    className="avatar-upload"
                                    id="avatar-upload"
                                />
                                <label htmlFor="avatar-upload" className="btn btn-sm">
                                    <FiUpload />
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="profile-info">
                        <div className="profile-name">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={channelData.displayName}
                                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                                    className="form-input"
                                />
                            ) : (
                                <h2>{channelData.displayName}</h2>
                            )}
                        </div>
                        <div className="profile-username">
                            @{channelData.channelName}
                        </div>
                    </div>
                </div>

                {/* Basic Information */}
                <div className="info-section">
                    <h3>Asosiy ma'lumotlar</h3>
                    <div className="info-grid">
                        <div className="info-group">
                            <label>Ism</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={channelData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    className="form-input"
                                />
                            ) : (
                                <span>{channelData.firstName}</span>
                            )}
                        </div>
                        <div className="info-group">
                            <label>Familiya</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={channelData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    className="form-input"
                                />
                            ) : (
                                <span>{channelData.lastName}</span>
                            )}
                        </div>
                        <div className="info-group">
                            <label>Kanal nomi (nik)</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={channelData.channelName}
                                    onChange={(e) => handleInputChange('channelName', e.target.value)}
                                    className="form-input"
                                />
                            ) : (
                                <span>@{channelData.channelName}</span>
                            )}
                        </div>
                        <div className="info-group">
                            <label>Haqida</label>
                            {isEditing ? (
                                <textarea
                                    value={channelData.about}
                                    onChange={(e) => handleInputChange('about', e.target.value)}
                                    className="form-textarea"
                                    rows="3"
                                />
                            ) : (
                                <span>{channelData.about}</span>
                            )}
                        </div>
                        <div className="info-group">
                            <label>Batafsil ma'lumot</label>
                            {isEditing ? (
                                <textarea
                                    value={channelData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="form-textarea"
                                    rows="4"
                                />
                            ) : (
                                <span>{channelData.bio}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="info-section">
                    <h3>Aloqa ma'lumotlari</h3>
                    <div className="info-grid">
                        <div className="info-group">
                            <label><FiMapPin /> Joylashuv</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={channelData.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    className="form-input"
                                />
                            ) : (
                                <span>{channelData.location}</span>
                            )}
                        </div>
                        <div className="info-group">
                            <label><FiGlobe /> Veb-sayt</label>
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={channelData.website}
                                    onChange={(e) => handleInputChange('website', e.target.value)}
                                    className="form-input"
                                />
                            ) : (
                                <a href={channelData.website} target="_blank" rel="noopener noreferrer">
                                    {channelData.website}
                                </a>
                            )}
                        </div>
                        <div className="info-group">
                            <label><FiClock /> Javob berish vaqti</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={channelData.responseTime}
                                    onChange={(e) => handleInputChange('responseTime', e.target.value)}
                                    className="form-input"
                                />
                            ) : (
                                <span>{channelData.responseTime}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="info-section">
                    <h3>Ijtimoiy tarmoqlar</h3>
                    <div className="social-links">
                        <div className="social-group">
                            <label><FiInstagram /> Instagram</label>
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={channelData.socialLinks.instagram}
                                    onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                                    className="form-input"
                                    placeholder="https://instagram.com/username"
                                />
                            ) : (
                                <a href={channelData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                                    {channelData.socialLinks.instagram}
                                </a>
                            )}
                        </div>
                        <div className="social-group">
                            <label><FiTwitter /> Twitter</label>
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={channelData.socialLinks.twitter}
                                    onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                                    className="form-input"
                                    placeholder="https://twitter.com/username"
                                />
                            ) : (
                                <a href={channelData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                                    {channelData.socialLinks.twitter}
                                </a>
                            )}
                        </div>
                        <div className="social-group">
                            <label><FiYoutube /> YouTube</label>
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={channelData.socialLinks.youtube}
                                    onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
                                    className="form-input"
                                    placeholder="https://youtube.com/@username"
                                />
                            ) : (
                                <a href={channelData.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                                    {channelData.socialLinks.youtube}
                                </a>
                            )}
                        </div>
                        <div className="social-group">
                            <label><FiLinkedin /> LinkedIn</label>
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={channelData.socialLinks.linkedin}
                                    onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                                    className="form-input"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            ) : (
                                <a href={channelData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                    {channelData.socialLinks.linkedin}
                                </a>
                            )}
                        </div>
                        <div className="social-group">
                            <label><FiGithub /> GitHub</label>
                            {isEditing ? (
                                <input
                                    type="url"
                                    value={channelData.socialLinks.github}
                                    onChange={(e) => handleInputChange('socialLinks.github', e.target.value)}
                                    className="form-input"
                                    placeholder="https://github.com/username"
                                />
                            ) : (
                                <a href={channelData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                                    {channelData.socialLinks.github}
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="info-section">
                    <div className="section-header">
                        <h3><FiAward /> Yutuqlar</h3>
                        {isEditing && (
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowAchievementModal(true)}
                            >
                                <FiAward /> Yutuq qo'shish
                            </button>
                        )}
                    </div>
                    <div className="achievements-grid">
                        {channelData.achievements.map((achievement) => (
                            <div key={achievement.id} className="achievement-card">
                                {achievement.image && (
                                    <img src={achievement.image} alt={achievement.title} className="achievement-image" />
                                )}
                                <div className="achievement-content">
                                    <h4>{achievement.title}</h4>
                                    <p>{achievement.description}</p>
                                    <span className="achievement-date">{achievement.date}</span>
                                </div>
                                {isEditing && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemoveAchievement(achievement.id)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certificates */}
                <div className="info-section">
                    <div className="section-header">
                        <h3><FiAward /> Sertifikatlar</h3>
                        {isEditing && (
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowCertificateModal(true)}
                            >
                                <FiAward /> Sertifikat qo'shish
                            </button>
                        )}
                    </div>
                    <div className="certificates-grid">
                        {channelData.certificates.map((certificate) => (
                            <div key={certificate.id} className="certificate-card">
                                {certificate.image && (
                                    <img src={certificate.image} alt={certificate.title} className="certificate-image" />
                                )}
                                <div className="certificate-content">
                                    <h4>{certificate.title}</h4>
                                    <p>Bergan: {certificate.issuer}</p>
                                    <span className="certificate-date">{certificate.date}</span>
                                </div>
                                {isEditing && (
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemoveCertificate(certificate.id)}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Add Achievement Modal */}
            {showAchievementModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Yutuq qo'shish</h2>
                            <button onClick={() => setShowAchievementModal(false)}>×</button>
                        </div>
                        <div className="modal-content">
                            <div className="form-group">
                                <label>Yutuq nomi</label>
                                <input
                                    type="text"
                                    value={newAchievement.title}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Tavsif</label>
                                <textarea
                                    value={newAchievement.description}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
                                    className="form-textarea"
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>Sana</label>
                                <input
                                    type="date"
                                    value={newAchievement.date}
                                    onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Rasm</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewAchievement({ ...newAchievement, image: e.target.files[0] })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowAchievementModal(false)}
                                    className="btn btn-secondary"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddAchievement}
                                    className="btn btn-primary"
                                >
                                    Qo'shish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Certificate Modal */}
            {showCertificateModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h2>Sertifikat qo'shish</h2>
                            <button onClick={() => setShowCertificateModal(false)}>×</button>
                        </div>
                        <div className="modal-content">
                            <div className="form-group">
                                <label>Sertifikat nomi</label>
                                <input
                                    type="text"
                                    value={newCertificate.title}
                                    onChange={(e) => setNewCertificate({ ...newCertificate, title: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Bergan tashkilot</label>
                                <input
                                    type="text"
                                    value={newCertificate.issuer}
                                    onChange={(e) => setNewCertificate({ ...newCertificate, issuer: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Sana</label>
                                <input
                                    type="date"
                                    value={newCertificate.date}
                                    onChange={(e) => setNewCertificate({ ...newCertificate, date: e.target.value })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Rasm</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setNewCertificate({ ...newCertificate, image: e.target.files[0] })}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-actions">
                                <button
                                    type="button"
                                    onClick={() => setShowCertificateModal(false)}
                                    className="btn btn-secondary"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddCertificate}
                                    className="btn btn-primary"
                                >
                                    Qo'shish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherChannel