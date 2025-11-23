import apiService, { BaseUrlReels } from "./apiService"

// Build absolute media URLs (e.g., avatars)
export const buildMediaUrl = (path) => {
    if (!path) return ""
    if (path.startsWith("http")) return path
    return `${BaseUrlReels}${path}`
}

// Normalize nested comment structure
const normalizeComment = (comment) => ({
    ...comment,
    user: { ...comment.user, avatar: buildMediaUrl(comment?.user?.avatar) },
    replies: (comment?.replies || []).map((r) => normalizeComment(r)),
})

// Fetch comments with pagination support.
// First page: fetchComments(reelId)
// Next page: fetchComments(reelId, nextUrl)
export const fetchComments = async (reelId, nextUrl = null) => {
    try {
        const url = nextUrl || `/reel/${encodeURIComponent(String(reelId))}/comments/`
        const { data } = await apiService.get(url)
        return {
            ...data,
            results: (data?.results || []).map((c) => normalizeComment(c)),
        }
    } catch (error) {
        console.error("fetchComments error:", error)
        return { count: 0, next: null, previous: null, results: [] }
    }
}

// Post a comment on a reel. Requires auth (access token in localStorage).
// body: { text } or { text, parent_id }
export const postComment = async (reelId, body) => {
    const access = localStorage.getItem("access")
    if (!access) {
        const err = new Error("Unauthorized")
        err.code = "UNAUTHORIZED"
        throw err
    }
    try {
        const { data } = await apiService.post(`/reel/${encodeURIComponent(String(reelId))}/comments/`, body)
        return normalizeComment(data)
    } catch (error) {
        console.error("postComment error:", error)
        throw error
    }
}

export default { fetchComments, postComment, buildMediaUrl }


