import apiService from './apiService'

export const teacherCoursesAPI = {
    // Get channel courses - sizning bergan API
    getChannelCourses: async (channelSlug) => {
        try {
            console.log('API call: getChannelCourses with slug:', channelSlug)
            const response = await apiService.get(`/teacher/${channelSlug}/courses/`)
            console.log('API response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error fetching channel courses:', error)
            throw error
        }
    },

    // Get course categories - sizning bergan API
    getCourseCategories: async () => {
        try {
            console.log('API call: getCourseCategories')
            const response = await apiService.get('/coursecategories/')
            console.log('Categories API response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error fetching course categories:', error)
            throw error
        }
    },

    // Get course types (months)
    getCourseTypes: async (courseSlug) => {
        try {
            console.log('API call: getCourseTypes for course:', courseSlug)
            const response = await apiService.get(`/get-course-type/${courseSlug}/`)
            console.log('Course types response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error fetching course types:', error)
            throw error
        }
    },

    // Create course type (month)
    createCourseType: async (courseTypeData) => {
        try {
            console.log('API call: createCourseType with data:', courseTypeData)
            
            const formData = {
                course: parseInt(courseTypeData.course),
                name: courseTypeData.name,
                slug: courseTypeData.slug,
                description: courseTypeData.description,
                created_by: parseInt(courseTypeData.created_by),
                price: courseTypeData.price ? parseFloat(courseTypeData.price) : null
            }

            const response = await apiService.post('/coursetypes/', formData)
            console.log('Create course type response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error creating course type:', error)
            throw error
        }
    },

    // Update course type (month)
    updateCourseType: async (courseTypeSlug, courseTypeData) => {
        try {
            console.log('API call: updateCourseType with slug:', courseTypeSlug, 'data:', courseTypeData)
            
            const formData = {
                course: parseInt(courseTypeData.course),
                name: courseTypeData.name,
                slug: courseTypeData.slug,
                description: courseTypeData.description,
                created_by: parseInt(courseTypeData.created_by),
                price: courseTypeData.price ? parseFloat(courseTypeData.price) : null
            }

            const response = await apiService.patch(`/coursetypes/${courseTypeSlug}/`, formData)
            console.log('Update course type response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error updating course type:', error)
            throw error
        }
    },

    // Delete course type (month)
    deleteCourseType: async (courseTypeSlug) => {
        try {
            console.log('API call: deleteCourseType with slug:', courseTypeSlug)
            const response = await apiService.delete(`/coursetypes/${courseTypeSlug}/`)
            console.log('Delete course type response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error deleting course type:', error)
            throw error
        }
    },

    // Get course detail by slug
    getCourseDetail: async (slug) => {
        try {
            const response = await apiService.get(`/courses/${slug}/`)
            return response.data
        } catch (error) {
            console.error('Error fetching course detail:', error)
            throw error
        }
    },
    // Create new course - sizning bergan API
    createCourse: async (courseData) => {
        try {
            console.log('API call: createCourse with data:', courseData)
            console.log('Course data keys:', Object.keys(courseData))
            console.log('Categories array:', courseData.categories)

            // Data ni to'g'ri formatga keltirish
            const cleanData = {
                title: courseData.title,
                slug: courseData.slug,
                description: courseData.description,
                language: parseInt(courseData.language), // Integer ga o'tkazish
                categories: courseData.categories, // [2, 5] format
                is_free: courseData.is_free,
                price: courseData.purchase_scope === 'course' && !courseData.is_free ? parseFloat(courseData.price) : null,
                level: courseData.level,
                is_new: courseData.is_new,
                is_bestseller: courseData.is_bestseller,
                is_serial: courseData.is_serial,
                certificate_available: courseData.certificate_available,
                channel: courseData.channel,
                purchase_scope: courseData.purchase_scope || 'course'
            }

            // Agar file upload bo'lsa, FormData ishlatamiz
            if (courseData.cover || courseData.thumbnail) {
                const form = new FormData()
                Object.keys(cleanData).forEach(key => {
                    if (key === 'categories' && Array.isArray(cleanData[key])) {
                        cleanData[key].forEach(categoryId => {
                            form.append('categories', categoryId)
                        })
                    } else if (cleanData[key] !== null && cleanData[key] !== undefined) {
                        form.append(key, cleanData[key])
                    }
                })

                if (courseData.cover) form.append('cover', courseData.cover)
                if (courseData.thumbnail) form.append('thumbnail', courseData.thumbnail)

                console.log('Sending FormData to API...')
                const response = await apiService.post('/courses/', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
                console.log('API Response (with files):', response.data)
                return response.data
            } else {
                console.log('Sending JSON data to API:', cleanData)
                const response = await apiService.post('/courses/', cleanData)
                console.log('API Response (JSON):', response.data)
                return response.data
            }
        } catch (error) {
            console.error('Error creating course:', error)
            console.log('API failed, returning mock response for development...')
            
            // Mock response for development
            const mockResponse = {
                id: Date.now(),
                title: courseData.title,
                slug: courseData.slug || courseData.title.toLowerCase().replace(/\s+/g, '-'),
                description: courseData.description,
                language: courseData.language,
                categories: courseData.categories,
                is_free: courseData.is_free,
                price: courseData.price,
                level: courseData.level,
                is_new: courseData.is_new,
                is_bestseller: courseData.is_bestseller,
                is_serial: courseData.is_serial,
                certificate_available: courseData.certificate_available,
                purchase_scope: courseData.purchase_scope || 'course',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                students_count: 0,
                lessons_count: 0,
                cover: null,
                thumbnail: null
            }
            
            console.log('Returning mock course:', mockResponse)
            return mockResponse
        }
    },

    // Update course
    updateCourse: async (courseslug, courseData) => {
        try {
            console.log('API call: updateCourse with data:', courseData)

            // Data ni to'g'ri formatga keltirish
            const cleanData = {
                title: courseData.title,
                slug: courseData.slug,
                description: courseData.description,
                language: parseInt(courseData.language),
                categories: courseData.categories,
                is_free: courseData.is_free,
                price: courseData.purchase_scope === 'course' && !courseData.is_free ? parseFloat(courseData.price) : null,
                level: courseData.level,
                is_new: courseData.is_new,
                is_bestseller: courseData.is_bestseller,
                is_serial: courseData.is_serial,
                certificate_available: courseData.certificate_available,
                channel: parseInt(courseData.channel), // Channel ID qo'shildi
                purchase_scope: courseData.purchase_scope || 'course'
            }

            const formData = new FormData()

            Object.keys(cleanData).forEach(key => {
                if (key === 'categories') {
                    cleanData[key].forEach(categoryId => {
                        formData.append('categories', categoryId)
                    })
                } else if (cleanData[key] !== null && cleanData[key] !== undefined) {
                    formData.append(key, cleanData[key])
                }
            })

            // File upload
            if (courseData.cover) formData.append('cover', courseData.cover)
            if (courseData.thumbnail) formData.append('thumbnail', courseData.thumbnail)

            const response = await apiService.put(`/courses/${courseslug}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data
        } catch (error) {
            console.error('Error updating course:', error)
            throw error
        }
    },

    // Delete course
    deleteCourse: async (courseId) => {
        try {
            const response = await apiService.delete(`/courses/${courseId}/`)
            return response.data
        } catch (error) {
            console.error('Error deleting course:', error)
            throw error
        }
    },

    // Get languages - agar API bo'lmasa, bo'sh array qaytaradi
    getLanguages: async () => {
        try {
            console.log('API call: getLanguages')
            // Agar languages API mavjud bo'lsa
            const response = await apiService.get('/languages/')
            console.log('Languages API response:', response)
            return response.data || response
        } catch (error) {
            console.error('Error fetching languages:', error)
            // Languages API bo'lmasa, bo'sh array qaytaradi
            return []
        }
    }
}
