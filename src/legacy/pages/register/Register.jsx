"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FiArrowLeft, FiCheckCircle, FiAlertCircle, FiInfo, FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"
import { FaGraduationCap } from "react-icons/fa"
import { register as apiRegister } from "../../api/apiRegister"

const Register = () => {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light")
    const [message, setMessage] = useState({ type: "", text: "" })
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [role, setRole] = useState("user")
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
    })

    const navigate = useNavigate()

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (message.text) setMessage({ type: "", text: "" })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.username || !formData.password || !formData.first_name || !formData.last_name || !formData.email) {
            setMessage({ type: "error", text: "Barcha maydonlarni to'ldiring" })
            return
        }
        setIsLoading(true)
        setMessage({ type: "", text: "" })
        try {
            const data = await apiRegister({ ...formData, role })
            // Auto-login done via token storage in apiRegister; redirect by role
            const userRole = data?.user?.role || role
            setMessage({ type: "success", text: "Muvaffaqiyatli ro'yxatdan o'tdingiz!" })
            setTimeout(() => navigate(`/profile/${userRole}/dashboard`), 500)
        } catch (error) {
            const errMsg = error?.response?.data?.error || error?.response?.data?.message || error?.response?.data?.detail || "Xatolik yuz berdi"
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
                        <h2>Ro'yxatdan o'tish</h2>
                        <p>O'qituvchi yoki oddiy foydalanuvchi sifatida hisob yarating</p>
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
                            <label className="auth__label">Kim bo'lishni xohlaysiz?</label>
                            <div className="auth__role-select">
                                <label className={`auth__role-option ${role === "teacher" ? "selected" : ""}`}>
                                    <input type="radio" name="role" value="teacher" checked={role === "teacher"} onChange={() => setRole("teacher")} />
                                    <span>O'qituvchi</span>
                                </label>
                                <label className={`auth__role-option ${role === "user" ? "selected" : ""}`}>
                                    <input type="radio" name="role" value="user" checked={role === "user"} onChange={() => setRole("user")} />
                                    <span>Oddiy foydalanuvchi</span>
                                </label>
                            </div>
                        </div>

                        <div className="auth__form-group">
                            <label htmlFor="username" className="auth__label">
                                <FiUser size={16} />
                                Username
                            </label>
                            <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} placeholder="masalan: behruz" className="auth__input" autoComplete="username" />
                        </div>

                        <div className="auth__form-row">
                            <div className="auth__form-group">
                                <label htmlFor="first_name" className="auth__label">
                                    <FiUser size={16} />
                                    First name
                                </label>
                                <input type="text" id="first_name" name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="Ism" className="auth__input" />
                            </div>
                            <div className="auth__form-group">
                                <label htmlFor="last_name" className="auth__label">
                                    <FiUser size={16} />
                                    Last name
                                </label>
                                <input type="text" id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Familiya" className="auth__input" />
                            </div>
                        </div>

                        <div className="auth__form-group">
                            <label htmlFor="email" className="auth__label">
                                <FiMail size={16} />
                                Email address
                            </label>
                            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="email@example.com" className="auth__input" autoComplete="email" />
                        </div>

                        <div className="auth__form-group">
                            <label htmlFor="password" className="auth__label">
                                <FiLock size={16} />
                                Password
                            </label>
                            <div className="auth__password-input">
                                <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Parol" className="auth__input" autoComplete="new-password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth__password-toggle" aria-label="Parolni ko'rsatish/yashirish">
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth__submit-btn" disabled={isLoading}>
                            {isLoading ? <span>Kuting...</span> : <span>Ro'yxatdan o'tish</span>}
                        </button>
                    </form>

                    <div className="auth__toggle">
                        <p className="auth__toggle-text">Hisobingiz bormi?</p>
                        <Link to="/login" className="auth__toggle-btn">Tizimga kirish</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
