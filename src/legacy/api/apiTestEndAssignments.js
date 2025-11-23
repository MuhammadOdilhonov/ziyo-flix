import apiService from './apiService'

// Test va Assignment API service
export const testAssignmentAPI = {
    // ========== TEST ENDPOINTS ==========
    
    // Test yaratish
    createTest: async (testData) => {
        try {
            const response = await apiService.post('/tests/create/', testData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error creating test:', error)
            throw new Error(error.response?.data?.message || 'Test yaratishda xatolik yuz berdi!')
        }
    },

    // Test ma'lumotlarini olish (yangi endpoint)
    getTest: async (testId, channelSlug, courseSlug, videoId) => {
        try {
            const response = await apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/tests/`)
            return response.data.video_test
        } catch (error) {
            console.error('Error getting test:', error)
            throw new Error(error.response?.data?.message || 'Test ma\'lumotlarini olishda xatolik!')
        }
    },

    // Test ma'lumotlarini olish (eski endpoint - backward compatibility)
    getTestOld: async (testId) => {
        try {
            const response = await apiService.get(`/tests/${testId}/`)
            return response.data
        } catch (error) {
            console.error('Error getting test:', error)
            throw new Error(error.response?.data?.message || 'Test ma\'lumotlarini olishda xatolik!')
        }
    },

    // Test yangilash
    updateTest: async (testId, testData) => {
        try {
            const response = await apiService.patch(`/video-tests/${testId}/`, testData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error updating test:', error)
            throw new Error(error.response?.data?.message || 'Test yangilashda xatolik!')
        }
    },

    // Test savolini yangilash
    updateTestQuestion: async (questionId, questionData) => {
        try {
            const response = await apiService.patch(`/video-test-questions/${questionId}/`, questionData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error updating question:', error)
            throw new Error(error.response?.data?.message || 'Savolni yangilashda xatolik!')
        }
    },

    // Test variantini yangilash
    updateTestOption: async (optionId, optionData) => {
        try {
            const response = await apiService.patch(`/video-test-options/${optionId}/`, optionData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error updating option:', error)
            throw new Error(error.response?.data?.message || 'Variantni yangilashda xatolik!')
        }
    },

    // Test javobini yangilash
    updateTestAnswer: async (answerId, answerData) => {
        try {
            const response = await apiService.patch(`/api/video-test-answers/${answerId}/`, answerData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error updating answer:', error)
            throw new Error(error.response?.data?.message || 'Javobni yangilashda xatolik!')
        }
    },

    // Test natijasini yangilash
    updateTestResult: async (resultId, resultData) => {
        try {
            const response = await apiService.put(`/video-test-results/${resultId}/`, resultData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error updating test result:', error)
            throw new Error(error.response?.data?.message || 'Test natijasini yangilashda xatolik!')
        }
    },

    // ========== ASSIGNMENT ENDPOINTS ==========
    
    // Vazifa yaratish
    createAssignment: async (assignmentData) => {
        try {
            const formData = new FormData()
            
            // Text fields
            Object.keys(assignmentData).forEach(key => {
                if (key !== 'file' && assignmentData[key] !== null && assignmentData[key] !== undefined) {
                    formData.append(key, assignmentData[key])
                }
            })
            
            // File field
            if (assignmentData.file) {
                formData.append('file', assignmentData.file)
            }

            const response = await apiService.post('/assignments/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error creating assignment:', error)
            throw new Error(error.response?.data?.message || 'Vazifa yaratishda xatolik yuz berdi!')
        }
    },

    // Vazifa ma'lumotlarini olish (yangi endpoint)
    getAssignment: async (assignmentId, channelSlug, courseSlug, videoId) => {
        try {
            const response = await apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/assignments/`)
            // assignments array dan assignmentId ga mos keluvchisini topish
            const assignment = response.data.assignments.find(a => a.id === assignmentId)
            return assignment
        } catch (error) {
            console.error('Error getting assignment:', error)
            throw new Error(error.response?.data?.message || 'Vazifa ma\'lumotlarini olishda xatolik!')
        }
    },

    // Vazifa ma'lumotlarini olish (eski endpoint - backward compatibility)
    getAssignmentOld: async (assignmentId) => {
        try {
            const response = await apiService.get(`/assignments/${assignmentId}/`)
            return response.data
        } catch (error) {
            console.error('Error getting assignment:', error)
            throw new Error(error.response?.data?.message || 'Vazifa ma\'lumotlarini olishda xatolik!')
        }
    },

    // Vazifa yangilash
    updateAssignment: async (assignmentId, assignmentData) => {
        try {
            const formData = new FormData()
            
            // Text fields
            Object.keys(assignmentData).forEach(key => {
                if (key !== 'file' && assignmentData[key] !== null && assignmentData[key] !== undefined) {
                    formData.append(key, assignmentData[key])
                }
            })
            
            // File field
            if (assignmentData.file) {
                formData.append('file', assignmentData.file)
            }

            const response = await apiService.patch(`/video-assignments/${assignmentId}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error updating assignment:', error)
            throw new Error(error.response?.data?.message || 'Vazifa yangilashda xatolik!')
        }
    },

    // Vazifa topshiriqini yangilash
    updateAssignmentSubmission: async (submissionId, submissionData) => {
        try {
            const response = await apiService.patch(`/assignment-submissions/${submissionId}/`, submissionData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error updating submission:', error)
            throw new Error(error.response?.data?.message || 'Topshiriqni yangilashda xatolik!')
        }
    },

    // Video uchun testlarni olish (yangi endpoint)
    getVideoTests: async (channelSlug, courseSlug, videoId) => {
        try {
            const response = await apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/tests/`)
            return response.data
        } catch (error) {
            console.error('Error getting video tests:', error)
            return null
        }
    },

    // Video uchun vazifalarni olish (yangi endpoint)
    getVideoAssignments: async (channelSlug, courseSlug, videoId) => {
        try {
            const response = await apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/videos/${videoId}/assignments/`)
            return response.data
        } catch (error) {
            console.error('Error getting video assignments:', error)
            return null
        }
    },

    // Eski metodlar (backward compatibility)
    getVideoTestsOld: async (videoId) => {
        try {
            const response = await apiService.get(`/videos/${videoId}/tests/`)
            return response.data
        } catch (error) {
            console.error('Error getting video tests:', error)
            return []
        }
    },

    getVideoAssignmentsOld: async (videoId) => {
        try {
            const response = await apiService.get(`/videos/${videoId}/assignments/`)
            return response.data
        } catch (error) {
            console.error('Error getting video assignments:', error)
            return []
        }
    }
}

export default testAssignmentAPI
