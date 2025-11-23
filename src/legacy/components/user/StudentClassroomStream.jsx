import React, { useState, useEffect } from 'react';
import { FiMessageSquare, FiUser, FiPaperclip } from 'react-icons/fi';
import { getClassroomStream } from '../../api/apiClassroom';
import { BaseUrlReels } from '../../api/apiService';

const StudentClassroomStream = ({ classroom }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (classroom) {
            fetchStream();
        }
    }, [classroom]);

    const fetchStream = async () => {
        try {
            setLoading(true);
            const response = await getClassroomStream(classroom.id);
            setPosts(response.results || []);
        } catch (error) {
            console.error('Error fetching stream:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Hozir';
        if (minutes < 60) return `${minutes} daqiqa oldin`;
        if (hours < 24) return `${hours} soat oldin`;
        if (days < 7) return `${days} kun oldin`;
        return date.toLocaleDateString('uz-UZ');
    };

    if (loading) {
        return (
            <div className="scs-loading">
                <div className="spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="student-classroom-stream">
            {/* Posts List */}
            <div className="scs-posts">
                {posts.length === 0 ? (
                    <div className="scs-empty">
                        <FiMessageSquare />
                        <p>Hali e'lonlar yo'q</p>
                        <span>O'qituvchi e'lon joylaganida bu yerda ko'rinadi</span>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="scs-post">
                            <div className="scs-post-header">
                                <div className="scs-post-author">
                                    <div className="scs-post-avatar">
                                        {post.author.avatar ? (
                                            <img src={`${BaseUrlReels}${post.author.avatar}`} alt={post.author.full_name} />
                                        ) : (
                                            <FiUser />
                                        )}
                                    </div>
                                    <div className="scs-post-author-info">
                                        <h4>{post.author.full_name}</h4>
                                        <span>{formatDate(post.created_at)}</span>
                                    </div>
                                </div>
                                {post.type === 'assignment_posted' && (
                                    <span className="scs-post-type">Vazifa</span>
                                )}
                            </div>

                            <div className="scs-post-content">
                                <p>{post.content}</p>
                                {post.assignment && (
                                    <div className="scs-post-assignment">
                                        <h5>{post.assignment.title}</h5>
                                        <span>Muddat: {new Date(post.assignment.due_date).toLocaleDateString('uz-UZ')}</span>
                                    </div>
                                )}
                                {post.attachments && post.attachments.length > 0 && (
                                    <div className="scs-post-attachments">
                                        {post.attachments.map((file, index) => (
                                            <div key={index} className="scs-attachment">
                                                <FiPaperclip />
                                                <span>{file.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {post.comments && post.comments.length > 0 && (
                                <div className="scs-post-comments">
                                    <h5>{post.comments.length} ta izoh</h5>
                                    {post.comments.map(comment => (
                                        <div key={comment.id} className="scs-comment">
                                            <div className="scs-comment-avatar">
                                                {comment.author.avatar ? (
                                                    <img src={`${BaseUrlReels}${comment.author.avatar}`} alt={comment.author.full_name} />
                                                ) : (
                                                    <FiUser />
                                                )}
                                            </div>
                                            <div className="scs-comment-content">
                                                <div className="scs-comment-header">
                                                    <h6>{comment.author.full_name}</h6>
                                                    <span>{formatDate(comment.created_at)}</span>
                                                </div>
                                                <p>{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="scs-post-actions">
                                <button className="scs-comment-btn" title="Izoh qoldirish">
                                    <FiMessageSquare /> Izoh
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentClassroomStream;
