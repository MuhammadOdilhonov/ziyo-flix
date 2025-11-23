import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BsFilm,
  BsCameraVideo,
  BsBook,
  BsSearch,
  BsSun,
  BsMoon,
  BsBoxArrowInRight,
  BsPersonPlus,
  BsBoxArrowRight,
  BsBell,
  BsGear,
  BsHouseDoor
} from "react-icons/bs";
import { RiWechatChannelsLine } from 'react-icons/ri';
import { FiHash } from 'react-icons/fi'
import { BaseUrlReels } from '../../api/apiService';


// Mock user data
const mockUser = {
  id: 1,
  name: "Akmal Usmonov",
  email: "akmal@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
};

function getStoredUser() {
  try { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null } catch { return null }
}
function getSelectedChannel() {
  try { const raw = localStorage.getItem('selectedTeacherChannel'); return raw ? JSON.parse(raw) : null } catch { return null }
}

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [hasNotifications, setHasNotifications] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    let savedUser = getStoredUser();

    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('theme', 'dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('theme', 'light');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    if (savedUser && savedUser.role) {
      setUser(savedUser);
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }

    setSelectedChannel(getSelectedChannel());
    const onChannelChange = () => setSelectedChannel(getSelectedChannel());
    window.addEventListener('selected-channel:change', onChannelChange);
    window.addEventListener('storage', onChannelChange);
    return () => {
      window.removeEventListener('selected-channel:change', onChannelChange);
      window.removeEventListener('storage', onChannelChange);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.setAttribute('theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogin = () => {
    setTimeout(() => {
      const userData = mockUser;
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/');
    }, 1000);
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
    navigate("/login", { replace: true })
    setActiveTab('home');
  };

  const handleNavigation = (path, tab) => {
    setActiveTab(tab);
    navigate(path);
  };

  const handleNotifications = () => {
    navigate('/notifications');
    setHasNotifications(false);
  };

  const navigationItems = [
    { id: 'movies', icon: BsFilm, label: 'Kinolar', path: '/movies' },
    { id: 'tutorials', icon: BsBook, label: 'Video Darslik', path: '/tutorials' },
    { id: 'channels', icon: RiWechatChannelsLine, label: 'Kanallar', path: '/channels' },
  ];

  const goToProfile = () => {
    const storedUser = getStoredUser()
    const role = storedUser?.role || 'user'

    console.log('[NavbarLeft] Profile navigation - Role:', role)

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
  }
  const handleClassroomClick = () => {
    const storedUser = getStoredUser();

    if (!storedUser) {
      // Agar foydalanuvchi ro'yxatdan o'tmagan bo'lsa, login sahifasiga yo'naltirish
      navigate('/login');
      return;
    }

    const role = storedUser.role || 'user';

    // Role asosida tegishli classroom sahifasiga yo'naltirish
    if (role === 'teacher') {
      navigate('/teacher/classrooms');
    } else {
      navigate('/user/classrooms');
    }

    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar-left">
      <div className="navbar-left__container">
        <div className="navbar-left__logo">
          <button
            onClick={() => handleNavigation('/', 'home')}
            className="navbar-left__logo-btn"
          >
            <div className="navbar-left__logo-icon">
              <img className='navbar__logo-link_img' src="/Ziyo-Flix-Logo.png" alt="ZiyoFlix" />
            </div>
            <span className="navbar-left__logo-text">ZiyoFlix</span>
          </button>
        </div>

        {/* Main Navigation */}
        <div className="navbar-left__nav">
          {navigationItems.map(({ id, icon: Icon, label, path }) => (
            <button
              key={id}
              onClick={() => handleNavigation(path, id)}
              className={`navbar-left__nav-item ${activeTab === id ? 'navbar-left__nav-item--active' : ''}`}
            >
              <div className="navbar-left__nav-icon">
                <Icon size={20} />
              </div>
              <span className="navbar-left__nav-text">{label}</span>
            </button>
          ))}

          {isAuthenticated && (
            <button
              onClick={handleClassroomClick}
              className="navbar-left__nav-item"
            >
              <div className="navbar-left__nav-icon">
                <BsHouseDoor size={20} />
              </div>
              <span className="navbar-left__nav-text">Klass</span>
            </button>
          )}
        </div>

        {/* Search */}
        <div className="navbar-left__search">
          <button
            onClick={() => navigate('/search')}
            className="navbar-left__nav-item"
          >
            <div className="navbar-left__nav-icon">
              <BsSearch size={20} />
            </div>
            <span className="navbar-left__nav-text">Qidiruv</span>
          </button>
        </div>

        {/* Spacer */}
        <div className="navbar-left__spacer"></div>

        {/* User Section */}
        <div className="navbar-left__user">
          {isAuthenticated ? (
            <>
              {/* User Profile */}
              <button
                onClick={goToProfile}
                className="navbar-left__nav-item navbar-left__profile-item"
              >
                <div className="navbar-left__nav-icon">
                  <img
                    src={BaseUrlReels + user?.avatar}
                    alt={user?.name}
                    className="navbar-left__user-avatar"
                  />
                </div>
                <div className="navbar-left__user-info">
                  <span className="navbar-left__user-name">
                    {user?.name}
                    {user?.role === 'teacher' && selectedChannel?.username && (
                      <span style={{ marginLeft: 6, fontWeight: 500, fontSize: 12, opacity: 0.9, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <FiHash /> @{selectedChannel.username}
                      </span>
                    )}
                  </span>
                  <span className="navbar-left__user-email">{user?.email}</span>
                </div>
              </button>

              {/* Notifications */}
              <button
                onClick={handleNotifications}
                className="navbar-left__nav-item"
              >
                <div className="navbar-left__nav-icon navbar-left__notification-icon">
                  <BsBell size={20} />
                  {hasNotifications && <span className="navbar-left__notification-badge"></span>}
                </div>
                <span className="navbar-left__nav-text">Xabar noma</span>
              </button>

              {/* Settings */}
              <button
                onClick={() => navigate('/settings')}
                className="navbar-left__nav-item"
              >
                <div className="navbar-left__nav-icon">
                  <BsGear size={20} />
                </div>
                <span className="navbar-left__nav-text">Sozlamalar</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="navbar-left__nav-item"
              >
                <div className="navbar-left__nav-icon">
                  {isDarkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
                </div>
                <span className="navbar-left__nav-text">
                  {isDarkMode ? 'Yorug\' rejim' : 'Tungi rejim'}
                </span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="navbar-left__nav-item navbar-left__nav-item--logout"
              >
                <div className="navbar-left__nav-icon">
                  <BsBoxArrowRight size={20} />
                </div>
                <span className="navbar-left__nav-text">Chiqish</span>
              </button>
            </>
          ) : (
            <>
              {/* Theme Toggle for non-authenticated users */}
              <button
                onClick={toggleTheme}
                className="navbar-left__nav-item"
              >
                <div className="navbar-left__nav-icon">
                  {isDarkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
                </div>
                <span className="navbar-left__nav-text">
                  {isDarkMode ? 'Yorug\' rejim' : 'Tungi rejim'}
                </span>
              </button>

              {/* Login */}
              <button
                onClick={handleLogin}
                className="navbar-left__nav-item navbar-left__nav-item--login"
              >
                <div className="navbar-left__nav-icon">
                  <BsBoxArrowInRight size={20} />
                </div>
                <span className="navbar-left__nav-text">Kirish</span>
              </button>

              {/* Register */}
              <button
                onClick={() => navigate('/register')}
                className="navbar-left__nav-item navbar-left__nav-item--register"
              >
                <div className="navbar-left__nav-icon">
                  <BsPersonPlus size={20} />
                </div>
                <span className="navbar-left__nav-text">Ro'yxatdan o'tish</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;