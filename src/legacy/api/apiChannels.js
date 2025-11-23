import apiService from "./apiService"

// GET /channels/
export const getChannels = async (params = {}) => {
  try {
    const { data } = await apiService.get(`/channels/`, { params })
    return data
  } catch (err) {
    console.error("getChannels error", err)
    throw err
  }
}

// GET /channels/<slug>/about/
export const getChannelAbout = async (slug) => {
  try {
    const { data } = await apiService.get(`/channels/${encodeURIComponent(slug)}/about/`)
    return data
  } catch (err) {
    console.error("getChannelAbout error", err)
    throw err
  }
}

// GET /channels/<slug>/courses/
export const getChannelCourses = async (slug, params = {}) => {
  try {
    const { data } = await apiService.get(`/channels/${encodeURIComponent(slug)}/courses/`, { params })
    return data
  } catch (err) {
    console.error("getChannelCourses error", err)
    throw err
  }
}

// GET /channels/<slug>/reels/
export const getChannelReels = async (slug, params = {}) => {
  try {
    const { data } = await apiService.get(`/channels/${encodeURIComponent(slug)}/reels/`, { params })
    return data
  } catch (err) {
    console.error("getChannelReels error", err)
    throw err
  }
}

export default { getChannels, getChannelAbout, getChannelCourses, getChannelReels }
