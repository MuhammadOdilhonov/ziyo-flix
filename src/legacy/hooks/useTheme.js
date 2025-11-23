"use client"

import { useState, useEffect } from "react"

export const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        // Brauzer muhitida localStorage dan tema olish
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme")
            if (savedTheme) {
                return savedTheme
            }
            // Tizim tema sozlamalarini tekshirish
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        }
        return "light"
    })

    useEffect(() => {
        // Tema o'zgarganda localStorage ga saqlash va DOM ga qo'llash
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", theme)
            document.documentElement.setAttribute("data-theme", theme)

            // Body ga tema sinfini qo'shish (Tailwind uchun)
            if (theme === "dark") {
                document.documentElement.classList.add("dark")
            } else {
                document.documentElement.classList.remove("dark")
            }
        }
    }, [theme])

    useEffect(() => {
        // Tizim tema o'zgarishlarini kuzatish
        if (typeof window !== "undefined") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

            const handleChange = (e) => {
                // Faqat foydalanuvchi o'zi tema tanlamagan bo'lsa
                const savedTheme = localStorage.getItem("theme")
                if (!savedTheme) {
                    setTheme(e.matches ? "dark" : "light")
                }
            }

            mediaQuery.addEventListener("change", handleChange)
            return () => mediaQuery.removeEventListener("change", handleChange)
        }
    }, [])

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
    }

    const setLightTheme = () => setTheme("light")
    const setDarkTheme = () => setTheme("dark")

    return {
        theme,
        toggleTheme,
        setLightTheme,
        setDarkTheme,
        isDark: theme === "dark",
        isLight: theme === "light",
    }
}
