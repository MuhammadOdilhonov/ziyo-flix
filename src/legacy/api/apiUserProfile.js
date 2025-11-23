import apiService from "./apiService"

/**
 * Saqlangan reelslarni olish
 * GET /saved-reels/
 */
export const getSavedReels = async () => {
    try {
        const { data } = await apiService.get("/saved-reels/")
        console.log("Saved reels:", data)
        return data
    } catch (error) {
        console.error("getSavedReels error:", error)
        throw error
    }
}

/**
 * Reel batafsil ma'lumotlarini olish
 * GET /reels/{reel_id}/
 */
export const getReelDetail = async (reelId) => {
    try {
        const { data } = await apiService.get(`/reels/${reelId}/`)
        console.log("Reel detail:", data)
        return data
    } catch (error) {
        console.error("getReelDetail error:", error)
        throw error
    }
}

/**
 * Reel commentlarini olish
 * GET /reel/{reel_id}/comments/
 */
export const getReelComments = async (reelId) => {
    try {
        const { data } = await apiService.get(`/reel/${reelId}/comments/`)
        console.log("Reel comments:", data)
        return data
    } catch (error) {
        console.error("getReelComments error:", error)
        throw error
    }
}

/**
 * Reel ga comment qo'shish
 * POST /reel/{reel_id}/comments/
 */
export const addReelComment = async (reelId, commentText) => {
    try {
        const { data } = await apiService.post(`/reel/${reelId}/comments/`, {
            text: commentText
        })
        console.log("Comment added:", data)
        return data
    } catch (error) {
        console.error("addReelComment error:", error)
        throw error
    }
}

/**
 * User likes va comments olish
 * GET /likes-comments/
 */
export const getLikesAndComments = async () => {
    try {
        const { data } = await apiService.get("/likes-comments/")
        console.log("Likes and comments:", data)
        return data
    } catch (error) {
        console.error("getLikesAndComments error:", error)
        throw error
    }
}

/**
 * Yuborgan vazifalarni olish
 * GET /submitted-assignments/
 */
export const getSubmittedAssignments = async () => {
    try {
        const { data } = await apiService.get("/submitted-assignments/")
        console.log("Submitted assignments:", data)
        return data
    } catch (error) {
        console.error("getSubmittedAssignments error:", error)
        throw error
    }
}

/**
 * Test natijalari olish
 * GET /test-results/
 */
export const getTestResults = async () => {
    try {
        const { data } = await apiService.get("/test-results/")
        console.log("Test results:", data)
        return data
    } catch (error) {
        console.error("getTestResults error:", error)
        throw error
    }
}

/**
 * Sotib olingan kurslarni olish
 * GET /purchases/
 */
export const getPurchasedCourses = async () => {
    try {
        const { data } = await apiService.get("/purchases/")
        console.log("Purchased courses:", data)
        return data
    } catch (error) {
        console.error("getPurchasedCourses error:", error)
        throw error
    }
}

/**
 * Test natijalari batafsil olish
 * GET /test-result/{test_id}/
 */
export const getTestResultDetail = async (testId) => {
    try {
        const { data } = await apiService.get(`/test-result/${testId}/`)
        console.log("Test result detail:", data)
        return data
    } catch (error) {
        console.error("getTestResultDetail error:", error)
        throw error
    }
}

/**
 * Yuborgan vazifa batafsil olish
 * GET /submitted-assignments/{assignment_id}/
 */
export const getSubmittedAssignmentDetail = async (assignmentId) => {
    try {
        const { data } = await apiService.get(`/submitted-assignments/${assignmentId}/`)
        console.log("Submitted assignment detail:", data)
        return data
    } catch (error) {
        console.error("getSubmittedAssignmentDetail error:", error)
        throw error
    }
}

export default {
    getSavedReels,
    getReelDetail,
    getReelComments,
    addReelComment,
    getLikesAndComments,
    getSubmittedAssignments,
    getTestResults,
    getPurchasedCourses,
    getTestResultDetail,
    getSubmittedAssignmentDetail,
}
