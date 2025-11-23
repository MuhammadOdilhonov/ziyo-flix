import apiService from "./apiService"

// Course Type Tests
export const getCtTestByType = async (courseTypeId) => {
  try {
    const { data } = await apiService.get(`/ct-tests/by-type/${encodeURIComponent(String(courseTypeId))}/`)
    return data || null
  } catch (err) {
    console.error("getCtTestByType error", err)
    throw err
  }
}

export const submitCtTest = async ({ test_id, answers }) => {
  try {
    const { data } = await apiService.post(`/ct-tests/submit/`, { test_id, answers })
    return data || null
  } catch (err) {
    console.error("submitCtTest error", err)
    throw err
  }
}

export const getMyCtTestResults = async ({ test_id, course_type_id } = {}) => {
  try {
    const params = {}
    if (test_id) params.test_id = test_id
    if (course_type_id) params.course_type_id = course_type_id
    const { data } = await apiService.get(`/ct-tests/my-results/`, { params })
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.error("getMyCtTestResults error", err)
    throw err
  }
}

export const getCtTestResultById = async (resultId) => {
  try {
    const { data } = await apiService.get(`/ct-tests/results/${encodeURIComponent(String(resultId))}/`)
    return data || null
  } catch (err) {
    console.error("getCtTestResultById error", err)
    throw err
  }
}

// Course Type Assignments
export const getCtAssignmentByType = async (courseTypeId) => {
  try {
    const { data } = await apiService.get(`/ct-assignments/by-type/${encodeURIComponent(String(courseTypeId))}/`)
    return data || null
  } catch (err) {
    if (err?.response?.status === 404) return null
    console.error("getCtAssignmentByType error", err)
    throw err
  }
}

export const submitCtAssignment = async (formData) => {
  try {
    const { data } = await apiService.post(`/ct-assignments/submit/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data || null
  } catch (err) {
    console.error("submitCtAssignment error", err)
    throw err
  }
}

export default { getCtTestByType, submitCtTest, getMyCtTestResults, getCtTestResultById, getCtAssignmentByType, submitCtAssignment }
