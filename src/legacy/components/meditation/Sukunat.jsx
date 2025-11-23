import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sukunat.scss';

const Sukunat = () => {
    const navigate = useNavigate();

    const seasons = [
        {
            id: 'spring',
            name: 'Bahor',
            emoji: '🌸',
            title: 'Yangilanish va Umid',
            description: 'Qushlar sayrashi, yashil tabiat uyg‘onadi',
            colors: ['#86efac', '#ffc8dd']
        },
        {
            id: 'summer',
            name: 'Yoz',
            emoji: '☀️',
            title: 'Energiya va Hayot',
            description: 'Issiq quyosh nuri va jonli tabiat',
            colors: ['#ffd60a', '#4cc9f0']
        },
        {
            id: 'autumn',
            name: 'Kuz',
            emoji: '🍂',
            title: 'Tinchlik va Fikrlash',
            description: 'Barglar shivirlashi, yomg‘ir tomchilari',
            colors: ['#f77f00', '#d62828']
        },
        {
            id: 'winter',
            name: 'Qish',
            emoji: '❄️',
            title: 'Sukut va Chuqur Tinchlik',
            description: 'Sovuq shamol va mutlaq osoyishtalik',
            colors: ['#caf0f8', '#90e0ef']
        }
    ];

    return (
        <div className="sukunat-app light-mode">
            <div className="sukunat-page welcome-page fade-in">
                <div className="welcome-header">
                    <div className="logo-animation float-animation">
                        <span className="logo-emoji">🧘‍♀️</span>
                    </div>
                    <h1>Sukunat</h1>
                    <p>Meditatsiya va Tinchlik Taymeri</p>
                </div>

                <div className="seasons-grid">
                    {seasons.map((season, index) => (
                        <div
                            key={season.id}
                            className="season-card slide-up"
                            onClick={() => navigate(`/timers/${season.id}`)}
                            style={{
                                background: `linear-gradient(135deg, ${season.colors[0]}, ${season.colors[1]})`,
                                animationDelay: `${index * 0.1}s`,
                                cursor: 'pointer'
                            }}
                        >
                            <div className="season-emoji">{season.emoji}</div>
                            <h3>{season.name}</h3>
                            <h4>{season.title}</h4>
                            <p>{season.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sukunat;
