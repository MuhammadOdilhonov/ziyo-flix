import apiService, { BaseUrlReels } from "./apiService"

export const buildMedia = (path) => {
    if (!path) return ""
    if (path.startsWith("http")) return path
    return `${BaseUrlReels}${path}`
}

export const getCategories = async () => {
    try {
        const { data } = await apiService.get(`/categories`)
        return (Array.isArray(data) ? data : []).map((c) => ({
            ...c,
            category_img: buildMedia(c.category_img),
        }))
    } catch (err) {
        console.error("getCategories error", err)
        return []
    }
}

export const getCategoryBySlug = async (slug) => {
    try {
        const { data } = await apiService.get(`/categories/${slug}`)
        return data || null
    } catch (err) {
        console.error("getCategoryBySlug error", err)
        return null
    }
}

export default { getCategories, getCategoryBySlug, buildMedia }


