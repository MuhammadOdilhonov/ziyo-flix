import apiService from "./apiService"

// Teacher Assignments API
export const teacherAssignmentsAPI = {
    // Vazifalar ro'yxatini olish
    getChannelAssignments: async (channelSlug, params = {}) => {
        try {
            console.log(`fetchAssignments called with: {channelSlug: "${channelSlug}", params:`, params, '}')
            const url = `/teacher/${channelSlug}/assignments/`
            console.log('API URL:', url)
            
            const response = await apiService.get(url, { params })
            console.log('Assignments response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching assignments:', error)
            // Mock data fallback - Real API formatiga mos
            return {
                count: 3,
                next: null,
                previous: null,
                results: [
                    {
                        id: 1,
                        title: "Homework 1",
                        description: "Solve the problems in the attached PDF.",
                        course: {
                            id: 1,
                            title: "dasturlash",
                            slug: "dasturlash"
                        },
                        due_days_after_completion: 7,
                        created_at: "2025-09-20T13:08:50.105495Z",
                        is_active: true,
                        max_score: 100,
                        submissions_count: 2,
                        graded_count: 0,
                        pending_count: 2,
                        avg_score: null,
                        difficulty: "beginner",
                        creator: {
                            id: 1,
                            username: "behruz",
                            full_name: "behruz"
                        },
                        attachment: null
                    },
                    {
                        id: 4,
                        title: "zxczxc",
                        description: "zxczxczxc",
                        course: {
                            id: 1,
                            title: "dasturlash",
                            slug: "dasturlash"
                        },
                        due_days_after_completion: 14,
                        created_at: "2025-10-04T10:25:59.113394Z",
                        is_active: true,
                        max_score: 100,
                        submissions_count: 0,
                        graded_count: 0,
                        pending_count: 0,
                        avg_score: null,
                        difficulty: "beginner",
                        creator: {
                            id: 1,
                            username: "behruz",
                            full_name: "behruz"
                        },
                        attachment: {
                            name: "courses/assignments/shaxsiy_varaqa.docx",
                            file: "/media/courses/assignments/shaxsiy_varaqa.docx",
                            size: 142216
                        }
                    },
                    {
                        id: 3,
                        title: "zxczxczx",
                        description: "czxczxczxczxc",
                        course: {
                            id: 1,
                            title: "dasturlash",
                            slug: "dasturlash"
                        },
                        due_days_after_completion: 10,
                        created_at: "2025-10-04T10:06:21.534613Z",
                        is_active: true,
                        max_score: 100,
                        submissions_count: 0,
                        graded_count: 0,
                        pending_count: 0,
                        avg_score: null,
                        difficulty: "beginner",
                        creator: {
                            id: 1,
                            username: "behruz",
                            full_name: "behruz"
                        },
                        attachment: {
                            name: "courses/assignments/shaxsiy_varaqa_2.docx",
                            file: "/media/courses/assignments/shaxsiy_varaqa_2.docx",
                            size: 263859
                        }
                    }
                ],
                filters: {
                    available_courses: [
                        {
                            id: 1,
                            title: "dasturlash",
                            slug: "dasturlash",
                            assignments_count: 3
                        },
                        {
                            id: 8,
                            title: "Zxzzxvv dsfsd",
                            slug: "zxzzxvv-dsfsd",
                            assignments_count: 0
                        },
                        {
                            id: 9,
                            title: "st dfgd gsdsf",
                            slug: "st-dfgd-gsdsf",
                            assignments_count: 0
                        }
                    ],
                    difficulty_levels: [
                        {
                            level: "advanced",
                            label: "Murakkab",
                            count: 1
                        },
                        {
                            level: "beginner",
                            label: "Boshlang'ich",
                            count: 1
                        },
                        {
                            level: "intermediate",
                            label: "O'rta",
                            count: 1
                        }
                    ],
                    status_options: [
                        {
                            status: "active",
                            label: "Faol",
                            count: 3
                        },
                        {
                            status: "overdue",
                            label: "Muddati o'tgan",
                            count: 1
                        },
                        {
                            status: "completed",
                            label: "Tugagan",
                            count: 0
                        }
                    ]
                }
            }
        }
    },

    // Vazifa statistikalarini olish
    getAssignmentStats: async (channelSlug) => {
        try {
            console.log(`fetchAssignmentStats called with channelSlug: "${channelSlug}"`)
            const url = `/teacher/${channelSlug}/assignments/stats/`
            console.log('API URL:', url)
            
            const response = await apiService.get(url)
            console.log('Assignment stats response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching assignment stats:', error)
            // Mock data fallback - Real API formatiga mos
            return {
                overview: {
                    total_assignments: 3,
                    total_submissions: 2,
                    total_students: 2,
                    avg_score: 0.0,
                    active_assignments: 3,
                    overdue_assignments: 1,
                    completed_assignments: 0,
                    pending_grading: 2
                },
                difficulty_breakdown: {
                    beginner: {
                        count: 3,
                        submissions: 2,
                        avg_score: 0.0
                    },
                    intermediate: {
                        count: 0,
                        submissions: 0,
                        avg_score: 0.0
                    },
                    advanced: {
                        count: 0,
                        submissions: 0,
                        avg_score: 0.0
                    }
                },
                course_performance: [
                    {
                        course_id: 1,
                        course_title: "dasturlash",
                        assignments_count: 3,
                        total_submissions: 2,
                        avg_score: 0.0,
                        students_count: 1
                    },
                    {
                        course_id: 8,
                        course_title: "Zxzzxvv dsfsd",
                        assignments_count: 0,
                        total_submissions: 0,
                        avg_score: 0.0,
                        students_count: 0
                    },
                    {
                        course_id: 9,
                        course_title: "st dfgd gsdsf",
                        assignments_count: 0,
                        total_submissions: 0,
                        avg_score: 0.0,
                        students_count: 0
                    }
                ],
                recent_activity: [
                    {
                        assignment_id: 1,
                        assignment_title: "Homework 1",
                        action: "submission_received",
                        student_name: "Azam Qahramoniy",
                        timestamp: "2025-10-05T11:17:59.694501Z"
                    },
                    {
                        assignment_id: 1,
                        assignment_title: "Homework 1",
                        action: "submission_received",
                        student_name: "behruz",
                        timestamp: "2025-09-20T13:17:06.043085Z"
                    },
                    {
                        assignment_id: 4,
                        assignment_title: "zxczxc",
                        action: "assignment_created",
                        timestamp: "2025-10-04T10:25:59.113394Z"
                    },
                    {
                        assignment_id: 3,
                        assignment_title: "zxczxczx",
                        action: "assignment_created",
                        timestamp: "2025-10-04T10:06:21.534613Z"
                    },
                    {
                        assignment_id: 1,
                        assignment_title: "Homework 1",
                        action: "assignment_created",
                        timestamp: "2025-09-20T13:08:50.105495Z"
                    }
                ],
                time_series: {
                    daily_submissions: [
                        {
                            date: "2025-09-20",
                            submissions: 1,
                            graded: 0
                        },
                        {
                            date: "2025-10-05",
                            submissions: 1,
                            graded: 0
                        }
                    ],
                    weekly_performance: [
                        {
                            week: "2025-09-15T00:00:00Z",
                            assignments_created: 1
                        },
                        {
                            week: "2025-09-29T00:00:00Z",
                            assignments_created: 2
                        }
                    ]
                },
                top_performing_assignments: [
                    {
                        assignment_id: 1,
                        title: "Homework 1",
                        avg_score: 0.0,
                        submissions_count: 2
                    }
                ],
                struggling_areas: [],
                grading_workload: {
                    pending_assignments: [
                        {
                            assignment_id: 1,
                            title: "Homework 1",
                            pending_count: 2,
                            due_days_after_completion: 7
                        }
                    ],
                    overdue_grading: [
                        {
                            assignment_id: 1,
                            title: "Homework 1",
                            overdue_count: 2
                        }
                    ]
                }
            }
        }
    },

    // Vazifa yaratish
    createAssignment: async (channelSlug, assignmentData) => {
        try {
            console.log(`createAssignment called with:`, { channelSlug, assignmentData })
            const url = `/teacher/${channelSlug}/assignments/create/`
            console.log('API URL:', url)
            
            const response = await apiService.post(url, assignmentData)
            console.log('Create assignment response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error creating assignment:', error)
            throw error
        }
    },

    // Vazifa yangilash
    updateAssignment: async (channelSlug, assignmentId, assignmentData) => {
        try {
            console.log(`updateAssignment called with:`, { channelSlug, assignmentId, assignmentData })
            const url = `/teacher/${channelSlug}/assignments/${assignmentId}/`
            console.log('API URL:', url)
            
            const response = await apiService.put(url, assignmentData)
            console.log('Update assignment response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error updating assignment:', error)
            throw error
        }
    },

    // Vazifa o'chirish
    deleteAssignment: async (channelSlug, assignmentId) => {
        try {
            console.log(`deleteAssignment called with:`, { channelSlug, assignmentId })
            const url = `/teacher/${channelSlug}/assignments/${assignmentId}/`
            console.log('API URL:', url)
            
            const response = await apiService.delete(url)
            console.log('Delete assignment response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error deleting assignment:', error)
            throw error
        }
    },

    // Vazifa batafsil ma'lumotlari
    getAssignmentDetail: async (channelSlug, assignmentId) => {
        try {
            console.log(`getAssignmentDetail called with:`, { channelSlug, assignmentId })
            const url = `/teacher/${channelSlug}/assignments/${assignmentId}/`
            console.log('API URL:', url)
            
            const response = await apiService.get(url)
            console.log('Assignment detail response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching assignment detail:', error)
            throw error
        }
    },

    // Vazifa topshiriqlarini olish
    getAssignmentSubmissions: async (channelSlug, assignmentId, params = {}) => {
        try {
            console.log(`getAssignmentSubmissions called with:`, { channelSlug, assignmentId, params })
            const url = `/teacher/${channelSlug}/assignments/${assignmentId}/submissions/`
            console.log('API URL:', url)
            
            const response = await apiService.get(url, { params })
            console.log('Assignment submissions response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching assignment submissions:', error)
            // Mock data fallback
            return {
                count: 5,
                results: [
                    {
                        id: 1,
                        student: {
                            id: 1,
                            full_name: "Alisher Karimov",
                            username: "alisher_k",
                            avatar: "/avatars/alisher.jpg"
                        },
                        text_answer: "Men To-Do List yaratdim. React va localStorage ishlatdim.",
                        attachment: "/submissions/alisher_todo.zip",
                        external_link: "https://github.com/alisher/todo-app",
                        submitted_at: "2024-02-10T15:30:00Z",
                        is_graded: true,
                        grade: 85,
                        is_late: false,
                        feedback: "Yaxshi ish! Kod toza va tushunarli."
                    },
                    {
                        id: 2,
                        student: {
                            id: 2,
                            full_name: "Malika Tosheva",
                            username: "malika_t",
                            avatar: "/avatars/malika.jpg"
                        },
                        text_answer: "Responsive dizayn bilan To-Do List yaratdim.",
                        attachment: "/submissions/malika_todo.zip",
                        external_link: "https://malika-todo.netlify.app",
                        submitted_at: "2024-02-12T09:15:00Z",
                        is_graded: false,
                        grade: null,
                        is_late: false,
                        feedback: null
                    }
                ]
            }
        }
    },

    // Topshiriqni baholash
    gradeSubmission: async (channelSlug, assignmentId, submissionId, gradeData) => {
        try {
            console.log(`gradeSubmission called with:`, { channelSlug, assignmentId, submissionId, gradeData })
            const url = `/teacher/${channelSlug}/assignments/submissions/${submissionId}/grade/`
            console.log('API URL:', url)
            
            const response = await apiService.post(url, gradeData)
            console.log('Grade submission response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error grading submission:', error)
            throw error
        }
    },

    // Kurslar ro'yxatini olish
    getCourses: async (channelSlug) => {
        try {
            console.log(`getCourses called with channelSlug: "${channelSlug}"`)
            const url = `/teacher/${channelSlug}/courses/`
            console.log('API URL:', url)
            
            const response = await apiService.get(url)
            console.log('Courses response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching courses:', error)
            // Mock data fallback - Real API formatiga mos
            return {
                count: 3,
                next: null,
                previous: null,
                results: [
                    {
                        id: 9,
                        title: "st dfgd gsdsf",
                        slug: "st-dfgd-gsdsf",
                        students_count: 0,
                        created_at: "2025-09-28T15:16:54.055130Z",
                        price: null,
                        cover: "/media/courses/covers/Logo_sMeeb1M.jpg",
                        thumbnail: "/media/courses/thumbnails/Xizmatchi.jpg",
                        course_types_count: 0,
                        videos_count: 0,
                        purchase_scope: "course"
                    },
                    {
                        id: 8,
                        title: "Zxzzxvv dsfsd",
                        slug: "zxzzxvv-dsfsd",
                        students_count: 0,
                        created_at: "2025-09-28T15:13:29.497414Z",
                        price: null,
                        cover: "/media/courses/covers/Xizmatchi_39K0QH3.jpg",
                        thumbnail: "/media/courses/thumbnails/Logo_65N25EP.png",
                        course_types_count: 0,
                        videos_count: 0,
                        purchase_scope: "course"
                    },
                    {
                        id: 1,
                        title: "dasturlash",
                        slug: "dasturlash",
                        students_count: 1,
                        created_at: "2025-09-16T14:40:52.089772Z",
                        price: "100.00",
                        cover: "/media/courses/covers/photo_2025-09-09_16-16-14.jpg",
                        thumbnail: "/media/courses/thumbnails/1355035.jpeg",
                        course_types_count: 3,
                        videos_count: 3,
                        purchase_scope: "course_type"
                    }
                ],
                channel: "biringchi kanal"
            }
        }
    }
}

export default teacherAssignmentsAPI
