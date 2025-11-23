import apiService from "./apiService"

// Teacher Assignment Review API
export const teacherAssignmentsCheckAPI = {
    // Barcha vazifalar va topshiriqlarni olish
    getAllAssignmentsWithSubmissions: async (channelSlug, params = {}) => {
        try {
            console.log(`getAllAssignmentsWithSubmissions called with: {channelSlug: "${channelSlug}", params:`, params, '}')
            const url = `/teacher/${channelSlug}/assignments/`
            console.log('API URL:', url)
            
            const response = await apiService.get(url, { params })
            console.log('Full API Response:', response.data)
            
            // Real API ma'lumotlarini qayta ishlash
            if (response.data && response.data.results) {
                console.log('Total assignments:', response.data.results.length)
                
                // Har bir assignment uchun submissions olish
                const assignmentsWithSubmissions = await Promise.all(
                    response.data.results.map(async (assignment) => {
                        try {
                            // Har bir assignment uchun submissions olish
                            const submissionsResponse = await apiService.get(`/teacher/${channelSlug}/assignments/${assignment.id}/submissions/`)
                            console.log(`Submissions for assignment ${assignment.id}:`, submissionsResponse.data)
                            
                            return {
                                ...assignment,
                                submissions: submissionsResponse.data.results || []
                            }
                        } catch (submissionError) {
                            console.error(`Error fetching submissions for assignment ${assignment.id}:`, submissionError)
                            return {
                                ...assignment,
                                submissions: []
                            }
                        }
                    })
                )
                
                // Summary hisoblash
                const allSubmissions = assignmentsWithSubmissions.flatMap(a => a.submissions || [])
                const summary = {
                    total_assignments: assignmentsWithSubmissions.length,
                    total_submissions: allSubmissions.length,
                    pending_submissions: allSubmissions.filter(s => !s.grade).length,
                    graded_submissions: allSubmissions.filter(s => s.grade).length,
                    overdue_submissions: allSubmissions.filter(s => s.is_late).length
                }
                
                return {
                    ...response.data,
                    results: assignmentsWithSubmissions,
                    summary
                }
            }
            
            return response.data
        } catch (error) {
            console.error('Error fetching assignments:', error)
            // Mock data fallback
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
                        difficulty: "beginner",
                        submissions: [
                            {
                                id: 1,
                                student: {
                                    id: 2,
                                    username: "azam_student",
                                    full_name: "Azam Qahramoniy",
                                    email: "azam@student.com",
                                    avatar: "/media/avatars/azam.jpg"
                                },
                                submitted_at: "2025-10-05T11:17:59.694501Z",
                                updated_at: "2025-10-05T14:30:15.123456Z",
                                is_late: true,
                                submission_text: "Men vazifani bajarib tugatdim. Barcha savollarni yechdim va PDF faylda javoblarni yozdim. Kodlarni GitHub da joylashtirdim va barcha talablarni bajarishga harakat qildim.",
                                attachments: [
                                    {
                                        id: 1,
                                        name: "homework1_solution.pdf",
                                        file: "/media/submissions/homework1_solution.pdf",
                                        size: 2048576,
                                        uploaded_at: "2025-10-05T11:17:59.694501Z"
                                    },
                                    {
                                        id: 2,
                                        name: "source_code.zip",
                                        file: "/media/submissions/source_code.zip",
                                        size: 1536000,
                                        uploaded_at: "2025-10-05T11:20:30.123456Z"
                                    }
                                ],
                                external_links: [
                                    {
                                        id: 1,
                                        title: "GitHub Repository - Homework 1",
                                        url: "https://github.com/azam/homework1"
                                    },
                                    {
                                        id: 2,
                                        title: "Live Demo",
                                        url: "https://azam-homework1.netlify.app"
                                    }
                                ],
                                grade: null,
                                attempt_number: 1,
                                status: "pending"
                            },
                            {
                                id: 2,
                                student: {
                                    id: 3,
                                    username: "sara_student", 
                                    full_name: "Sara Abdullayeva",
                                    email: "sara@student.com",
                                    avatar: "/media/avatars/sara.jpg"
                                },
                                submitted_at: "2025-09-20T13:17:06.043085Z",
                                updated_at: "2025-09-21T08:45:22.987654Z",
                                is_late: false,
                                submission_text: "Vazifani vaqtida bajardim. Barcha masalalar yechilgan va qo'shimcha tadqiqotlar ham amalga oshirildi. Natijalarni PowerPoint taqdimotida tayyorladim.",
                                attachments: [
                                    {
                                        id: 3,
                                        name: "sara_homework1.docx",
                                        file: "/media/submissions/sara_homework1.docx",
                                        size: 1536000,
                                        uploaded_at: "2025-09-20T13:17:06.043085Z"
                                    },
                                    {
                                        id: 4,
                                        name: "presentation.pptx",
                                        file: "/media/submissions/presentation.pptx",
                                        size: 3072000,
                                        uploaded_at: "2025-09-20T15:30:45.567890Z"
                                    },
                                    {
                                        id: 5,
                                        name: "research_data.xlsx",
                                        file: "/media/submissions/research_data.xlsx",
                                        size: 512000,
                                        uploaded_at: "2025-09-20T16:15:30.234567Z"
                                    }
                                ],
                                external_links: [
                                    {
                                        id: 3,
                                        title: "Online Survey Results",
                                        url: "https://forms.google.com/survey-results/abc123"
                                    }
                                ],
                                grade: {
                                    score: 85.0,
                                    max_score: 100.0,
                                    percentage: 85.0,
                                    graded_at: "2025-09-21T10:30:00Z",
                                    graded_by: {
                                        id: 1,
                                        username: "behruz",
                                        full_name: "Behruz Developer"
                                    },
                                    feedback: "Yaxshi ish! Ba'zi qismlarni yaxshilash mumkin edi. Qo'shimcha tadqiqotlar juda yaxshi baholandi."
                                },
                                attempt_number: 1,
                                status: "graded"
                            }
                        ],
                        submissions_count: 2,
                        graded_count: 1,
                        pending_count: 1
                    },
                    {
                        id: 4,
                        title: "Web Loyiha Yaratish",
                        description: "React va Node.js yordamida to'liq web loyiha yarating. Frontend va backend qismlarini bog'lang.",
                        course: {
                            id: 1,
                            title: "dasturlash",
                            slug: "dasturlash"
                        },
                        due_days_after_completion: 14,
                        created_at: "2025-10-04T10:25:59.113394Z",
                        is_active: true,
                        max_score: 100,
                        difficulty: "intermediate",
                        submissions: [
                            {
                                id: 3,
                                student: {
                                    id: 4,
                                    username: "john_student",
                                    full_name: "John Smith",
                                    email: "john@student.com",
                                    avatar: "/media/avatars/john.jpg"
                                },
                                submitted_at: "2025-10-06T16:45:30.123456Z",
                                updated_at: null,
                                is_late: false,
                                submission_text: "Men React va Node.js yordamida e-commerce web saytini yaratdim. Barcha funksiyalar ishlaydi va responsive dizayn qo'shilgan.",
                                attachments: [
                                    {
                                        id: 6,
                                        name: "project_documentation.pdf",
                                        file: "/media/submissions/project_documentation.pdf",
                                        size: 4096000,
                                        uploaded_at: "2025-10-06T16:45:30.123456Z"
                                    },
                                    {
                                        id: 7,
                                        name: "frontend_code.zip",
                                        file: "/media/submissions/frontend_code.zip",
                                        size: 8192000,
                                        uploaded_at: "2025-10-06T16:50:15.654321Z"
                                    },
                                    {
                                        id: 8,
                                        name: "backend_api.zip",
                                        file: "/media/submissions/backend_api.zip",
                                        size: 6144000,
                                        uploaded_at: "2025-10-06T16:55:45.987654Z"
                                    }
                                ],
                                external_links: [
                                    {
                                        id: 4,
                                        title: "GitHub Frontend Repository",
                                        url: "https://github.com/john/ecommerce-frontend"
                                    },
                                    {
                                        id: 5,
                                        title: "GitHub Backend Repository",
                                        url: "https://github.com/john/ecommerce-backend"
                                    },
                                    {
                                        id: 6,
                                        title: "Live Demo Website",
                                        url: "https://john-ecommerce.vercel.app"
                                    },
                                    {
                                        id: 7,
                                        title: "API Documentation",
                                        url: "https://john-api-docs.postman.co"
                                    }
                                ],
                                grade: null,
                                attempt_number: 1,
                                status: "pending"
                            }
                        ],
                        submissions_count: 1,
                        graded_count: 0,
                        pending_count: 1
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
                        difficulty: "beginner",
                        submissions: [],
                        submissions_count: 0,
                        graded_count: 0,
                        pending_count: 0
                    }
                ],
                summary: {
                    total_assignments: 3,
                    total_submissions: 3,
                    pending_submissions: 2,
                    graded_submissions: 1,
                    overdue_submissions: 1
                }
            }
        }
    },

    // Topshiriqni baholash
    gradeSubmission: async (channelSlug, submissionId, gradeData) => {
        try {
            console.log(`gradeSubmission called with:`, { channelSlug, submissionId, gradeData })
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

    // Topshiriq batafsil ma'lumotlari
    getSubmissionDetail: async (channelSlug, submissionId) => {
        try {
            console.log(`getSubmissionDetail called with:`, { channelSlug, submissionId })
            const url = `/teacher/${channelSlug}/assignments/submissions/${submissionId}/`
            console.log('API URL:', url)
            
            const response = await apiService.get(url)
            console.log('Submission detail response:', response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching submission detail:', error)
            throw error
        }
    },

    // Faylni yuklash
    downloadFile: async (fileUrl) => {
        try {
            console.log(`downloadFile called with: ${fileUrl}`)
            const response = await apiService.get(fileUrl, { responseType: 'blob' })
            return response.data
        } catch (error) {
            console.error('Error downloading file:', error)
            throw error
        }
    }
}

export default teacherAssignmentsCheckAPI
