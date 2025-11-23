import apiService from './apiService'

export const teacherVideosAPI = {
    // Get course videos - barcha videolar
    getCourseVideos: async (courseSlug) => {
        try {
            console.log('API call: getCourseVideos for course:', courseSlug)
            const response = await apiService.get(`/get-course-videos/${courseSlug}/`)
            console.log('Course videos response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error fetching course videos:', error)
            throw error
        }
    },

    // Get course type videos - oyga qarab videolar
    getCourseTypeVideos: async (courseSlug, courseTypeSlug) => {
        try {
            console.log('API call: getCourseTypeVideos for course:', courseSlug, 'type:', courseTypeSlug)
            const response = await apiService.get(`/get-course-videos/${courseSlug}/${courseTypeSlug}/`)
            console.log('Course type videos response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error fetching course type videos:', error)
            throw error
        }
    },

    // Create new video
    createVideo: async (videoData) => {
        try {
            console.log('API call: createVideo with data:', videoData)
            
            const formData = new FormData()
            Object.keys(videoData).forEach(key => {
                if (videoData[key] !== null && videoData[key] !== undefined) {
                    formData.append(key, videoData[key])
                }
            })

            const response = await apiService.post('/videos/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            console.log('Create video response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error creating video:', error)
            throw error
        }
    },

    // Update video
    updateVideo: async (videoId, videoData) => {
        try {
            console.log('API call: updateVideo with id:', videoId, 'data:', videoData)
            
            const formData = new FormData()
            Object.keys(videoData).forEach(key => {
                if (videoData[key] !== null && videoData[key] !== undefined) {
                    formData.append(key, videoData[key])
                }
            })

            const response = await apiService.put(`/videos/${videoId}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            console.log('Update video response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error updating video:', error)
            throw error
        }
    },

    // Delete video
    deleteVideo: async (videoId) => {
        try {
            console.log('API call: deleteVideo with id:', videoId)
            const response = await apiService.delete(`/course-videos/${videoId}/`)
            console.log('Delete video response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error deleting video:', error)
            throw error
        }
    },

    // Get video detail
    getVideoDetail: async (videoId) => {
        try {
            console.log('API call: getVideoDetail with id:', videoId)
            const response = await apiService.get(`/videos/${videoId}/`)
            console.log('Video detail response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error fetching video detail:', error)
            throw error
        }
    }
}
