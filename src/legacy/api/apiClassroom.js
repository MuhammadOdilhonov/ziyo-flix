// Google Classroom API Service - Fake Data Only

// ==================== FAKE DATA ====================

// Fake Attendance Data
const FAKE_ATTENDANCE_DATA = {
    students: [
        { id: 1, full_name: 'Ali Valiyev', username: 'ali_v', avatar: null },
        { id: 2, full_name: 'Malika Karimova', username: 'malika_k', avatar: null },
        { id: 3, full_name: 'Bobur Toshmatov', username: 'bobur_t', avatar: null },
        { id: 4, full_name: 'Nilufar Rahimova', username: 'nilufar_r', avatar: null },
        { id: 5, full_name: 'Sardor Usmonov', username: 'sardor_u', avatar: null }
    ],
    attendance: {
        '1-5': 'present',
        '1-12': 'absent',
        '1-19': 'present',
        '1-26': 'excused',
        '2-5': 'present',
        '2-12': 'present',
        '2-19': 'absent',
        '2-26': 'present',
        '3-5': 'excused',
        '3-12': 'present',
        '3-19': 'present',
        '3-26': 'present',
        '4-5': 'present',
        '4-12': 'present',
        '4-19': 'excused',
        '4-26': 'absent',
        '5-5': 'absent',
        '5-12': 'excused',
        '5-19': 'present',
        '5-26': 'present'
    }
};

const FAKE_CLASSROOMS = [
    {
        id: 1,
        name: "Dasturlash Asoslari",
        code: "ABC123",
        subject: "Informatika",
        room: "101-xona",
        section: "A guruh",
        description: "Python dasturlash tilini o'rganish",
        theme_color: "#1976d2",
        is_private: false,
        password: null,
        teacher: {
            id: 1,
            full_name: "Aziz Rahimov",
            username: "aziz_teacher",
            avatar: "/media/avatars/teacher1.jpg"
        },
        students_count: 25,
        assignments_count: 12,
        materials_count: 8,
        created_at: "2025-01-15T10:00:00Z"
    },
    {
        id: 2,
        name: "Web Development",
        code: "WEB456",
        subject: "Web Dasturlash",
        room: "102-xona",
        section: "B guruh",
        description: "HTML, CSS, JavaScript o'rganish",
        theme_color: "#388e3c",
        is_private: true,
        password: "web2025",
        teacher: {
            id: 1,
            full_name: "Aziz Rahimov",
            username: "aziz_teacher",
            avatar: "/media/avatars/teacher1.jpg"
        },
        students_count: 18,
        assignments_count: 15,
        materials_count: 10,
        created_at: "2025-02-01T10:00:00Z"
    }
];

const FAKE_STREAM_POSTS = [
    {
        id: 1,
        classroom_id: 1,
        type: "announcement",
        author: {
            id: 1,
            full_name: "Aziz Rahimov",
            username: "aziz_teacher",
            avatar: "/media/avatars/teacher1.jpg"
        },
        content: "Hurmatli o'quvchilar! Ertaga yangi dars boshlanadi.",
        attachments: [],
        created_at: "2025-03-01T10:00:00Z",
        comments: [
            {
                id: 1,
                author: {
                    id: 2,
                    full_name: "Ali Valiyev",
                    username: "ali_student",
                    avatar: "/media/avatars/student1.jpg"
                },
                content: "Tushundik, rahmat!",
                created_at: "2025-03-01T11:00:00Z"
            }
        ]
    },
    {
        id: 2,
        classroom_id: 1,
        type: "assignment_posted",
        author: {
            id: 1,
            full_name: "Aziz Rahimov",
            username: "aziz_teacher",
            avatar: "/media/avatars/teacher1.jpg"
        },
        content: "Yangi vazifa: Python asoslari",
        assignment: {
            id: 1,
            title: "Python asoslari",
            due_date: "2025-03-10T23:59:00Z"
        },
        created_at: "2025-03-02T10:00:00Z",
        comments: []
    }
];

const FAKE_CLASSWORK = {
    topics: [
        { id: 1, name: "Kirish", order: 1 },
        { id: 2, name: "Amaliy mashg'ulotlar", order: 2 },
        { id: 3, name: "Yakuniy nazorat", order: 3 }
    ],
    items: [
        {
            id: 1,
            type: "assignment",
            topic_id: 1,
            title: "Python o'rnatish",
            description: "Python dasturlash muhitini o'rnating",
            due_date: "2025-03-10T23:59:00Z",
            points: 10,
            attachments: [],
            created_at: "2025-03-01T10:00:00Z",
            submissions_count: 20,
            graded_count: 15
        },
        {
            id: 2,
            type: "material",
            topic_id: 1,
            title: "Python darsligi",
            description: "Python asoslari bo'yicha darslik",
            attachments: [
                { name: "python_basics.pdf", url: "/media/materials/python.pdf", type: "pdf" }
            ],
            created_at: "2025-03-01T10:00:00Z"
        },
        {
            id: 3,
            type: "quiz",
            topic_id: 2,
            title: "Python sintaksisi testi",
            description: "Python sintaksisi bo'yicha test",
            due_date: "2025-03-15T23:59:00Z",
            points: 20,
            time_limit: 30,
            passing_score: 70,
            questions_count: 10,
            created_at: "2025-03-05T10:00:00Z",
            attempts_count: 18
        },
        {
            id: 4,
            type: "question",
            topic_id: 2,
            title: "Python nima?",
            description: "Python dasturlash tili haqida fikringizni yozing",
            created_at: "2025-03-06T10:00:00Z",
            answers_count: 22
        }
    ]
};

const FAKE_STUDENTS = [
    {
        id: 2,
        full_name: "Ali Valiyev",
        username: "ali_student",
        email: "ali@example.com",
        avatar: "/media/avatars/student1.jpg",
        joined_at: "2025-01-20T10:00:00Z",
        assignments_completed: 10,
        assignments_total: 12,
        average_grade: 85.5,
        last_active: "2025-03-08T15:30:00Z"
    },
    {
        id: 3,
        full_name: "Malika Karimova",
        username: "malika_student",
        email: "malika@example.com",
        avatar: "/media/avatars/student2.jpg",
        joined_at: "2025-01-21T10:00:00Z",
        assignments_completed: 12,
        assignments_total: 12,
        average_grade: 92.0,
        last_active: "2025-03-08T16:00:00Z"
    }
];

const FAKE_SUBMISSIONS = [
    {
        id: 1,
        assignment_id: 1,
        student: {
            id: 2,
            full_name: "Ali Valiyev",
            username: "ali_student",
            avatar: "/media/avatars/student1.jpg"
        },
        submitted_at: "2025-03-09T14:30:00Z",
        status: "graded",
        grade: 8,
        max_grade: 10,
        feedback: "Yaxshi ish!",
        attachments: [
            { name: "homework.py", url: "/media/submissions/homework.py" }
        ]
    },
    {
        id: 2,
        assignment_id: 1,
        student: {
            id: 3,
            full_name: "Malika Karimova",
            username: "malika_student",
            avatar: "/media/avatars/student2.jpg"
        },
        submitted_at: "2025-03-08T10:00:00Z",
        status: "graded",
        grade: 10,
        max_grade: 10,
        feedback: "A'lo!",
        attachments: [
            { name: "solution.py", url: "/media/submissions/solution.py" }
        ]
    }
];

const FAKE_GRADEBOOK = {
    students: FAKE_STUDENTS,
    assignments: [
        { id: 1, title: "Python o'rnatish", max_points: 10 },
        { id: 3, title: "Python sintaksisi testi", max_points: 20 },
        { id: 5, title: "Funksiyalar", max_points: 15 }
    ],
    grades: [
        {
            student_id: 2,
            grades: [
                { assignment_id: 1, grade: 8, max_grade: 10 },
                { assignment_id: 3, grade: 16, max_grade: 20 },
                { assignment_id: 5, grade: 12, max_grade: 15 }
            ],
            total_points: 36,
            max_total_points: 45,
            average: 80.0
        },
        {
            student_id: 3,
            grades: [
                { assignment_id: 1, grade: 10, max_grade: 10 },
                { assignment_id: 3, grade: 19, max_grade: 20 },
                { assignment_id: 5, grade: 15, max_grade: 15 }
            ],
            total_points: 44,
            max_total_points: 45,
            average: 97.8
        }
    ]
};

// ==================== TEACHER API FUNCTIONS ====================

export const getTeacherClassrooms = async () => {
    console.log('📚 [API] Getting teacher classrooms...');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                count: FAKE_CLASSROOMS.length,
                results: FAKE_CLASSROOMS
            });
        }, 500);
    });
};

export const createClassroom = async (data) => {
    console.log('➕ [API] Creating classroom:', data);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newClassroom = {
                id: Date.now(),
                ...data,
                code: Math.random().toString(36).substring(2, 8).toUpperCase(),
                teacher: {
                    id: 1,
                    full_name: "Aziz Rahimov",
                    username: "aziz_teacher",
                    avatar: "/media/avatars/teacher1.jpg"
                },
                students_count: 0,
                assignments_count: 0,
                materials_count: 0,
                created_at: new Date().toISOString()
            };
            FAKE_CLASSROOMS.push(newClassroom);
            resolve(newClassroom);
        }, 500);
    });
};

export const getClassroomDetail = async (classroomId) => {
    console.log('📖 [API] Getting classroom detail:', classroomId);
    return new Promise((resolve) => {
        setTimeout(() => {
            const classroom = FAKE_CLASSROOMS.find(c => c.id === parseInt(classroomId));
            resolve(classroom || FAKE_CLASSROOMS[0]);
        }, 300);
    });
};

export const updateClassroom = async (classroomId, data) => {
    console.log('✏️ [API] Updating classroom:', classroomId, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = FAKE_CLASSROOMS.findIndex(c => c.id === parseInt(classroomId));
            if (index !== -1) {
                FAKE_CLASSROOMS[index] = { ...FAKE_CLASSROOMS[index], ...data };
                resolve(FAKE_CLASSROOMS[index]);
            }
        }, 500);
    });
};

export const deleteClassroom = async (classroomId) => {
    console.log('🗑️ [API] Deleting classroom:', classroomId);
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = FAKE_CLASSROOMS.findIndex(c => c.id === parseInt(classroomId));
            if (index !== -1) {
                FAKE_CLASSROOMS.splice(index, 1);
            }
            resolve({ success: true });
        }, 500);
    });
};

export const getClassroomStream = async (classroomId) => {
    console.log('📰 [API] Getting classroom stream:', classroomId);
    return new Promise((resolve) => {
        setTimeout(() => {
            const posts = FAKE_STREAM_POSTS.filter(p => p.classroom_id === parseInt(classroomId));
            resolve({
                count: posts.length,
                results: posts
            });
        }, 300);
    });
};

export const postToStream = async (classroomId, data) => {
    console.log('📝 [API] Posting to stream:', classroomId, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newPost = {
                id: Date.now(),
                classroom_id: parseInt(classroomId),
                type: "announcement",
                author: {
                    id: 1,
                    full_name: "Aziz Rahimov",
                    username: "aziz_teacher",
                    avatar: "/media/avatars/teacher1.jpg"
                },
                content: data.content,
                attachments: data.attachments || [],
                created_at: new Date().toISOString(),
                comments: []
            };
            FAKE_STREAM_POSTS.push(newPost);
            resolve(newPost);
        }, 500);
    });
};

export const getClasswork = async (classroomId) => {
    console.log('📚 [API] Getting classwork:', classroomId);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(FAKE_CLASSWORK);
        }, 300);
    });
};

// Submitted Assignments
export const getSubmittedAssignments = async (classroomId) => {
    console.log('📝 [API] Getting submitted assignments:', classroomId);
    return new Promise((resolve) => {
        setTimeout(() => {
            const submissions = [
                {
                    id: 1,
                    assignment: { id: 1, title: "Python Asoslari", points: 10 },
                    student: {
                        id: 1,
                        full_name: "Sardor Aliyev",
                        username: "sardor_student",
                        avatar: "/media/avatars/student1.jpg"
                    },
                    content: "Vazifa bajarildi. Barcha topshiriqlar to'liq bajarilgan.",
                    files: [
                        { name: "homework.py", url: "#" },
                        { name: "report.pdf", url: "#" }
                    ],
                    submitted_at: new Date().toISOString(),
                    status: "pending",
                    score: null,
                    feedback: null
                },
                {
                    id: 2,
                    assignment: { id: 2, title: "Ma'lumotlar Tuzilmasi", points: 15 },
                    student: {
                        id: 2,
                        full_name: "Dilnoza Karimova",
                        username: "dilnoza_student",
                        avatar: "/media/avatars/student2.jpg"
                    },
                    content: "Topshiriq bajarildi. Qo'shimcha izohlar qo'shilgan.",
                    files: [{ name: "assignment.py", url: "#" }],
                    submitted_at: new Date(Date.now() - 86400000).toISOString(),
                    status: "graded",
                    score: 14,
                    feedback: "Juda yaxshi ish! Kodni optimallashtirishga e'tibor bering."
                }
            ];
            resolve({ results: submissions });
        }, 300);
    });
};

export const gradeAssignment = async (submissionId, data) => {
    console.log('✅ [API] Grading assignment:', submissionId, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
};

export const deleteSubmission = async (submissionId) => {
    console.log('🗑️ [API] Deleting submission:', submissionId);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 300);
    });
};

// Questions
export const getQuestions = async (classroomId) => {
    console.log('❓ [API] Getting questions:', classroomId);
    return new Promise((resolve) => {
        setTimeout(() => {
            const questions = [
                {
                    id: 1,
                    title: "Python'da list va tuple farqi nima?",
                    content: "Men list va tuple o'rtasidagi asosiy farqni tushunmayapman. Tushuntirib bera olasizmi?",
                    student: {
                        id: 1,
                        full_name: "Sardor Aliyev",
                        username: "sardor_student",
                        avatar: "/media/avatars/student1.jpg"
                    },
                    created_at: new Date().toISOString(),
                    answer: null
                },
                {
                    id: 2,
                    title: "Rekursiya qanday ishlaydi?",
                    content: "Rekursiya haqida darsda gapirdingiz, lekin to'liq tushunmadim. Oddiy misol bilan tushuntirib bera olasizmi?",
                    student: {
                        id: 2,
                        full_name: "Dilnoza Karimova",
                        username: "dilnoza_student",
                        avatar: "/media/avatars/student2.jpg"
                    },
                    created_at: new Date(Date.now() - 3600000).toISOString(),
                    answer: "Rekursiya - bu funksiya o'zini o'zi chaqirishi. Misol: factorial(5) = 5 * factorial(4). Har safar funksiya o'zini kichikroq qiymat bilan chaqiradi, base case ga yetguncha."
                }
            ];
            resolve({ results: questions });
        }, 300);
    });
};

export const answerQuestion = async (questionId, data) => {
    console.log('💬 [API] Answering question:', questionId, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
};

export const deleteQuestion = async (questionId) => {
    console.log('🗑️ [API] Deleting question:', questionId);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 300);
    });
};

// Student Questions
export const getMyQuestions = async (classroomId) => {
    console.log('❓ [API] Getting my questions:', classroomId);
    return new Promise((resolve) => {
        setTimeout(() => {
            const questions = [
                {
                    id: 1,
                    title: "Python'da list va tuple farqi nima?",
                    content: "Men list va tuple o'rtasidagi asosiy farqni tushunmayapman. Tushuntirib bera olasizmi?",
                    created_at: new Date().toISOString(),
                    answer: "List o'zgaruvchan (mutable), tuple o'zgarmas (immutable). List [] bilan, tuple () bilan yaratiladi. List elementlarini o'zgartirish mumkin, tuple elementlarini o'zgartirib bo'lmaydi.",
                    teacher: {
                        id: 1,
                        full_name: "Aziz Rahimov",
                        username: "aziz_teacher",
                        avatar: "/media/avatars/teacher1.jpg"
                    }
                },
                {
                    id: 2,
                    title: "Rekursiya qanday ishlaydi?",
                    content: "Rekursiya haqida darsda gapirdingiz, lekin to'liq tushunmadim. Oddiy misol bilan tushuntirib bera olasizmi?",
                    created_at: new Date(Date.now() - 3600000).toISOString(),
                    answer: null,
                    teacher: null
                }
            ];
            resolve({ results: questions });
        }, 300);
    });
};

export const askQuestion = async (classroomId, data) => {
    console.log('📝 [API] Asking question:', classroomId, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true });
        }, 500);
    });
};

export const createClassworkItem = async (classroomId, data) => {
    console.log('➕ [API] Creating classwork item:', classroomId, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newItem = {
                id: Date.now(),
                ...data,
                created_at: new Date().toISOString(),
                submissions_count: 0,
                graded_count: 0
            };
            FAKE_CLASSWORK.items.push(newItem);
            resolve(newItem);
        }, 500);
    });
};

export const getClassroomStudents = async (classroomId) => {
    console.log('👥 [API] Getting classroom students:', classroomId);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                count: FAKE_STUDENTS.length,
                results: FAKE_STUDENTS
            });
        }, 300);
    });
};

export const getAssignmentSubmissions = async (assignmentId) => {
    console.log('📄 [API] Getting assignment submissions:', assignmentId);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                count: FAKE_SUBMISSIONS.length,
                results: FAKE_SUBMISSIONS
            });
        }, 300);
    });
};

export const gradeSubmission = async (submissionId, data) => {
    console.log('✅ [API] Grading submission:', submissionId, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = FAKE_SUBMISSIONS.findIndex(s => s.id === parseInt(submissionId));
            if (index !== -1) {
                FAKE_SUBMISSIONS[index] = {
                    ...FAKE_SUBMISSIONS[index],
                    status: 'graded',
                    grade: data.grade,
                    feedback: data.feedback
                };
                resolve(FAKE_SUBMISSIONS[index]);
            }
        }, 500);
    });
};

export const getGradebook = async (classroomId) => {
    console.log('📊 [API] Getting gradebook:', classroomId);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(FAKE_GRADEBOOK);
        }, 300);
    });
};

// ==================== STUDENT API FUNCTIONS ====================

export const getStudentClassrooms = async () => {
    console.log('📚 [API] Getting student classrooms...');
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                count: FAKE_CLASSROOMS.length,
                results: FAKE_CLASSROOMS
            });
        }, 500);
    });
};

export const joinClassroom = async (code, password = null) => {
    console.log('🔗 [API] Joining classroom:', code);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const classroom = FAKE_CLASSROOMS.find(c => c.code === code);
            if (!classroom) {
                reject({ error: "Sinf topilmadi" });
                return;
            }
            if (classroom.is_private && classroom.password !== password) {
                reject({ error: "Parol noto'g'ri" });
                return;
            }
            resolve(classroom);
        }, 500);
    });
};

export const submitAssignment = async (assignmentId, data) => {
    console.log('📤 [API] Submitting assignment:', assignmentId, data);
    return new Promise((resolve) => {
        setTimeout(() => {
            const newSubmission = {
                id: Date.now(),
                assignment_id: parseInt(assignmentId),
                student: {
                    id: 2,
                    full_name: "Ali Valiyev",
                    username: "ali_student",
                    avatar: "/media/avatars/student1.jpg"
                },
                submitted_at: new Date().toISOString(),
                status: "submitted",
                grade: null,
                max_grade: null,
                feedback: null,
                attachments: data.attachments || []
            };
            FAKE_SUBMISSIONS.push(newSubmission);
            resolve(newSubmission);
        }, 500);
    });
};

export const getStudentSubmission = async (assignmentId) => {
    console.log('📄 [API] Getting student submission:', assignmentId);
    return new Promise((resolve) => {
        setTimeout(() => {
            const submission = FAKE_SUBMISSIONS.find(s => s.assignment_id === parseInt(assignmentId));
            resolve(submission || null);
        }, 300);
    });
};

// ==================== ATTENDANCE API ====================

export const getClassroomAttendance = async (classroomId, month, year) => {
    console.log('📊 [API] Getting classroom attendance:', { classroomId, month, year });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(FAKE_ATTENDANCE_DATA);
        }, 500);
    });
};

export const saveAttendance = async (classroomId, attendanceData) => {
    console.log('💾 [API] Saving attendance:', { classroomId, attendanceData });
    return new Promise((resolve) => {
        setTimeout(() => {
            // In real implementation, this would save to backend
            console.log('✅ Attendance saved successfully');
            resolve({ success: true, message: 'Davomat saqlandi' });
        }, 800);
    });
};

export default {
    // Teacher
    getTeacherClassrooms,
    createClassroom,
    getClassroomDetail,
    updateClassroom,
    deleteClassroom,
    getClassroomStream,
    postToStream,
    getClasswork,
    createClassworkItem,
    getClassroomStudents,
    getAssignmentSubmissions,
    gradeSubmission,
    getGradebook,
    // Student
    getStudentClassrooms,
    joinClassroom,
    submitAssignment,
    getStudentSubmission,
    // Attendance
    getClassroomAttendance,
    saveAttendance
};
