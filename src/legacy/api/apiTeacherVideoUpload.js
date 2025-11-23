import apiService from './apiService'

// Video upload API service
export const teacherVideoUploadAPI = {
    // Chunked video upload
    uploadChunk: async (formData) => {
        try {
            // apiService avtomatik token qo'shadi, shuning uchun alohida qo'shish kerak emas
            const response = await apiService.post('/course-video/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            return response.data
        } catch (error) {
            console.error('Error uploading chunk:', error)
            
            // Xatolik ma'lumotlarini batafsil ko'rsatish
            if (error.response) {
                const errorMessage = error.response.data?.message || error.response.data?.error || `Server xatoligi: ${error.response.status}`
                throw new Error(errorMessage)
            } else if (error.request) {
                throw new Error('Serverga ulanishda xatolik. Internet aloqangizni tekshiring.')
            } else {
                throw new Error('Video yuklashda kutilmagan xatolik yuz berdi.')
            }
        }
    },

    // Check video processing status
    getVideoStatus: async (videoId) => {
        try {
            const response = await apiService.get(`/course-video/${videoId}/status/`)
            return response.data
        } catch (error) {
            console.error('Error getting video status:', error)
            
            if (error.response) {
                const errorMessage = error.response.data?.message || `Server xatoligi: ${error.response.status}`
                throw new Error(errorMessage)
            } else if (error.request) {
                throw new Error('Serverga ulanishda xatolik.')
            } else {
                throw new Error('Video holatini olishda xatolik.')
            }
        }
    },

    // Get video stream URL
    getVideoStream: async (videoId) => {
        try {
            const response = await apiService.get(`/course-video/${videoId}/stream/`)
            return response.data
        } catch (error) {
            console.error('Error getting video stream:', error)
            
            if (error.response) {
                const errorMessage = error.response.data?.message || `Server xatoligi: ${error.response.status}`
                throw new Error(errorMessage)
            } else if (error.request) {
                throw new Error('Serverga ulanishda xatolik.')
            } else {
                throw new Error('Video stream URL olishda xatolik.')
            }
        }
    }
}
