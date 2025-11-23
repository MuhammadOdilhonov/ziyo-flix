import React, { useState, useEffect } from 'react';
import { 
    getModerationCourses,
    getModerationCourseTypes,
    getModerationCourseVideos,
    setCourseStatus,
    setCourseTypeStatus,
    setCourseVideoStatus,
    setCourseReason,
    setCourseTypeReason,
    setCourseVideoReason
} from '../../api/apiDirectorProfile';
import { 
    FiBook, 
    FiVideo, 
    FiCheck, 
    FiX, 
    FiEye, 
    FiAlertCircle,
    FiSearch,
    FiCalendar,
    FiClock,
    FiDollarSign,
    FiTag,
    FiPlay,
    FiPackage,
    FiGrid,
    FiList,
    FiHash,
    FiFileText,
    FiEdit,
    FiUsers,
    FiUser,
    FiSettings
} from 'react-icons/fi';

const ContentReview = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('courses'); // courses | course-types | videos
    const [viewMode, setViewMode] = useState('card'); // card | table
    
    // Filter states
    const [statusFilter, setStatusFilter] = useState('moderation');
    const [activeFilter, setActiveFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Data states
    const [courses, setCourses] = useState([]);
    const [allCourseTypes, setAllCourseTypes] = useState([]);
    const [allVideos, setAllVideos] = useState([]);
    
    // Modal states
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [courseTypes, setCourseTypes] = useState([]);
    const [courseVideos, setCourseVideos] = useState({});
    const [loadingModal, setLoadingModal] = useState(false);
    
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectTarget, setRejectTarget] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    
    // Detail modals
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [selectedType, setSelectedType] = useState(null);
    const [typeVideos, setTypeVideos] = useState([]);
    const [loadingTypeVideos, setLoadingTypeVideos] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab, statusFilter, activeFilter]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (activeFilter) params.is_active = activeFilter === 'true';
            
            if (activeTab === 'courses') {
                const response = await getModerationCourses(params);
                setCourses(response.results || response);
            } else if (activeTab === 'course-types') {
                const response = await getModerationCourseTypes(params);
                setAllCourseTypes(response.results || response);
            } else if (activeTab === 'videos') {
                const response = await getModerationCourseVideos(params);
                setAllVideos(response.results || response);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseDetails = async (courseId) => {
        try {
            setLoadingModal(true);
            
            // Fetch course types for this course
            const typesResponse = await getModerationCourseTypes({ course_id: courseId });
            const types = typesResponse.results || typesResponse;
            setCourseTypes(types);
            
            // Fetch videos for each course type
            const videosData = {};
            for (const type of types) {
                const videosResponse = await getModerationCourseVideos({ course_id: courseId, course_type: type.id });
                videosData[type.id] = videosResponse.results || videosResponse;
            }
            setCourseVideos(videosData);
        } catch (error) {
            console.error('Error fetching course details:', error);
        } finally {
            setLoadingModal(false);
        }
    };

    const getStatusBadge = (status, absolute = true) => {
        const badges = {
            moderation: { color: '#f59e0b', text: 'Moderatsiyada', icon: FiClock },
            approved: { color: '#10b981', text: 'Tasdiqlangan', icon: FiCheck },
            rejected: { color: '#ef4444', text: 'Rad etilgan', icon: FiX }
        };
        const badge = badges[status] || badges.moderation;
        const Icon = badge.icon;
        
        return (
            <div 
                className={`cr__status-badge ${absolute ? 'cr__status-badge--absolute' : ''}`}
                style={{ backgroundColor: badge.color }}
            >
                <Icon />
                <span>{badge.text}</span>
            </div>
        );
    };

    const getLevelLabel = (level) => {
        const labels = {
            beginner: 'Boshlang\'ich',
            intermediate: 'O\'rta',
            advanced: 'Murakkab'
        };
        return labels[level] || level;
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('uz-UZ');
    };

    const handleApproveCourse = async (course) => {
        try {
            await setCourseStatus(course.slug, 'approved');
            fetchData();
            if (showCourseModal && selectedCourse?.id === course.id) {
                setShowCourseModal(false);
            }
        } catch (error) {
            console.error('Error approving course:', error);
        }
    };

    const handleRejectCourse = (course) => {
        setRejectTarget({ item: course, type: 'course' });
        setShowRejectModal(true);
    };

    const openTypeModal = async (type) => {
        setSelectedType(type);
        setShowTypeModal(true);
        setLoadingTypeVideos(true);
        setTypeVideos([]);
        
        try {
            // Fetch videos for this course type
            const response = await getModerationCourseVideos({ course_type: type.id });
            setTypeVideos(response.results || response || []);
        } catch (error) {
            console.error('Error fetching type videos:', error);
            setTypeVideos([]);
        } finally {
            setLoadingTypeVideos(false);
        }
    };

    const openVideoModal = (video) => {
        setSelectedVideo(video);
        setShowVideoModal(true);
    };

    const handleApproveType = async (type) => {
        try {
            await setCourseTypeStatus(type.slug, 'approved');
            fetchCourseDetails(selectedCourse.id);
        } catch (error) {
            console.error('Error approving type:', error);
        }
    };

    const handleRejectType = (type) => {
        setRejectTarget({ item: type, type: 'course-type' });
        setShowRejectModal(true);
    };

    const handleApproveVideo = async (video) => {
        try {
            await setCourseVideoStatus(video.id, 'approved');
            fetchCourseDetails(selectedCourse.id);
        } catch (error) {
            console.error('Error approving video:', error);
        }
    };

    const handleRejectVideo = (video) => {
        setRejectTarget({ item: video, type: 'video' });
        setShowRejectModal(true);
    };

    const confirmReject = async () => {
        if (!rejectTarget || !rejectReason.trim()) return;
        
        try {
            const { item, type } = rejectTarget;
            
            if (type === 'course') {
                await setCourseStatus(item.slug, 'rejected');
                await setCourseReason(item.slug, rejectReason);
                fetchData();
                if (showCourseModal) setShowCourseModal(false);
            } else if (type === 'course-type') {
                await setCourseTypeStatus(item.slug, 'rejected');
                await setCourseTypeReason(item.slug, rejectReason);
                if (showCourseModal && selectedCourse) {
                    fetchCourseDetails(selectedCourse.id);
                } else {
                    fetchData();
                }
            } else if (type === 'video') {
                await setCourseVideoStatus(item.id, 'rejected', rejectReason);
                if (showCourseModal && selectedCourse) {
                    fetchCourseDetails(selectedCourse.id);
                } else {
                    fetchData();
                }
            }
            
            setShowRejectModal(false);
            setRejectReason('');
            setRejectTarget(null);
        } catch (error) {
            console.error('Error rejecting:', error);
        }
    };

    const openCourseModal = async (course) => {
        setSelectedCourse(course);
        setShowCourseModal(true);
        await fetchCourseDetails(course.id);
    };

    const getFilteredData = () => {
        let data = [];
        
        if (activeTab === 'courses') {
            data = courses;
        } else if (activeTab === 'course-types') {
            data = allCourseTypes;
        } else if (activeTab === 'videos') {
            data = allVideos;
        }
        
        if (!searchTerm) return data;
        
        return data.filter(item => {
            const searchLower = searchTerm.toLowerCase();
            return (
                item.title?.toLowerCase().includes(searchLower) ||
                item.name?.toLowerCase().includes(searchLower) ||
                item.description?.toLowerCase().includes(searchLower) ||
                item.slug?.toLowerCase().includes(searchLower)
            );
        });
    };
    
    const filteredData = getFilteredData();

    if (loading) {
        return (
            <div className="content-review">
                <div className="cr__loading">
                    <div className="spinner"></div>
                    <p>Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="content-review">
            <div className="cr__header">
                <h1>Kontent Tekshiruv</h1>
                <p>Kurslar, oylar va videolarni moderatsiya qilish</p>
            </div>

            {/* Tabs */}
            <div className="cr__tabs">
                <button 
                    className={`cr__tab ${activeTab === 'courses' ? 'cr__tab--active' : ''}`}
                    onClick={() => setActiveTab('courses')}
                >
                    <FiBook />
                    <span>Kurslar</span>
                </button>
                <button 
                    className={`cr__tab ${activeTab === 'course-types' ? 'cr__tab--active' : ''}`}
                    onClick={() => setActiveTab('course-types')}
                >
                    <FiPackage />
                    <span>Oylar</span>
                </button>
                <button 
                    className={`cr__tab ${activeTab === 'videos' ? 'cr__tab--active' : ''}`}
                    onClick={() => setActiveTab('videos')}
                >
                    <FiVideo />
                    <span>Videolar</span>
                </button>
            </div>

            {/* Filters */}
            <div className="cr__filters">
                <div className="cr__filter-group">
                    <div className="cr__filter-item">
                        <label>Status:</label>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="cr__select"
                        >
                            <option value="">Barchasi</option>
                            <option value="moderation">Moderatsiyada</option>
                            <option value="approved">Tasdiqlangan</option>
                            <option value="rejected">Rad etilgan</option>
                        </select>
                    </div>
                    
                    <div className="cr__filter-item">
                        <label>Faollik:</label>
                        <select 
                            value={activeFilter} 
                            onChange={(e) => setActiveFilter(e.target.value)}
                            className="cr__select"
                        >
                            <option value="">Barchasi</option>
                            <option value="true">Faol</option>
                            <option value="false">Nofaol</option>
                        </select>
                    </div>
                </div>

                <div className="cr__search-group">
                    <div className="cr__search">
                        <FiSearch />
                        <input 
                            type="text"
                            placeholder="Qidirish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="cr__view-toggle">
                        <button 
                            className={`cr__view-btn ${viewMode === 'card' ? 'cr__view-btn--active' : ''}`}
                            onClick={() => setViewMode('card')}
                            title="Card ko'rinish"
                        >
                            <FiGrid />
                        </button>
                        <button 
                            className={`cr__view-btn ${viewMode === 'table' ? 'cr__view-btn--active' : ''}`}
                            onClick={() => setViewMode('table')}
                            title="Table ko'rinish"
                        >
                            <FiList />
                        </button>
                    </div>
                </div>
            </div>

            {/* Courses Card View */}
            {activeTab === 'courses' && viewMode === 'card' && (
                <div className="cr__courses-grid">
                    {filteredData.map(course => (
                    <div key={course.id} className="cr__course-card" onClick={() => openCourseModal(course)}>
                        <div className="cr__course-image">
                            <img src={course.thumbnail} alt={course.title} />
                            {getStatusBadge(course.status)}
                        </div>
                        <div className="cr__course-content">
                            <h3>{course.title}</h3>
                            <p>{course.description?.substring(0, 100)}...</p>
                            <div className="cr__course-meta">
                                <span className="cr__level">{getLevelLabel(course.level)}</span>
                                <span className="cr__price">
                                    {course.is_free ? 'Bepul' : `${course.price} FC`}
                                </span>
                            </div>
                            {course.reason && (
                                <div className="cr__reason-mini">
                                    <FiAlertCircle />
                                    <span>{course.reason.substring(0, 50)}...</span>
                                </div>
                            )}
                        </div>
                        <div className="cr__course-footer">
                            <button 
                                className="cr__btn-icon cr__btn-icon--view"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openCourseModal(course);
                                }}
                            >
                                <FiEye />
                            </button>
                            <button 
                                className="cr__btn-icon cr__btn-icon--approve"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveCourse(course);
                                }}
                                disabled={course.status === 'approved'}
                            >
                                <FiCheck />
                            </button>
                            <button 
                                className="cr__btn-icon cr__btn-icon--reject"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRejectCourse(course);
                                }}
                                disabled={course.status === 'rejected'}
                            >
                                <FiX />
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
            )}

            {/* Courses Table View */}
            {activeTab === 'courses' && viewMode === 'table' && (
                <div className="cr__table-container">
                    <table className="cr__table">
                        <thead>
                            <tr>
                                <th>Kurs nomi</th>
                                <th>Tavsif</th>
                                <th>Daraja</th>
                                <th>Narx</th>
                                <th>Status</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(course => (
                                <tr key={course.id} onClick={() => openCourseModal(course)} style={{cursor: 'pointer'}}>
                                    <td>
                                        <div className="cr__table-name">
                                            <FiBook />
                                            <div>
                                                <strong>{course.title}</strong>
                                                <span className="cr__table-slug">{course.slug}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="cr__table-desc">
                                            {course.description || 'Tavsif yo\'q'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="cr__table-level">{getLevelLabel(course.level)}</span>
                                    </td>
                                    <td>
                                        <span className="cr__table-price">
                                            {course.is_free ? 'Bepul' : `${course.price} FC`}
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(course.status)}</td>
                                    <td>
                                        <div className="cr__table-actions">
                                            <button 
                                                className="cr__table-btn cr__table-btn--approve"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleApproveCourse(course);
                                                }}
                                                disabled={course.status === 'approved'}
                                                title="Tasdiqlash"
                                            >
                                                <FiCheck />
                                            </button>
                                            <button 
                                                className="cr__table-btn cr__table-btn--reject"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRejectCourse(course);
                                                }}
                                                disabled={course.status === 'rejected'}
                                                title="Rad etish"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Course Types Grid/Table */}
            {activeTab === 'course-types' && viewMode === 'card' && (
                <div className="cr__types-grid">
                    {filteredData.map(type => (
                        <div key={type.id} className="cr__type-card" onClick={() => openTypeModal(type)}>
                            <div className="cr__type-main">
                                <div className="cr__type-icon">
                                    <FiPackage />
                                </div>
                                <div className="cr__type-content">
                                    <div className="cr__type-header-row">
                                        <h3>{type.name}</h3>
                                        {getStatusBadge(type.status)}
                                    </div>
                                    <p>{type.description}</p>
                                    <div className="cr__type-meta">
                                        <span className="cr__type-price">
                                            <FiDollarSign />
                                            {type.price} FC
                                        </span>
                                        <span className="cr__type-videos">
                                            <FiVideo />
                                            {type.total_course_videos} ta video
                                        </span>
                                        <span className="cr__type-slug">
                                            <FiTag />
                                            {type.slug}
                                        </span>
                                    </div>
                                    {type.reason && (
                                        <div className="cr__reason-mini">
                                            <FiAlertCircle />
                                            <span>{type.reason}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="cr__type-footer">
                                <button 
                                    className="cr__btn-icon cr__btn-icon--approve"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleApproveType(type);
                                    }}
                                    disabled={type.status === 'approved'}
                                >
                                    <FiCheck />
                                    <span>Tasdiqlash</span>
                                </button>
                                <button 
                                    className="cr__btn-icon cr__btn-icon--reject"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRejectType(type);
                                    }}
                                    disabled={type.status === 'rejected'}
                                >
                                    <FiX />
                                    <span>Rad etish</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'course-types' && viewMode === 'table' && (
                <div className="cr__table-container">
                    <table className="cr__table">
                        <thead>
                            <tr>
                                <th>Oy nomi</th>
                                <th>Tavsif</th>
                                <th>Narx</th>
                                <th>Videolar</th>
                                <th>Status</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(type => (
                                <tr key={type.id} onClick={() => openTypeModal(type)} style={{cursor: 'pointer'}}>
                                    <td>
                                        <div className="cr__table-name">
                                            <FiPackage />
                                            <div>
                                                <strong>{type.name}</strong>
                                                <span className="cr__table-slug">{type.slug}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="cr__table-desc">
                                            {type.description || 'Tavsif yo\'q'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="cr__table-price">{type.price} FC</span>
                                    </td>
                                    <td>
                                        <span className="cr__table-count">{type.total_course_videos} ta</span>
                                    </td>
                                    <td>{getStatusBadge(type.status)}</td>
                                    <td>
                                        <div className="cr__table-actions">
                                            <button 
                                                className="cr__table-btn cr__table-btn--approve"
                                                onClick={() => handleApproveType(type)}
                                                disabled={type.status === 'approved'}
                                                title="Tasdiqlash"
                                            >
                                                <FiCheck />
                                            </button>
                                            <button 
                                                className="cr__table-btn cr__table-btn--reject"
                                                onClick={() => handleRejectType(type)}
                                                disabled={type.status === 'rejected'}
                                                title="Rad etish"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Videos Card View */}
            {activeTab === 'videos' && viewMode === 'card' && (
                <div className="cr__videos-grid">
                    {filteredData.map(video => (
                        <div key={video.id} className="cr__video-card" onClick={() => openVideoModal(video)}>
                            <div className="cr__video-poster">
                                {video.poster ? (
                                    <img src={video.poster} alt={video.title} />
                                ) : (
                                    <div className="cr__video-placeholder">
                                        <FiVideo />
                                        <span>Poster yo'q</span>
                                    </div>
                                )}
                                <div className="cr__video-duration">
                                    <FiPlay />
                                    {formatDuration(video.duration)}
                                </div>
                                {getStatusBadge(video.status)}
                            </div>
                            <div className="cr__video-content">
                                <h3>{video.title}</h3>
                                <p>{video.description || 'Tavsif yo\'q'}</p>
                                <div className="cr__video-meta">
                                    <span className="cr__video-order">Tartib: {video.order}</span>
                                    {video.has_test && <span className="cr__video-feature">Test</span>}
                                    {video.has_assignment && <span className="cr__video-feature">Vazifa</span>}
                                    {video.course_type_info && (
                                        <span className="cr__course-type">{video.course_type_info.name}</span>
                                    )}
                                </div>
                                {video.reason && (
                                    <div className="cr__reason-mini">
                                        <FiAlertCircle />
                                        <span>{video.reason}</span>
                                    </div>
                                )}
                            </div>
                            <div className="cr__video-actions">
                                <button 
                                    className="cr__btn-icon cr__btn-icon--approve"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleApproveVideo(video);
                                    }}
                                    disabled={video.status === 'approved'}
                                >
                                    <FiCheck />
                                </button>
                                <button 
                                    className="cr__btn-icon cr__btn-icon--reject"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRejectVideo(video);
                                    }}
                                    disabled={video.status === 'rejected'}
                                >
                                    <FiX />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Videos Table View */}
            {activeTab === 'videos' && viewMode === 'table' && (
                <div className="cr__table-container">
                    <table className="cr__table">
                        <thead>
                            <tr>
                                <th>Video nomi</th>
                                <th>Tavsif</th>
                                <th>Davomiyligi</th>
                                <th>Tartib</th>
                                <th>Status</th>
                                <th>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map(video => (
                                <tr key={video.id} onClick={() => openVideoModal(video)} style={{cursor: 'pointer'}}>
                                    <td>
                                        <div className="cr__table-name">
                                            <FiVideo />
                                            <div>
                                                <strong>{video.title}</strong>
                                                {video.course_type_info && (
                                                    <span className="cr__table-slug">{video.course_type_info.name}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="cr__table-desc">
                                            {video.description || 'Tavsif yo\'q'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="cr__table-duration">{formatDuration(video.duration)}</span>
                                    </td>
                                    <td>
                                        <span className="cr__table-count">{video.order}</span>
                                    </td>
                                    <td>{getStatusBadge(video.status)}</td>
                                    <td>
                                        <div className="cr__table-actions">
                                            <button 
                                                className="cr__table-btn cr__table-btn--approve"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleApproveVideo(video);
                                                }}
                                                disabled={video.status === 'approved'}
                                                title="Tasdiqlash"
                                            >
                                                <FiCheck />
                                            </button>
                                            <button 
                                                className="cr__table-btn cr__table-btn--reject"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRejectVideo(video);
                                                }}
                                                disabled={video.status === 'rejected'}
                                                title="Rad etish"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {filteredData.length === 0 && (
                <div className="cr__empty">
                    <FiAlertCircle />
                    <p>Kurslar topilmadi</p>
                </div>
            )}

            {/* Course Detail Modal */}
            {showCourseModal && selectedCourse && (
                <div className="cr__modal-overlay" onClick={() => setShowCourseModal(false)}>
                    <div className="cr__modal cr__modal--large" onClick={(e) => e.stopPropagation()}>
                        <div className="cr__modal-header">
                            <div className="cr__modal-title">
                                <h3>{selectedCourse.title}</h3>
                            </div>
                            <button 
                                className="cr__modal-close"
                                onClick={() => setShowCourseModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>
                        
                        <div className="cr__modal-body">
                            {/* Course Main Layout - Banner and Info Side by Side */}
                            <div className="cr__course-main-layout">
                                {/* Left Side - Banner and Thumbnail */}
                                <div className="cr__course-visual-section">
                                    <div className="cr__course-banner-bg">
                                        <img src={selectedCourse.cover} alt="Banner" />
                                        <div className="cr__banner-overlay"></div>
                                    </div>
                                    <div className="cr__course-thumbnail-main">
                                        <img src={selectedCourse.thumbnail} alt={selectedCourse.title} />
                                    </div>
                                </div>

                                {/* Right Side - Course Info */}
                                <div className="cr__course-main-info">
                                    <div className="cr__course-title-section">
                                        <h2>{selectedCourse.title}</h2>
                                        <div className="cr__course-quick-meta">
                                            <span className="cr__level-badge">{getLevelLabel(selectedCourse.level)}</span>
                                            <span className="cr__price-badge">
                                                {selectedCourse.is_free ? 'Bepul' : `${selectedCourse.price} FC`}
                                            </span>
                                            {getStatusBadge(selectedCourse.status, false)}
                                        </div>
                                    </div>

                                    <div className="cr__info-section cr__info-section--compact">
                                        <h4><FiBook /> Kurs Ma'lumotlari</h4>
                                        <div className="cr__info-items">
                                            <div className="cr__info-item">
                                                <label>Slug:</label>
                                                <span className="cr__slug-text">{selectedCourse.slug}</span>
                                            </div>
                                            <div className="cr__info-item">
                                                <label>Daraja:</label>
                                                <span>{getLevelLabel(selectedCourse.level)}</span>
                                            </div>
                                            <div className="cr__info-item">
                                                <label>Til:</label>
                                                <span>{selectedCourse.language === 3 ? 'O\'zbek' : 'Boshqa'}</span>
                                            </div>
                                            <div className="cr__info-item">
                                                <label>Narx:</label>
                                                <span className="cr__price-text">
                                                    {selectedCourse.is_free ? 'Bepul' : `${selectedCourse.price} FC`}
                                                </span>
                                            </div>
                                            <div className="cr__info-item">
                                                <label>Sotib olish:</label>
                                                <span>{selectedCourse.purchase_scope === 'course' ? 'Butun kurs' : 'Oylik'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="cr__course-description-section">
                                <h4><FiFileText /> Tavsif</h4>
                                <p>{selectedCourse.description}</p>
                            </div>

                            {/* Additional Info Grid */}
                            <div className="cr__course-info-grid">
                                <div className="cr__info-section">
                                    <h4><FiBook /> Kurs Ma'lumotlari</h4>
                                    <div className="cr__info-items">
                                        <div className="cr__info-item">
                                            <label>Kurs nomi:</label>
                                            <span>{selectedCourse.title}</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Slug:</label>
                                            <span className="cr__slug-text">{selectedCourse.slug}</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Tavsif:</label>
                                            <p>{selectedCourse.description}</p>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Daraja:</label>
                                            <span className="cr__level-badge">{getLevelLabel(selectedCourse.level)}</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Til:</label>
                                            <span>{selectedCourse.language === 3 ? 'O\'zbek' : 'Boshqa'}</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Narx:</label>
                                            <span className="cr__price-text">
                                                {selectedCourse.is_free ? 'Bepul' : `${selectedCourse.price} FC`}
                                            </span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Sotib olish turi:</label>
                                            <span>{selectedCourse.purchase_scope === 'course' ? 'Butun kurs' : 'Oylik'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="cr__info-section">
                                    <h4><FiUsers /> Statistika va Xususiyatlar</h4>
                                    <div className="cr__info-items">
                                        <div className="cr__info-item">
                                            <label>O'quvchilar:</label>
                                            <span>{selectedCourse.students_count} ta</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Darslar soni:</label>
                                            <span>{selectedCourse.lessons_count} ta</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Umumiy davomiyligi:</label>
                                            <span>{selectedCourse.total_duration_minutes} daqiqa</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Reyting:</label>
                                            <span>{selectedCourse.rating_avg} ⭐ ({selectedCourse.rating_count} ta baho)</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Xususiyatlar:</label>
                                            <div className="cr__features-list">
                                                {selectedCourse.is_new && <span className="cr__feature-tag">Yangi</span>}
                                                {selectedCourse.is_bestseller && <span className="cr__feature-tag">Top</span>}
                                                {selectedCourse.is_serial && <span className="cr__feature-tag">Serial</span>}
                                                {selectedCourse.certificate_available && <span className="cr__feature-tag">Sertifikat</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedCourse.channel_info && (
                                    <div className="cr__info-section">
                                        <h4><FiUser /> Kanal Ma'lumotlari</h4>
                                        <div className="cr__channel-card">
                                            <img src={selectedCourse.channel_info.avatar} alt={selectedCourse.channel_info.title} className="cr__channel-avatar" />
                                            <div className="cr__channel-info">
                                                <h5>
                                                    {selectedCourse.channel_info.title}
                                                    {selectedCourse.channel_info.verified && <FiCheck className="cr__verified" />}
                                                </h5>
                                                {selectedCourse.channel_info.badge && (
                                                    <span className="cr__channel-badge">{selectedCourse.channel_info.badge}</span>
                                                )}
                                                <p>{selectedCourse.channel_info.description}</p>
                                                <div className="cr__channel-stats">
                                                    <span><FiUsers /> {selectedCourse.channel_info.subscriber_count} obunachi</span>
                                                    <span><FiVideo /> {selectedCourse.channel_info.videos_count} video</span>
                                                    <span><FiPlay /> {selectedCourse.channel_info.reels_count} reels</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedCourse.reason && (
                                <div className="cr__reason-box">
                                    <FiAlertCircle />
                                    <div>
                                        <strong>Rad etish sababi:</strong>
                                        <p>{selectedCourse.reason}</p>
                                    </div>
                                </div>
                            )}

                            {/* Course Types and Videos */}
                            {loadingModal ? (
                                <div className="cr__modal-loading">
                                    <div className="spinner"></div>
                                    <p>Oylar va videolar yuklanmoqda...</p>
                                </div>
                            ) : (
                                <div className="cr__course-types">
                                    <h4><FiPackage /> Kurs Oylari va Videolar</h4>
                                    {courseTypes.length === 0 ? (
                                        <div className="cr__empty-small">
                                            <p>Kurs oylari topilmadi</p>
                                        </div>
                                    ) : (
                                        courseTypes.map(type => (
                                            <div key={type.id} className="cr__type-section">
                                                <div className="cr__type-header">
                                                    <div className="cr__type-info">
                                                        <h5>{type.name}</h5>
                                                        <div className="cr__type-meta">
                                                            <span className="cr__type-price">{type.price} FC</span>
                                                            <span className="cr__type-videos">{type.total_course_videos} ta video</span>
                                                            {getStatusBadge(type.status)}
                                                        </div>
                                                        {type.description && <p>{type.description}</p>}
                                                        {type.reason && (
                                                            <div className="cr__reason-small">
                                                                <FiAlertCircle />
                                                                <span>{type.reason}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="cr__type-actions">
                                                        <button 
                                                            className="cr__btn-small cr__btn-small--approve"
                                                            onClick={() => handleApproveType(type)}
                                                            disabled={type.status === 'approved'}
                                                        >
                                                            <FiCheck />
                                                        </button>
                                                        <button 
                                                            className="cr__btn-small cr__btn-small--reject"
                                                            onClick={() => handleRejectType(type)}
                                                            disabled={type.status === 'rejected'}
                                                        >
                                                            <FiX />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Videos for this type - Horizontal Scroll */}
                                                <div className="cr__videos-horizontal">
                                                    {courseVideos[type.id]?.length > 0 ? (
                                                        courseVideos[type.id].map(video => (
                                                            <div 
                                                                key={video.id} 
                                                                className="cr__video-mini-card"
                                                                onClick={() => openVideoModal(video)}
                                                            >
                                                                <div className="cr__video-mini-poster">
                                                                    {video.poster ? (
                                                                        <img src={video.poster} alt={video.title} />
                                                                    ) : (
                                                                        <div className="cr__video-mini-placeholder">
                                                                            <FiVideo />
                                                                        </div>
                                                                    )}
                                                                    <div className="cr__video-mini-duration">
                                                                        <FiPlay />
                                                                        {formatDuration(video.duration)}
                                                                    </div>
                                                                    {getStatusBadge(video.status)}
                                                                </div>
                                                                <div className="cr__video-mini-info">
                                                                    <h6>{video.title}</h6>
                                                                    <div className="cr__video-mini-meta">
                                                                        <span>Tartib: {video.order}</span>
                                                                        {video.has_test && <span className="cr__mini-badge">Test</span>}
                                                                        {video.has_assignment && <span className="cr__mini-badge">Vazifa</span>}
                                                                    </div>
                                                                </div>
                                                                <div className="cr__video-mini-actions">
                                                                    <button 
                                                                        className="cr__btn-mini cr__btn-mini--approve"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleApproveVideo(video);
                                                                        }}
                                                                        disabled={video.status === 'approved'}
                                                                        title="Tasdiqlash"
                                                                    >
                                                                        <FiCheck />
                                                                    </button>
                                                                    <button 
                                                                        className="cr__btn-mini cr__btn-mini--reject"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleRejectVideo(video);
                                                                        }}
                                                                        disabled={video.status === 'rejected'}
                                                                        title="Rad etish"
                                                                    >
                                                                        <FiX />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="cr__empty-small">
                                                            <p>Videolar topilmadi</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="cr__modal-footer">
                            <button 
                                className="cr__btn cr__btn--approve"
                                onClick={() => handleApproveCourse(selectedCourse)}
                                disabled={selectedCourse.status === 'approved'}
                            >
                                <FiCheck />
                                Kursni Tasdiqlash
                            </button>
                            <button 
                                className="cr__btn cr__btn--reject"
                                onClick={() => handleRejectCourse(selectedCourse)}
                                disabled={selectedCourse.status === 'rejected'}
                            >
                                <FiX />
                                Kursni Rad etish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Type Detail Modal */}
            {showTypeModal && selectedType && (
                <div className="cr__modal-overlay" onClick={() => setShowTypeModal(false)}>
                    <div className="cr__modal cr__modal--medium" onClick={(e) => e.stopPropagation()}>
                        <div className="cr__modal-header">
                            <div className="cr__modal-title">
                                <FiPackage />
                                <h3>{selectedType.name}</h3>
                            </div>
                            <button 
                                className="cr__modal-close"
                                onClick={() => setShowTypeModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>
                        <div className="cr__modal-body">
                            <div className="cr__detail-grid">
                                <div className="cr__detail-item">
                                    <label>Oy nomi:</label>
                                    <span>{selectedType.name}</span>
                                </div>
                                <div className="cr__detail-item">
                                    <label>Slug:</label>
                                    <span className="cr__detail-slug">{selectedType.slug}</span>
                                </div>
                                <div className="cr__detail-item">
                                    <label>Narx:</label>
                                    <span className="cr__detail-price">{selectedType.price} FC</span>
                                </div>
                                <div className="cr__detail-item">
                                    <label>Videolar soni:</label>
                                    <span>{selectedType.total_course_videos} ta</span>
                                </div>
                                <div className="cr__detail-item">
                                    <label>Status:</label>
                                    {getStatusBadge(selectedType.status)}
                                </div>
                                <div className="cr__detail-item cr__detail-item--full">
                                    <label>Tavsif:</label>
                                    <p>{selectedType.description || 'Tavsif yo\'q'}</p>
                                </div>
                            </div>

                            {/* Videos for this Type */}
                            <div className="cr__type-videos-section">
                                <h4><FiVideo /> Oy Videolari</h4>
                                {loadingTypeVideos ? (
                                    <div className="cr__modal-loading">
                                        <div className="spinner"></div>
                                        <p>Videolar yuklanmoqda...</p>
                                    </div>
                                ) : typeVideos.length > 0 ? (
                                    <div className="cr__videos-horizontal">
                                        {typeVideos.map(video => (
                                            <div 
                                                key={video.id} 
                                                className="cr__video-mini-card"
                                                onClick={() => openVideoModal(video)}
                                            >
                                                <div className="cr__video-mini-poster">
                                                    {video.poster ? (
                                                        <img src={video.poster} alt={video.title} />
                                                    ) : (
                                                        <div className="cr__video-mini-placeholder">
                                                            <FiVideo />
                                                        </div>
                                                    )}
                                                    <div className="cr__video-mini-duration">
                                                        <FiPlay />
                                                        {formatDuration(video.duration)}
                                                    </div>
                                                    {getStatusBadge(video.status)}
                                                </div>
                                                <div className="cr__video-mini-info">
                                                    <h6>{video.title}</h6>
                                                    <div className="cr__video-mini-meta">
                                                        <span>Tartib: {video.order}</span>
                                                        {video.has_test && <span className="cr__mini-badge">Test</span>}
                                                        {video.has_assignment && <span className="cr__mini-badge">Vazifa</span>}
                                                    </div>
                                                </div>
                                                <div className="cr__video-mini-actions">
                                                    <button 
                                                        className="cr__btn-mini cr__btn-mini--approve"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleApproveVideo(video);
                                                        }}
                                                        disabled={video.status === 'approved'}
                                                        title="Tasdiqlash"
                                                    >
                                                        <FiCheck />
                                                    </button>
                                                    <button 
                                                        className="cr__btn-mini cr__btn-mini--reject"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRejectVideo(video);
                                                        }}
                                                        disabled={video.status === 'rejected'}
                                                        title="Rad etish"
                                                    >
                                                        <FiX />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="cr__empty-small">
                                        <p>Bu oyga tegishli videolar topilmadi</p>
                                    </div>
                                )}
                                {selectedType.reason && (
                                    <div className="cr__detail-item cr__detail-item--full">
                                        <label>Rad etish sababi:</label>
                                        <div className="cr__reason">
                                            <FiAlertCircle />
                                            <span>{selectedType.reason}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="cr__modal-footer">
                            <button 
                                className="cr__btn cr__btn--approve"
                                onClick={() => {
                                    handleApproveType(selectedType);
                                    setShowTypeModal(false);
                                }}
                                disabled={selectedType.status === 'approved'}
                            >
                                <FiCheck />
                                Tasdiqlash
                            </button>
                            <button 
                                className="cr__btn cr__btn--reject"
                                onClick={() => {
                                    handleRejectType(selectedType);
                                    setShowTypeModal(false);
                                }}
                                disabled={selectedType.status === 'rejected'}
                            >
                                <FiX />
                                Rad etish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Video Detail Modal */}
            {showVideoModal && selectedVideo && (
                <div className="cr__modal-overlay" onClick={() => setShowVideoModal(false)}>
                    <div className="cr__modal cr__modal--large" onClick={(e) => e.stopPropagation()}>
                        <div className="cr__modal-header">
                            <div className="cr__modal-title">
                                <FiVideo />
                                <h3>{selectedVideo.title}</h3>
                                {getStatusBadge(selectedVideo.status)}
                            </div>
                            <button 
                                className="cr__modal-close"
                                onClick={() => setShowVideoModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>
                        <div className="cr__modal-body">
                            {/* Video Player and Side Info - Split Layout */}
                            <div className="cr__video-modal-layout">
                                {/* Left: Video Player */}
                                {selectedVideo.hls_playlist_url && (
                                    <div className="cr__video-player">
                                        <video 
                                            controls 
                                            poster={selectedVideo.poster}
                                            className="cr__video-element"
                                        >
                                            <source src={selectedVideo.hls_playlist_url} type="application/x-mpegURL" />
                                            <source src={selectedVideo.upload_file} type="video/mp4" />
                                            Brauzeringiz video playbackni qo'llab-quvvatlamaydi.
                                        </video>
                                    </div>
                                )}

                                {/* Right: Quick Info */}
                                <div className="cr__video-side-info">
                                    <div className="cr__info-section">
                                        <h4><FiVideo /> Video Ma'lumotlari</h4>
                                        <div className="cr__info-items">
                                            <div className="cr__info-item">
                                                <label>Video nomi:</label>
                                                <span>{selectedVideo.title}</span>
                                            </div>
                                            <div className="cr__info-item">
                                                <label>Tartib raqami:</label>
                                                <span className="cr__order-badge">{selectedVideo.order}</span>
                                            </div>
                                            <div className="cr__info-item">
                                                <label>Davomiyligi:</label>
                                                <span>{formatDuration(selectedVideo.duration)}</span>
                                            </div>
                                            {selectedVideo.course_type_info && (
                                                <div className="cr__info-item">
                                                    <label>Oy:</label>
                                                    <div className="cr__type-info-box">
                                                        <strong>{selectedVideo.course_type_info.name}</strong>
                                                        <span className="cr__type-price">{selectedVideo.course_type_info.price} FC</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="cr__info-section">
                                        <h4><FiFileText /> Test va Vazifalar</h4>
                                        <div className="cr__info-items">
                                            <div className="cr__info-item">
                                                <label>Testlar:</label>
                                                {selectedVideo.tests_brief && selectedVideo.tests_brief.length > 0 ? (
                                                    <div className="cr__list-items">
                                                        {selectedVideo.tests_brief.map(test => (
                                                            <div key={test.id} className="cr__list-item">
                                                                <FiFileText />
                                                                <span>{test.title}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="cr__empty-text">Test yo'q</span>
                                                )}
                                            </div>
                                            <div className="cr__info-item">
                                                <label>Vazifalar:</label>
                                                {selectedVideo.assignments_brief && selectedVideo.assignments_brief.length > 0 ? (
                                                    <div className="cr__list-items">
                                                        {selectedVideo.assignments_brief.map(assignment => (
                                                            <div key={assignment.id} className="cr__list-item">
                                                                <FiEdit />
                                                                <span>{assignment.title}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="cr__empty-text">Vazifa yo'q</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Full Video Info Grid Below */}
                            <div className="cr__video-info-grid">
                                <div className="cr__info-section">
                                    <h4><FiVideo /> Video Ma'lumotlari</h4>
                                    <div className="cr__info-items">
                                        <div className="cr__info-item">
                                            <label>Video nomi:</label>
                                            <span>{selectedVideo.title}</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Tavsif:</label>
                                            <p>{selectedVideo.description || 'Tavsif yo\'q'}</p>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Tartib raqami:</label>
                                            <span className="cr__order-badge">{selectedVideo.order}</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Davomiyligi:</label>
                                            <span>{formatDuration(selectedVideo.duration)}</span>
                                        </div>
                                        {selectedVideo.course_type_info && (
                                            <div className="cr__info-item">
                                                <label>Oy (Course Type):</label>
                                                <div className="cr__type-info-box">
                                                    <strong>{selectedVideo.course_type_info.name}</strong>
                                                    <p>{selectedVideo.course_type_info.description}</p>
                                                    <span className="cr__type-price">{selectedVideo.course_type_info.price} FC</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="cr__info-section">
                                    <h4><FiFileText /> Test va Vazifalar</h4>
                                    <div className="cr__info-items">
                                        <div className="cr__info-item">
                                            <label>Testlar:</label>
                                            {selectedVideo.tests_brief && selectedVideo.tests_brief.length > 0 ? (
                                                <div className="cr__list-items">
                                                    {selectedVideo.tests_brief.map(test => (
                                                        <div key={test.id} className="cr__list-item">
                                                            <FiFileText />
                                                            <span>{test.title}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="cr__empty-text">Test yo'q</span>
                                            )}
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Vazifalar:</label>
                                            {selectedVideo.assignments_brief && selectedVideo.assignments_brief.length > 0 ? (
                                                <div className="cr__list-items">
                                                    {selectedVideo.assignments_brief.map(assignment => (
                                                        <div key={assignment.id} className="cr__list-item">
                                                            <FiEdit />
                                                            <span>{assignment.title}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="cr__empty-text">Vazifa yo'q</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="cr__info-section">
                                    <h4><FiSettings /> Texnik Ma'lumotlar</h4>
                                    <div className="cr__info-items">
                                        <div className="cr__info-item">
                                            <label>HLS Playlist:</label>
                                            <span className="cr__file-path">{selectedVideo.hls_playlist_url}</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Upload File:</label>
                                            <span className="cr__file-path">{selectedVideo.upload_file}</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Yaratilgan:</label>
                                            <span>{new Date(selectedVideo.created_at).toLocaleString('uz-UZ')}</span>
                                        </div>
                                        <div className="cr__info-item">
                                            <label>Faol:</label>
                                            <span className={selectedVideo.is_active ? 'cr__status-active' : 'cr__status-inactive'}>
                                                {selectedVideo.is_active ? 'Faol' : 'Nofaol'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedVideo.reason && (
                                <div className="cr__reason-box">
                                    <FiAlertCircle />
                                    <div>
                                        <strong>Rad etish sababi:</strong>
                                        <p>{selectedVideo.reason}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="cr__modal-footer">
                            <button 
                                className="cr__btn cr__btn--approve"
                                onClick={() => {
                                    handleApproveVideo(selectedVideo);
                                    setShowVideoModal(false);
                                }}
                                disabled={selectedVideo.status === 'approved'}
                            >
                                <FiCheck />
                                Tasdiqlash
                            </button>
                            <button 
                                className="cr__btn cr__btn--reject"
                                onClick={() => {
                                    handleRejectVideo(selectedVideo);
                                    setShowVideoModal(false);
                                }}
                                disabled={selectedVideo.status === 'rejected'}
                            >
                                <FiX />
                                Rad etish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="cr__modal-overlay" onClick={() => setShowRejectModal(false)}>
                    <div className="cr__modal cr__modal--small" onClick={(e) => e.stopPropagation()}>
                        <div className="cr__modal-header">
                            <h3>Rad etish sababi</h3>
                            <button 
                                className="cr__modal-close"
                                onClick={() => setShowRejectModal(false)}
                            >
                                <FiX />
                            </button>
                        </div>
                        <div className="cr__modal-body">
                            <textarea
                                className="cr__textarea"
                                placeholder="Rad etish sababini kiriting..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="cr__modal-footer">
                            <button 
                                className="cr__btn cr__btn--cancel"
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                    setRejectTarget(null);
                                }}
                            >
                                Bekor qilish
                            </button>
                            <button 
                                className="cr__btn cr__btn--reject"
                                onClick={confirmReject}
                                disabled={!rejectReason.trim()}
                            >
                                <FiX />
                                Rad etish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentReview;
