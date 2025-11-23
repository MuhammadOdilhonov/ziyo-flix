import apiService from "./apiService"

export const getAllMovies = async ({ next } = {}) => {
    try {
        const url = next || `/get-movies/`
        const { data } = await apiService.get(url)
        return data || { count: 0, next: null, previous: null, results: [] }
    } catch (err) {
        console.error("getAllMovies error", err)
        return { count: 0, next: null, previous: null, results: [] }
    }
}

export const getMoviesByCategory = async ({ slug, next } = {}) => {
    try {
        const url = next || `/get-movies/category/${encodeURIComponent(String(slug))}`
        const { data } = await apiService.get(url)
        return data || { count: 0, next: null, previous: null, results: [] }
    } catch (err) {
        console.error("getMoviesByCategory error", err)
        return { count: 0, next: null, previous: null, results: [] }
    }
}

export const getMovieDetail = async (slug) => {
    try {
        const { data } = await apiService.get(`/get-movies/${encodeURIComponent(String(slug))}`)
        return data
    } catch (err) {
        console.error("getMovieDetail error", err)
        return null
    }
}

export default { getAllMovies, getMoviesByCategory, getMovieDetail }


