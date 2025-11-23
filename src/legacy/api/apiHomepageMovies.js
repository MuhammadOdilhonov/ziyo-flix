import apiService from "./apiService"

export const getHomepageMovies = async () => {
  try {
    const { data } = await apiService.get(`/homepage/movies/`)
    // Expecting { movies: [...] }
    return data?.movies || []
  } catch (err) {
    console.error("getHomepageMovies error", err)
    return []
  }
}

export default { getHomepageMovies }
