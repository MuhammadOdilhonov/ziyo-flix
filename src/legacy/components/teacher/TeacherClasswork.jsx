import React, { useState, useEffect } from 'react';
import { FiPlus, FiFile, FiEdit, FiHelpCircle, FiCheckSquare, FiMoreVertical } from 'react-icons/fi';
import { getClasswork, createClassworkItem } from '../../api/apiClassroom';
import FileViewer from '../common/FileViewer';
import FilePermissionSettings from './FilePermissionSettings';

const TeacherClasswork = ({ classroom }) => {
    const [classwork, setClasswork] = useState({ topics: [], items: [] });
    const [loading, setLoading] = useState(true);
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showTopicModal, setShowTopicModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [formData, setFormData] = useState({});
    const [topicName, setTopicName] = useState('');
    const [filePermissions, setFilePermissions] = useState({
        allowViewInPlatform: true,
        allowDownload: true
    });

    useEffect(() => {
        if (classroom) {
            fetchClasswork();
        }
    }, [classroom]);

    const fetchClasswork = async () => {
        try {
            setLoading(true);
            const data = await getClasswork(classroom.id);
            setClasswork(data);
        } catch (error) {
            console.error('Error fetching classwork:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = (type) => {
        setModalType(type);
        setShowCreateMenu(false);
        setShowModal(true);
        
        // Initialize form data based on type
        if (type === 'material') {
            setFormData({ 
                type: 'material', 
                title: '', 
                description: '', 
                topic_id: 1, 
                attachments: [],
                filePermissions: filePermissions
            });
        } else if (type === 'assignment') {
            setFormData({ 
                type: 'assignment', 
                title: '', 
                description: '', 
                topic_id: 1, 
                due_date: '', 
                points: 10,
                filePermissions: filePermissions
            });
        } else if (type === 'question') {
            setFormData({ type: 'question', title: '', description: '', topic_id: 1 });
        } else if (type === 'quiz') {
            setFormData({ 
                type: 'quiz', 
                title: '', 
                description: '', 
                topic_id: 1, 
                due_date: '', 
                points: 20,
                time_limit: 30,
                passing_score: 70,
                questions: []
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createClassworkItem(classroom.id, formData);
            setShowModal(false);
            setFormData({});
            fetchClasswork();
        } catch (error) {
            console.error('Error creating classwork:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="tcw-loading">
                <div className="spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="teacher-classwork">
            <div className="tcw-header">
                <h2>Darslar</h2>
                <div className="tcw-header-actions">
                    <button 
                        className="tcw-topic-btn"
                        onClick={() => setShowTopicModal(true)}
                        title="Yangi mavzu qo'shish"
                    >
                        <FiPlus /> Mavzu qo'shish
                    </button>
                    <div className="tcw-create-dropdown">
                        <button 
                            className="tcw-create-btn"
                            onClick={() => setShowCreateMenu(!showCreateMenu)}
                            title="Yangi element yaratish"
                        >
                            <FiPlus /> Yaratish
                        </button>
                    {showCreateMenu && (
                        <div className="tcw-create-menu">
                            <button 
                                onClick={() => handleCreateClick('material')}
                                title="PDF, video, slayd kabi materiallar yuklash"
                            >
                                <FiFile /> Material
                            </button>
                            <button 
                                onClick={() => handleCreateClick('assignment')}
                                title="O'quvchilarga topshiriq berish"
                            >
                                <FiEdit /> Topshiriq
                            </button>
                            <button 
                                onClick={() => handleCreateClick('question')}
                                title="Savol-javob uchun"
                            >
                                <FiHelpCircle /> Savol
                            </button>
                            <button 
                                onClick={() => handleCreateClick('quiz')}
                                title="Test yaratish va baholash"
                            >
                                <FiCheckSquare /> Test
                            </button>
                        </div>
                    )}
                    </div>
                </div>
            </div>

            <div className="tcw-content">
                {classwork.topics.map(topic => {
                    const topicItems = classwork.items.filter(item => item.topic_id === topic.id);
                    
                    return (
                        <div key={topic.id} className="tcw-topic">
                            <div className="tcw-topic-header">
                                <h3>{topic.name}</h3>
                                <button className="tcw-topic-menu" title="Mavzu sozlamalari">
                                    <FiMoreVertical />
                                </button>
                            </div>

                            <div className="tcw-items">
                                {topicItems.length === 0 ? (
                                    <div className="tcw-empty">
                                        <p>Bu mavzuda hali elementlar yo'q</p>
                                    </div>
                                ) : (
                                    topicItems.map(item => (
                                        <div key={item.id} className={`tcw-item tcw-item-${item.type}`}>
                                            <div className="tcw-item-icon">
                                                {item.type === 'material' && <FiFile />}
                                                {item.type === 'assignment' && <FiEdit />}
                                                {item.type === 'question' && <FiHelpCircle />}
                                                {item.type === 'quiz' && <FiCheckSquare />}
                                            </div>

                                            <div className="tcw-item-content">
                                                <h4>{item.title}</h4>
                                                <p>{item.description}</p>
                                                
                                                {item.due_date && (
                                                    <span className="tcw-item-due">
                                                        Muddat: {formatDate(item.due_date)}
                                                    </span>
                                                )}

                                                {item.points && (
                                                    <span className="tcw-item-points">
                                                        {item.points} ball
                                                    </span>
                                                )}

                                                {item.type === 'assignment' && (
                                                    <div className="tcw-item-stats">
                                                        <span>{item.submissions_count} topshirdi</span>
                                                        <span>•</span>
                                                        <span>{item.graded_count} baholandi</span>
                                                    </div>
                                                )}

                                                {item.type === 'quiz' && (
                                                    <div className="tcw-item-stats">
                                                        <span>{item.questions_count} savol</span>
                                                        <span>•</span>
                                                        <span>{item.time_limit} daqiqa</span>
                                                        <span>•</span>
                                                        <span>{item.attempts_count} urinish</span>
                                                    </div>
                                                )}
                                            </div>

                                            <button className="tcw-item-menu" title="Element sozlamalari">
                                                <FiMoreVertical />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="tcw-modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="tcw-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tcw-modal-header">
                            <h2>
                                {modalType === 'material' && '📄 Material yaratish'}
                                {modalType === 'assignment' && '📝 Topshiriq yaratish'}
                                {modalType === 'question' && '❓ Savol yaratish'}
                                {modalType === 'quiz' && '📊 Test yaratish'}
                            </h2>
                            <button 
                                className="tcw-modal-close"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="tcw-modal-form">
                            {/* Material Modal */}
                            {modalType === 'material' && (
                                <>
                                    <div className="tcw-form-group">
                                        <label>Sarlavha *</label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            placeholder="Material nomi"
                                            required
                                        />
                                    </div>

                                    <div className="tcw-form-group">
                                        <label>Tavsif</label>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            placeholder="Material haqida ma'lumot"
                                            rows="4"
                                        />
                                    </div>

                                    <div className="tcw-form-group">
                                        <label>Mavzu</label>
                                        <select
                                            value={formData.topic_id || 1}
                                            onChange={(e) => setFormData({...formData, topic_id: parseInt(e.target.value)})}
                                        >
                                            {classwork.topics.map(topic => (
                                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="tcw-form-group">
                                        <label>Fayllar</label>
                                        <div className="tcw-file-upload">
                                            <button type="button" className="tcw-upload-btn">
                                                <FiFile /> Fayl yuklash
                                            </button>
                                            <p className="tcw-upload-hint">PDF, Word, PowerPoint, Video</p>
                                        </div>
                                    </div>

                                    <div className="tcw-form-group">
                                        <FilePermissionSettings
                                            initialPermissions={formData.filePermissions || filePermissions}
                                            onPermissionsChange={(newPermissions) => {
                                                setFormData({...formData, filePermissions: newPermissions});
                                                setFilePermissions(newPermissions);
                                            }}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Assignment Modal */}
                            {modalType === 'assignment' && (
                                <>
                                    <div className="tcw-form-group">
                                        <label>Topshiriq nomi *</label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            placeholder="Topshiriq sarlavhasi"
                                            required
                                        />
                                    </div>

                                    <div className="tcw-form-group">
                                        <label>Ko'rsatma</label>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            placeholder="Topshiriq shartlari va ko'rsatmalar"
                                            rows="5"
                                        />
                                    </div>

                                    <div className="tcw-form-row">
                                        <div className="tcw-form-group">
                                            <label>Ball *</label>
                                            <input
                                                type="number"
                                                value={formData.points || 10}
                                                onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                                                min="1"
                                                required
                                            />
                                        </div>

                                        <div className="tcw-form-group">
                                            <label>Muddat</label>
                                            <input
                                                type="datetime-local"
                                                value={formData.due_date || ''}
                                                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="tcw-form-group">
                                        <label>Mavzu</label>
                                        <select
                                            value={formData.topic_id || 1}
                                            onChange={(e) => setFormData({...formData, topic_id: parseInt(e.target.value)})}
                                        >
                                            {classwork.topics.map(topic => (
                                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="tcw-form-group">
                                        <FilePermissionSettings
                                            initialPermissions={formData.filePermissions || filePermissions}
                                            onPermissionsChange={(newPermissions) => {
                                                setFormData({...formData, filePermissions: newPermissions});
                                                setFilePermissions(newPermissions);
                                            }}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Question Modal */}
                            {modalType === 'question' && (
                                <>
                                    <div className="tcw-form-group">
                                        <label>Savol *</label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            placeholder="Savolingizni yozing"
                                            required
                                        />
                                    </div>

                                    <div className="tcw-form-group">
                                        <label>Qo'shimcha ma'lumot</label>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            placeholder="Savol haqida batafsil"
                                            rows="4"
                                        />
                                    </div>

                                    <div className="tcw-form-group">
                                        <label>Mavzu</label>
                                        <select
                                            value={formData.topic_id || 1}
                                            onChange={(e) => setFormData({...formData, topic_id: parseInt(e.target.value)})}
                                        >
                                            {classwork.topics.map(topic => (
                                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* Quiz Modal */}
                            {modalType === 'quiz' && (
                                <>
                                    <div className="tcw-form-group">
                                        <label>Test nomi *</label>
                                        <input
                                            type="text"
                                            value={formData.title || ''}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            placeholder="Test sarlavhasi"
                                            required
                                        />
                                    </div>

                                    <div className="tcw-form-group">
                                        <label>Tavsif</label>
                                        <textarea
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            placeholder="Test haqida ma'lumot"
                                            rows="3"
                                        />
                                    </div>

                                    <div className="tcw-form-row">
                                        <div className="tcw-form-group">
                                            <label>Umumiy ball *</label>
                                            <input
                                                type="number"
                                                value={formData.points || 20}
                                                onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                                                min="1"
                                                required
                                            />
                                            <p className="tcw-form-hint">Test uchun maksimal ball</p>
                                        </div>

                                        <div className="tcw-form-group">
                                            <label>Vaqt (daqiqa) *</label>
                                            <input
                                                type="number"
                                                value={formData.time_limit || 30}
                                                onChange={(e) => setFormData({...formData, time_limit: parseInt(e.target.value)})}
                                                min="1"
                                                required
                                            />
                                            <p className="tcw-form-hint">Test yechish uchun vaqt</p>
                                        </div>
                                    </div>

                                    <div className="tcw-form-row">
                                        <div className="tcw-form-group">
                                            <label>O'tish balli (%) *</label>
                                            <input
                                                type="number"
                                                value={formData.passing_score || 70}
                                                onChange={(e) => setFormData({...formData, passing_score: parseInt(e.target.value)})}
                                                min="1"
                                                max="100"
                                                required
                                            />
                                            <p className="tcw-form-hint">Testdan o'tish uchun minimal foiz</p>
                                        </div>

                                        <div className="tcw-form-group">
                                            <label>Muddat</label>
                                            <input
                                                type="datetime-local"
                                                value={formData.due_date || ''}
                                                onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="tcw-form-group">
                                        <label>Mavzu</label>
                                        <select
                                            value={formData.topic_id || 1}
                                            onChange={(e) => setFormData({...formData, topic_id: parseInt(e.target.value)})}
                                        >
                                            {classwork.topics.map(topic => (
                                                <option key={topic.id} value={topic.id}>{topic.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="tcw-quiz-note">
                                        <p>💡 Test savollarini keyinroq qo'shishingiz mumkin</p>
                                    </div>
                                </>
                            )}

                            <div className="tcw-modal-actions">
                                <button 
                                    type="button" 
                                    className="tcw-btn-cancel"
                                    onClick={() => setShowModal(false)}
                                >
                                    Bekor qilish
                                </button>
                                <button type="submit" className="tcw-btn-submit">
                                    Yaratish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Topic Modal */}
            {showTopicModal && (
                <div className="tcw-modal-overlay" onClick={() => setShowTopicModal(false)}>
                    <div className="tcw-topic-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="tcw-modal-header">
                            <h2>Yangi Mavzu Qo'shish</h2>
                            <button 
                                className="tcw-modal-close"
                                onClick={() => setShowTopicModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            console.log('Yangi mavzu:', topicName);
                            // API call here
                            setShowTopicModal(false);
                            setTopicName('');
                        }} className="tcw-modal-form">
                            <div className="tcw-form-group">
                                <label>Mavzu nomi *</label>
                                <input
                                    type="text"
                                    value={topicName}
                                    onChange={(e) => setTopicName(e.target.value)}
                                    placeholder="Masalan: Kirish, Amaliy mashg'ulotlar, Yakuniy nazorat"
                                    required
                                    autoFocus
                                />
                                <span className="tcw-form-hint">
                                    Mavzu darslarni guruhlashtirish uchun ishlatiladi
                                </span>
                            </div>

                            <div className="tcw-topic-examples">
                                <p>Tavsiya etiladigan mavzular:</p>
                                <div className="tcw-example-chips">
                                    <button 
                                        type="button"
                                        onClick={() => setTopicName('Kirish')}
                                        className="tcw-example-chip"
                                    >
                                        Kirish
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setTopicName('Amaliy mashg\'ulotlar')}
                                        className="tcw-example-chip"
                                    >
                                        Amaliy mashg'ulotlar
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setTopicName('Yakuniy nazorat')}
                                        className="tcw-example-chip"
                                    >
                                        Yakuniy nazorat
                                    </button>
                                </div>
                            </div>

                            <div className="tcw-modal-actions">
                                <button 
                                    type="button" 
                                    className="tcw-btn-cancel"
                                    onClick={() => {
                                        setShowTopicModal(false);
                                        setTopicName('');
                                    }}
                                >
                                    Bekor qilish
                                </button>
                                <button type="submit" className="tcw-btn-submit">
                                    <FiPlus /> Qo'shish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherClasswork;
