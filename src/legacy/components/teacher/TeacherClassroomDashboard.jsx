import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route, NavLink } from 'react-router-dom';
import { FiHome, FiBook, FiUsers, FiBarChart2, FiArrowLeft, FiFileText, FiHelpCircle, FiCalendar, FiSettings, FiCheck } from 'react-icons/fi';
import { getClassroomDetail } from '../../api/apiClassroom';
import TeacherClassroomStream from './TeacherClassroomStream';
import TeacherClasswork from './TeacherClasswork';
import TeacherClassroomPeople from './TeacherClassroomPeople';
import TeacherClassroomGrades from './TeacherClassroomGrades';
import TeacherSubmittedAssignments from './TeacherSubmittedAssignments';
import TeacherQuestions from './TeacherQuestions';
import TeacherAttendance from './TeacherAttendance';

const TeacherClassroomDashboard = () => {
    const { classroomId } = useParams();
    const navigate = useNavigate();
    const [classroom, setClassroom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTabSelector, setShowTabSelector] = useState(false);
    const [selectedTabs, setSelectedTabs] = useState(['stream', 'classwork', 'submitted']);

    // Available tabs configuration
    const availableTabs = [
        { id: 'stream', name: 'Oqim', icon: FiHome, description: 'Asosiy oqim - e\'lonlar va yangiliklar' },
        { id: 'classwork', name: 'Darslar', icon: FiBook, description: 'Darslar - vazifalar, testlar, materiallar' },
        { id: 'submitted', name: 'Topshirilgan', icon: FiFileText, description: 'Topshirilgan vazifalar' },
        { id: 'questions', name: 'Savollar', icon: FiHelpCircle, description: 'O\'quvchilar savollari' },
        { id: 'attendance', name: 'Davomat', icon: FiCalendar, description: 'Davomat - o\'quvchilar qatnashishi' },
        { id: 'people', name: 'O\'quvchilar', icon: FiUsers, description: 'O\'quvchilar ro\'yxati va boshqaruv' },
        { id: 'grades', name: 'Baholar', icon: FiBarChart2, description: 'Baholar jurnali va statistika' }
    ];

    useEffect(() => {
        fetchClassroomDetail();
    }, [classroomId]);

    const fetchClassroomDetail = async () => {
        try {
            setLoading(true);
            const data = await getClassroomDetail(classroomId);
            setClassroom(data);
        } catch (error) {
            console.error('Error fetching classroom:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabToggle = (tabId) => {
        if (selectedTabs.includes(tabId)) {
            // Remove tab if already selected (but keep at least 1 tab)
            if (selectedTabs.length > 3) {
                setSelectedTabs(selectedTabs.filter(id => id !== tabId));
            }
        } else {
            // Add tab if not selected (but keep max 3 tabs)
            if (selectedTabs.length < 7) {
                setSelectedTabs([...selectedTabs, tabId]);
            }
        }
    };

    const saveTabSelection = () => {
        // Save to localStorage for persistence
        localStorage.setItem(`classroom-tabs-${classroomId}`, JSON.stringify(selectedTabs));
        setShowTabSelector(false);
    };

    // Load saved tabs on component mount
    useEffect(() => {
        const savedTabs = localStorage.getItem(`classroom-tabs-${classroomId}`);
        if (savedTabs) {
            try {
                const parsedTabs = JSON.parse(savedTabs);
                if (Array.isArray(parsedTabs) && parsedTabs.length > 0) {
                    setSelectedTabs(parsedTabs);
                }
            } catch (error) {
                console.error('Error parsing saved tabs:', error);
            }
        }
    }, [classroomId]);

    if (loading) {
        return (
            <div className="tcd-loading">
                <div className="spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    if (!classroom) {
        return (
            <div className="tcd-error">
                <p>Sinf topilmadi</p>
                <button onClick={() => navigate('/teacher/classrooms')}>
                    Orqaga
                </button>
            </div>
        );
    }

    return (
        <div className="teacher-classroom-dashboard">
            <div className="tcd-header" style={{ '--theme-color': classroom.theme_color }}>
                <button 
                    className="tcd-back-btn"
                    onClick={() => navigate('/teacher/classrooms')}
                    title="Sinflar ro'yxatiga qaytish"
                >
                    <FiArrowLeft /> Orqaga
                </button>

                <div className="tcd-header-content">
                    <h1>{classroom.name}</h1>
                    <div className="tcd-header-info">
                        <span>{classroom.section}</span>
                        <span>•</span>
                        <span>{classroom.subject}</span>
                        <span>•</span>
                        <span>{classroom.room}</span>
                    </div>
                </div>

                <div className="tcd-header-code">
                    <span className="tcd-code-label">Sinf kodi:</span>
                    <span className="tcd-code-value">{classroom.code}</span>
                </div>

                <button 
                    className="tcd-settings-btn"
                    onClick={() => setShowTabSelector(true)}
                    title="Tab sozlamalarini o'zgartirish"
                >
                    <FiSettings />
                </button>
            </div>

            <nav className="tcd-nav">
                {availableTabs
                    .filter(tab => selectedTabs.includes(tab.id))
                    .map(tab => {
                        const IconComponent = tab.icon;
                        return (
                            <NavLink 
                                key={tab.id}
                                to={`/teacher/classroom/${classroomId}/${tab.id}`}
                                className={({ isActive }) => isActive ? 'tcd-nav-link active' : 'tcd-nav-link'}
                                title={tab.description}
                            >
                                <IconComponent /> {tab.name}
                            </NavLink>
                        );
                    })
                }
            </nav>

            <div className="tcd-content">
                <Routes>
                    <Route path="stream" element={<TeacherClassroomStream classroom={classroom} />} />
                    <Route path="classwork" element={<TeacherClasswork classroom={classroom} />} />
                    <Route path="submitted" element={<TeacherSubmittedAssignments classroom={classroom} />} />
                    <Route path="questions" element={<TeacherQuestions classroom={classroom} />} />
                    <Route path="attendance" element={<TeacherAttendance classroom={classroom} />} />
                    <Route path="people" element={<TeacherClassroomPeople classroom={classroom} />} />
                    <Route path="grades" element={<TeacherClassroomGrades classroom={classroom} />} />
                </Routes>
            </div>

            {/* Tab Selection Modal */}
            {showTabSelector && (
                <div className="tcd-modal-overlay" onClick={() => setShowTabSelector(false)}>
                    <div className="tcd-tab-selector-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tcd-modal-header">
                            <h3>Dashboard tablarini tanlang</h3>
                            <p>Maksimal 3 ta tab tanlashingiz mumkin</p>
                            <button 
                                className="tcd-modal-close"
                                onClick={() => setShowTabSelector(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="tcd-modal-content">
                            <div className="tcd-tab-grid">
                                {availableTabs.map(tab => {
                                    const IconComponent = tab.icon;
                                    const isSelected = selectedTabs.includes(tab.id);
                                    const canSelect = !isSelected && selectedTabs.length < 7;
                                    const canDeselect = isSelected && selectedTabs.length > 3;
                                    
                                    return (
                                        <div 
                                            key={tab.id}
                                            className={`tcd-tab-option ${isSelected ? 'selected' : ''} ${
                                                !canSelect && !isSelected ? 'disabled' : ''
                                            }`}
                                            onClick={() => {
                                                if (canSelect || canDeselect) {
                                                    handleTabToggle(tab.id);
                                                }
                                            }}
                                        >
                                            <div className="tcd-tab-option-header">
                                                <div className="tcd-tab-option-icon">
                                                    <IconComponent />
                                                </div>
                                                <div className="tcd-tab-option-check">
                                                    {isSelected && <FiCheck />}
                                                </div>
                                            </div>
                                            <h4>{tab.name}</h4>
                                            <p>{tab.description}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="tcd-selection-info">
                                <p>
                                    Tanlangan: <strong>{selectedTabs.length}/3</strong>
                                </p>
                                <div className="tcd-selected-tabs">
                                    {selectedTabs.map(tabId => {
                                        const tab = availableTabs.find(t => t.id === tabId);
                                        return tab ? (
                                            <span key={tabId} className="tcd-selected-tag">
                                                {tab.name}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="tcd-modal-footer">
                            <button 
                                className="tcd-btn tcd-btn-secondary"
                                onClick={() => setShowTabSelector(false)}
                            >
                                Bekor qilish
                            </button>
                            <button 
                                className="tcd-btn tcd-btn-primary"
                                onClick={saveTabSelection}
                                disabled={selectedTabs.length === 0}
                            >
                                Saqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherClassroomDashboard;
