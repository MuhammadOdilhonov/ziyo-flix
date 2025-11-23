import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import {
    getMovieDetail,
    getLanguages,
    uploadMovieChunk,
    finishMovieUpload
} from '../../api/apiDirectorProfile'
import { FiChevronLeft, FiUpload, FiX, FiVideo, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'

const CHUNK_SIZE = 5 * 1024 * 1024 // 5MB

const MovieFiles = () => {
    const { slug } = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [languages, setLanguages] = useState([])

    const [showUploadModal, setShowUploadModal] = useState(false)
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState('')
    const [quality, setQuality] = useState('1080p')
    const [languageId, setLanguageId] = useState('')
    const [seasonId, setSeasonId] = useState('')
    const [episodeId, setEpisodeId] = useState('')

    const [uploading, setUploading] = useState(false)
    const [uploadId, setUploadId] = useState('')
    const [totalChunks, setTotalChunks] = useState(0)
    const [uploadedChunks, setUploadedChunks] = useState(0)
    const [progress, setProgress] = useState(0)
    const [statusText, setStatusText] = useState('')

    const uploadingRef = useRef(false)

    useEffect(() => {
        const init = async () => {
            try {
                setLoading(true)
                setError('')
                const [movieData, langs] = await Promise.all([
                    getMovieDetail(slug),
                    getLanguages()
                ])
                setMovie(movieData)
                setLanguages(Array.isArray(langs) ? langs : (langs?.results || []))
                if ((langs && Array.isArray(langs) && langs.length) || (langs?.results?.length)) {
                    const first = Array.isArray(langs) ? langs[0] : langs.results[0]
                    setLanguageId(String(first?.id ?? ''))
                }
                // Prefill season/episode from navigation state if provided
                if (location.state?.season) setSeasonId(String(location.state.season))
                if (location.state?.episode) setEpisodeId(String(location.state.episode))
            } catch (e) {
                setError('Maʼlumotlarni yuklashda xatolik yuz berdi')
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [slug])

    const isSerial = useMemo(() => {
        if (!movie) return false
        if (typeof movie.is_serial === 'boolean') return movie.is_serial
        if (movie.type) return String(movie.type).toLowerCase() === 'serial'
        // fallback to navigation state if provided
        if (location.state?.movieType) return String(location.state.movieType).toLowerCase() === 'serial'
        return false
    }, [movie, location.state])

    const resetUploadState = () => {
        setFile(null)
        setTitle('')
        setQuality('1080p')
        setUploadedChunks(0)
        setTotalChunks(0)
        setProgress(0)
        setStatusText('')
        setUploadId('')
        setSeasonId('')
        setEpisodeId('')
    }

    const genUploadId = () => `${movie?.id || 'movie'}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

    const handleFileChange = (e) => {
        const f = e.target.files?.[0]
        if (f) setFile(f)
    }

    const uploadChunkWithRetry = async (formData, maxRetries = 3) => {
        let attempt = 0
        // Retry on network/server errors
        while (true) {
            try {
                return await uploadMovieChunk(formData)
            } catch (err) {
                attempt += 1
                if (attempt > maxRetries) throw err
                await new Promise(r => setTimeout(r, 1000 * attempt))
            }
        }
    }

    const startUpload = async (e) => {
        e?.preventDefault?.()
        if (!movie?.id) return alert('Movie ID topilmadi')
        if (!file) return alert('Video fayl tanlanmagan')
        if (!title.trim()) return alert('Sarlavha talab qilinadi')
        if (!languageId) return alert('Til tanlanmagan')
        if (isSerial && (!seasonId || !episodeId)) return alert('Serial uchun fasl va qism talab qilinadi')

        const uid = genUploadId()
        setUploadId(uid)
        setUploading(true)
        uploadingRef.current = true

        const total = Math.ceil(file.size / CHUNK_SIZE)
        setTotalChunks(total)
        setUploadedChunks(0)
        setProgress(0)
        setStatusText('Yuklash boshlandi...')

        for (let index = 0; index < total; index++) {
            if (!uploadingRef.current) break
            const start = index * CHUNK_SIZE
            const end = Math.min(start + CHUNK_SIZE, file.size)
            const chunk = file.slice(start, end)

            const fd = new FormData()
            fd.append('file', chunk)
            fd.append('chunkIndex', String(index))
            fd.append('totalChunks', String(total))
            fd.append('uploadId', uid)
            fd.append('movie_id', String(movie.id))
            fd.append('quality', quality)
            fd.append('language_id', String(languageId))
            fd.append('title', title)
            if (isSerial) {
                fd.append('season', String(seasonId))
                fd.append('episode', String(episodeId))
            }

            try {
                await uploadChunkWithRetry(fd)
            } catch (err) {
                setStatusText('Ulanish xatosi. Qayta urinilyapti...')
                // One more explicit retry burst before failing completely
                try {
                    await uploadChunkWithRetry(fd, 5)
                } catch (err2) {
                    setUploading(false)
                    uploadingRef.current = false
                    setStatusText('Yuklash bekor qilindi')
                    alert('Yuklashda xatolik: ' + (err2?.message || 'Nomaʼlum xato'))
                    return
                }
            }

            const nextUploaded = index + 1
            setUploadedChunks(nextUploaded)
            setProgress(Math.round((nextUploaded / total) * 100))
        }

        if (uploadingRef.current) {
            setStatusText('HLS generation starting...')
            try {
                await finishMovieUpload({
                    uploadId: uid,
                    movie_id: movie.id,
                    quality,
                    language_id: Number(languageId),
                    title,
                    ...(isSerial ? { season: Number(seasonId), episode: Number(episodeId) } : {})
                })
                setStatusText('HLS Generation started')
            } catch (err) {
                setStatusText('Finish signal yuborishda xato')
                alert('Finish-upload xatosi: ' + (err?.message || 'Nomaʼlum xato'))
            }

            setUploading(false)
            uploadingRef.current = false
        }

    }

    const closeModal = () => {
        if (uploading) return
        setShowUploadModal(false)
        resetUploadState()
    }

    if (loading) {
        return (
            <div className="mf__container">
                <div className="mf__loading">
                    <div className="mf__spinner" />
                    <p>Yuklanmoqda...</p>
                </div>
            </div>
        )
    }

    if (error || !movie) {
        return (
            <div className="mf__container">
                <div className="mf__error">
                    <div className="mf__error-icon"><FiAlertCircle /></div>
                    <h3>Xatolik</h3>
                    <p>{error || 'Maʼlumot topilmadi'}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mf__container">
            <div className="mf__header">
                <button className="mf__back-btn" onClick={() => navigate(-1)}>
                    <FiChevronLeft /> Ortga
                </button>

                <div className="mf__movie-info">
                    <div className="mf__movie-poster">
                        {movie.poster ? (
                            <img src={movie.poster} alt={movie.title} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', background: '#e2e8f0' }} />
                        )}
                        <div className="mf__movie-type" title={isSerial ? 'Serial' : 'Kino'}>
                            <FiVideo />
                        </div>
                    </div>

                    <div className="mf__movie-details">
                        <h1>{movie.title}</h1>
                        <div className="mf__movie-meta">
                            <span className={`mf__type-badge ${isSerial ? 'mf__type-badge--serial' : 'mf__type-badge--movie'}`}>
                                {isSerial ? 'Serial' : 'Kino'}
                            </span>
                        </div>
                        {movie.description ? (
                            <p className="mf__movie-description">{movie.description}</p>
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="mf__controls">
                <div className="mf__controls-left">
                    <h2>Video fayllar</h2>
                    <div className="mf__files-count">HLS yaratish uchun videoni yuklang</div>
                </div>
                <div className="mf__controls-right">
                    <button className="mf__btn mf__btn--primary" onClick={() => setShowUploadModal(true)}>
                        <FiUpload /> Yangi video yuklash
                    </button>
                </div>
            </div>

            <div className="mf__content">
                <div className="mf__empty">
                    <div className="mf__empty-icon"><FiVideo /></div>
                    <h3>Hozircha video fayllar yoʻq</h3>
                    <p>Yangi video yuklab, backend tomonidan HLS (m3u8 + ts) generatsiyani boshlang.</p>
                    <button className="mf__btn mf__btn--secondary" onClick={() => setShowUploadModal(true)}>
                        <FiUpload /> Video yuklash
                    </button>
                </div>
            </div>

            {showUploadModal && (
                <div className="mf__modal-overlay" onClick={closeModal}>
                    <div className="mf__modal mf__modal--large" onClick={(e) => e.stopPropagation()}>
                        <div className="mf__modal-header">
                            <h3><FiUpload /> Video yuklash</h3>
                            <button className="mf__modal-close" onClick={closeModal} disabled={uploading}><FiX /></button>
                        </div>
                        <div className="mf__modal-body">
                            <form className="mf__upload-form" onSubmit={startUpload}>
                                <div className="mf__form-grid">
                                    <div className="mf__form-group">
                                        <label>Sarlavha</label>
                                        <input className="mf__form-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masalan: Asosiy video" />
                                    </div>

                                    <div className="mf__form-group">
                                        <label>Sifat</label>
                                        <select className="mf__form-select" value={quality} onChange={(e) => setQuality(e.target.value)}>
                                            <option value="480p">480p</option>
                                            <option value="720p">720p</option>
                                            <option value="1080p">1080p</option>
                                            <option value="4k">4K</option>
                                        </select>
                                    </div>

                                    <div className="mf__form-group">
                                        <label>Til</label>
                                        <select className="mf__form-select" value={languageId} onChange={(e) => setLanguageId(e.target.value)}>
                                            <option value="" disabled>Til tanlang</option>
                                            {(languages || []).map(l => (
                                                <option key={l.id} value={l.id}>{l.name || l.title || `ID ${l.id}`}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {isSerial && (
                                        <>
                                            <div className="mf__form-group">
                                                <label>Fasl (season_id)</label>
                                                <input className="mf__form-input" type="number" min="1" value={seasonId} onChange={(e) => setSeasonId(e.target.value)} placeholder="Masalan: 1" />
                                            </div>
                                            <div className="mf__form-group">
                                                <label>Qism (episode_id)</label>
                                                <input className="mf__form-input" type="number" min="1" value={episodeId} onChange={(e) => setEpisodeId(e.target.value)} placeholder="Masalan: 1" />
                                            </div>
                                        </>
                                    )}

                                    <div className="mf__form-group mf__form-group--full mf__file-upload">
                                        <label>Video fayl</label>
                                        <input className="mf__file-input" id="video-file" type="file" accept="video/*" onChange={handleFileChange} />
                                        <label className="mf__file-label" htmlFor="video-file">
                                            <FiUpload /> {file ? file.name : 'MP4 faylni tanlang (frontend faqat upload qiladi)'}
                                        </label>
                                    </div>
                                </div>

                                {uploading && (
                                    <div className="mf__form-group mf__form-group--full">
                                        <label>Yuklash jarayoni</label>
                                        <div style={{ background: '#e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                                            <div style={{ width: `${progress}%`, height: 10, background: '#3b82f6', transition: 'width .3s' }} />
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, color: '#64748b' }}>
                                            <span>{progress}%</span>
                                            <span>{uploadedChunks}/{totalChunks} boʼlak</span>
                                        </div>
                                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, color: '#64748b' }}>
                                            {progress === 100 ? <FiCheckCircle /> : <FiAlertCircle />} <span>{statusText}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="mf__form-actions">
                                    <button type="button" className="mf__btn mf__btn--secondary" onClick={closeModal} disabled={uploading}>
                                        Bekor qilish
                                    </button>
                                    <button type="submit" className="mf__btn mf__btn--primary" disabled={uploading || !file || !title || !languageId || (isSerial && (!seasonId || !episodeId))}>
                                        {uploading ? 'Yuklanmoqda...' : 'Yuklashni boshlash'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}


export default MovieFiles;
