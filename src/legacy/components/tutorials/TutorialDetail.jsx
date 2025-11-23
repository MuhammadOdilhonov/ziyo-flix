import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetail, getCourseTypes, getCourseVideos } from '../../api/apiCourses';
import { getCourseProgress, getVideoProgress } from '../../api/apiProgress';
import { getCtTestByType } from '../../api/apiCourseType';
import { getCtAssignmentByType } from '../../api/apiCourseType';
import { walletPurchaseAPI } from '../../api/apiWalletPurchase';
import { setSeoTags, setJsonLd } from '../../utils/seo';
import { BaseUrlReels } from '../../api/apiService';

import {
    ArrowLeft,
    Play,
    Star,
    Users,
    Book,
    Clock,
    Calendar,
    CheckCircle,
    Lock,
    Trophy,
    Award,
    FileText,
    Upload,
    CreditCard,
    Coins,
    ShoppingCart,
    Gift,
    Sparkles
} from 'lucide-react';

const TutorialDetail = () => {
    const { tutorialSlug } = useParams();
    const navigate = useNavigate();

    // Main states
    const [course, setCourse] = useState(null);
    const [courseTypes, setCourseTypes] = useState([]); // months
    const [selectedTypeSlug, setSelectedTypeSlug] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(1);
    const [completedLessons, setCompletedLessons] = useState([1, 2]);
    const [lessonScores, setLessonScores] = useState({ 1: 85, 2: 92 });
    const [testResults, setTestResults] = useState({});
    const [assignmentResults, setAssignmentResults] = useState({});
    const [lessonWatched, setLessonWatched] = useState({}); // { [lessonId]: true }
    const [lastLessonReady, setLastLessonReady] = useState(false);
    const [courseProgress, setCourseProgress] = useState(null);
    const [hasMonthTest, setHasMonthTest] = useState(false);
    const [hasMonthAssignment, setHasMonthAssignment] = useState(false);

    // Purchase states
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseType, setPurchaseType] = useState(''); // 'course' or 'month'
    const [selectedCourseType, setSelectedCourseType] = useState(null);
    const [walletBalance, setWalletBalance] = useState(null);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [purchaseResult, setPurchaseResult] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const testResultsData = JSON.parse(localStorage.getItem("testResults") || "{}");
        const assignmentResultsData = JSON.parse(localStorage.getItem("assignmentResults") || "{}");

        setTestResults(testResultsData);
        setAssignmentResults(assignmentResultsData);

        const scores = {};
        Object.keys(testResultsData).forEach((lessonId) => {
            if (testResultsData[lessonId].passed) {
                scores[lessonId] = testResultsData[lessonId].score;
            }
        });
        Object.keys(assignmentResultsData).forEach((lessonId) => {
            if (assignmentResultsData[lessonId].passed) {
                scores[lessonId] = assignmentResultsData[lessonId].score;
            }
        });

        setLessonScores(scores);
        // Initialize; will rely on API-based lessonWatched in render
        setCompletedLessons([]);

        // Fetch course detail and structure
        let mounted = true;
        (async () => {
            try {
                const detail = await getCourseDetail(tutorialSlug);
                if (!mounted) return;
                setCourse(detail);

                const typesRes = await getCourseTypes(tutorialSlug);
                const types = Array.isArray(typesRes.results) ? typesRes.results : [];
                if (!mounted) return;
                setCourseTypes(types);
                if (types.length > 0) {
                    setSelectedTypeSlug(types[0].slug);
                }
                // Load overall course progress
                try {
                    const cp = await getCourseProgress(tutorialSlug);
                    if (mounted) setCourseProgress(cp);
                } catch (_) { }
            } catch (_) {
                if (mounted) {
                    setCourse(null);
                    setCourseTypes([]);
                }
            }
        })();
        return () => { mounted = false };
    }, [tutorialSlug]);

    // SEO tags for Course Detail
    useEffect(() => {
        if (!course) return;
        const title = `${course.title} — Darslik — ZiyoFlix`;
        const description = course.description || "ZiyoFlix: O'zbek tilida professional video darsliklar.";
        const rawImg = course.cover || course.thumbnail || "/Ziyo-Flix-Logo.png";
        const image = (typeof rawImg === 'string' && rawImg.startsWith('http'))
            ? rawImg
            : `${BaseUrlReels}${rawImg?.startsWith('/') ? rawImg : `/${rawImg}`}`;
        setSeoTags({ title, description, image, type: 'website' });

        const jsonLd = {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.title,
            "description": description,
            ...(image ? { image } : {}),
            ...(course.category ? { "subjectOf": { "@type": "Thing", "name": course.category } } : {}),
            ...(course.channel_info ? { "provider": { "@type": "Organization", "name": course.channel_info.title } } : {})
        };
        setJsonLd(jsonLd);
    }, [course]);

    // Load lessons for selected type
    useEffect(() => {
        let mounted = true;
        if (!selectedTypeSlug) {
            setLessons([]);
            return;
        }
        (async () => {
            try {
                const videosRes = await getCourseVideos({ courseSlug: tutorialSlug, courseTypeSlug: selectedTypeSlug });
                const list = Array.isArray(videosRes.results) ? videosRes.results : [];
                if (mounted) setLessons(list);
            } catch (_) {
                if (mounted) setLessons([]);
            }
        })();
        return () => { mounted = false };
    }, [tutorialSlug, selectedTypeSlug]);

    // Fetch overall course progress (types with percent/completed/total)
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const cp = await getCourseProgress(tutorialSlug);
                if (mounted) setCourseProgress(cp || null);
            } catch (_) {
                if (mounted) setCourseProgress(null);
            }
        })();
        return () => { mounted = false };
    }, [tutorialSlug]);

    // Check if month-level test/assignment exist for the selected course type
    useEffect(() => {
        const ct = courseTypes.find(ct => ct.slug === selectedTypeSlug);
        if (!ct) { setHasMonthTest(false); setHasMonthAssignment(false); return; }
        let mounted = true;
        (async () => {
            try {
                const t = await getCtTestByType(ct.id);
                if (mounted) setHasMonthTest(!!t);
            } catch (_) { if (mounted) setHasMonthTest(false); }
            try {
                const a = await getCtAssignmentByType(ct.id);
                if (mounted) setHasMonthAssignment(!!a);
            } catch (_) { if (mounted) setHasMonthAssignment(false); }
        })();
        return () => { mounted = false };
    }, [courseTypes, selectedTypeSlug]);

    // Determine if last lesson has been reached using API progress
    useEffect(() => {
        let mounted = true;
        const checkLastLesson = async () => {
            try {
                if (!Array.isArray(lessons) || lessons.length === 0) {
                    if (mounted) setLastLessonReady(false);
                    return;
                }
                // pick last lesson by order if provided, else by last in array
                const sorted = [...lessons].sort((a, b) => {
                    const ao = Number.isFinite(a.order) ? a.order : a.id;
                    const bo = Number.isFinite(b.order) ? b.order : b.id;
                    return ao - bo;
                });
                const last = sorted[sorted.length - 1];
                const vp = await getVideoProgress(last.id);
                const reached = !!(vp?.completed || Number(vp?.last_position || 0) > 0);
                if (mounted) setLastLessonReady(reached);
            } catch (_) {
                if (mounted) setLastLessonReady(false);
            }
        };
        checkLastLesson();
        return () => { mounted = false };
    }, [lessons]);

    // Build per-lesson watched map via API (completed only)
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            if (!Array.isArray(lessons) || lessons.length === 0) {
                if (mounted) setLessonWatched({});
                return;
            }
            try {
                const entries = await Promise.all(
                    lessons.map(async (l) => {
                        try {
                            const vp = await getVideoProgress(l.id);
                            return [l.id, !!vp?.completed];
                        } catch { return [l.id, false]; }
                    })
                );
                if (mounted) {
                    const map = Object.fromEntries(entries);
                    setLessonWatched(map);
                }
            } catch {
                if (mounted) setLessonWatched({});
            }
        };
        load();
        return () => { mounted = false };
    }, [lessons]);

    const updateLessonLockStatus = () => { };

    const getPreviousLesson = () => null;

    const isMonthUnlocked = () => true;

    // Compose lesson states: watched (API), test/assignment passed (local for now), completed, and chained lock
    const lessonsWithState = useMemo(() => {
        const sorted = [...lessons].sort((a, b) => {
            const ao = Number.isFinite(a.order) ? a.order : a.id;
            const bo = Number.isFinite(b.order) ? b.order : b.id;
            return ao - bo;
        });
        let prevCompleted = true;
        return sorted.map((l) => {
            const watched = !!lessonWatched[l.id];
            const testNeeded = !!l.has_test;
            const assignNeeded = !!l.has_assignment;
            const testPassed = !!(testResults[l.id]?.passed || typeof testResults[l.id]?.score === 'number' || testResults[l.id]);
            const assignPassed = !!(assignmentResults[l.id]?.passed || assignmentResults[l.id]?.submitted || assignmentResults[l.id]);
            // Completion rule (as requested): checkmark if watched OR test done OR assignment done
            const completed = watched || (testNeeded && testPassed) || (assignNeeded && assignPassed);
            const chainLocked = !prevCompleted; // lock until previous completed
            const isLocked = chainLocked || Boolean(l.is_locked ?? l.isLocked);
            prevCompleted = prevCompleted && completed;
            return { ...l, _state: { watched, testPassed, assignPassed, completed, isLocked } };
        });
    }, [lessons, lessonWatched, testResults, assignmentResults]);

    const tutorial = course ? {
        id: course.id,
        title: course.title,
        slug: course.slug,
        subject: course.category || '',
        instructor: course.channel_info ? {
            id: course.channel_info.id,
            name: course.channel_info.title,
            username: course.channel_info.slug,
            avatar: course.channel_info.avatar,
            verified: course.channel_info.verified,
            bio: course.channel_info.description,
        } : null,
        description: course.description,
        fullDescription: course.description,
        image_banner: course.cover,
        image: course.thumbnail,
        totalMonths: courseTypes.length,
        totalLessons: course.lessons_count || 0,
        duration: course.total_duration_minutes ? `${course.total_duration_minutes} min` : '',
        level: course.level,
        rating: course.rating_avg || 0,
        students: course.students_count || 0,
        price: Number(course.price || 0),
        isPurchased: course.is_free || course.is_purchased || false,
        purchaseScope: course.purchase_scope || 'course',
        months: courseTypes.map((ct, idx) => ({ id: idx + 1, name: ct.name, description: ct.description, slug: ct.slug })),
    } : null;

    const currentMonth = tutorial && selectedTypeSlug ? tutorial.months.find((m) => m.slug === selectedTypeSlug) : null;

    // Sotib olish holatini tekshirish funksiyasi
    const checkPurchaseStatus = () => {
        if (!tutorial) return false;

        if (tutorial.purchaseScope === 'course') {
            // Butun kurs sotib olish - course.is_purchased tekshirish
            return tutorial.isPurchased;
        } else if (tutorial.purchaseScope === 'course_type') {
            // Oylik sotib olish - joriy oy uchun is_purchased tekshirish
            const currentType = courseTypes.find(ct => ct.slug === selectedTypeSlug);
            return currentType?.is_purchased || false;
        }

        return false;
    };

    // Sotib olish tugmasini ko'rsatish kerakligini aniqlash
    const shouldShowPurchaseButton = () => {
        if (!tutorial) return false;

        if (tutorial.purchaseScope === 'course') {
            // Butun kurs uchun - agar sotib olinmagan bo'lsa tugma ko'rsatish
            return !tutorial.isPurchased && tutorial.price > 0;
        } else if (tutorial.purchaseScope === 'course_type') {
            // Oylik uchun - joriy oy sotib olinmagan bo'lsa tugma ko'rsatish
            const currentType = courseTypes.find(ct => ct.slug === selectedTypeSlug);
            const monthPrice = currentType?.price ? parseFloat(currentType.price) : 0;
            return !currentType?.is_purchased && monthPrice > 0;
        }

        return false;
    };

    const handleLessonClick = async (lesson) => {
        // Purchase scope bo'yicha access logic
        if (tutorial.purchaseScope === 'course') {
            // Butun kurs sotib olish - agar sotib olinmagan bo'lsa faqat birinchi videoga ruxsat
            if (!tutorial.isPurchased) {
                const sortedLessons = [...lessons].sort((a, b) => {
                    const ao = Number.isFinite(a.order) ? a.order : a.id;
                    const bo = Number.isFinite(b.order) ? b.order : b.id;
                    return ao - bo;
                });
                const firstLesson = sortedLessons[0];

                if (lesson.id !== firstLesson?.id) {
                    alert("Kursni sotib oling yoki faqat birinchi darsni ko'ring!");
                    return;
                }
            }
        } else if (tutorial.purchaseScope === 'course_type') {
            // Oylik sotib olish - har bir oy uchun alohida tekshirish
            const currentType = courseTypes.find(ct => ct.slug === selectedTypeSlug);
            if (currentType && !currentType.is_purchased) {
                // Agar joriy oy sotib olinmagan bo'lsa, faqat birinchi videoga ruxsat
                const sortedLessons = [...lessons].sort((a, b) => {
                    const ao = Number.isFinite(a.order) ? a.order : a.id;
                    const bo = Number.isFinite(b.order) ? b.order : b.id;
                    return ao - bo;
                });
                const firstLesson = sortedLessons[0];

                if (lesson.id !== firstLesson?.id) {
                    alert("Bu oyni sotib oling yoki faqat birinchi darsni ko'ring!");
                    return;
                }
            } else if (currentType && currentType.is_purchased) {
                // Agar oy sotib olingan bo'lsa, lesson state bo'yicha tekshirish
                const isLocked = Boolean(lesson._state?.isLocked ?? (lesson.is_locked ?? lesson.isLocked));
                if (isLocked) {
                    alert("Oldingi darslarni tugatib, testlardan o'ting!");
                    return;
                }
            }
        }

        // Block play if whole month (course type) is locked
        const currentType = courseTypes.find(ct => ct.slug === selectedTypeSlug)
        if (currentType?.is_locked && tutorial.isPurchased) {
            alert("Bu oy qulflangan. Videoni ko'rish uchun oldingi shartlarni bajaring.");
            return;
        }

        const isLocked = Boolean(lesson._state?.isLocked ?? (lesson.is_locked ?? lesson.isLocked))
        if (isLocked && tutorial.isPurchased) {
            alert("Oldingi darslarni tugatib, testlardan o'ting!");
            return;
        }

        // Build lesson object for player, include HLS playlist url
        const hlsUrl = lesson.hls_playlist_url || lesson.hlsPlaylistUrl || '';
        let resume = 0
        try {
            const vp = await getVideoProgress(lesson.id)
            resume = Number(vp?.last_position || 0)
        } catch (_) { }
        navigate(`/tutorials/${tutorialSlug}/video/${lesson.id}`, {
            state: {
                lesson: {
                    id: lesson.id,
                    title: lesson.title,
                    description: lesson.description,
                    duration: lesson.duration ? `${lesson.duration} min` : '',
                    thumbnail: course?.thumbnail || course?.cover || '',
                    hls_playlist_url: hlsUrl,
                    resume_position: resume,
                },
                tutorialTitle: tutorial.title,
                monthName: currentMonth?.name || ''
            },
        });
    };

    const handleTestClick = (lesson) => {
        const watchedLessons = JSON.parse(localStorage.getItem("watchedLessons") || "[]");
        if (!watchedLessons.includes(lesson.id)) {
            alert("Avval videoni to'liq ko'ring!");
            return;
        }

        navigate(`/tutorials/${tutorialSlug}/test/${lesson.id}`, {
            state: { lesson },
        });
    };

    const handleAssignmentClick = (lesson) => {
        const watchedLessons = JSON.parse(localStorage.getItem("watchedLessons") || "[]");
        if (!watchedLessons.includes(lesson.id)) {
            alert("Avval videoni to'liq ko'ring!");
            return;
        }

        navigate(`/tutorials/${tutorialSlug}/assignment/${lesson.id}`, {
            state: { lesson },
        });
    };

    // Purchase functions
    const fetchWalletBalance = async () => {
        try {
            const balance = await walletPurchaseAPI.getBalance();
            setWalletBalance(balance);
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
        }
    };

    const handlePurchaseCourse = async () => {
        setPurchaseType('course');
        setSelectedCourseType(null);
        await fetchWalletBalance();
        setShowConfirmModal(true);
    };

    const handlePurchaseMonth = async (courseType) => {
        setPurchaseType('month');
        setSelectedCourseType(courseType);
        await fetchWalletBalance();
        setShowConfirmModal(true);
    };

    const confirmPurchase = async () => {
        setShowConfirmModal(false);
        setPurchaseLoading(true);
        setShowPurchaseModal(true);

        try {
            let result;
            if (purchaseType === 'course') {
                result = await walletPurchaseAPI.purchaseCourse(course.id);
            } else {
                result = await walletPurchaseAPI.purchaseCourseType(selectedCourseType.id);
            }

            setPurchaseResult(result);

            // Simulate loading time
            setTimeout(() => {
                setPurchaseLoading(false);
                setShowSuccessModal(true);

                // Trigger confetti effect
                createConfetti();

                // Update course data
                if (purchaseType === 'course') {
                    setCourse(prev => ({ ...prev, is_free: true, isPurchased: true }));
                } else {
                    setCourseTypes(prev => prev.map(ct =>
                        ct.id === selectedCourseType.id
                            ? { ...ct, is_locked: false }
                            : ct
                    ));
                }
            }, 2000);

        } catch (error) {
            console.error('Purchase error:', error);
            setPurchaseLoading(false);
            setShowPurchaseModal(false);
            alert('Xatolik yuz berdi. Qayta urinib ko\'ring.');
        }
    };

    const createConfetti = () => {
        // Simple confetti effect
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.zIndex = '10000';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = `confetti-fall ${Math.random() * 2 + 2}s linear forwards`;

            document.body.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }

        // Add CSS animation if not exists
        if (!document.getElementById('confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-10px) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setShowPurchaseModal(false);
        setPurchaseResult(null);
    };

    const handleMonthChange = (monthId) => {
        if (!isMonthUnlocked(monthId)) {
            alert("Oldingi oyni to'liq tugatib, barcha test va vazifalardan o'ting!");
            return;
        }
        setSelectedMonth(monthId);
    };

    const getOverallProgress = () => {
        if (courseProgress && typeof courseProgress.percent === 'number') {
            return Math.round(courseProgress.percent);
        }
        if (!tutorial) return 0;
        return Math.round((completedLessons.length / tutorial.totalLessons) * 100);
    };

    const getCompletedLessonsCount = () => completedLessons.length;

    const getAverageScore = () => {
        const scores = Object.values(lessonScores);
        if (scores.length === 0) return 0;
        return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    };

    // Month-level completion checks (API-based: completed videos only)
    const monthAllWatched = lessons.length > 0 && lessons.every(l => !!lessonWatched[l.id]);
    // New simplified rule: if user reached the last lesson OR all videos are watched, unlock finals
    const monthReadyForFinals = lastLessonReady || monthAllWatched;

    const handleMonthTestStart = () => {
        if (!monthReadyForFinals) return;
        const ct = courseTypes.find(ct => ct.slug === selectedTypeSlug)
        if (!ct) return;
        navigate(`/tutorials/${tutorialSlug}/month/${ct.id}/test`)
    };

    const handleMonthAssignmentStart = () => {
        if (!monthReadyForFinals) return;
        const ct = courseTypes.find(ct => ct.slug === selectedTypeSlug)
        if (!ct) return;
        navigate(`/tutorials/${tutorialSlug}/month/${ct.id}/assignment`)
    };

    const getMonthProgress = (monthId) => {
        const month = tutorial.months.find((m) => m.id === monthId);
        if (!month) return 0;
        const monthCompletedLessons = month.lessons.filter((lesson) => completedLessons.includes(lesson.id));
        return Math.round((monthCompletedLessons.length / month.lessons.length) * 100);
    };

    if (!tutorial) {
        return (
            <div className="tutorial-detail__error">
                <h2>Tutorial topilmadi</h2>
                <button onClick={() => navigate("/tutorials")}>Orqaga qaytish</button>
            </div>
        );
    }

    return (
        <div className="tutorial-detail">
            <div className="tutorial-detail__header">
                <div className="tutorial-detail__container">
                    <button className="tutorial-detail__back" onClick={() => navigate("/tutorials")}>
                        <ArrowLeft size={20} />
                        Orqaga
                    </button>

                    <div className="tutorial-detail__hero">
                        <div className="tutorial-detail__image">
                            <img src={tutorial.image || "/placeholder.svg"} alt={tutorial.title} />
                            <div className="tutorial-detail__play-overlay">
                                <Play size={48} />
                            </div>
                        </div>

                        <div className="tutorial-detail__info">
                            <div className="tutorial-detail__breadcrumb">
                                <span>Darsliklar</span>
                                <span>/</span>
                                <span>{tutorial.subject}</span>
                            </div>

                            <h1 className="tutorial-detail__title">{tutorial.title}</h1>
                            <p className="tutorial-detail__description">{tutorial.description}</p>

                            <div className="tutorial-detail__meta">
                                <div className="tutorial-detail__meta-item">
                                    <Star size={16} />
                                    <span>{tutorial.rating}</span>
                                </div>
                                <div className="tutorial-detail__meta-item">
                                    <Users size={16} />
                                    <span>{tutorial.students.toLocaleString()} o'quvchi</span>
                                </div>
                                <div className="tutorial-detail__meta-item">
                                    <Book size={16} />
                                    <span>{tutorial.totalLessons} dars</span>
                                </div>
                                <div className="tutorial-detail__meta-item">
                                    <Clock size={16} />
                                    <span>{tutorial.duration}</span>
                                </div>
                                <div className="tutorial-detail__meta-item">
                                    <Calendar size={16} />
                                    <span>{tutorial.level}</span>
                                </div>
                            </div>

                            <div onClick={() => navigate(`/channels/${tutorial.instructor.username}`)} className="tutorial-detail__instructor">
                                <img src={tutorial.instructor.avatar || "/placeholder.svg"} alt={tutorial.instructor.name} />
                                <div className="tutorial-detail__instructor-info">
                                    <h4>{tutorial.instructor.name}</h4>
                                    <h6>{tutorial.instructor.username}</h6>
                                    <p>{tutorial.instructor.bio}</p>
                                </div>
                            </div>

                            {shouldShowPurchaseButton() && tutorial.purchaseScope === 'course' && (
                                <div className="tutorial-detail__purchase">
                                    <div className="tutorial-detail__price">
                                        <span className="tutorial-detail__price-amount">{tutorial.price} FixCoin</span>
                                        <span className="tutorial-detail__price-label">Butun kurs</span>
                                    </div>
                                    <button
                                        className="tutorial-detail__purchase-btn"
                                        onClick={handlePurchaseCourse}
                                    >
                                        <ShoppingCart size={20} />
                                        Butun kursni sotib olish
                                    </button>
                                </div>
                            )}

                            {checkPurchaseStatus() && tutorial.purchaseScope === 'course' && (
                                <div className="tutorial-detail__purchased">
                                    <div className="tutorial-detail__purchased-badge">
                                        <CheckCircle size={20} />
                                        <span>Sotib olingan</span>
                                    </div>
                                </div>
                            )}

                            {tutorial.isPurchased && (
                                <div className="tutorial-detail__stats">
                                    <div className="tutorial-detail__progress">
                                        <div className="tutorial-detail__progress-bar">
                                            <div className="tutorial-detail__progress-fill" style={{ width: `${getOverallProgress()}%` }} />
                                        </div>
                                        <span className="tutorial-detail__progress-text">
                                            {getOverallProgress()}% tugallangan {courseProgress ? `(${courseProgress.completed_videos}/${courseProgress.total_videos} dars)` : `(${getCompletedLessonsCount()}/${tutorial.totalLessons} dars)`}
                                        </span>
                                    </div>

                                    <div className="tutorial-detail__score">
                                        <Award size={16} />
                                        <span>O'rtacha ball: {getAverageScore()}%</span>
                                    </div>
                                    {Array.isArray(courseProgress?.types) && courseProgress.types.length > 0 && (
                                        <div className="tutorial-detail__progress-breakdown" style={{ marginTop: 8 }}>
                                            {courseProgress.types.map((t) => (
                                                <div key={t.id} className="tutorial-detail__progress-type" style={{ fontSize: 12, opacity: 0.8 }}>
                                                    <span>{t.name}: {Math.round(t.percent)}% ({t.completed_videos}/{t.total_videos})</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>

            <div className="tutorial-detail__content">
                <div className="tutorial-detail__container">
                    <div className="tutorial-detail__months">
                        {(tutorial.months || []).map((month) => {
                            const courseType = courseTypes.find(ct => ct.slug === month.slug);
                            const locked = Boolean(courseType?.is_locked);
                            const t = (courseProgress?.types || []).find(tp => tp.slug === month.slug)
                            const percent = t ? Math.round(t.percent || 0) : 0
                            const completed = t ? (t.completed_videos || 0) : 0
                            const total = t ? (t.total_videos || 0) : 0
                            const remain = Math.max(0, total - completed)

                            // Price logic - agar null bo'lsa "Bepul", aks holda narx
                            const monthPrice = courseType?.price ? parseFloat(courseType.price) : null
                            const isPurchased = courseType?.is_purchased || false
                            const priceText = monthPrice ? `${monthPrice} FixCoin` : "Bepul"
                            const isFree = !monthPrice

                            return (
                                <button
                                    key={month.id}
                                    className={`tutorial-detail__month-tab ${selectedTypeSlug === month.slug ? "active" : ""} ${locked ? "locked" : ""}`}
                                    onClick={() => setSelectedTypeSlug(month.slug)}
                                    title={locked ? "Bu oy qulflangan (ko'rish mumkin, lekin darslarni ko'rib bo'lmaydi)" : month.name}
                                >
                                    <div className="tutorial-detail__month-info">
                                        <div className="tutorial-detail__month-header">
                                            <h3>
                                                {month.name}
                                                {locked && <Lock size={14} style={{ marginLeft: 6 }} />}
                                            </h3>
                                            <div className="tutorial-detail__month-price">
                                                {isFree ? (
                                                    <span className="free-badge">Bepul</span>
                                                ) : (
                                                    <span className="price-text">{priceText}</span>
                                                )}
                                            </div>
                                        </div>
                                        <p>{month.description}</p>

                                        {/* Progress bar */}
                                        <div className="tutorial-detail__month-lessons" style={{ display: 'grid', gap: 6 }}>
                                            <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                                                <div style={{ width: `${percent}%`, height: '100%', background: 'linear-gradient(90deg, #6c5ce7, #8b7bff)' }} />
                                            </div>
                                            <div style={{ fontSize: 12, opacity: 0.9, display: 'flex', gap: 8 }}>
                                                <span>{percent}%</span>
                                                <span>•</span>
                                                <span>Qolgan: {remain}</span>
                                                {total > 0 && (<>
                                                    <span>•</span>
                                                    <span>{completed}/{total}</span>
                                                </>)}
                                            </div>
                                        </div>

                                        {/* Purchase button - faqat course_type scope da va sotib olinmagan oylar uchun */}
                                        {tutorial.purchaseScope === 'course_type' && monthPrice && !isPurchased && (
                                            <div className="tutorial-detail__month-purchase-inline">
                                                <button
                                                    className="tutorial-detail__month-purchase-btn-small"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Tab click ni to'xtatish
                                                        handlePurchaseMonth(courseType);
                                                    }}
                                                >
                                                    <CreditCard size={14} />
                                                    <span>Sotib olish</span>
                                                </button>
                                            </div>
                                        )}

                                        {/* Purchased badge - sotib olingan oylar uchun */}
                                        {tutorial.purchaseScope === 'course_type' && isPurchased && (
                                            <div className="tutorial-detail__month-purchased-inline">
                                                <div className="tutorial-detail__month-purchased-badge">
                                                    <CheckCircle size={14} />
                                                    <span>Sotib olingan</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>

                    {currentMonth && (
                        <div className="tutorial-detail__month-content">
                            <div className="tutorial-detail__month-header">
                                <h2 className="tutorial-detail__month-title">{currentMonth.name}</h2>
                                <p className="tutorial-detail__month-description">{currentMonth.description}</p>


                            </div>

                            <div className="tutorial-detail__lessons">
                                {lessonsWithState.map((lesson, index) => {
                                    // Purchase scope bo'yicha lock logic
                                    const sortedLessons = [...lessons].sort((a, b) => {
                                        const ao = Number.isFinite(a.order) ? a.order : a.id;
                                        const bo = Number.isFinite(b.order) ? b.order : b.id;
                                        return ao - bo;
                                    });
                                    const firstLesson = sortedLessons[0];
                                    const isFirstLesson = lesson.id === firstLesson?.id;

                                    let isLocked = false;

                                    if (tutorial.purchaseScope === 'course') {
                                        // Butun kurs sotib olish
                                        isLocked = tutorial.isPurchased
                                            ? !!lesson._state?.isLocked
                                            : !isFirstLesson;
                                    } else if (tutorial.purchaseScope === 'course_type') {
                                        // Oylik sotib olish
                                        const currentType = courseTypes.find(ct => ct.slug === selectedTypeSlug);
                                        if (currentType && currentType.is_purchased) {
                                            // Oy sotib olingan bo'lsa, faqat lesson state bo'yicha
                                            isLocked = !!lesson._state?.isLocked;
                                        } else {
                                            // Oy sotib olinmagan bo'lsa, faqat birinchi dars ochiq
                                            isLocked = !isFirstLesson;
                                        }
                                    }
                                    const isWatched = !!lesson._state?.watched;
                                    const testResult = testResults[lesson.id];
                                    const assignmentResult = assignmentResults[lesson.id];
                                    const isCompleted = !!lesson._state?.completed;

                                    return (
                                        <div
                                            key={lesson.id}
                                            className={`lesson-item ${isCompleted ? "completed" : ""}`}
                                        >
                                            <div className={`lesson-item__number ${isLocked ? "locked" : ""}`}>
                                                {index + 1}
                                            </div>

                                            <div className="lesson-item__content">
                                                <h4 className="lesson-item__title">{lesson.title}</h4>
                                                <p className="lesson-item__description">{lesson.description}</p>

                                                {(testResult || assignmentResult) && (
                                                    <div className="lesson-item__results">
                                                        {testResult && (
                                                            <div
                                                                className={`lesson-item__result-banner test ${testResult.passed ? "passed" : "failed"}`}
                                                            >
                                                                <Trophy size={14} />
                                                                <span>
                                                                    Test: {testResult.score}% {testResult.passed ? "✓" : "✗"}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {assignmentResult && (
                                                            <div
                                                                className={`lesson-item__result-banner assignment ${assignmentResult.passed ? "passed" : "failed"}`}
                                                            >
                                                                <Award size={14} />
                                                                <span>
                                                                    Vazifa: {assignmentResult.score}% {assignmentResult.passed ? "✓" : "✗"}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="lesson-item__meta">
                                                    <span className="lesson-item__duration">
                                                        <Clock size={14} />
                                                        {Number.isFinite(lesson.duration) && lesson.duration !== null ? `${lesson.duration} min` : (lesson.duration || '')}
                                                    </span>
                                                    {lesson.has_test && <span className="lesson-item__badge test">Test</span>}
                                                    {lesson.has_assignment && <span className="lesson-item__badge assignment">Vazifa</span>}
                                                    {lessonScores[lesson.id] && (
                                                        <span className="lesson-item__score">
                                                            <Trophy size={14} />
                                                            {lessonScores[lesson.id]}%
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="lesson-item__actions">
                                                    <button
                                                        className={`lesson-item__action-btn ${isLocked && !isFirstLesson ? 'locked' : 'primary'}`}
                                                        onClick={() => handleLessonClick(lesson)}
                                                        disabled={isLocked && !isFirstLesson}
                                                        title={(() => {
                                                            if (isLocked && !isFirstLesson) {
                                                                if (tutorial.purchaseScope === 'course') {
                                                                    return tutorial.isPurchased ? 'Oldingi darslarni tugatib, testlardan o\'ting!' : 'Kursni sotib oling';
                                                                } else if (tutorial.purchaseScope === 'course_type') {
                                                                    const currentType = courseTypes.find(ct => ct.slug === selectedTypeSlug);
                                                                    return currentType?.is_purchased ? 'Oldingi darslarni tugatib, testlardan o\'ting!' : 'Bu oyni sotib oling';
                                                                }
                                                            }
                                                            return 'Darsni ko\'rish';
                                                        })()}
                                                    >
                                                        {isLocked && !isFirstLesson ? (
                                                            <>
                                                                <Lock size={16} />
                                                                Qulflangan
                                                            </>
                                                        ) : isFirstLesson && (() => {
                                                            if (tutorial.purchaseScope === 'course') {
                                                                return !tutorial.isPurchased;
                                                            } else if (tutorial.purchaseScope === 'course_type') {
                                                                const currentType = courseTypes.find(ct => ct.slug === selectedTypeSlug);
                                                                return !currentType?.is_purchased;
                                                            }
                                                            return false;
                                                        })() ? (
                                                            <>
                                                                <Gift size={16} />
                                                                Bepul dars
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Play size={16} />
                                                                Darsni ko'rish
                                                            </>
                                                        )}
                                                    </button>
                                                    {lesson.has_test && (
                                                        <button
                                                            className={`lesson-item__action-btn test ${testResult?.passed ? 'passed' : ''} ${isLocked ? 'locked' : ''}`}
                                                            onClick={() => navigate(`/tutorials/${tutorialSlug}/test/${lesson.id}`)}
                                                            disabled={isLocked}
                                                            title={isLocked ? 'Avval videoni ko\'ring!' : testResult?.passed ? 'Test yakunlandi!' : 'Testni boshlash'}
                                                        >
                                                            {testResult?.passed ? 'Test ✓' : 'Test'}
                                                        </button>
                                                    )}
                                                    {lesson.has_assignment && (
                                                        <button
                                                            className={`lesson-item__action-btn assignment ${assignmentResult?.passed ? 'passed' : ''} ${isLocked ? 'locked' : ''}`}
                                                            onClick={() => navigate(`/tutorials/${tutorialSlug}/assignment/${lesson.id}`)}
                                                            disabled={isLocked}
                                                        >
                                                            {assignmentResult?.passed ? 'Vazifa ✓' : 'Vazifa'}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="lesson-item__status">
                                                {isCompleted ? (
                                                    <CheckCircle className="lesson-item__completed-icon" />
                                                ) : isLocked ? (
                                                    <Lock className="lesson-item__locked-icon" />
                                                ) : (
                                                    <Play className="lesson-item__play-icon" />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {/* Month-level actions: visible for any month, unlocked when last video reached or all watched */}
                                <div className="month-actions" style={{ marginTop: 16 }}>
                                    {!monthReadyForFinals && (
                                        <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 8, textAlign: 'center' }}>
                                            Talablar: {monthAllWatched ? "Barcha darslar ko'rilgan ✓" : "Barcha darslarni ko'ring ✗"}
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                                        {hasMonthTest && (
                                            <button
                                                className={`lesson-item__action-btn test ${!monthReadyForFinals ? 'disabled' : ''}`}
                                                disabled={!monthReadyForFinals}
                                                title={monthReadyForFinals ? 'Umumiy testni boshlash' : "Avval barcha darslar, test va vazifalarni yakunlang"}
                                                onClick={handleMonthTestStart}
                                            >
                                                <FileText size={16} />
                                                Umumiy Test
                                            </button>
                                        )}
                                        {hasMonthAssignment && (
                                            <button
                                                className={`lesson-item__action-btn assignment ${!monthReadyForFinals ? 'disabled' : ''}`}
                                                disabled={!monthReadyForFinals}
                                                title={monthReadyForFinals ? 'Umumiy vazifani boshlash' : "Avval barcha darslar, test va vazifalarni yakunlang"}
                                                onClick={handleMonthAssignmentStart}
                                            >
                                                <Upload size={16} />
                                                Umumiy Vazifa
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="purchase-modal-overlay" onClick={() => setShowConfirmModal(false)}>
                    <div className="purchase-modal confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="purchase-modal-header">
                            <h3>Sotib olishni tasdiqlang</h3>
                            <button
                                className="purchase-modal-close"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="purchase-modal-content">
                            <div className="purchase-confirm-info">
                                <div className="purchase-item-info">
                                    <h4>
                                        {purchaseType === 'course'
                                            ? `${tutorial.title} (Butun kurs)`
                                            : `${selectedCourseType?.name} (${tutorial.title})`
                                        }
                                    </h4>
                                    <div className="purchase-price">
                                        <Coins size={20} />
                                        <span>
                                            {purchaseType === 'course'
                                                ? `${tutorial.price} FixCoin`
                                                : `${selectedCourseType?.price || '29.99'} FixCoin`
                                            }
                                        </span>
                                    </div>
                                </div>

                                <div className="wallet-balance">
                                    <h5>Hamyon balansi:</h5>
                                    <div className="balance-amount">
                                        <Coins size={16} />
                                        <span>{walletBalance?.balance || '0.00'} {walletBalance?.currency || 'FixCoin'}</span>
                                    </div>
                                </div>

                                <div className="purchase-question">
                                    <p>Rostdan ham sotib olishni xohlaysizmi?</p>
                                </div>
                            </div>
                        </div>

                        <div className="purchase-modal-actions">
                            <button
                                className="purchase-cancel-btn"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Bekor qilish
                            </button>
                            <button
                                className="purchase-confirm-btn"
                                onClick={confirmPurchase}
                            >
                                <ShoppingCart size={16} />
                                Ha, sotib olaman
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Purchase Loading Modal */}
            {showPurchaseModal && (
                <div className="purchase-modal-overlay">
                    <div className="purchase-modal loading-modal">
                        {purchaseLoading ? (
                            <div className="purchase-loading">
                                <div className="purchase-spinner"></div>
                                <h3>Sotib olinmoqda...</h3>
                                <p>Iltimos kuting, tranzaksiya amalga oshirilmoqda</p>
                            </div>
                        ) : showSuccessModal && (
                            <div className="purchase-success">
                                <div className="success-icon">
                                    <Gift size={48} />
                                </div>
                                <h3>Tabriklaymiz! 🎉</h3>
                                <p>
                                    {purchaseType === 'course'
                                        ? 'Butun kurs muvaffaqiyatli sotib olindi!'
                                        : `${selectedCourseType?.name} muvaffaqiyatli sotib olindi!`
                                    }
                                </p>
                                <div className="success-details">
                                    <div className="success-item">
                                        <span>Kurs:</span>
                                        <span>{purchaseResult?.course?.title || tutorial.title}</span>
                                    </div>
                                    <div className="success-item">
                                        <span>Narx:</span>
                                        <span>{purchaseResult?.course?.price || selectedCourseType?.price} FixCoin</span>
                                    </div>
                                    <div className="success-item">
                                        <span>Tranzaksiya ID:</span>
                                        <span>#{purchaseResult?.transaction_id}</span>
                                    </div>
                                </div>
                                <div className="success-message">
                                    <Sparkles size={20} />
                                    <span>
                                        {purchaseType === 'course'
                                            ? 'Endi barcha darslarni ko\'rishingiz mumkin!'
                                            : 'Endi bu oyning darslarini ko\'rishingiz mumkin!'
                                        }
                                    </span>
                                </div>
                                <button
                                    className="success-close-btn"
                                    onClick={closeSuccessModal}
                                >
                                    Davom etish
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorialDetail;