import apiService from "./apiService"

export const getHomepageChannels = async () => {
  try {
    const { data } = await apiService.get(`/homepage/channels/`)
    // Expecting { channels: [...] }
    return data?.channels || []
  } catch (err) {
    console.error("getHomepageChannels error", err)
    return []
  }
}

export default { getHomepageChannels }
