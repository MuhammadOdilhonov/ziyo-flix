import  apiService  from './apiService'

export const courseTypeAssignmentsAPI = {
    // Vazifa yaratish
    createAssignment: async (assignmentData) => {
        try {
            const response = await apiService.post('/ct-assignments/create/', assignmentData)
            return response.data
        } catch (error) {
            console.error('Error creating assignment:', error)
            throw error
        }
    },

    // Course type bo'yicha vazifalarni olish
    getAssignmentsByCourseType: async (courseTypeId) => {
        try {
            const response = await apiService.get(`/ct-assignments/by-type/${courseTypeId}/`)
            return response.data
        } catch (error) {
            console.error('Error fetching assignments:', error)
            throw error
        }
    },

    // Vazifani o'chirish
    deleteAssignment: async (assignmentId) => {
        try {
            const response = await apiService.delete(`/ct-assignments/${assignmentId}/`)
            return response.data
        } catch (error) {
            console.error('Error deleting assignment:', error)
            throw error
        }
    },

    // Vazifa natijalarini olish
    getAssignmentResults: async (assignmentId) => {
        try {
            const response = await apiService.get(`/ct-assignments/${assignmentId}/results/`)
            return response.data
        } catch (error) {
            console.error('Error fetching assignment results:', error)
            throw error
        }
    }
}
