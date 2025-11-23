import apiService from './apiService'

// Teacher Reels API service
export const teacherReelsAPI = {
    // ========== REELS ENDPOINTS ==========
    
    // Kanal reelslarini olish
    getChannelReels: async (channelSlug) => {
        try {
            const response = await apiService.get(`/teacher/${channelSlug}/reels/`)
            return response.data
        } catch (error) {
            console.error('Error getting channel reels:', error)
            throw new Error(error.response?.data?.message || 'Reelslarni olishda xatolik!')
        }
    },

    // Reel batafsil ma'lumotlari
    getReelSummary: async (channelSlug, reelId) => {
        try {
            const response = await apiService.get(`/teacher/${channelSlug}/reels/${reelId}/summary/`)
            return response.data
        } catch (error) {
            console.error('Error getting reel summary:', error)
            throw new Error(error.response?.data?.message || 'Reel ma\'lumotlarini olishda xatolik!')
        }
    },

    // Reel yaratish
    createReel: async (channelSlug, reelData) => {
        try {
            const formData = new FormData()
            
            console.log('API createReel called with:', { channelSlug, reelData })
            
            // Video file (required) - try both field names
            if (reelData.file) {
                formData.append('file', reelData.file)
                formData.append('video', reelData.file)
                console.log('Video file added as both "file" and "video":', reelData.file.name, reelData.file.size)
            } else {
                console.error('No file provided in reelData:', reelData)
            }
            
            // Required fields
            formData.append('reel_type_id_or_slug', reelData.reel_type_id_or_slug || 'default')
            formData.append('channel_id', reelData.channel_id)
            
            console.log('Required fields added:', {
                reel_type_id_or_slug: reelData.reel_type_id_or_slug || 'default',
                channel_id: reelData.channel_id
            })
            
            // Text fields
            Object.keys(reelData).forEach(key => {
                if (key !== 'file' && key !== 'video' && key !== 'reel_type_id_or_slug' && key !== 'channel_id' && 
                    reelData[key] !== null && reelData[key] !== undefined) {
                    formData.append(key, reelData[key])
                    console.log(`Added field ${key}:`, reelData[key])
                }
            })

            // Debug FormData contents
            console.log('FormData contents:')
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    console.log(`${key}:`, `File(${value.name}, ${value.size} bytes, ${value.type})`)
                } else {
                    console.log(`${key}:`, value)
                }
            }
            
            console.log('Sending POST request to /reel/upload/')
            
            const response = await apiService.post(`/reel/upload/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            console.log('Upload response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error creating reel:', error)
            console.error('Error response:', error.response?.data)
            throw new Error(error.response?.data?.message || 'Reel yaratishda xatolik!')
        }
    },

    // Reel yangilash
    updateReel: async (channelSlug, reelId, reelData) => {
        try {
            const response = await apiService.patch(`/teacher/${channelSlug}/reels/${reelId}/`, reelData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error updating reel:', error)
            throw new Error(error.response?.data?.message || 'Reel yangilashda xatolik!')
        }
    },

    // Reel o'chirish
    deleteReel: async (channelSlug, reelId) => {
        try {
            const response = await apiService.delete(`/reels/${reelId}/`)
            return response.data
        } catch (error) {
            console.error('Error deleting reel:', error)
            throw new Error(error.response?.data?.message || 'Reel o\'chirishda xatolik!')
        }
    },

    // Reel statistikalari
    getReelStats: async (channelSlug, reelId) => {
        try {
            const response = await apiService.get(`/teacher/${channelSlug}/reels/${reelId}/stats/`)
            return response.data
        } catch (error) {
            console.error('Error getting reel stats:', error)
            throw new Error(error.response?.data?.message || 'Reel statistikalarini olishda xatolik!')
        }
    }
}

export default teacherReelsAPI
