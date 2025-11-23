import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Film,
    Video,
    BookOpen,
    Search,
    Menu,
    X,
    LogOut,
    Sun,
    Moon
} from 'lucide-react';
import { RiWechatChannelsLine } from "react-icons/ri";
import { BaseUrlReels } from '../../api/apiService';
import { BsBoxArrowInRight } from 'react-icons/bs';


function getStoredUser() {
    try { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null } catch { return null }
}

const NavbarMedia = () => {
    const [activeTab, setActiveTab] = useState('home');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Set active tab based on current location
        const path = location.pathname;
        if (path === '/') setActiveTab('home');
        else if (path === '/reels') setActiveTab('reels');
        else if (path === '/movies') setActiveTab('movies');
        else if (path === '/tutorials') setActiveTab('tutorials');
        else if (path === '/search') setActiveTab('search');
        else if (path === '/profile') setActiveTab('profile');

        // Theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.setAttribute('theme', 'dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.setAttribute('theme', 'light');
            document.documentElement.setAttribute('data-theme', 'light');
        }

        // User authentication check
        const savedUser = getStoredUser();
        if (savedUser && savedUser.role) {
            setUser(savedUser);
            setIsAuthenticated(true);
        } else {
            setUser(null);
            setIsAuthenticated(false);
        }
    }, [location.pathname]);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        document.documentElement.setAttribute('theme', newTheme ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    };

    const handleNotifications = () => {
        navigate('/notifications');
    };

    const handleNavigation = (path, tab) => {
        setActiveTab(tab);
        navigate(path);
        setIsModalOpen(false);
    };

    const goToProfile = () => {
        const storedUser = getStoredUser()
        const role = storedUser?.role || 'user'

        console.log('[NavbarMedia] Profile navigation - Role:', role)

        switch (role) {
            case 'director':
                navigate('/profile/director/dashboard')
                break
            case 'admin':
                navigate('/profile/admin/dashboard')
                break
            case 'teacher':
                // Teacher uchun kanal tanlash sahifasiga yo'naltirish
                navigate('/profile/teacher/channels')
                break
            case 'user':
            default:
                navigate('/profile/user/dashboard')
                break
        }
    };
    const handleLogin = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user")
        localStorage.removeItem("selectedTeacherChannel")
        localStorage.removeItem("selectedChannel")
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        localStorage.removeItem("reels_seed")
        navigate("/", { replace: true })
        setIsModalOpen(false);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const modalItems = [
        { id: 'movies', icon: Film, label: 'Kinolar', path: '/movies' },
        { id: 'channels', icon: RiWechatChannelsLine, label: 'Kanallar', path: '/channels' },
        { id: 'search', icon: Search, label: 'Qidiruv', path: '/search' },
    ];

    return (
        <>
            {/* Top Header */}
            <header className="navbar-media-header">
                <div className="navbar-media-header__container">
                    {/* Logo */}
                    <button
                        onClick={() => handleNavigation('/', 'home')}
                        className="navbar-media-header__logo"
                    >
                        <img className='navbar-media-header__logo_img' src="/Ziyo-Flix-Logo.png" alt="ZiyoFlix" />
                        <span className="navbar-media-header__logo-text">ZiyoFlix</span>
                    </button>

                    {/* Theme Toggle */}
                    <button onClick={toggleTheme} className="navbar-media-header__theme-toggle" aria-label="Tema">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Profile */}
                    {isAuthenticated ? (
                        <button
                            onClick={goToProfile}
                            className="navbar-media-header__profile"
                        >
                            <img
                                src={BaseUrlReels + user?.avatar}
                                alt={user?.name}
                                className="navbar-media-header__profile-avatar"
                            />
                        </button>
                    ) : (
                        <button className="navbar__auth-btn navbar__auth-btn--login" onClick={handleLogin}>
                            <BsBoxArrowInRight size={18} />
                            Kirish
                        </button>
                    )}
                </div>
            </header>

            {/* Bottom Navigation */}
            <nav className="navbar-media">
                <div className="navbar-media__container">
                    <button
                        onClick={() => handleNavigation('/reels', 'reels')}
                        className={`navbar-media__item ${activeTab === 'reels' ? 'navbar-media__item--active' : ''}`}
                    >
                        <div className="navbar-media__icon">
                            <Video size={20} />
                        </div>
                        {
                            activeTab !== 'reels' &&
                            <span className="navbar-media__label">Reels</span>
                        }
                    </button>

                    <button
                        onClick={() => handleNavigation('/tutorials', 'tutorials')}
                        className={`navbar-media__item ${activeTab === 'tutorials' ? 'navbar-media__item--active' : ''}`}
                    >
                        <div className="navbar-media__icon">
                            <BookOpen size={20} />
                        </div>
                        {
                            activeTab !== 'tutorials' &&
                            <span className="navbar-media__label">Darslik</span>
                        }
                    </button>

                    <button
                        onClick={toggleModal}
                        className="navbar-media__item navbar-media__item--menu"
                    >
                        <div className="navbar-media__icon">
                            <Menu size={20} />
                        </div>
                        <span className="navbar-media__label">Menu</span>
                    </button>
                </div>
            </nav>

            {/* Modal */}
            {isModalOpen && (
                <>
                    <div className="navbar-media-modal-overlay" onClick={toggleModal} />
                    <div className="navbar-media-modal">
                        <div className="navbar-media-modal__header">
                            <h3 className="navbar-media-modal__title">Menu</h3>
                            <button
                                onClick={toggleModal}
                                className="navbar-media-modal__close"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="navbar-media-modal__content">
                            {modalItems.map(({ id, icon: Icon, label, path }) => (
                                <button
                                    key={id}
                                    onClick={() => handleNavigation(path, id)}
                                    className="navbar-media-modal__item"
                                >
                                    <div className="navbar-media-modal__item-icon">
                                        <Icon size={20} />
                                    </div>
                                    <span className="navbar-media-modal__item-text">{label}</span>
                                </button>
                            ))}

                            {/* Classroom */}
                            {isAuthenticated && (
                                <button
                                    onClick={() => {
                                        const u = getStoredUser();
                                        const role = u?.role || 'user';
                                        handleNavigation(role === 'teacher' ? '/teacher/classrooms' : '/user/classrooms', 'classrooms');
                                    }}
                                    className="navbar-media-modal__item"
                                >
                                    <div className="navbar-media-modal__item-icon">
                                        {/* reuse Film icon for simplicity */}
                                        <Film size={20} />
                                    </div>
                                    <span className="navbar-media-modal__item-text">Klass</span>
                                </button>
                            )}

                            {/* Profile / Notifications */}
                            {isAuthenticated && (
                                <>
                                    <button
                                        onClick={goToProfile}
                                        className="navbar-media-modal__item"
                                    >
                                        <div className="navbar-media-modal__item-icon">
                                            <Film size={20} />
                                        </div>
                                        <span className="navbar-media-modal__item-text">Profil</span>
                                    </button>

                                    <button
                                        onClick={handleNotifications}
                                        className="navbar-media-modal__item"
                                    >
                                        <div className="navbar-media-modal__item-icon">
                                            <Search size={20} />
                                        </div>
                                        <span className="navbar-media-modal__item-text">Xabar noma</span>
                                    </button>
                                </>
                            )}

                            {isAuthenticated && (
                                <button
                                    onClick={handleLogout}
                                    className="navbar-media-modal__item navbar-media-modal__item--logout"
                                >
                                    <div className="navbar-media-modal__item-icon">
                                        <LogOut size={20} />
                                    </div>
                                    <span className="navbar-media-modal__item-text">Chiqish</span>
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default NavbarMedia;