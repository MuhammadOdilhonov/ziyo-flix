import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sounds, getSoundsBySeason, soundCategories, getSoundsByCategory } from './sounds';
import './sukunat.scss';

const bahorGif = '/times/gif_img/bahor.gif';
const yozGif = '/times/gif_img/yoz.gif';
const kuzGif = '/times/gif_img/kuz.gif';
const qishGif = '/times/gif_img/qish.gif';

const SukunatId = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [selectedSeason, setSelectedSeason] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [selectedDuration, setSelectedDuration] = useState(25);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeLayers, setActiveLayers] = useState([]);
    const [masterVolume, setMasterVolume] = useState(70);
    const [isMuted, setIsMuted] = useState(false);
    const [showSoundModal, setShowSoundModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [seasonAudioPlaying, setSeasonAudioPlaying] = useState(false);
    const [seasonAudioVolume, setSeasonAudioVolume] = useState(70);

    const timerRef = useRef(null);
    const audioNodesRef = useRef({});
    const seasonAudioRef = useRef(null);

    const seasons = [
        {
            id: 'spring',
            name: 'Bahor',
            emoji: '🌸',
            description: 'Yangilanish va o\'sish fasli',
            gradient: 'linear-gradient(135deg, #86efac 0%, #ffc8dd 100%)',
            color: '#86efac',
            bg: bahorGif,
            audio: '/times/mp3/bohor.mp3'
        },
        {
            id: 'summer',
            name: 'Yoz',
            emoji: '☀️',
            description: 'Energiya va faollik fasli',
            gradient: 'linear-gradient(135deg, #ffd60a 0%, #4cc9f0 100%)',
            color: '#ffd60a',
            bg: yozGif,
            audio: '/times/mp3/yoz.mp3'
        },
        {
            id: 'autumn',
            name: 'Kuz',
            emoji: '🍂',
            description: 'Tinchlik va mulohaza fasli',
            gradient: 'linear-gradient(135deg, #f77f00 0%, #d62828 100%)',
            color: '#f77f00',
            bg: kuzGif,
            audio: '/times/mp3/kuz.mp3'
        },
        {
            id: 'winter',
            name: 'Qish',
            emoji: '❄️',
            description: 'Chuqur meditatsiya fasli',
            gradient: 'linear-gradient(135deg, #caf0f8 0%, #90e0ef 100%)',
            color: '#caf0f8',
            bg: qishGif,
            audio: '/times/mp3/qish.mp3'
        }
    ];

    const durations = [5, 10, 15, 20, 25, 30, 45, 60];

    const calculateFinalVolume = (individualVolume) => {
        if (isMuted) return 0;
        return Math.min((individualVolume / 100) * (masterVolume / 100), 1);
    };

    const loadSeasonAudio = useCallback((season) => {
        if (seasonAudioRef.current) {
            seasonAudioRef.current.pause();
            seasonAudioRef.current.currentTime = 0;
            seasonAudioRef.current = null;
        }

        if (season.audio) {
            const audio = new Audio(season.audio);
            audio.loop = true;
            audio.volume = calculateFinalVolume(seasonAudioVolume);
            seasonAudioRef.current = audio;

            setSeasonAudioPlaying(true);
            audio.play().catch(err => {
                console.log('Season audio play error:', err);
                setSeasonAudioPlaying(false);
            });
        }
    }, [seasonAudioVolume, masterVolume, isMuted]);

    useEffect(() => {
        const season = seasons.find(s => s.id === id);
        if (season) {
            setSelectedSeason(season);
            loadSeasonAudio(season);
        }
    }, [id]);

    useEffect(() => {
        if (selectedSeason && !seasonAudioRef.current) {
            loadSeasonAudio(selectedSeason);
        }
    }, [selectedSeason, loadSeasonAudio]);

    const toggleSeasonAudio = () => {
        if (seasonAudioRef.current) {
            if (seasonAudioPlaying) {
                seasonAudioRef.current.pause();
                setSeasonAudioPlaying(false);
            } else {
                seasonAudioRef.current.play().catch(err => {
                    console.log('Season audio play error:', err);
                });
                setSeasonAudioPlaying(true);
            }
        }
    };

    const updateSeasonAudioVolume = (volume) => {
        setSeasonAudioVolume(volume);
        if (seasonAudioRef.current) {
            seasonAudioRef.current.volume = calculateFinalVolume(volume);
        }
    };

    const stopAllAudio = () => {
        if (seasonAudioRef.current) {
            seasonAudioRef.current.pause();
            setSeasonAudioPlaying(false);
        }

        setActiveLayers(prev => prev.map(layer => ({ ...layer, isPlaying: false })));
        Object.keys(audioNodesRef.current).forEach(soundId => {
            if (audioNodesRef.current[soundId]) {
                audioNodesRef.current[soundId].pause();
            }
        });
    };

    const playAllAudio = () => {
        if (seasonAudioRef.current && !seasonAudioPlaying) {
            seasonAudioRef.current.play().catch(err => console.log('Season audio play error:', err));
            setSeasonAudioPlaying(true);
        }

        setActiveLayers(prev => prev.map(layer => ({ ...layer, isPlaying: true })));
        Object.keys(audioNodesRef.current).forEach(soundId => {
            if (audioNodesRef.current[soundId]) {
                audioNodesRef.current[soundId].play().catch(err => console.log('Layer audio play error:', err));
            }
        });
    };

    useEffect(() => {
        return () => {
            Object.values(audioNodesRef.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
            });

            if (seasonAudioRef.current) {
                seasonAudioRef.current.pause();
                seasonAudioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false);
            playCompletionSound();
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isPlaying, timeLeft]);

    useEffect(() => {
        activeLayers.forEach(layer => {
            if (audioNodesRef.current[layer.id]) {
                audioNodesRef.current[layer.id].volume = calculateFinalVolume(layer.volume);
            }
        });

        if (seasonAudioRef.current) {
            seasonAudioRef.current.volume = calculateFinalVolume(seasonAudioVolume);
        }
    }, [masterVolume, isMuted, activeLayers, seasonAudioVolume]);

    const playCompletionSound = () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 2);
    };

    const toggleTimer = () => setIsPlaying(!isPlaying);

    const resetTimer = () => {
        setIsPlaying(false);
        setTimeLeft(selectedDuration * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const totalDuration = selectedDuration * 60;
    const elapsed = totalDuration - timeLeft;
    const progress = totalDuration > 0 ? elapsed / totalDuration : 0;
    const circumference = 2 * Math.PI * 90;
    const strokeDashoffset = circumference * (1 - progress);

    const createAudioElement = useCallback((sound, individualVolume) => {
        const audio = new Audio(sound.src);
        audio.loop = true;
        audio.preload = 'auto';
        audio.volume = calculateFinalVolume(individualVolume);
        return audio;
    }, [masterVolume, isMuted]);

    const toggleLayer = (sound) => {
        const isActive = activeLayers.find(layer => layer.id === sound.id);

        if (isActive) {
            if (audioNodesRef.current[sound.id]) {
                audioNodesRef.current[sound.id].pause();
                delete audioNodesRef.current[sound.id];
            }
            setActiveLayers(prev => prev.filter(layer => layer.id !== sound.id));
        } else {
            const initialVolume = 70;
            const audioElement = createAudioElement(sound, initialVolume);
            audioNodesRef.current[sound.id] = audioElement;
            audioElement.play().catch(err => console.log('Audio play error:', err));
            setActiveLayers(prev => [...prev, { ...sound, volume: initialVolume, isPlaying: true }]);
        }
    };

    const toggleLayerPlayPause = (soundId) => {
        const layer = activeLayers.find(l => l.id === soundId);
        if (!layer || !audioNodesRef.current[soundId]) return;

        if (layer.isPlaying) {
            audioNodesRef.current[soundId].pause();
        } else {
            audioNodesRef.current[soundId].play().catch(err => console.log('Audio play error:', err));
        }

        setActiveLayers(prev => prev.map(l =>
            l.id === soundId ? { ...l, isPlaying: !l.isPlaying } : l
        ));
    };

    const updateLayerVolume = (soundId, volume) => {
        setActiveLayers(prev => prev.map(layer =>
            layer.id === soundId ? { ...layer, volume } : layer
        ));

        if (audioNodesRef.current[soundId]) {
            audioNodesRef.current[soundId].volume = calculateFinalVolume(volume);
        }
    };

    return (
        <div className={`sukunat-app ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
            <div
                className="sukunat-page timer-page fade-in"
                data-season={selectedSeason?.id}
                style={{
                    backgroundImage: selectedSeason?.bg ? `url(${selectedSeason.bg})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh'
                }}
            >
                <div className="page-header">
                    <button className="back-btn" onClick={() => navigate('/timers')}>
                        ←
                    </button>

                    <div className="season-info">
                        <span className="season-emoji">{selectedSeason?.emoji}</span>
                        <span className="season-name">{selectedSeason?.name}</span>
                    </div>

                    <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>
                </div>

                <div className="timer-main">
                    <div className="timer-circle">
                        <svg className="timer-progress" viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                transform="rotate(-90 100 100)"
                            />
                        </svg>

                        <div className="timer-content">
                            <div className="time-display">{formatTime(timeLeft)}</div>
                            <div className="timer-controls">
                                <button className="timer-btn reset" onClick={resetTimer}>
                                    ⟲
                                </button>
                                <button className={`timer-btn play-pause ${isPlaying ? 'playing' : ''}`} onClick={toggleTimer}>
                                    {isPlaying ? '⏸' : '▶'}
                                </button>
                                <button className="timer-btn volume" onClick={() => setIsMuted(!isMuted)}>
                                    {isMuted ? '🔇' : '🔊'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="duration-selector">
                    <h3>Davomiyligi</h3>
                    <div className="duration-buttons">
                        {durations.map(duration => (
                            <button
                                key={duration}
                                className={`duration-btn ${selectedDuration === duration ? 'active' : ''}`}
                                onClick={() => {
                                    if (selectedDuration !== duration) {
                                        setSelectedDuration(duration);
                                        setTimeLeft(duration * 60);
                                        setIsPlaying(false);
                                    }
                                }}
                            >
                                {duration}m
                            </button>
                        ))}
                    </div>
                </div>

                <div className="sound-layers">
                    <div className="sounds-header">
                        <h3>Tovushlar</h3>
                        <div className="header-controls">
                            <button className="play-all-btn" onClick={playAllAudio} title="Barcha tovushlarni boshlash">
                                ▶
                            </button>
                            <button className="stop-all-btn" onClick={stopAllAudio} title="Barcha tovushlarni to'xtatish">
                                ⏸
                            </button>
                            <button className="add-sound-btn" onClick={() => setShowSoundModal(true)} title="Tovush qo'shish">
                                +
                            </button>
                        </div>
                    </div>

                    {selectedSeason && (
                        <div className="season-audio-control">
                            <div className="active-sound-item">
                                <div className="sound-info">
                                    <span className="sound-emoji">{selectedSeason.emoji}</span>
                                    <span className="sound-name">{selectedSeason.name} musiqasi</span>
                                    <button
                                        className={`play-pause-btn ${seasonAudioPlaying ? 'playing' : 'paused'}`}
                                        onClick={toggleSeasonAudio}
                                    >
                                        {seasonAudioPlaying ? '⏸' : '▶'}
                                    </button>
                                </div>
                                <div className="sound-controls">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={seasonAudioVolume}
                                        onChange={(e) => updateSeasonAudioVolume(parseInt(e.target.value))}
                                        className="volume-slider"
                                    />
                                    <span className="volume-value">{seasonAudioVolume}%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="active-sounds">
                        {activeLayers.map(layer => (
                            <div key={layer.id} className="active-sound-item">
                                <div className="sound-info">
                                    <span className="sound-emoji">{layer.emoji}</span>
                                    <span className="sound-name">{layer.name}</span>
                                    <button
                                        className={`play-pause-btn ${layer.isPlaying ? 'playing' : 'paused'}`}
                                        onClick={() => toggleLayerPlayPause(layer.id)}
                                    >
                                        {layer.isPlaying ? '⏸' : '▶'}
                                    </button>
                                </div>
                                <div className="sound-controls">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={layer.volume}
                                        onChange={(e) => updateLayerVolume(layer.id, parseInt(e.target.value))}
                                        className="volume-slider"
                                    />
                                    <span className="volume-value">{layer.volume}%</span>
                                    <button className="remove-sound-btn" onClick={() => toggleLayer(layer)}>
                                        ×
                                    </button>
                                </div>
                            </div>
                        ))}

                        {activeLayers.length === 0 && (
                            <div className="empty-sounds">
                                <div className="empty-icon">🎵</div>
                                <p>Qo'shimcha tovush qo'shish uchun + tugmasini bosing</p>
                                <small>Tabiat tovushlari, musiqa va boshqa ambient tovushlar</small>
                            </div>
                        )}
                    </div>
                </div>

                <div className="master-volume">
                    <div className="volume-control">
                        <span>🔊</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={masterVolume}
                            onChange={(e) => setMasterVolume(parseInt(e.target.value))}
                            className="master-volume-slider"
                        />
                        <span>{masterVolume}%</span>
                    </div>
                </div>
            </div>

            {showSoundModal && (
                <div className="sound-modal-overlay fade-in" onClick={() => setShowSoundModal(false)}>
                    <div className="sound-modal slide-up-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Tovush qo'shish</h3>
                            <button className="close-modal-btn" onClick={() => setShowSoundModal(false)}>
                                ×
                            </button>
                        </div>

                        <div className="modal-content">
                            {!selectedCategory ? (
                                <div className="categories-grid">
                                    {soundCategories.map(category => (
                                        <button
                                            key={category.id}
                                            className="category-card"
                                            style={{ '--category-color': category.color }}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            <span className="category-emoji">{category.emoji}</span>
                                            <span className="category-name">{category.name}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="sounds-list">
                                    <div className="category-header">
                                        <button className="back-to-categories" onClick={() => setSelectedCategory(null)}>
                                            ←
                                        </button>
                                        <h4>
                                            <span>{selectedCategory.emoji}</span>
                                            {selectedCategory.name}
                                        </h4>
                                    </div>

                                    <div className="sounds-grid">
                                        {getSoundsByCategory(selectedCategory.id).map(sound => {
                                            const isActive = activeLayers.find(layer => layer.id === sound.id);
                                            return (
                                                <button
                                                    key={sound.id}
                                                    className={`sound-item ${isActive ? 'active' : ''}`}
                                                    onClick={() => {
                                                        toggleLayer(sound);
                                                        if (!isActive) {
                                                            setShowSoundModal(false);
                                                            setSelectedCategory(null);
                                                        }
                                                    }}
                                                >
                                                    <span className="sound-emoji">{sound.emoji}</span>
                                                    <span className="sound-name">{sound.name}</span>
                                                    <div className="add-icon">{isActive ? '×' : '+'}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SukunatId;
