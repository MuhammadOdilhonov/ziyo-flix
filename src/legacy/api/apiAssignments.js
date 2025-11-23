import apiService from "./apiService"

// Fetch assignments by course video ID (paginated)
export const getAssignmentsByVideo = async (videoId) => {
  try {
    const { data } = await apiService.get(`/assignments/by-video/${encodeURIComponent(String(videoId))}/`)
    // Expecting { count, next, previous, results: [...] }
    return data || { count: 0, next: null, previous: null, results: [] }
  } catch (err) {
    console.error("getAssignmentsByVideo error", err)
    return { count: 0, next: null, previous: null, results: [] }
  }
}

// Submit an assignment (supports file upload)
export const submitAssignment = async ({ assignment_id, text_answer, external_link, attachment, onUploadProgress }) => {
  try {
    const form = new FormData()
    form.append("assignment_id", assignment_id)
    if (text_answer) form.append("text_answer", text_answer)
    if (external_link) form.append("external_link", external_link)
    if (attachment) form.append("attachment", attachment)

    const { data } = await apiService.post(`/assignments/submit/`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onUploadProgress,
    })
    return data || null
  } catch (err) {
    console.error("submitAssignment error", err)
    throw err
  }
}

export default { getAssignmentsByVideo, submitAssignment }
                                                                                                                            