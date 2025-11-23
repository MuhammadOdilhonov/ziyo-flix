import  apiService  from './apiService'

export const courseTypeTestsAPI = {
    // Test yaratish
    createTest: async (testData) => {
        try {
            const response = await apiService.post('/ct-tests/create/', testData)
            return response.data
        } catch (error) {
            console.error('Error creating test:', error)
            throw error
        }
    },

    // Course type bo'yicha testlarni olish
    getTestsByCourseType: async (channelSlug, courseSlug, courseTypeSlug) => {
        try {
            const response = await apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/course-types/${courseTypeSlug}/ct-tests/`)
            return response.data
        } catch (error) {
            console.error('Error fetching tests:', error)
            throw error
        }
    },

    // Testni o'chirish
    deleteTest: async (testId) => {
        try {
            const response = await apiService.delete(`/ct-tests/${testId}/`)
            return response.data
        } catch (error) {
            console.error('Error deleting test:', error)
            throw error
        }
    },

    // Test natijalarini olish
    getTestResults: async (testId) => {
        try {
            const response = await apiService.get(`/ct-tests/${testId}/results/`)
            return response.data
        } catch (error) {
            console.error('Error fetching test results:', error)
            throw error
        }
    }
}
