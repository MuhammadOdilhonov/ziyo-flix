"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FiEye, FiEyeOff, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiInfo, FiLock, FiUser, FiLoader } from "react-icons/fi"
import { FaGraduationCap } from "react-icons/fa"
import { login as apiLogin } from "../../api/apiLogin"
import { setSeoTags, setRobots } from "../../utils/seo"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light"
  })
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const navigate = useNavigate()

  useEffect(() => {
    setSeoTags({
      title: "Tizimga kirish — ZiyoFlix",
      description: "ZiyoFlix hisobingizga kiring va darslar, kanallar, kinolardan foydalaning.",
      image: '/Ziyo-Flix-Logo.png',
      type: 'website'
    })
    setRobots('noindex, nofollow')
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const user = JSON.parse(savedUser)
      if (user?.role) {
        navigate(`/profile/${user.role}/dashboard`)
      } else {
        navigate("/profile")
      }
    }
    document.documentElement.setAttribute("data-theme", theme)
  }, [navigate, theme])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (message.text) setMessage({ type: "", text: "" })
  }

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      setMessage({ type: "error", text: "Login va parolni kiriting" })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setMessage({ type: "", text: "" })
    try {
      const data = await apiLogin({ username: formData.username, password: formData.password })
      const userRole = data?.user?.role
      setMessage({ type: "success", text: "Muvaffaqiyatli tizimga kirdingiz!" })
      setTimeout(() => {
        if (userRole) {
          navigate(`/`)
        } else {
          navigate("/profile")
        }
      }, 500)
    } catch (error) {
      const errMsg = error?.response?.data?.error || error?.response?.data?.message || error?.response?.data?.detail || "dasturda hatolik yuz berdi"
      setMessage({ type: "error", text: errMsg })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  return (
    <div className={`auth ${theme === "dark" ? "auth--dark" : "auth--light"}`}>
      <div className="auth__container">
        <div className="auth__header-controls">
          <button onClick={() => navigate("/")} className="auth__back-btn" aria-label="Bosh sahifaga qaytish">
            <FiArrowLeft size={20} />
            <span>Bosh sahifa</span>
          </button>
          <button onClick={toggleTheme} className="auth__theme-toggle" aria-label="Tema almashtirish">
            {theme === "dark" ? <FiEye size={20} /> : <FiEyeOff size={20} />}
          </button>
        </div>

        <div className="auth__card">
          <div className="auth__logo">
            <div className="auth__logo-icon">
              <FaGraduationCap size={32} />
            </div>
            <div className="auth__logo-text">
              <h1>ZiyoFlex</h1>
              <span>Ta'lim platformasi</span>
            </div>
          </div>

          <div className="auth__content-header">
            <h2>Tizimga kirish</h2>
            <p>Video ta'lim va interaktiv kurslar dunyosiga xush kelibsiz</p>
          </div>

          {message.text && (
            <div className={`auth__message auth__message--${message.type}`}>
              <div className="auth__message-icon">
                {message.type === "success" && <FiCheckCircle size={18} />}
                {message.type === "error" && <FiAlertCircle size={18} />}
                {message.type === "info" && <FiInfo size={18} />}
              </div>
              <span className="auth__message-text">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth__form">
            <div className="auth__form-group">
              <label htmlFor="username" className="auth__label">
                <FiUser size={16} />
                Login (username)
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="masalan: behruz"
                disabled={isLoading}
                className="auth__input"
                autoComplete="username"
              />
            </div>

            <div className="auth__form-group">
              <label htmlFor="password" className="auth__label">
                <FiLock size={16} />
                Parol
              </label>
              <div className="auth__password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Parolni kiriting"
                  disabled={isLoading}
                  className="auth__input"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth__password-toggle"
                  aria-label="Parolni ko'rsatish/yashirish"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth__submit-btn" disabled={isLoading}>
              {isLoading ? (
                <div className="auth__loading">
                  <FiLoader className="auth__loading-spinner" size={18} />
                  <span>Kuting...</span>
                </div>
              ) : (
                <span>Tizimga kirish</span>
              )}
            </button>
          </form>

          <div className="auth__toggle">
            <p className="auth__toggle-text">Hisobingiz yo'qmi?</p>
            <Link to="/register" className="auth__toggle-btn">Ro'yxatdan o'tish</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
