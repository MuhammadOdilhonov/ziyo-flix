import apiService, { BaseUrlReels } from "./apiService"

export const getRandomFeed = async ({ page = 1, seed, next }) => {
    let url

    if (next) {
        // Agar next URL mavjud bo'lsa, uni ishlatish
        url = next

        // Agar next URL da seed yo'q bo'lsa va bizda seed mavjud bo'lsa, qo'shamiz
        if (seed && !next.includes("seed=")) {
            const separator = next.includes("?") ? "&" : "?"
            url = `${next}${separator}seed=${encodeURIComponent(String(seed))}`
        }
    } else {
        // Yangi so'rov uchun parametrlar tuzish
        const params = new URLSearchParams()
        if (page) params.append("page", String(page))
        if (seed) params.append("seed", String(seed))

        const queryString = params.toString()
        url = `/reel/random-feed/${queryString ? `?${queryString}` : ""}`
    }

    try {
        const response = await apiService.get(url)
        return response?.data || {}
    } catch (error) {
        console.error("API request failed:", error)
        return { results: [], next: null, seed: null }
    }
}

export const buildHlsUrl = (hlsPath) => {
    if (!hlsPath) return ""
    if (hlsPath.startsWith("http")) return hlsPath
    // Avatar uchun ham ishlatish mumkin
    if (hlsPath.startsWith("/media/")) {
        return `${BaseUrlReels}${hlsPath}`
    }
    return `${BaseUrlReels}${hlsPath}`
}

// Like/Unlike a reel. Requires auth. Returns { message, likes_count }
export const toggleLikeReel = async (reelId) => {
    const access = localStorage.getItem("access")
    if (!access) {
        const err = new Error("Unauthorized")
        err.code = "UNAUTHORIZED"
        throw err
    }
    try {
        const { data } = await apiService.post(`/reel/${encodeURIComponent(String(reelId))}/like/`)
        // Expected: { message: "Liked"|"Unliked", likes_count: number }
        return data
    } catch (error) {
        console.error("toggleLikeReel error:", error)
        throw error
    }
}

// Save/Unsave a reel. Requires auth. Returns { message, saved: boolean }
export const toggleSaveReel = async (reelId, isSaved) => {
    const access = localStorage.getItem("access")
    if (!access) {
        const err = new Error("Unauthorized")
        err.code = "UNAUTHORIZED"
        throw err
    }
    try {
        if (isSaved) {
            // Agar saqlangan bo'lsa, DELETE request jo'natish
            const { data } = await apiService.delete(`/reel/${encodeURIComponent(String(reelId))}/save/`)
            console.log(`DELETE /reel/${reelId}/save/ - Unsaved`)
            return { message: "Unsaved", saved: false, ...data }
        } else {
            // Agar saqlanmagan bo'lsa, POST request jo'natish
            const { data } = await apiService.post(`/reel/${encodeURIComponent(String(reelId))}/save/`)
            console.log(`POST /reel/${reelId}/save/ - Saved`)
            return { message: "Saved", saved: true, ...data }
        }
    } catch (error) {
        console.error("toggleSaveReel error:", error)
        throw error
    }
}

// Report a reel. Requires auth. Body: { reason }
export const reportReel = async (reelId, reason) => {
    const access = localStorage.getItem("access")
    if (!access) {
        const err = new Error("Unauthorized")
        err.code = "UNAUTHORIZED"
        throw err
    }
    try {
        const { data } = await apiService.post(`/reel/${encodeURIComponent(String(reelId))}/report/`, { reason })
        return data
    } catch (error) {
        console.error("reportReel error:", error)
        throw error
    }
}

export default { getRandomFeed, buildHlsUrl, toggleLikeReel, toggleSaveReel, reportReel }