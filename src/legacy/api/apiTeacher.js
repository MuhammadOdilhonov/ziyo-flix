import apiService from './apiService'

// Teacher Dashboard API endpoints
export const teacherAPI = {
    // Get teacher channels
    getChannels: () => {
        return apiService.get('/teacher/channels/')
    },

    // Create new channel
    createChannel: (channelData) => {
        return apiService.post('/channels/', channelData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    // Update channel
    updateChannel: (channelId, channelData) => {
        return apiService.put(`/channels/${channelId}/`, channelData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    // Delete channel
    deleteChannel: (channelId) => {
        return apiService.delete(`/teacher/channels/${channelId}/`)
    },

    // Get analytics overview
    getAnalyticsOverview: () => {
        return apiService.get('/teacher/analytics/overview/')
    },

    // Get course analytics
    getAnalyticsCourses: () => {
        return apiService.get('/teacher/analytics/courses/')
    },

    // Get engagement analytics
    getAnalyticsEngagement: () => {
        return apiService.get('/teacher/analytics/engagement/')
    },

    // Get courses for specific channel
    getChannelCourses: (channelSlug) => {
        return apiService.get(`/teacher/${channelSlug}/courses/`)
    },

    // Get videos for specific course
    getCourseVideos: (channelSlug, courseSlug) => {
        return apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/videos/`)
    },

    // Get videos by course type
    getCourseTypeVideos: (channelSlug, courseSlug, courseTypeSlug) => {
        return apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/videos/type/${courseTypeSlug}/`)
    },

    // Get video tests
    getVideoTests: (channelSlug, courseSlug, videoId) => {
        return apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/tests/`)
    },

    // Get video assignments
    getVideoAssignments: (channelSlug, courseSlug, videoId) => {
        return apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/assignments/`)
    },

    // Get video summary
    getVideoSummary: (channelSlug, courseSlug, videoId) => {
        return apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/summary/`)
    },

    // Create test for video
    createVideoTest: (channelSlug, courseSlug, videoId, testData) => {
        return apiService.post(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/tests/`, testData)
    },

    // Update test
    updateVideoTest: (channelSlug, courseSlug, videoId, testId, testData) => {
        return apiService.put(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/tests/${testId}/`, testData)
    },

    // Delete test
    deleteVideoTest: (channelSlug, courseSlug, videoId, testId) => {
        return apiService.delete(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/tests/${testId}/`)
    },

    // Create assignment for video
    createVideoAssignment: (channelSlug, courseSlug, videoId, assignmentData) => {
        return apiService.post(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/assignments/`, assignmentData)
    },

    // Update assignment
    updateVideoAssignment: (channelSlug, courseSlug, videoId, assignmentId, assignmentData) => {
        return apiService.put(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/assignments/${assignmentId}/`, assignmentData)
    },

    // Delete assignment
    deleteVideoAssignment: (channelSlug, courseSlug, videoId, assignmentId) => {
        return apiService.delete(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/assignments/${assignmentId}/`)
    },

    // Grade assignment
    gradeAssignment: (channelSlug, courseSlug, videoId, assignmentId, submissionId, gradeData) => {
        return apiService.post(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/assignments/${assignmentId}/submissions/${submissionId}/grade/`, gradeData)
    },

    // Get assignment submissions
    getAssignmentSubmissions: (channelSlug, courseSlug, videoId, assignmentId) => {
        return apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/assignments/${assignmentId}/submissions/`)
    },

    // Get test results
    getTestResults: (channelSlug, courseSlug, videoId, testId) => {
        return apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/tests/${testId}/results/`)
    }
}

export default teacherAPI
