import apiService, { BaseUrlReels } from "./apiService"

// 1) Categories
export const getCourseCategories = async () => {
  try {
    const { data } = await apiService.get(`/coursecategories`)
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("getCourseCategories error", err)
    return []
  }
}

// 2) Courses by category (paginated)
export const getCoursesByCategory = async ({ categorySlug, next } = {}) => {
  try {
    const url = next || `/get-courses/coursecategory/${encodeURIComponent(String(categorySlug))}/`
    const { data } = await apiService.get(url)
    return data || { count: 0, next: null, previous: null, results: [] }
  } catch (err) {
    console.error("getCoursesByCategory error", err)
    return { count: 0, next: null, previous: null, results: [] }
  }
}

// 3) Course detail
export const getCourseDetail = async (courseSlug) => {
  try {
    const { data } = await apiService.get(`/courses/${encodeURIComponent(String(courseSlug))}`)
    return data || null
  } catch (err) {
    console.error("getCourseDetail error", err)
    return null
  }
}

// 4) Course types (months)
export const getCourseTypes = async (courseSlug) => {
  try {
    const { data } = await apiService.get(`/get-course-type/${encodeURIComponent(String(courseSlug))}/`)
    return data || { count: 0, next: null, previous: null, results: [] }
  } catch (err) {
    console.error("getCourseTypes error", err)
    return { count: 0, next: null, previous: null, results: [] }
  }
}

// 5) Course videos for a given month type
export const getCourseVideos = async ({ courseSlug, courseTypeSlug, next } = {}) => {
  try {
    const url = next || `/get-course-videos/${encodeURIComponent(String(courseSlug))}/${encodeURIComponent(String(courseTypeSlug))}/`
    const { data } = await apiService.get(url)
    return data || { count: 0, next: null, previous: null, results: [] }
  } catch (err) {
    console.error("getCourseVideos error", err)
    return { count: 0, next: null, previous: null, results: [] }
  }
}

export default { getCourseCategories, getCoursesByCategory, getCourseDetail, getCourseTypes, getCourseVideos }
