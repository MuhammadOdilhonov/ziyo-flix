import apiService from './apiService'

export const teacherStudentsAPI = {
    // O'quvchilar ro'yxatini olish
    getStudents: async (channelSlug, courseSlug, params = {}) => {
        try {
            console.log('Fetching students for:', { channelSlug, courseSlug, params })
            const queryParams = new URLSearchParams(params).toString()
            const url = `/teacher/${channelSlug}/courses/${courseSlug}/students/${queryParams ? `?${queryParams}` : ''}`
            console.log('API URL:', url)
            const response = await apiService.get(url)
            console.log('Students response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching students:', error.response?.data || error.message)
            // Mock data for testing
            
        }
    },

    // O'quvchilar statistikasini olish
    getStudentsStats: async (channelSlug, courseSlug, windowDays = 30) => {
        try {
            console.log('Fetching students stats for:', { channelSlug, courseSlug, windowDays })
            const response = await apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/students/stats/?window_days=${windowDays}`)
            console.log('Stats response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching students stats:', error.response?.data || error.message)
            // Mock data for testing
            return {
                course: {
                    id: 1,
                    title: "Test Course"
                },
                window_days: windowDays,
                students: {
                    total: 15,
                    new_in_window: 5,
                    purchases_daily: [
                        { day: "2025-10-01", count: 2, buyers: 2 },
                        { day: "2025-10-02", count: 1, buyers: 1 },
                        { day: "2025-10-03", count: 3, buyers: 3 }
                    ]
                },
                revenue: {
                    total: 450.0,
                    in_window: 280.0,
                    daily: [
                        { day: "2025-10-01", amount: 120.0 },
                        { day: "2025-10-02", amount: 80.0 },
                        { day: "2025-10-03", amount: 80.0 }
                    ]
                },
                engagement: {
                    progress_daily: [
                        { day: "2025-10-05", events: 8, active_learners: 6 }
                    ],
                    tests_daily: {
                        video: [
                            { day: "2025-10-05", attempts: 12, passed: 10 }
                        ],
                        course_type: [
                            { day: "2025-10-05", attempts: 5, passed: 4 }
                        ]
                    },
                    submissions_daily: {
                        video: [
                            { day: "2025-10-05", count: 3 }
                        ],
                        course_type: []
                    }
                }
            }
        }
    },

    // O'quvchi faoliyatini olish
    getStudentActivity: async (channelSlug, courseSlug, userId) => {
        try {
            console.log('Fetching student activity for:', { channelSlug, courseSlug, userId })
            const response = await apiService.get(`/teacher/${channelSlug}/courses/${courseSlug}/students/${userId}/activity/`)
            console.log('Activity response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching student activity:', error.response?.data || error.message)
            // Mock data for testing
            return {
                course: {
                    id: 1,
                    title: "Test Course"
                },
                activity: {
                    student: {
                        id: userId,
                        username: "teststudent",
                        full_name: "Test Student",
                        email: "test@student.com",
                        avatar: null
                    },
                    video_test_results: [
                        {
                            id: 1,
                            test_title: "Video Test 1",
                            attempt: 1,
                            score: 85.0,
                            started_at: "2025-10-05T10:00:00Z",
                            completed_at: "2025-10-05T10:15:00Z"
                        },
                        {
                            id: 2,
                            test_title: "Video Test 2", 
                            attempt: 2,
                            score: 92.0,
                            started_at: "2025-10-05T11:00:00Z",
                            completed_at: "2025-10-05T11:20:00Z"
                        }
                    ],
                    course_type_test_results: [
                        {
                            id: 3,
                            test_title: "Oylik Test",
                            attempt: 1,
                            score: 78.0,
                            started_at: "2025-10-05T12:00:00Z",
                            completed_at: "2025-10-05T12:30:00Z"
                        }
                    ],
                    assignment_submissions: [
                        {
                            id: 1,
                            student: {
                                id: userId,
                                username: "teststudent",
                                full_name: "Test Student",
                                email: "test@student.com",
                                avatar: null
                            },
                            assignment: {
                                id: 1,
                                title: "Test Assignment",
                                description: "Bu test vazifasi",
                                course_title: "Test Course",
                                video_title: "Test Video",
                                due_days_after_completion: 7,
                                max_points: 100
                            },
                            text_answer: "Bu mening javobim",
                            attachment: null,
                            external_link: "https://github.com/student/project",
                            submitted_at: "2025-10-05T14:00:00Z",
                            grade: 85,
                            feedback: "Yaxshi ish!",
                            graded_by: null,
                            is_graded: true,
                            is_late: false
                        }
                    ]
                }
            }
        }
    },

    // Vazifa bahosini berish
    gradeAssignment: async (submissionId, gradeData) => {
        try {
            console.log('Grading assignment:', { submissionId, gradeData })
            const response = await apiService.patch(`/assignments/submissions/${submissionId}/grade/`, gradeData)
            console.log('Grade response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error grading assignment:', error.response?.data || error.message)
            throw error
        }
    },

    // O'quvchini kursdan chiqarish
    removeStudent: async (channelSlug, courseSlug, userId) => {
        try {
            console.log('Removing student:', { channelSlug, courseSlug, userId })
            const response = await apiService.delete(`/teacher/${channelSlug}/courses/${courseSlug}/students/${userId}/`)
            console.log('Remove response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error removing student:', error.response?.data || error.message)
            throw error
        }
    }
}
