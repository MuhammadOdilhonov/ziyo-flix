import apiService from "./apiService"

// Teacher Tests API
export const teacherTestsAPI = {
    // Testlar ro'yxatini olish
    getChannelTests: async (channelSlug, params = {}) => {
        try {
            console.log(`fetchTests called with: {channelSlug: "${channelSlug}", params:`, params, '}')
            const url = `/teacher/${channelSlug}/tests/`
            console.log('API URL:', url)
            
            const response = await apiService.get(url, { params })
            console.log('Tests response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching tests:', error)
            // Mock data fallback - Real API formatiga mos
            return {
                count: 3,
                next: null,
                previous: null,
                results: [
                    {
                        id: 1,
                        title: "JavaScript Asoslari Testi",
                        description: "JavaScript ning asosiy tushunchalari",
                        type: "video",
                        course: {
                            id: 1,
                            title: "dasturlash",
                            slug: "dasturlash"
                        },
                        questions_count: 10,
                        time_limit: 30,
                        attempts_count: 45,
                        pass_rate: 78.0,
                        avg_score: 82.5,
                        max_score: 100,
                        passing_score: 70,
                        created_at: "2024-01-15T10:00:00Z",
                        updated_at: null,
                        is_active: true,
                        difficulty: "beginner",
                        tags: [],
                        creator: {
                            id: 1,
                            username: "behruz",
                            full_name: "behruz"
                        }
                    },
                    {
                        id: 2,
                        title: "React Hooks Testi",
                        description: "React Hooks bo'yicha test",
                        type: "video", 
                        course: {
                            id: 1,
                            title: "dasturlash",
                            slug: "dasturlash"
                        },
                        questions_count: 15,
                        time_limit: 25,
                        attempts_count: 32,
                        pass_rate: 65.0,
                        avg_score: 75.2,
                        max_score: 100,
                        passing_score: 70,
                        created_at: "2024-01-20T14:30:00Z",
                        updated_at: null,
                        is_active: true,
                        difficulty: "intermediate",
                        tags: [],
                        creator: {
                            id: 1,
                            username: "behruz",
                            full_name: "behruz"
                        }
                    },
                    {
                        id: 3,
                        title: "Oylik Baholash Testi",
                        description: "Oylik baholash uchun test",
                        type: "course_type",
                        course: {
                            id: 1,
                            title: "dasturlash",
                            slug: "dasturlash"
                        },
                        questions_count: 25,
                        time_limit: 45,
                        attempts_count: 28,
                        pass_rate: 85.0,
                        avg_score: 88.7,
                        max_score: 100,
                        passing_score: 70,
                        created_at: "2024-01-25T09:15:00Z",
                        updated_at: null,
                        is_active: true,
                        difficulty: "advanced",
                        tags: [],
                        creator: {
                            id: 1,
                            username: "behruz",
                            full_name: "behruz"
                        }
                    }
                ],
                filters: {
                    available_courses: [
                        {
                            id: 1,
                            title: "dasturlash",
                            slug: "dasturlash",
                            tests_count: 3
                        }
                    ],
                    available_types: [
                        {
                            type: "video",
                            label: "Video Testlar",
                            count: 2
                        },
                        {
                            type: "course_type",
                            label: "Oylik Testlar",
                            count: 1
                        }
                    ],
                    difficulty_levels: [
                        {
                            level: "beginner",
                            label: "Boshlang'ich",
                            count: 1
                        },
                        {
                            level: "intermediate",
                            label: "O'rta",
                            count: 1
                        },
                        {
                            level: "advanced",
                            label: "Murakkab",
                            count: 1
                        }
                    ]
                }
            }
        }
    },

    // Test statistikalarini olish
    getTestStats: async (channelSlug) => {
        try {
            console.log(`fetchTestStats called with channelSlug: "${channelSlug}"`)
            const url = `/teacher/${channelSlug}/tests/stats/`
            console.log('API URL:', url)
            
            const response = await apiService.get(url)
            console.log('Test stats response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching test stats:', error)
            // Mock data fallback - Real API formatiga mos
            return {
                overview: {
                    total_tests: 3,
                    total_attempts: 105,
                    total_students: 25,
                    avg_pass_rate: 76.0,
                    avg_completion_time: 1800,
                    active_tests: 3,
                    inactive_tests: 0
                },
                test_types: {
                    video_tests: {
                        count: 2,
                        attempts: 77,
                        pass_rate: 75.0,
                        avg_score: 78.5
                    },
                    course_type_tests: {
                        count: 1,
                        attempts: 28,
                        pass_rate: 85.0,
                        avg_score: 88.7
                    }
                },
                difficulty_breakdown: {
                    beginner: {
                        count: 1,
                        attempts: 45,
                        pass_rate: 78.0,
                        avg_score: 82.5
                    },
                    intermediate: {
                        count: 1,
                        attempts: 32,
                        pass_rate: 65.0,
                        avg_score: 75.2
                    },
                    advanced: {
                        count: 1,
                        attempts: 28,
                        pass_rate: 85.0,
                        avg_score: 88.7
                    }
                },
                course_performance: [
                    {
                        course_id: 1,
                        course_title: "dasturlash",
                        tests_count: 3,
                        total_attempts: 105,
                        pass_rate: 76.0,
                        avg_score: 82.1,
                        students_count: 25
                    }
                ],
                recent_activity: [
                    {
                        test_id: 1,
                        test_title: "JavaScript Asoslari Testi",
                        action: "attempt_completed",
                        student_name: "Alisher Karimov",
                        score: 85.0,
                        timestamp: "2024-02-15T14:30:00Z"
                    },
                    {
                        test_id: 2,
                        test_title: "React Hooks Testi",
                        action: "test_created",
                        timestamp: "2024-02-14T10:15:00Z"
                    }
                ],
                time_series: {
                    daily_attempts: [
                        {
                            date: "2024-02-10",
                            attempts: 12,
                            completions: 10,
                            pass_count: 8
                        },
                        {
                            date: "2024-02-11",
                            attempts: 15,
                            completions: 13,
                            pass_count: 9
                        }
                    ],
                    weekly_performance: [
                        {
                            week: "2024-02-05T00:00:00Z",
                            tests_created: 2
                        }
                    ]
                },
                top_performing_tests: [
                    {
                        test_id: 3,
                        title: "Oylik Baholash Testi",
                        pass_rate: 85.0,
                        attempts: 28
                    },
                    {
                        test_id: 1,
                        title: "JavaScript Asoslari Testi",
                        pass_rate: 78.0,
                        attempts: 45
                    }
                ],
                struggling_areas: [
                    {
                        test_id: 2,
                        title: "React Hooks Testi",
                        pass_rate: 65.0,
                        common_mistakes: [
                            "useState hook noto'g'ri ishlatish",
                            "useEffect dependency array"
                        ]
                    }
                ]
            }
        }
    },

    // Test yaratish
    createTest: async (channelSlug, testData) => {
        try {
            console.log(`createTest called with:`, { channelSlug, testData })
            const url = `/teacher/${channelSlug}/tests/create/`
            console.log('API URL:', url)
            
            const response = await apiService.post(url, testData)
            console.log('Create test response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error creating test:', error)
            throw error
        }
    },

    // Test yangilash
    updateTest: async (channelSlug, testId, testData) => {
        try {
            console.log(`updateTest called with:`, { channelSlug, testId, testData })
            const url = `/teacher/${channelSlug}/tests/${testId}/`
            console.log('API URL:', url)
            
            const response = await apiService.put(url, testData)
            console.log('Update test response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error updating test:', error)
            throw error
        }
    },

    // Test o'chirish
    deleteTest: async (channelSlug, testId) => {
        try {
            console.log(`deleteTest called with:`, { channelSlug, testId })
            const url = `/teacher/${channelSlug}/tests/${testId}/`
            console.log('API URL:', url)
            
            const response = await apiService.delete(url)
            console.log('Delete test response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error deleting test:', error)
            throw error
        }
    },

    // Test batafsil ma'lumotlari
    getTestDetail: async (channelSlug, testId) => {
        try {
            console.log(`getTestDetail called with:`, { channelSlug, testId })
            const url = `/teacher/${channelSlug}/tests/${testId}/`
            console.log('API URL:', url)
            
            const response = await apiService.get(url)
            console.log('Test detail response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching test detail:', error)
            throw error
        }
    },

    // Test urinishlarini olish
    getTestAttempts: async (channelSlug, testId, testType = 'video', params = {}) => {
        try {
            console.log(`getTestAttempts called with:`, { channelSlug, testId, testType, params })
            const url = `/teacher/${channelSlug}/tests/${testType}/${testId}/attempts/`
            console.log('API URL:', url)
            
            const response = await apiService.get(url, { params })
            console.log('Test attempts response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching test attempts:', error)
            console.log('Using mock data for test type:', testType)
            // Mock data fallback - Real API formatiga to'liq mos
            return {
                count: 3,
                next: null,
                previous: null,
                results: [
                    {
                        user: {
                            id: 2,
                            username: "teacherazam",
                            full_name: "Azam Qahramoniy",
                            email: "teacherazam@gmail.com",
                            avatar: "/media/avatars/channels4_profile.jpg"
                        },
                        attempt: 1,
                        score: 100.0,
                        started_at: "2025-10-05T12:01:56.586416Z",
                        completed_at: "2025-10-05T12:01:56.614494Z",
                        answers: [
                            {
                                question_id: 2,
                                question_text: "Savol 1",
                                selected_option: {
                                    id: 3,
                                    text: "A",
                                    order: 1,
                                    is_correct: true
                                },
                                is_correct: true,
                                correct_options: [
                                    {
                                        id: 3,
                                        text: "A",
                                        order: 1,
                                        is_correct: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        user: {
                            id: 3,
                            username: "student_alisher",
                            full_name: "Alisher Karimov",
                            email: "alisher@gmail.com",
                            avatar: "/media/avatars/student1.jpg"
                        },
                        attempt: 1,
                        score: 85.0,
                        started_at: "2025-10-04T14:30:00.000000Z",
                        completed_at: "2025-10-04T14:45:30.000000Z",
                        answers: [
                            {
                                question_id: 2,
                                question_text: "Savol 1",
                                selected_option: {
                                    id: 3,
                                    text: "A",
                                    order: 1,
                                    is_correct: true
                                },
                                is_correct: true,
                                correct_options: [
                                    {
                                        id: 3,
                                        text: "A",
                                        order: 1,
                                        is_correct: true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        user: {
                            id: 4,
                            username: "student_behruz",
                            full_name: "Behruz Developer",
                            email: "behruz@gmail.com",
                            avatar: "/media/avatars/student2.jpg"
                        },
                        attempt: 2,
                        score: 75.0,
                        started_at: "2025-10-03T10:15:00.000000Z",
                        completed_at: "2025-10-03T10:35:45.000000Z",
                        answers: [
                            {
                                question_id: 2,
                                question_text: "Savol 1",
                                selected_option: {
                                    id: 4,
                                    text: "B",
                                    order: 2,
                                    is_correct: false
                                },
                                is_correct: false,
                                correct_options: [
                                    {
                                        id: 3,
                                        text: "A",
                                        order: 1,
                                        is_correct: true
                                    }
                                ]
                            }
                        ]
                    }
                ],
                test: {
                    id: 2,
                    type: "course_type",
                    title: "Oylik test"
                },
                summary: {
                    total_attempts: 3,
                    unique_students: 3,
                    per_student: [
                        {
                            user: {
                                id: 2,
                                full_name: "Azam Qahramoniy",
                                username: "teacherazam"
                            },
                            attempts_count: 1
                        },
                        {
                            user: {
                                id: 3,
                                full_name: "Alisher Karimov",
                                username: "student_alisher"
                            },
                            attempts_count: 1
                        },
                        {
                            user: {
                                id: 4,
                                full_name: "Behruz Developer",
                                username: "student_behruz"
                            },
                            attempts_count: 2
                        }
                    ]
                }
            }
        }
    }
}

export default teacherTestsAPI
