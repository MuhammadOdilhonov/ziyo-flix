import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BsFilm,
  BsPlayFill,
  BsBook,
  BsSearch,
  BsSun,
  BsMoon,
  BsBoxArrowInRight,
  BsPersonPlus,
  BsPerson,
  BsCameraVideo,
  BsList,
  BsX,
  BsBoxArrowRight,
  BsBell,
  BsClock,
  BsHouseDoor
} from 'react-icons/bs';
import { RiWechatChannelsLine } from 'react-icons/ri';
import { FiHash } from 'react-icons/fi'
import { BaseUrlReels } from '../../api/apiService';

// Simulyatsiya uchun mock user data
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

// Test user creation removed per request

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true); // Notification holatini boshqarish uchun
  const [selectedChannel, setSelectedChannel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    let savedUser = getStoredUser();

    console.log('[Navbar] Saved user from localStorage:', savedUser);

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
      console.log('[Navbar] User authenticated with role:', savedUser.role);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogin = () => {
    navigate('/Login'); // Kirishdan keyin asosiy sahifaga o'tish
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const goToProfile = () => {
    const storedUser = getStoredUser()
    const role = storedUser?.role || 'user'

    console.log('[Navbar] Profile navigation - Role:', role)

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
  };

  const handleNotifications = () => {
    navigate('/notifications');
    setHasNotifications(false); // O'qilgan deb hisoblash uchun
  };

  const navigateToSection = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

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
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <div className="navbar__logo">
          <button onClick={() => navigateToSection('/')} className="navbar__logo-link">
            <img className='navbar__logo-link_img' src="/Ziyo-Flix-Logo.png" alt="ZiyoFlix" />
            <span className="navbar__logo-text">ZiyoFlix</span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar__nav">
          <button onClick={() => navigateToSection('/reels')} className="navbar__nav-link">
            <BsCameraVideo size={20} />
            Reels
          </button>
          <button onClick={() => navigateToSection('/movies')} className="navbar__nav-link">
            <BsFilm size={20} />
            Kinolar
          </button>
          <button onClick={() => navigateToSection('/tutorials')} className="navbar__nav-link">
            <BsBook size={20} />
            Video Darslik
          </button>
          <button onClick={() => navigateToSection('/channels')} className="navbar__nav-link">
            <RiWechatChannelsLine size={20} />
            Kanallar
          </button>
          {isAuthenticated && (
            <button onClick={handleClassroomClick} className="navbar__nav-link">
              <BsHouseDoor size={20} />
              Klass
            </button>
          )}
          {/* <button onClick={() => navigateToSection('/timers')} className="navbar__nav-link">
            <BsClock size={20} />
            Vaqt
          </button> */}
        </div>

        {/* Search Bar */}
        <form className="navbar__search" onSubmit={handleSearch}>
          <div className="navbar__search-container">
            <input
              type="text"
              placeholder="Qidiruv..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="navbar__search-input"
            />
          </div>
        </form>

        {/* Theme Toggle */}
        <button className="navbar__theme-toggle" onClick={toggleTheme} aria-label="Tema o'zgartirish">
          {isDarkMode ? <BsSun size={20} /> : <BsMoon size={20} />}
        </button>

        {/* User Actions */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <div className="navbar__user-menu">
              <button className="navbar__profile" onClick={goToProfile} aria-label="Profile">
                <img
                  src={BaseUrlReels + user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                  alt={user?.name || "User Avatar"}
                  className="navbar__profile-avatar"
                />
                <div className="navbar__profile-info">
                  <span className="navbar__profile-name">
                    {user?.name || "Foydalanuvchi"}
                    <span style={{
                      marginLeft: '8px',
                      padding: '2px 6px',
                      fontSize: '10px',
                      fontWeight: '600',
                      borderRadius: '8px',
                      background: user?.role === 'director' ? '#3b82f6' :
                        user?.role === 'admin' ? '#ef4444' :
                          user?.role === 'teacher' ? '#10b981' : '#8b5cf6',
                      color: 'white'
                    }}>
                      {user?.role === 'director' && '🎯'}
                      {user?.role === 'admin' && '🛡️'}
                      {user?.role === 'teacher' && '🎓'}
                      {user?.role === 'user' && '👤'}
                      {user?.role?.toUpperCase() || 'USER'}
                    </span>
                    {user?.role === 'teacher' && selectedChannel?.username && (
                      <span style={{ marginLeft: 8, fontWeight: 500, fontSize: 12, opacity: 0.9, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <FiHash /> @{selectedChannel.username}
                      </span>
                    )}
                  </span>
                  <span className="navbar__profile-email">{user?.email || "user@example.com"}</span>
                </div>
              </button>
              {/* Profile Dropdown */}
              <div className="navbar__profile-dropdown">
                <button onClick={goToProfile} className="navbar__dropdown-item">
                  <BsPerson size={18} />
                  Profilim
                </button>
                <button onClick={handleNotifications} className="navbar__dropdown-item navbar__dropdown-item--notification">
                  <div className="navbar__icon-wrapper">
                    <BsBell size={18} />
                    {hasNotifications && <span className="notification-badge" />}
                  </div>
                  Xabar noma
                </button>
                <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--logout">
                  <BsBoxArrowRight size={18} />
                  Chiqish
                </button>
              </div>
            </div>
          ) : (
            <div className="navbar__auth-buttons">
              <button className="navbar__auth-btn navbar__auth-btn--login" onClick={handleLogin}>
                <BsBoxArrowInRight size={18} />
                Kirish
              </button>
              <button className="navbar__auth-btn navbar__auth-btn--register" onClick={handleRegister}>
                <BsPersonPlus size={18} />
                Ro'yxatdan o'tish
              </button>
            </div>
          )}
        </div>

      </div>


    </nav>
  );
};

export default Navbar;