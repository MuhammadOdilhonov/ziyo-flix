import apiService from "./apiService"

// Fetch a test by course video ID
export const getTestByVideoId = async (videoId) => {
  try {
    const { data } = await apiService.get(`/tests/by-video/${encodeURIComponent(String(videoId))}/`)
    return data || null
  } catch (err) {
    console.error("getTestByVideoId error", err)
    return null
  }
}

// Submit test answers
export const submitTestAnswers = async ({ test_id, answers }) => {
  try {
    const payload = { test_id, answers }
    const { data } = await apiService.post(`/tests/submit/`, payload)
    return data || null
  } catch (err) {
    console.error("submitTestAnswers error", err)
    throw err
  }
}

// Get current user's test results
export const getMyTestResults = async () => {
  try {
    const { data } = await apiService.get(`/tests/my-results/`)
    // Expecting { results: [...] }
    return data?.results || []
  } catch (err) {
    console.error("getMyTestResults error", err)
    return []
  }
}

export default { getTestByVideoId, submitTestAnswers, getMyTestResults }
