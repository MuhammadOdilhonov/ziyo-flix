import apiService from "./apiService"

// GET /progress/video/<video_id>/
export const getVideoProgress = async (videoId) => {
  try {
    const { data } = await apiService.get(`/progress/video/${encodeURIComponent(String(videoId))}/`)
    return data || null
  } catch (err) {
    console.error("getVideoProgress error", err)
    throw err
  }
}

// PATCH /progress/video/<video_id>/  (POST also allowed)
export const updateVideoProgress = async (videoId, payload) => {
  try {
    const { data } = await apiService.patch(`/progress/video/${encodeURIComponent(String(videoId))}/`, payload)
    return data || null
  } catch (err) {
    console.error("updateVideoProgress error", err)
    throw err
  }
}

// GET /progress/course/<course_slug>/
export const getCourseProgress = async (courseSlug) => {
  try {
    const { data } = await apiService.get(`/progress/course/${encodeURIComponent(String(courseSlug))}/`)
    return data || null
  } catch (err) {
    console.error("getCourseProgress error", err)
    throw err
  }
}

export default { getVideoProgress, updateVideoProgress, getCourseProgress }
