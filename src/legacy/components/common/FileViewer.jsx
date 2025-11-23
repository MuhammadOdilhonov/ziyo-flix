import React, { useState } from 'react';
import { FiDownload, FiEye, FiX, FiFile, FiImage, FiVideo, FiMusic } from 'react-icons/fi';
import { BaseUrlReels } from '../../api/apiService';

const FileViewer = ({ 
    file, 
    canDownload = true, 
    canViewInPlatform = true, 
    userRole = 'user',
    teacherPermissions = {
        allowDownload: true,
        allowViewInPlatform: true
    }
}) => {
    const [showViewer, setShowViewer] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Determine actual permissions based on user role and teacher settings
    const actualCanDownload = userRole === 'teacher' ? canDownload : (canDownload && teacherPermissions.allowDownload);
    const actualCanView = userRole === 'teacher' ? canViewInPlatform : (canViewInPlatform && teacherPermissions.allowViewInPlatform);

    // Get file extension and type
    const getFileType = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
            return 'image';
        } else if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension)) {
            return 'video';
        } else if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
            return 'audio';
        } else if (['pdf'].includes(extension)) {
            return 'pdf';
        } else if (['doc', 'docx', 'txt', 'rtf'].includes(extension)) {
            return 'document';
        } else {
            return 'file';
        }
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'image': return <FiImage />;
            case 'video': return <FiVideo />;
            case 'audio': return <FiMusic />;
            default: return <FiFile />;
        }
    };

    const fileType = getFileType(file.name || file.url || '');
    const fileUrl = file.url ? (file.url.startsWith('http') ? file.url : `${BaseUrlReels}${file.url}`) : `${BaseUrlReels}${file}`;

    const handleDownload = () => {
        if (!actualCanDownload) {
            alert('Faylni yuklab olish uchun ruxsat yo\'q');
            return;
        }

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = file.name || 'file';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleViewInPlatform = () => {
        if (!actualCanView) {
            alert('Faylni platformada ko\'rish uchun ruxsat yo\'q');
            return;
        }
        setShowViewer(true);
    };

    const renderFileViewer = () => {
        switch (fileType) {
            case 'image':
                return (
                    <img 
                        src={fileUrl} 
                        alt={file.name || 'Image'} 
                        className="file-viewer-content"
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                    />
                );
            case 'video':
                return (
                    <video 
                        src={fileUrl} 
                        controls 
                        className="file-viewer-content"
                        onLoadedData={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                    >
                        Brauzeringiz video formatini qo'llab-quvvatlamaydi.
                    </video>
                );
            case 'audio':
                return (
                    <audio 
                        src={fileUrl} 
                        controls 
                        className="file-viewer-content"
                        onLoadedData={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                    >
                        Brauzeringiz audio formatini qo'llab-quvvatlamaydi.
                    </audio>
                );
            case 'pdf':
                return (
                    <iframe 
                        src={fileUrl} 
                        className="file-viewer-content"
                        title={file.name || 'PDF Document'}
                        onLoad={() => setIsLoading(false)}
                    />
                );
            default:
                return (
                    <div className="file-viewer-unsupported">
                        <FiFile size={64} />
                        <p>Bu fayl turini ko'rish qo'llab-quvvatlanmaydi</p>
                        <p>Faylni yuklab olib, tashqi dasturda oching</p>
                    </div>
                );
        }
    };

    return (
        <>
            <div className="file-attachment">
                <div className="file-info">
                    <div className="file-icon">
                        {getFileIcon(fileType)}
                    </div>
                    <div className="file-details">
                        <span className="file-name">{file.name || 'Fayl'}</span>
                        {file.size && (
                            <span className="file-size">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                        )}
                    </div>
                </div>

                <div className="file-actions">
                    {actualCanView && ['image', 'video', 'audio', 'pdf'].includes(fileType) && (
                        <button 
                            className="file-action-btn file-action-btn--view"
                            onClick={handleViewInPlatform}
                            title="Platformada ko'rish"
                        >
                            <FiEye />
                        </button>
                    )}
                    
                    {actualCanDownload && (
                        <button 
                            className="file-action-btn file-action-btn--download"
                            onClick={handleDownload}
                            title="Yuklab olish"
                        >
                            <FiDownload />
                        </button>
                    )}
                </div>

                {/* Permission indicators for teachers */}
                {userRole === 'teacher' && (
                    <div className="file-permissions">
                        <span className="permission-label">O'quvchilar uchun:</span>
                        <div className="permission-badges">
                            <span className={`permission-badge ${teacherPermissions.allowViewInPlatform ? 'allowed' : 'denied'}`}>
                                Ko'rish: {teacherPermissions.allowViewInPlatform ? 'Ruxsat' : 'Taqiqlangan'}
                            </span>
                            <span className={`permission-badge ${teacherPermissions.allowDownload ? 'allowed' : 'denied'}`}>
                                Yuklab olish: {teacherPermissions.allowDownload ? 'Ruxsat' : 'Taqiqlangan'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* File Viewer Modal */}
            {showViewer && (
                <div className="file-viewer-modal" onClick={() => setShowViewer(false)}>
                    <div className="file-viewer-container" onClick={e => e.stopPropagation()}>
                        <div className="file-viewer-header">
                            <h3>{file.name || 'Fayl'}</h3>
                            <button 
                                className="file-viewer-close"
                                onClick={() => setShowViewer(false)}
                            >
                                <FiX />
                            </button>
                        </div>

                        <div className="file-viewer-body">
                            {isLoading && (
                                <div className="file-viewer-loading">
                                    <div className="spinner"></div>
                                    <p>Fayl yuklanmoqda...</p>
                                </div>
                            )}
                            {renderFileViewer()}
                        </div>

                        <div className="file-viewer-footer">
                            {actualCanDownload && (
                                <button 
                                    className="btn btn-primary"
                                    onClick={handleDownload}
                                >
                                    <FiDownload /> Yuklab olish
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FileViewer;
