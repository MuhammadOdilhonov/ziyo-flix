import apiService from './apiService';

// Reports API
export const getReportsOverview = async () => {
    try {
        const response = await apiService.get('/director/reports/overview/');
        return response.data;
    } catch (error) {
        console.error('Error fetching reports overview:', error);
        throw error;
    }
};

// Movie Detail API
export const getMovieDetail = async (slug) => {
    try {
        const response = await apiService.get(`/director/movies/${slug}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie detail:', error);
        throw error;
    }
};

// Create Movie API
export const createMovie = async (formData) => {
    try {
        if (!(formData instanceof FormData)) {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'categories' && Array.isArray(formData[key])) {
                    formData[key].forEach(categoryId => {
                        fd.append('categories', Number(categoryId));
                    });
                } else if (key === 'poster' || key === 'cover') {
                    if (formData[key] && formData[key] instanceof File) {
                        fd.append(key, formData[key]);
                    }
                } else {
                    fd.append(key, formData[key]);
                }
            });
            formData = fd;
        }
        const response = await apiService.post('/director/movies/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating movie:', error);
        throw error;
    }
};

// Update Movie API
export const updateMovie = async (slug, formData) => {
    try {
        if (!(formData instanceof FormData)) {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'categories' && Array.isArray(formData[key])) {
                    formData[key].forEach(categoryId => {
                        fd.append('categories', Number(categoryId));
                    });
                } else if (key === 'poster' || key === 'cover') {
                    if (formData[key] && formData[key] instanceof File) {
                        fd.append(key, formData[key]);
                    }
                } else {
                    fd.append(key, formData[key]);
                }
            });
            formData = fd;
        }
        const response = await apiService.patch(`/director/movies/${slug}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating movie:', error);
        throw error;
    }
};

// Delete Movie API
export const deleteMovie = async (slug) => {
    try {
        const response = await apiService.delete(`/director/movies/${slug}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting movie:', error);
        throw error;
    }
};

// Category Movies API
export const getMovieCategoryDetail = async (slug) => {
    try {
        const response = await apiService.get(`/director/movie-categories/${slug}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie category detail:', error);
        throw error;
    }
};

export const getCategoryMovies = async (slug) => {
    try {
        const response = await apiService.get(`/director/movie-categories/${slug}/movies/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching category movies:', error);
        throw error;
    }
};

export const getMovies = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/director/movies/?${queryString}` : '/director/movies/';
        const response = await apiService.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

// Moderation Courses API
export const getModerationCourses = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/director/moderation/courses/?${queryString}` : '/director/moderation/courses/';
        const response = await apiService.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching moderation courses:', error);
        throw error;
    }
};

export const getModerationCourseTypes = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/director/moderation/course-types/?${queryString}` : '/director/moderation/course-types/';
        const response = await apiService.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching moderation course types:', error);
        throw error;
    }
};

export const getModerationCourseVideos = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/director/moderation/course-videos/?${queryString}` : '/director/moderation/course-videos/';
        const response = await apiService.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching moderation course videos:', error);
        throw error;
    }
};

export const setCourseStatus = async (slug, status) => {
    try {
        const response = await apiService.patch(`/director/moderation/courses/${slug}/set-status/`, { status });
        return response.data;
    } catch (error) {
        console.error('Error setting course status:', error);
        throw error;
    }
};

export const setCourseTypeStatus = async (slug, status) => {
    try {
        const response = await apiService.patch(`/director/moderation/course-types/${slug}/set-status/`, { status });
        return response.data;
    } catch (error) {
        console.error('Error setting course type status:', error);
        throw error;
    }
};

export const setCourseVideoStatus = async (id, status, reason = null) => {
    try {
        const body = { status };
        if (reason) body.reason = reason;
        const response = await apiService.patch(`/director/moderation/course-videos/${id}/set-status/`, body);
        return response.data;
    } catch (error) {
        console.error('Error setting course video status:', error);
        throw error;
    }
};

export const setCourseReason = async (slug, reason) => {
    try {
        const response = await apiService.patch(`/director/moderation/courses/${slug}/`, { reason });
        return response.data;
    } catch (error) {
        console.error('Error setting course reason:', error);
        throw error;
    }
};

export const setCourseTypeReason = async (slug, reason) => {
    try {
        const response = await apiService.patch(`/director/moderation/course-types/${slug}/`, { reason });
        return response.data;
    } catch (error) {
        console.error('Error setting course type reason:', error);
        throw error;
    }
};

// Promo Codes API
export const getPromoCodes = async () => {
    try {
        const response = await apiService.get('/director/promo-codes/');
        return response.data;
    } catch (error) {
        console.error('Error fetching promo codes:', error);
        throw error;
    }
};

export const createPromoCode = async (formData) => {
    try {
        const response = await apiService.post('/director/promo-codes/', formData);
        return response.data;
    } catch (error) {
        console.error('Error creating promo code:', error);
        throw error;
    }
};

export const updatePromoCode = async (id, formData) => {
    try {
        const response = await apiService.patch(`/director/promo-codes/${id}/`, formData);
        return response.data;
    } catch (error) {
        console.error('Error updating promo code:', error);
        throw error;
    }
};

export const deletePromoCode = async (id) => {
    try {
        const response = await apiService.delete(`/director/promo-codes/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting promo code:', error);
        throw error;
    }
};

// Banners API
export const getBanners = async () => {
    try {
        const response = await apiService.get('/director/banners/');
        return response.data;
    } catch (error) {
        console.error('Error fetching banners:', error);
        throw error;
    }
};

export const createBanner = async (formData) => {
    try {
        const response = await apiService.post('/director/banners/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating banner:', error);
        throw error;
    }
};

export const updateBanner = async (id, formData) => {
    try {
        const response = await apiService.patch(`/director/banners/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating banner:', error);
        throw error;
    }
};

export const deleteBanner = async (id) => {
    try {
        const response = await apiService.delete(`/director/banners/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting banner:', error);
        throw error;
    }
};

// Course Categories API
export const getCourseCategories = async () => {
    try {
        const response = await apiService.get('/director/course-categories/');
        return response.data;
    } catch (error) {
        console.error('Error fetching course categories:', error);
        throw error;
    }
};

export const createCourseCategory = async (formData) => {
    try {
        if (!(formData instanceof FormData)) {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'category_img' || key === 'category_banner') {
                    if (formData[key] && formData[key] instanceof File) {
                        fd.append(key, formData[key]);
                    }
                } else if (formData[key] !== undefined && formData[key] !== null) {
                    fd.append(key, formData[key]);
                }
            });
            formData = fd;
        }
        const response = await apiService.post('/director/course-categories/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating course category:', error);
        throw error;
    }
};

export const updateCourseCategory = async (id, formData) => {
    try {
        if (!(formData instanceof FormData)) {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'category_img' || key === 'category_banner') {
                    if (formData[key] && formData[key] instanceof File) {
                        fd.append(key, formData[key]);
                    }
                } else if (formData[key] !== undefined && formData[key] !== null) {
                    fd.append(key, formData[key]);
                }
            });
            formData = fd;
        }
        const response = await apiService.patch(`/director/course-categories/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating course category:', error);
        throw error;
    }
};

export const deleteCourseCategory = async (id) => {
    try {
        const response = await apiService.delete(`/director/course-categories/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting course category:', error);
        throw error;
    }
};

// Movie Categories API
export const getMovieCategories = async () => {
    try {
        const response = await apiService.get('/director/movie-categories/');
        return response.data;
    } catch (error) {
        console.error('Error fetching movie categories:', error);
        throw error;
    }
};

export const createMovieCategory = async (formData) => {
    try {
        if (!(formData instanceof FormData)) {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'category_img' || key === 'category_banner') {
                    if (formData[key] && formData[key] instanceof File) {
                        fd.append(key, formData[key]);
                    }
                } else if (formData[key] !== undefined && formData[key] !== null) {
                    fd.append(key, formData[key]);
                }
            });
            formData = fd;
        }
        const response = await apiService.post('/director/movie-categories/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating movie category:', error);
        throw error;
    }
};

export const updateMovieCategory = async (id, formData) => {
    try {
        if (!(formData instanceof FormData)) {
            const fd = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'category_img' || key === 'category_banner') {
                    if (formData[key] && formData[key] instanceof File) {
                        fd.append(key, formData[key]);
                    }
                } else if (formData[key] !== undefined && formData[key] !== null) {
                    fd.append(key, formData[key]);
                }
            });
            formData = fd;
        }
        const response = await apiService.patch(`/director/movie-categories/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating movie category:', error);
        throw error;
    }
};

export const deleteMovieCategory = async (id) => {
    try {
        const response = await apiService.delete(`/director/movie-categories/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting movie category:', error);
        throw error;
    }
};

// Users Management API
export const getUsersByRole = async (params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `/director/users/?${queryString}` : '/director/users/';
        const response = await apiService.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching users by role:', error);
        throw error;
    }
};

export const createUser = async (formData) => {
    try {
        const response = await apiService.post('/director/users/', formData);
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const updateUser = async (id, formData) => {
    try {
        const response = await apiService.patch(`/director/users/${id}/`, formData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await apiService.delete(`/director/users/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};

// Languages (shared)
export const getLanguages = async () => {
    try {
        const response = await apiService.get('/languages/');
        return response.data;
    } catch (error) {
        console.error('Error fetching languages:', error);
        return [];
    }
};

// Movie Files - Chunked Upload
export const uploadMovieChunk = async (formData, onUploadProgress) => {
    try {
        // Primary endpoint (namespaced)
        const response = await apiService.post(
            '/upload-video/',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress
            }
        );
        return response.data;
    } catch (error) {
        // Fallback to generic endpoint if primary fails (e.g., 404)
        try {
            const response2 = await apiService.post(
                '/upload-chunk/',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress
                }
            );
            return response2.data;
        } catch (error2) {
            console.error('Error uploading movie chunk:', error2);
            if (error2?.response?.data) throw error2;
            throw new Error(error2.message || 'Chunk upload failed');
        }
    }
};

export const finishMovieUpload = async (payload) => {
    try {
        // Primary endpoint (namespaced)
        const response = await apiService.post(
            '/director/movies/files/finish-upload/',
            payload
        );
        return response.data;
    } catch (error) {
        // Fallback to generic endpoint
        try {
            const response2 = await apiService.post(
                '/finish-upload/',
                payload
            );
            return response2.data;
        } catch (error2) {
            console.error('Error finishing movie upload:', error2);
            if (error2?.response?.data) throw error2;
            throw new Error(error2.message || 'Finish upload failed');
        }
    }
};

// Channels API (Director)
export const verifyChannel = async (slug, verified = true) => {
    try {
        const response = await apiService.patch(`/director/channels/${encodeURIComponent(slug)}/verify/`, { verified });
        return response.data;
    } catch (error) {
        console.error('Error verifying channel:', error);
        throw error;
    }
};

// Director Reels - Reports list
export const getReelReports = async (params = {}) => {
    try {
        const query = new URLSearchParams(params).toString();
        const url = query ? `/director/reports-reel/?${query}` : '/director/reports-reel/';
        const response = await apiService.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching reels reports:', error);
        throw error;
    }
};

// Director Reels CRUD
export const getDirectorReels = async (params = {}) => {
    try {
        const query = new URLSearchParams(params).toString();
        const url = query ? `/director/reels/?${query}` : '/director/reels/';
        const response = await apiService.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching director reels:', error);
        throw error;
    }
};

export const updateDirectorReel = async (id, payload) => {
    try {
        const response = await apiService.patch(`/director/reels/${id}/`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating director reel:', error);
        throw error;
    }
};

export const deleteDirectorReel = async (id) => {
    try {
        const response = await apiService.delete(`/director/reels/${id}/`);
        return response.data;
    } catch (error) {
        console.error('Error deleting director reel:', error);
        throw error;
    }
};
