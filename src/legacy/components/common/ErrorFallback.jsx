import React from "react";

const ErrorFallback = ({ message = "Ma'lumot kelmadi", details = "Internet yoki server bilan muammo bo'lishi mumkin." }) => {
  return (
    <div className="error-fallback" style={{
      display: 'grid',
      placeItems: 'center',
      textAlign: 'center',
      padding: '24px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      <img
        src="./images_and_gif/loading.gif"
        alt="error"
        style={{ width: 220, height: 'auto', marginBottom: 12, objectFit: 'contain' }}
      />
      <h3 style={{ margin: 0, color: '#fff', fontWeight: 700 }}>{message}</h3>
      {details && (
        <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.8)' }}>{details}</p>
      )}
    </div>
  );
};

export default ErrorFallback;
