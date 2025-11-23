import apiService from './apiService'

// Video Upload API endpoints
export const videoUploadAPI = {
    // Upload video chunk
    uploadChunk: (formData) => {
        return apiService.post('/course-video/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },

    // Get video status
    getVideoStatus: (videoId) => {
        return apiService.get(`/course-video/${videoId}/status/`)
    },

    // Get video stream URL
    getVideoStream: (videoId) => {
        return apiService.get(`/course-video/${videoId}/stream/`)
    },

    // Update video metadata
    updateVideoMetadata: (videoId, metadata) => {
        return apiService.put(`/course-video/${videoId}/`, metadata)
    },

    // Delete video
    deleteVideo: (videoId) => {
        return apiService.delete(`/course-video/${videoId}/`)
    },

    // Get video details
    getVideoDetails: (videoId) => {
        return apiService.get(`/course-video/${videoId}/`)
    }
}

export default videoUploadAPI
