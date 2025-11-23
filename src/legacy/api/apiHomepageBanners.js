import apiService from "./apiService"

export const getHomepageBanners = async () => {
  try {
    const { data } = await apiService.get(`/homepage/banners/`)
    // Expecting { banners: [...] }
    return data?.banners || []
  } catch (err) {
    console.error("getHomepageBanners error", err)
    return []
  }
}

export default { getHomepageBanners }
