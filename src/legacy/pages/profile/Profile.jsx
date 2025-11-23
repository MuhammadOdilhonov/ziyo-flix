"use client"

// pages/Profile.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/sidebar/Sidebar"
import SidebarMedia from "../../components/sidebar/SidebarMedia"
import { Outlet } from "react-router-dom"
import { teacherAPI } from "../../api/apiTeacher"
import useSelectedChannel from "../../hooks/useSelectedChannel"

const Profile = () => {
    const navigate = useNavigate()
    const [currentUser, setCurrentUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light"
    })
    const { selectedChannel } = useSelectedChannel()

    useEffect(() => {
        try {
            const userData = localStorage.getItem("user")

            if (!userData) {
                // Agar localStorage bo'sh bo'lsa, login sahifasiga yo'naltirish
                console.log("[v0] Foydalanuvchi ma'lumotlari topilmadi, login sahifasiga yo'naltirilmoqda")
                navigate("/login", { replace: true })
                return
            }

            const parsedUser = JSON.parse(userData)

            // // Foydalanuvchi ma'lumotlarining to'liqligini tekshirish
            // if (!parsedUser.id || !parsedUser.email || !parsedUser.role) {
            //     console.log("[v0] Foydalanuvchi ma'lumotlari noto'liq, settings sahifasiga yo'naltirilmoqda")
                
            //     // User ma'lumotlari noto'liq bo'lsa ham sidebar bilan settings sahifasini ko'rsatish
            //     setCurrentUser(parsedUser || { role: 'user' }) // Mavjud ma'lumotlar yoki default user
            //     setIsLoading(false) // Loading holatini to'xtatish
                
            //     // Role asosida to'g'ri settings sahifasiga yo'naltirish
            //     const role = parsedUser?.role || 'user'
            //     let settingsPath = ''
                
            //     switch (role) {
            //         case 'director':
            //             settingsPath = '/profile/director/settings'
            //             break
            //         case 'admin':
            //             settingsPath = '/profile/admin/settings'
            //             break
            //         case 'teacher':
            //             settingsPath = '/profile/teacher/channels' // Teacher uchun avval kanal kerak
            //             break
            //         case 'user':
            //         default:
            //             settingsPath = '/profile/user/settings'
            //             break
            //     }
                
            //     console.log(`[Profile] Yo'naltirilmoqda: ${settingsPath}`)
            //     navigate(settingsPath, { replace: true })
            //     return
            // }

            setCurrentUser(parsedUser)
            console.log("[v0] Foydalanuvchi muvaffaqiyatli yuklandi:", parsedUser.email)

            // Agar teacher bo'lsa va kanal tanlanmagan bo'lsa, kanal tanlash sahifasiga yo'naltirish
            if (parsedUser.role === 'teacher' && !selectedChannel) {
                const currentPath = window.location.pathname
                if (!currentPath.includes('/channels') && !currentPath.includes('/channel/edit')) {
                    navigate('/profile/teacher/channels', { replace: true })
                    return
                }
            }

        } catch (error) {
            console.error("[v0] Foydalanuvchi ma'lumotlarini yuklashda xatolik:", error)
            localStorage.removeItem("user")
            navigate("/login", { replace: true })
        } finally {
            setIsLoading(false)
        }
    }, [navigate, selectedChannel])

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light"
        setTheme(newTheme)
        localStorage.setItem("theme", newTheme)
        document.documentElement.setAttribute("data-theme", newTheme)
        document.body.setAttribute("data-theme", newTheme)

        // Force re-render of all components
        setTimeout(() => {
            window.dispatchEvent(new Event('themeChanged'))
        }, 100)
    }

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
        // Force re-render of all components with theme
        document.body.setAttribute("data-theme", theme)
    }, [theme])

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen)
    const closeSidebar = () => setSidebarOpen(false)

    if (isLoading) {
        return (
            <div className="profile-loading" data-theme={theme}>
                <div className="loading-spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        )
    }

    if (!currentUser) {
        return null
    }

    // Aktiv menyuni aniqlash
    const location = window.location.pathname
    const activeItem = location.split("/").pop()

    return (
        <div className={`profile-container theme-${theme}`} data-theme={theme}>
            {/* Desktop uchun Sidebar (768px dan yuqori) */}
            <Sidebar 
                userRole={currentUser?.role || 'user'} 
                theme={theme} 
                onThemeToggle={toggleTheme} 
                currentUser={currentUser} 
            />

            {/* Mobile uchun SidebarMedia (768px gacha) */}
            <SidebarMedia
                userRole={currentUser?.role || 'user'}
                isOpen={isSidebarOpen}
                onToggle={toggleSidebar}
                onClose={closeSidebar}
                theme={theme}
                onThemeToggle={toggleTheme}
                currentUser={currentUser}
            />

            {/* Asosiy kontent */}
            <div className="main-content" data-theme={theme}>
                <Outlet />
            </div>
        </div>
    )
}

export default Profile
