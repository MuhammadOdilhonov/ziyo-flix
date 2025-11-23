import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiUsers, FiBook, FiFileText, FiLock, FiUnlock, FiHome, FiHelpCircle, FiCalendar, FiSettings, FiCheck } from 'react-icons/fi';
import { getStudentClassrooms, joinClassroom } from '../../api/apiClassroom';
import { setSeoTags, setRobots } from '../../utils/seo';

const StudentClassrooms = () => {
    const navigate = useNavigate();
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinPassword, setJoinPassword] = useState('');
    const [joinError, setJoinError] = useState('');
    const [joining, setJoining] = useState(false);
    const [showTabSelector, setShowTabSelector] = useState(false);
    const [selectedClassroomId, setSelectedClassroomId] = useState(null);
    const [selectedTabs, setSelectedTabs] = useState(['stream', 'classwork', 'questions']);

    // Available tabs for students
    const availableTabs = [
        { id: 'stream', name: 'Oqim', icon: FiHome, description: 'Asosiy oqim - e\'lonlar va yangiliklar' },
        { id: 'classwork', name: 'Darslar', icon: FiBook, description: 'Darslar - vazifalar, testlar, materiallar' },
        { id: 'questions', name: 'Savollar', icon: FiHelpCircle, description: 'Mening savollarim' },
        { id: 'attendance', name: 'Davomat', icon: FiCalendar, description: 'Mening davomatim' }
    ];

    useEffect(() => {
        fetchClassrooms();
    }, []);

    useEffect(() => {
        setSeoTags({
            title: "Klassroom — O'quvchi — ZiyoFlix",
            description: "Sinf xonalari: darslar, topshiriqlar, testlar va oqim. Bilimingizni oshiring, o‘qituvchi bilan birga o‘rganing.",
            image: '/Ziyo-Flix-Logo.png',
            type: 'website'
        })
        setRobots('noindex, nofollow')
    }, [])

    const fetchClassrooms = async () => {
        try {
            setLoading(true);
            const response = await getStudentClassrooms();
            setClassrooms(response.results || []);
        } catch (error) {
            console.error('Error fetching classrooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinClassroom = async (e) => {
        e.preventDefault();
        setJoinError('');

        if (!joinCode.trim()) {
            setJoinError('Sinf kodini kiriting');
            return;
        }

        try {
            setJoining(true);
            await joinClassroom(joinCode, joinPassword || null);
            setShowJoinModal(false);
            setJoinCode('');
            setJoinPassword('');
            fetchClassrooms();
        } catch (error) {
            setJoinError(error.error || 'Sinfga qo\'shilishda xatolik');
        } finally {
            setJoining(false);
        }
    };

    const handleClassroomClick = (classroomId) => {
        navigate(`/user/classroom/${classroomId}/stream`);
    };

    const handleTabSelection = (classroomId) => {
        setSelectedClassroomId(classroomId);
        // Load saved tabs for this classroom
        const savedTabs = localStorage.getItem(`student-classroom-tabs-${classroomId}`);
        if (savedTabs) {
            try {
                const parsedTabs = JSON.parse(savedTabs);
                if (Array.isArray(parsedTabs) && parsedTabs.length > 0) {
                    setSelectedTabs(parsedTabs);
                }
            } catch (error) {
                console.error('Error parsing saved tabs:', error);
                setSelectedTabs(['stream', 'classwork', 'questions']);
            }
        } else {
            setSelectedTabs(['stream', 'classwork', 'questions']);
        }
        setShowTabSelector(true);
    };

    const handleTabToggle = (tabId) => {
        if (selectedTabs.includes(tabId)) {
            // Remove tab if already selected (but keep at least 1 tab)
            if (selectedTabs.length > 3) {
                setSelectedTabs(selectedTabs.filter(id => id !== tabId));
            }
        } else {
            // Add tab if not selected (but keep max 3 tabs)
            if (selectedTabs.length < 4) {
                setSelectedTabs([...selectedTabs, tabId]);
            }
        }
    };

    const saveTabSelection = () => {
        if (selectedClassroomId) {
            // Save to localStorage for persistence
            localStorage.setItem(`student-classroom-tabs-${selectedClassroomId}`, JSON.stringify(selectedTabs));
            setShowTabSelector(false);
            // Navigate to classroom with first selected tab
            const firstTab = selectedTabs[0] || 'stream';
            navigate(`/user/classroom/${selectedClassroomId}/${firstTab}`);
        }
    };

    if (loading) {
        return (
            <div className="student-classrooms">
                <div className="sc-loading">
                    <div className="spinner"></div>
                    <p>Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="student-classrooms">
            <div className="sc-header">
                <div className="sc-header-content">
                    <h1>Mening Sinflarim</h1>
                    <p>Sinf xonalari: darslar, topshiriqlar, testlar va oqim. Bilimingizni oshiring, o‘qituvchi bilan birga o‘rganing.</p>
                </div>
                <button
                    className="sc-join-btn"
                    onClick={() => setShowJoinModal(true)}
                    title="Sinfga qo'shilish"
                >
                    <FiPlus /> Sinfga qo'shilish
                </button>
            </div>

            {classrooms.length === 0 ? (
                <div className="sc-empty">
                    <div className="sc-empty-icon">
                        <FiBook />
                    </div>
                    <h2>Hali sinflar yo'q</h2>
                    <p>O'qituvchidan sinf kodini olib, qo'shiling</p>
                    <button
                        className="sc-empty-btn"
                        onClick={() => setShowJoinModal(true)}
                    >
                        <FiPlus /> Sinfga qo'shilish
                    </button>
                </div>
            ) : (
                <div className="sc-grid">
                    {classrooms.map(classroom => (
                        <div
                            key={classroom.id}
                            className="sc-card"
                            style={{ '--theme-color': classroom.theme_color }}
                            onClick={() => handleClassroomClick(classroom.id)}
                        >
                            <div className="sc-card-header">
                                <div className="sc-card-title">
                                    <h3>{classroom.name}</h3>
                                    <span className="sc-card-section">{classroom.section}</span>
                                </div>
                                <div className="sc-card-privacy">
                                    {classroom.is_private ? (
                                        <span className="sc-privacy-badge private" title="Maxfiy sinf">
                                            <FiLock />
                                        </span>
                                    ) : (
                                        <span className="sc-privacy-badge public" title="Ochiq sinf">
                                            <FiUnlock />
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="sc-card-body">
                                <div className="sc-card-info">
                                    <p className="sc-card-subject">
                                        <FiBook /> {classroom.subject}
                                    </p>
                                    <p className="sc-card-teacher">
                                        O'qituvchi: {classroom.teacher.full_name}
                                    </p>
                                </div>
                                <p className="sc-card-description">{classroom.description}</p>
                            </div>

                            <div className="sc-card-stats">
                                <div className="sc-stat" title="O'quvchilar soni">
                                    <FiUsers />
                                    <span>{classroom.students_count}</span>
                                </div>
                                <div className="sc-stat" title="Topshiriqlar soni">
                                    <FiFileText />
                                    <span>{classroom.assignments_count}</span>
                                </div>
                                <div className="sc-stat" title="Materiallar soni">
                                    <FiBook />
                                    <span>{classroom.materials_count}</span>
                                </div>
                            </div>

                            <div className="sc-card-footer">
                                <button
                                    className="sc-tab-selector-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTabSelection(classroom.id);
                                    }}
                                    title="Sinfga qo'shilish - kerakli funksiyalarni tanlang"
                                >
                                    <FiSettings />
                                    <span>Qo'shilish</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Join Classroom Modal */}
            {showJoinModal && (
                <div className="sc-modal-overlay" onClick={() => setShowJoinModal(false)}>
                    <div className="sc-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="sc-modal-header">
                            <h2>Sinfga Qo'shilish</h2>
                            <button
                                className="sc-modal-close"
                                onClick={() => setShowJoinModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleJoinClassroom} className="sc-modal-form">
                            <div className="sc-form-group">
                                <label>Sinf kodi *</label>
                                <input
                                    type="text"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                    placeholder="Masalan: ABC123"
                                    required
                                    maxLength="6"
                                />
                                <p className="sc-form-hint">
                                    O'qituvchidan sinf kodini so'rang
                                </p>
                            </div>

                            <div className="sc-form-group">
                                <label>Parol (agar maxfiy bo'lsa)</label>
                                <input
                                    type="password"
                                    value={joinPassword}
                                    onChange={(e) => setJoinPassword(e.target.value)}
                                    placeholder="Parolni kiriting"
                                />
                                <p className="sc-form-hint">
                                    Maxfiy sinflar uchun parol talab qilinadi
                                </p>
                            </div>

                            {joinError && (
                                <div className="sc-error-message">
                                    {joinError}
                                </div>
                            )}

                            <div className="sc-modal-actions">
                                <button
                                    type="button"
                                    className="sc-btn-cancel"
                                    onClick={() => setShowJoinModal(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    className="sc-btn-submit"
                                    disabled={joining}
                                >
                                    {joining ? 'Qo\'shilmoqda...' : 'Qo\'shilish'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tab Selection Modal */}
            {showTabSelector && (
                <div className="sc-tab-modal-overlay" onClick={() => setShowTabSelector(false)}>
                    <div className="sc-tab-selector-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="sc-tab-modal-header">
                            <h3>Kerakli funksiyalarni tanlang</h3>
                            <p>Sinfga qo'shilishda qaysi bo'limlar ko'rinishini tanlang (maksimal 3 ta)</p>
                            <button
                                className="sc-tab-modal-close"
                                onClick={() => setShowTabSelector(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="sc-tab-modal-content">
                            <div className="sc-tab-grid">
                                {availableTabs.map(tab => {
                                    const IconComponent = tab.icon;
                                    const isSelected = selectedTabs.includes(tab.id);
                                    const canSelect = !isSelected && selectedTabs.length < 4;
                                    const canDeselect = isSelected && selectedTabs.length > 3;

                                    return (
                                        <div
                                            key={tab.id}
                                            className={`sc-tab-option ${isSelected ? 'selected' : ''} ${!canSelect && !isSelected ? 'disabled' : ''
                                                }`}
                                            onClick={() => {
                                                if (canSelect || canDeselect) {
                                                    handleTabToggle(tab.id);
                                                }
                                            }}
                                        >
                                            <div className="sc-tab-option-header">
                                                <div className="sc-tab-option-icon">
                                                    <IconComponent />
                                                </div>
                                                <div className="sc-tab-option-check">
                                                    {isSelected && <FiCheck />}
                                                </div>
                                            </div>
                                            <h4>{tab.name}</h4>
                                            <p>{tab.description}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="sc-tab-selection-info">
                                <div className="sc-selection-counter">
                                    <span>Tanlangan: <strong>{selectedTabs.length}/3</strong></span>
                                </div>
                                <div className="sc-selected-tabs">
                                    {selectedTabs.map(tabId => {
                                        const tab = availableTabs.find(t => t.id === tabId);
                                        return tab ? (
                                            <span key={tabId} className="sc-selected-tag">
                                                <tab.icon />
                                                {tab.name}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="sc-tab-modal-footer">
                            <button
                                className="sc-tab-btn sc-tab-btn-cancel"
                                onClick={() => setShowTabSelector(false)}
                            >
                                Bekor qilish
                            </button>
                            <button
                                className="sc-tab-btn sc-tab-btn-save"
                                onClick={saveTabSelection}
                                disabled={selectedTabs.length === 0}
                            >
                                Saqlash va Kirish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentClassrooms;
