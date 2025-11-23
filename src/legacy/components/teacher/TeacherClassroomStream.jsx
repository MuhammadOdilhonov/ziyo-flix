import React, { useState, useEffect } from 'react';
import { FiSend, FiPaperclip, FiMessageSquare, FiUser } from 'react-icons/fi';
import { getClassroomStream, postToStream } from '../../api/apiClassroom';
import { BaseUrlReels } from '../../api/apiService';

const TeacherClassroomStream = ({ classroom }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [posting, setPosting] = useState(false);

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

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        try {
            setPosting(true);
            await postToStream(classroom.id, { content: newPost });
            setNewPost('');
            fetchStream();
        } catch (error) {
            console.error('Error posting:', error);
        } finally {
            setPosting(false);
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
            <div className="tcs-loading">
                <div className="spinner"></div>
                <p>Yuklanmoqda...</p>
            </div>
        );
    }

    return (
        <div className="teacher-classroom-stream">
            {/* Post Form */}
            <div className="tcs-post-form">
                <div className="tcs-post-avatar">
                    <FiUser />
                </div>
                <form onSubmit={handlePostSubmit} className="tcs-form">
                    <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder="Sinf uchun e'lon yozing..."
                        rows="3"
                        disabled={posting}
                    />
                    <div className="tcs-form-actions">
                        <button 
                            type="button" 
                            className="tcs-attach-btn"
                            title="Fayl biriktirish"
                        >
                            <FiPaperclip /> Fayl
                        </button>
                        <button 
                            type="submit" 
                            className="tcs-submit-btn"
                            disabled={!newPost.trim() || posting}
                            title="E'lon joylash"
                        >
                            {posting ? 'Joylanmoqda...' : <><FiSend /> Joylash</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Posts List */}
            <div className="tcs-posts">
                {posts.length === 0 ? (
                    <div className="tcs-empty">
                        <FiMessageSquare />
                        <p>Hali e'lonlar yo'q</p>
                        <span>Birinchi e'loningizni joylang</span>
                    </div>
                ) : (
                    posts.map(post => (
                        <div key={post.id} className="tcs-post">
                            <div className="tcs-post-header">
                                <div className="tcs-post-author">
                                    <div className="tcs-post-avatar">
                                        {post.author.avatar ? (
                                            <img src={`${BaseUrlReels}${post.author.avatar}`} alt={post.author.full_name} />
                                        ) : (
                                            <FiUser />
                                        )}
                                    </div>
                                    <div className="tcs-post-author-info">
                                        <h4>{post.author.full_name}</h4>
                                        <span>{formatDate(post.created_at)}</span>
                                    </div>
                                </div>
                                {post.type === 'assignment_posted' && (
                                    <span className="tcs-post-type">Vazifa</span>
                                )}
                            </div>

                            <div className="tcs-post-content">
                                <p>{post.content}</p>
                                {post.assignment && (
                                    <div className="tcs-post-assignment">
                                        <h5>{post.assignment.title}</h5>
                                        <span>Muddat: {new Date(post.assignment.due_date).toLocaleDateString('uz-UZ')}</span>
                                    </div>
                                )}
                            </div>

                            {post.comments && post.comments.length > 0 && (
                                <div className="tcs-post-comments">
                                    <h5>{post.comments.length} ta izoh</h5>
                                    {post.comments.map(comment => (
                                        <div key={comment.id} className="tcs-comment">
                                            <div className="tcs-comment-avatar">
                                                {comment.author.avatar ? (
                                                    <img src={`${BaseUrlReels}${comment.author.avatar}`} alt={comment.author.full_name} />
                                                ) : (
                                                    <FiUser />
                                                )}
                                            </div>
                                            <div className="tcs-comment-content">
                                                <div className="tcs-comment-header">
                                                    <h6>{comment.author.full_name}</h6>
                                                    <span>{formatDate(comment.created_at)}</span>
                                                </div>
                                                <p>{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="tcs-post-actions">
                                <button className="tcs-comment-btn" title="Izoh qoldirish">
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

export default TeacherClassroomStream;
