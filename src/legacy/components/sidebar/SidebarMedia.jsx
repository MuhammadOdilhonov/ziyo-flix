"use client"

import { Link, useLocation, useNavigate } from "react-router-dom"
import {
    FiHome,
    FiUser,
    FiUsers,
    FiBarChart2,
    FiSettings,
    FiTrendingUp,
    FiBook,
    FiVideo,
    FiFilm,
    FiFileText,
    FiClipboard,
    FiCalendar,
    FiAward,
    FiUserCheck,
    FiCreditCard,
    FiRepeat,
    FiBookmark,
    FiHeart,
    FiHash,
    FiRefreshCw,
    FiActivity,
    FiSend,
    FiLogOut,
    FiSun,
    FiMoon,
    FiEye,
    FiGift,
    FiGlobe,
    FiDollarSign,
    FiAlertTriangle,
    FiUserX,
    FiCheckSquare,
    FiEdit3,
    FiX,
    FiMoreHorizontal,
    FiDatabase,
} from "react-icons/fi"

import { FaGraduationCap } from "react-icons/fa"
import { useState, useEffect } from "react"
import useSelectedChannel from "../../hooks/useSelectedChannel"
import { BaseUrlReels } from "../../api/apiService"

const SidebarMedia = ({ userRole, isOpen, onClose, onToggle, theme, onThemeToggle, currentUser }) => {
    const location = useLocation()
    const navigate = useNavigate()
    const currentPath = location.pathname

    // CurrentUser fallback
    const safeUser = currentUser || {
        name: "Foydalanuvchi",
        role: userRole || 'user',
        avatar: null
    }
    const { selectedChannel } = useSelectedChannel()

    const [visibleCount, setVisibleCount] = useState(4) // Dastlab 4 ta ko'rinadi

    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth >= 640) {
                setVisibleCount(4) // katta ekran
            } else if (window.innerWidth >= 480) {
                setVisibleCount(3)
            } else if (window.innerWidth >= 360) {
                setVisibleCount(3)
            } else {
                setVisibleCount(2)
            }
        }

        updateVisibleCount()
        window.addEventListener("resize", updateVisibleCount)
        return () => window.removeEventListener("resize", updateVisibleCount)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("user")
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        navigate("/login", { replace: true })
    }

    const getMenuItems = () => {
        const baseItems = [
            {
                id: "dashboard",
                label: "Umumiy analiz",
                icon: FiHome,
                path: `/profile/${userRole}/dashboard`,
            },
            {
                id: "profile",
                label: "Profil",
                icon: FiUser,
                path: `/profile/${userRole}/profile`,
            },
        ]

        switch (userRole) {
            // ========================================
            // 🟦 DIRECTOR (Direktor) - Barcha narsaga kirish
            // ========================================
            case "director":
                return [
                    ...baseItems,
                    // Kontent tekshiruv bo'limi
                    {
                        id: "channels",
                        label: "Kanallar boshqaruvi",
                        icon: FiTrendingUp,
                        path: `/profile/director/channels`,
                        section: "content"
                    },
                    {
                        id: "content-review",
                        label: "Kontent tekshiruv",
                        icon: FiEye,
                        path: `/profile/director/content-review`,
                        section: "content"
                    },
                    {
                        id: "reels",
                        label: "Reels boshqaruvi",
                        icon: FiFilm,
                        path: `/profile/director/reels`,
                        section: "content"
                    },
                    // Vazifalar va tizim bo'limi
                    {
                        id: "reports",
                        label: "Hisobotlar",
                        icon: FiBarChart2,
                        path: `/profile/director/reports`,
                        section: "tasks"
                    },
                    {
                        id: "certificates",
                        label: "Sertifikatlar berish",
                        icon: FiAward,
                        path: `/profile/director/certificates`,
                        section: "tasks"
                    },
                    {
                        id: "promocodes",
                        label: "Promokod berish",
                        icon: FiGift,
                        path: `/profile/director/promocodes`,
                        section: "tasks"
                    },
                    {
                        id: "site-management",
                        label: "Sayt boshqaruvi",
                        icon: FiGlobe,
                        path: `/profile/director/site-management`,
                        section: "tasks"
                    },
                    // Foydalanuvchilar bo'limi
                    {
                        id: "users",
                        label: "Foydalanuvchilar",
                        icon: FiUsers,
                        path: `/profile/director/users`,
                        section: "users"
                    },
                    {
                        id: "admins",
                        label: "Administratorlar",
                        icon: FiUserCheck,
                        path: `/profile/director/admins`,
                        section: "users"
                    },
                    {
                        id: "teachers",
                        label: "O'qituvchilar",
                        icon: FaGraduationCap,
                        path: `/profile/director/teachers`,
                        section: "users"
                    },
                    // Ma'lumotlar va moliya bo'limi
                    {
                        id: "transactions",
                        label: "O'tkazmalar",
                        icon: FiRepeat,
                        path: `/profile/director/transactions`,
                        section: "data"
                    },
                    {
                        id: "wallets",
                        label: "Hamyonlar",
                        icon: FiCreditCard,
                        path: `/profile/director/wallets`,
                        section: "data"
                    },
                    {
                        id: "payments",
                        label: "To'lovlar",
                        icon: FiDollarSign,
                        path: `/profile/director/payments`,
                        section: "data"
                    },
                    {
                        id: "settings",
                        label: "Sozlamalar",
                        icon: FiSettings,
                        path: `/profile/director/settings`,
                        section: "data"
                    },
                ]

            // ========================================
            // 🟨 ADMIN (Administrator) - Kontent, kanal, o'qituvchi, foydalanuvchi
            // ========================================
            case "admin":
                return [
                    ...baseItems,
                    // Kontent tekshiruv bo'limi
                    {
                        id: "content-moderation",
                        label: "Kontent moderatsiya",
                        icon: FiEye,
                        path: `/profile/admin/content-moderation`,
                        section: "content"
                    },
                    {
                        id: "video-review",
                        label: "Video tekshiruv",
                        icon: FiVideo,
                        path: `/profile/admin/video-review`,
                        section: "content"
                    },
                    {
                        id: "reels-review",
                        label: "Reels tekshiruv",
                        icon: FiFilm,
                        path: `/profile/admin/reels-review`,
                        section: "content"
                    },
                    {
                        id: "channels-management",
                        label: "Kanallar boshqaruvi",
                        icon: FiTrendingUp,
                        path: `/profile/admin/channels-management`,
                        section: "content"
                    },
                    // Vazifalar va tizim bo'limi
                    {
                        id: "assignments",
                        label: "Vazifalar tekshiruv",
                        icon: FiClipboard,
                        path: `/profile/admin/assignments`,
                        section: "tasks"
                    },
                    {
                        id: "reports",
                        label: "Hisobotlar",
                        icon: FiBarChart2,
                        path: `/profile/admin/reports`,
                        section: "tasks"
                    },
                    {
                        id: "certificates",
                        label: "Sertifikatlar",
                        icon: FiAward,
                        path: `/profile/admin/certificates`,
                        section: "tasks"
                    },
                    {
                        id: "user-complaints",
                        label: "Foydalanuvchi shikoyatlari",
                        icon: FiAlertTriangle,
                        path: `/profile/admin/user-complaints`,
                        section: "tasks"
                    },
                    // Foydalanuvchilar bo'limi
                    {
                        id: "users",
                        label: "Foydalanuvchilar",
                        icon: FiUsers,
                        path: `/profile/admin/users`,
                        section: "users"
                    },
                    {
                        id: "teachers",
                        label: "O'qituvchilar",
                        icon: FaGraduationCap,
                        path: `/profile/admin/teachers`,
                        section: "users"
                    },
                    {
                        id: "banned-users",
                        label: "Bloklangan foydalanuvchilar",
                        icon: FiUserX,
                        path: `/profile/admin/banned-users`,
                        section: "users"
                    },
                    // Ma'lumotlar bo'limi
                    {
                        id: "transactions",
                        label: "O'tkazmalar",
                        icon: FiRepeat,
                        path: `/profile/admin/transactions`,
                        section: "data"
                    },
                    {
                        id: "wallets",
                        label: "Hamyonlar",
                        icon: FiCreditCard,
                        path: `/profile/admin/wallets`,
                        section: "data"
                    },
                    {
                        id: "system-logs",
                        label: "Tizim loglari",
                        icon: FiFileText,
                        path: `/profile/admin/system-logs`,
                        section: "data"
                    },
                    {
                        id: "settings",
                        label: "Sozlamalar",
                        icon: FiSettings,
                        path: `/profile/admin/settings`,
                        section: "data"
                    },
                ]

            // ========================================
            // 🟩 TEACHER (O'qituvchi) - Yangi struktura
            // ========================================
            case "teacher":
                const channelSlug = selectedChannel?.slug || selectedChannel?.username || 'default'
                return [
                    // Umumiy analitika (kanaldan yuqori)
                    {
                        id: "dashboard",
                        label: "Umumiy analiz",
                        icon: FiHome,
                        path: `/profile/teacher/dashboard`,
                        section: "analytics"
                    },
                    {
                        id: "analytics",
                        label: "Analitika",
                        icon: FiBarChart2,
                        path: `/profile/teacher/analytics/overview`,
                        section: "analytics"
                    },

                    // Kontent boshqaruvi
                    {
                        id: "information",
                        label: "Informatsiya",
                        icon: FiBook,
                        path: `/profile/teacher/${channelSlug}/information`,
                        section: "content"
                    },
                    {
                        id: "videos",
                        label: "Video darsliklar",
                        icon: FiVideo,
                        path: `/profile/teacher/${channelSlug}/videos`,
                        section: "content"
                    },
                    {
                        id: "reels",
                        label: "Reels",
                        icon: FiFilm,
                        path: `/profile/teacher/${channelSlug}/reels`,
                        section: "content"
                    },
                    {
                        id: "students",
                        label: "O'quvchilar",
                        icon: FaGraduationCap,
                        path: `/profile/teacher/${channelSlug}/students`,
                        section: "content"
                    },

                    // Vazifalar bo'limi
                    {
                        id: "tests",
                        label: "Test bo'yicha ma'lumotlar",
                        icon: FiCheckSquare,
                        path: `/profile/teacher/${channelSlug}/tests`,
                        section: "tasks"
                    },
                    {
                        id: "assignments",
                        label: "Vazifa bo'yicha ma'lumotlar",
                        icon: FiEdit3,
                        path: `/profile/teacher/${channelSlug}/assignments`,
                        section: "tasks"
                    },
                    {
                        id: "assignment-review",
                        label: "O'quvchilardan kelgan vazifalarni tekshirish",
                        icon: FiEye,
                        path: `/profile/teacher/${channelSlug}/assignment-review`,
                        section: "tasks"
                    },

                    // Ma'lumotlar bo'limi
                    {
                        id: "wallet",
                        label: "Hamyon",
                        icon: FiCreditCard,
                        path: `/profile/teacher/${channelSlug}/wallet`,
                        section: "data"
                    },
                    {
                        id: "settings",
                        label: "Sozlamalar",
                        icon: FiSettings,
                        path: `/profile/teacher/${channelSlug}/settings`,
                        section: "data"
                    },
                ]

            // ========================================
            // 🟨 USER (O'quvchi) - Shaxsiy kabinet
            // ========================================
            case "user":
            default:
                return [
                    ...baseItems,
                    // Kontent bo'limi
                    {
                        id: "courses",
                        label: "Video darsliklari",
                        icon: FiBook,
                        path: `/profile/user/courses`,
                        section: "content"
                    },
                    {
                        id: "reels",
                        label: "Saqlangan reels",
                        icon: FiFilm,
                        path: `/profile/user/reels`,
                        section: "content"
                    },
                    // Vazifalar bo'limi
                    {
                        id: "assignments",
                        label: "Yuborgan vazifalar",
                        icon: FiSend,
                        path: `/profile/user/submitted-assignments`,
                        section: "tasks"
                    },
                    {
                        id: "tests",
                        label: "Testlar",
                        icon: FiClipboard,
                        path: `/profile/user/tests`,
                        section: "tasks"
                    },
                    {
                        id: "certificates",
                        label: "Olgan sertifikatlar",
                        icon: FiAward,
                        path: `/profile/user/certificates`,
                        section: "tasks"
                    },
                    {
                        id: "likes-comments",
                        label: "Yoqtirganlar & Izohlar",
                        icon: FiHeart,
                        path: `/profile/user/likes-comments`,
                        section: "data"
                    },
                    {
                        id: "wallet",
                        label: "Hamyon",
                        icon: FiCreditCard,
                        path: `/profile/user/wallet`,
                        section: "data"
                    },
                    {
                        id: "settings",
                        label: "Sozlamalar",
                        icon: FiSettings,
                        path: `/profile/user/settings`,
                        section: "data"
                    },
                ]
        }
    }

    const menuItems = getMenuItems()
    const primaryItems = menuItems.slice(0, visibleCount)
    const moreItems = menuItems.slice(visibleCount)
    const hasMoreItems = moreItems.length > 0

    const getRoleTitle = () => {
        switch (userRole) {
            case "director":
                return "Direktor"
            case "admin":
                return "Administrator"
            case "teacher":
                return "O'qituvchi"
            case "user":
                return "O'quvchi"
            default:
                return "Foydalanuvchi"
        }
    }

    return (
        <div className={`sidebar-media ${theme === "dark" ? "sidebar-media--dark" : "sidebar-media--light"}`} data-theme={theme}>
            {/* Overlay */}
            {isOpen && <div className={"sidebar-media__overlay"} onClick={onClose}></div>}

            {/* Modal (barcha menyular) */}
            <div className={`sidebar-media__modal ${isOpen ? "sidebar-media__modal--open" : ""}`} data-theme={theme}>
                <div className={"sidebar-media__handle"}>
                    <div className={"sidebar-media__handle-bar"}></div>
                </div>

                <div className={"sidebar-media__header"}>
                    <div className={"sidebar-media__logo"}>
                        <div className={"sidebar-media__logo-icon"}>
                            <img src="/Ziyo-Flix-Logo.png" alt="ziyo-flix" />
                        </div>
                        <div className={"sidebar-media__logo-text"}>
                            <h3>ZiyoFlix</h3>
                            <span>Ta'lim platformasi</span>
                        </div>
                    </div>
                    <button className={"sidebar-media__close"} onClick={onClose} aria-label="Yopish">
                        <FiX size={24} />
                    </button>
                </div>

                <div className={"sidebar-media__user"}>
                    <div className={"sidebar-media__user-avatar"}>
                        {safeUser.avatar ? (
                            <img src={BaseUrlReels + safeUser.avatar || "/placeholder.svg"} alt={safeUser.name} />
                        ) : (
                            <FiUser size={20} />
                        )}
                    </div>
                    <div className={"sidebar-media__user-info"}>
                        <h4>{safeUser.name}</h4>
                        <span className={"sidebar-media__user-role"}>{getRoleTitle()}</span>
                    </div>
                </div>

                {userRole === "teacher" && (
                    <div className={"sidebar-media__channel"}>
                        <div className={"sidebar-media__channel-title"}>Kanal</div>
                        <Link to="/profile/teacher/channels" className={"sidebar-media__channel-item"} onClick={onClose}>
                            <div className={"sidebar-media__nav-icon"}><FiHash size={18} /></div>
                            <span className={"sidebar-media__nav-label"}>
                                {selectedChannel ? `@${selectedChannel.slug || selectedChannel.username}` : "Kanal tanlanmagan"}
                            </span>
                            <div style={{ marginLeft: "auto", opacity: 0.8 }}><FiRefreshCw size={16} /></div>
                        </Link>
                    </div>
                )}

                <nav className={"sidebar-media__nav"}>
                    {/* Umumiy analitika bo'limi */}
                    {menuItems.filter(item => item.section === "analytics").length > 0 && (
                        <div className={"sidebar-media__nav-section"}>
                            <h5 className={"sidebar-media__nav-title"}>Umumiy</h5>
                            {menuItems.filter(item => item.section === "analytics").map((item) => {
                                const IconComponent = item.icon
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={`${"sidebar-media__nav-item"} ${currentPath === item.path ||
                                            (item.id === "analytics" && currentPath.includes("/analytics"))
                                            ? "sidebar-media__nav-item--active" : ""
                                            }`}
                                        onClick={onClose}
                                    >
                                        <div className={"sidebar-media__nav-icon"}>
                                            <IconComponent size={20} />
                                        </div>
                                        <span className={"sidebar-media__nav-label"}>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {/* Asosiy bo'lim (dashboard) */}
                    {menuItems.filter(item => !item.section).length > 0 && (
                        <div className={"sidebar-media__nav-section"}>
                            <h5 className={"sidebar-media__nav-title"}>Asosiy</h5>
                            {menuItems.filter(item => !item.section).map((item) => {
                                const IconComponent = item.icon
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={`${"sidebar-media__nav-item"} ${currentPath === item.path ? "sidebar-media__nav-item--active" : ""}`}
                                        onClick={onClose}
                                    >
                                        <div className={"sidebar-media__nav-icon"}>
                                            <IconComponent size={20} />
                                        </div>
                                        <span className={"sidebar-media__nav-label"}>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {/* Kontent boshqaruvi bo'limi */}
                    {menuItems.filter(item => item.section === "content").length > 0 && (
                        <div className={"sidebar-media__nav-section"}>
                            <h5 className={"sidebar-media__nav-title"}>Kontent</h5>
                            {menuItems.filter(item => item.section === "content").map((item) => {
                                const IconComponent = item.icon
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={`${"sidebar-media__nav-item"} ${currentPath === item.path ||
                                            currentPath.includes(item.path)
                                            ? "sidebar-media__nav-item--active" : ""
                                            }`}
                                        onClick={onClose}
                                    >
                                        <div className={"sidebar-media__nav-icon"}>
                                            <IconComponent size={20} />
                                        </div>
                                        <span className={"sidebar-media__nav-label"}>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {/* Vazifalar va tizim bo'limi */}
                    {menuItems.filter(item => item.section === "tasks").length > 0 && (
                        <div className={"sidebar-media__nav-section"}>
                            <h5 className={"sidebar-media__nav-title"}>Vazifalar va tizim</h5>
                            {menuItems.filter(item => item.section === "tasks").map((item) => {
                                const IconComponent = item.icon
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={`${"sidebar-media__nav-item"} ${currentPath === item.path ||
                                            currentPath.includes(item.path)
                                            ? "sidebar-media__nav-item--active" : ""
                                            }`}
                                        onClick={onClose}
                                    >
                                        <div className={"sidebar-media__nav-icon"}>
                                            <IconComponent size={20} />
                                        </div>
                                        <span className={"sidebar-media__nav-label"}>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {/* Foydalanuvchilar bo'limi */}
                    {menuItems.filter(item => item.section === "users").length > 0 && (
                        <div className={"sidebar-media__nav-section"}>
                            <h5 className={"sidebar-media__nav-title"}>Foydalanuvchilar</h5>
                            {menuItems.filter(item => item.section === "users").map((item) => {
                                const IconComponent = item.icon
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={`${"sidebar-media__nav-item"} ${currentPath === item.path ||
                                            currentPath.includes(item.path)
                                            ? "sidebar-media__nav-item--active" : ""
                                            }`}
                                        onClick={onClose}
                                    >
                                        <div className={"sidebar-media__nav-icon"}>
                                            <IconComponent size={20} />
                                        </div>
                                        <span className={"sidebar-media__nav-label"}>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}

                    {/* Ma'lumotlar bo'limi */}
                    {menuItems.filter(item => item.section === "data").length > 0 && (
                        <div className={"sidebar-media__nav-section"}>
                            <h5 className={"sidebar-media__nav-title"}>Ma'lumotlar</h5>
                            {menuItems.filter(item => item.section === "data").map((item) => {
                                const IconComponent = item.icon
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={`${"sidebar-media__nav-item"} ${currentPath === item.path ||
                                            currentPath.includes(item.path)
                                            ? "sidebar-media__nav-item--active" : ""
                                            }`}
                                        onClick={onClose}
                                    >
                                        <div className={"sidebar-media__nav-icon"}>
                                            <IconComponent size={20} />
                                        </div>
                                        <span className={"sidebar-media__nav-label"}>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    )}
                </nav>

                <div className={"sidebar-media__footer"}>
                    {onThemeToggle && (
                        <button
                            className={"sidebar-media__action-btn"}
                            onClick={() => {
                                onThemeToggle()
                                onClose()
                            }}
                        >
                            <div className={"sidebar-media__nav-icon"}>
                                {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
                            </div>
                            <span className={"sidebar-media__nav-label"}>
                                {theme === "dark" ? "Yorug' rejim" : "Qorong'u rejim"}
                            </span>
                        </button>
                    )}

                    <button className={"sidebar-media__logout-btn"} onClick={handleLogout}>
                        <div className={"sidebar-media__nav-icon"}>
                            <FiLogOut size={20} />
                        </div>
                        <span className={"sidebar-media__nav-label"}>Tizimdan chiqish</span>
                    </button>
                </div>
            </div>

            {/* Pastki navigatsiya */}
            <div className={"sidebar-media__bottom-nav"} data-theme={theme}>
                {primaryItems.map((item) => {
                    const IconComponent = item.icon
                    const isActive = currentPath === item.path
                    return (
                        <Link
                            key={item.id}
                            to={item.path}
                            className={`${"sidebar-media__bottom-item"} ${isActive ? "sidebar-media__bottom-item--active" : ""}`}
                            aria-label={item.label}
                        >
                            <div className={"sidebar-media__bottom-icon"}>
                                <IconComponent size={20} />
                            </div>
                            {isActive ? <span className={"indicator-dot"}></span> : <span className={"sidebar-media__bottom-label"}>{item.label}</span>}

                        </Link>
                    )
                })}

                {hasMoreItems && (
                    <button
                        className={`${"sidebar-media__bottom-item"} ${"sidebar-media__more-btn"} ${isOpen ? "sidebar-media__bottom-item--active" : ""}`}
                        onClick={onToggle}
                        aria-label="Ko'proq"
                    >
                        <div className={"sidebar-media__bottom-icon"}>
                            <FiMoreHorizontal size={20} />
                            {isOpen && <span className={"indicator-dot"}></span>}
                        </div>
                        <span className={"sidebar-media__bottom-label"}>Ko'proq</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default SidebarMedia