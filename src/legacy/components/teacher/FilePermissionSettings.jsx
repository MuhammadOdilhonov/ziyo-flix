import React, { useState } from 'react';
import { FiSettings, FiEye, FiDownload, FiCheck, FiX } from 'react-icons/fi';

const FilePermissionSettings = ({ 
    initialPermissions = {
        allowViewInPlatform: true,
        allowDownload: true
    },
    onPermissionsChange,
    className = ""
}) => {
    const [permissions, setPermissions] = useState(initialPermissions);
    const [showSettings, setShowSettings] = useState(false);

    const handlePermissionChange = (key, value) => {
        const newPermissions = {
            ...permissions,
            [key]: value
        };
        setPermissions(newPermissions);
        
        if (onPermissionsChange) {
            onPermissionsChange(newPermissions);
        }
    };

    return (
        <div className={`file-permission-settings ${className}`}>
            <button 
                className="permission-settings-trigger"
                onClick={() => setShowSettings(!showSettings)}
                title="Fayl ruxsatlarini sozlash"
            >
                <FiSettings />
                <span>Fayl ruxsatlari</span>
            </button>

            {showSettings && (
                <div className="permission-settings-panel">
                    <div className="permission-settings-header">
                        <h4>O'quvchilar uchun fayl ruxsatlari</h4>
                        <button 
                            className="close-settings"
                            onClick={() => setShowSettings(false)}
                        >
                            <FiX />
                        </button>
                    </div>

                    <div className="permission-settings-content">
                        <div className="permission-item">
                            <div className="permission-info">
                                <div className="permission-icon">
                                    <FiEye />
                                </div>
                                <div className="permission-details">
                                    <h5>Platformada ko'rish</h5>
                                    <p>O'quvchilar fayllarni brauzerda ochib ko'ra olishadi</p>
                                </div>
                            </div>
                            <div className="permission-toggle">
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox"
                                        checked={permissions.allowViewInPlatform}
                                        onChange={(e) => handlePermissionChange('allowViewInPlatform', e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="permission-item">
                            <div className="permission-info">
                                <div className="permission-icon">
                                    <FiDownload />
                                </div>
                                <div className="permission-details">
                                    <h5>Yuklab olish</h5>
                                    <p>O'quvchilar fayllarni o'z qurilmalariga yuklab olishlari mumkin</p>
                                </div>
                            </div>
                            <div className="permission-toggle">
                                <label className="toggle-switch">
                                    <input 
                                        type="checkbox"
                                        checked={permissions.allowDownload}
                                        onChange={(e) => handlePermissionChange('allowDownload', e.target.checked)}
                                    />
                                    <span className="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="permission-settings-footer">
                        <div className="permission-summary">
                            <span className="summary-label">Joriy sozlamalar:</span>
                            <div className="summary-badges">
                                <span className={`summary-badge ${permissions.allowViewInPlatform ? 'enabled' : 'disabled'}`}>
                                    {permissions.allowViewInPlatform ? <FiCheck /> : <FiX />}
                                    Ko'rish
                                </span>
                                <span className={`summary-badge ${permissions.allowDownload ? 'enabled' : 'disabled'}`}>
                                    {permissions.allowDownload ? <FiCheck /> : <FiX />}
                                    Yuklab olish
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilePermissionSettings;
