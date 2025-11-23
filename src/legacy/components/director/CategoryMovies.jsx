import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiEye, FiStar, FiClock, FiCalendar, FiUser, FiMapPin, FiFilm, FiMinus, FiUpload } from 'react-icons/fi';
import * as directorAPI from '../../api/apiDirectorProfile';
import { BaseUrlReels } from '../../api/apiService';

const CategoryMovies = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [addModalSearch, setAddModalSearch] = useState('');
  const [addModalFilter, setAddModalFilter] = useState('all');

  const [movieFormData, setMovieFormData] = useState({
    title: '',
    slug: '',
    description: '',
    release_date: '',
    duration: '',
    type: 'movie',
    director: '',
    actors: '',
    country: '',
    categories: []
  });
  const [movieImageFiles, setMovieImageFiles] = useState({
    poster: null,
    cover: null
  });
  const [movieImagePreviews, setMovieImagePreviews] = useState({
    poster: null,
    cover: null
  });

  useEffect(() => {
    fetchCategoryData();
  }, [slug]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      const [categoryData, moviesData, allMoviesData] = await Promise.all([
        directorAPI.getMovieCategoryDetail(slug),
        directorAPI.getCategoryMovies(slug),
        directorAPI.getMovies()
      ]);

      setCategory(categoryData);
      setMovies(moviesData.results || []);
      setAllMovies(allMoviesData.results || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Ma\'lumotlarni yuklashda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  const openPreviewModal = (movie) => {
    setSelectedMovie(movie);
    setShowPreviewModal(true);
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || movie.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const availableMovies = allMovies.filter(movie => movie.type);

  // Debug: Log data for troubleshooting
  console.log('All movies:', allMovies);
  console.log('Available serials (filtered):', availableMovies);
  console.log('Current category movies:', movies);

  const formatDuration = (minutes) => {
    if (!minutes) return 'Noma\'lum';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}s ${mins}d` : `${mins}d`;
  };

  // Open movie modal for editing
  const openMovieModal = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setMovieFormData({
        title: movie.title || '',
        slug: movie.slug || '',
        description: movie.description || '',
        release_date: movie.release_date || '',
        duration: movie.duration || '',
        type: movie.type || 'movie',
        director: movie.director || '',
        actors: movie.actors || '',
        country: movie.country || '',
        categories: movie.categories || []
      });
      setMovieImagePreviews({
        poster: movie.poster ? BaseUrlReels + movie.poster : null,
        cover: movie.cover ? BaseUrlReels + movie.cover : null
      });
    } else {
      setEditingMovie(null);
      setMovieFormData({
        title: '',
        slug: '',
        description: '',
        release_date: '',
        duration: '',
        type: 'movie',
        director: '',
        actors: '',
        country: '',
        categories: []
      });
      setMovieImagePreviews({ poster: null, cover: null });
    }
    setMovieImageFiles({ poster: null, cover: null });
    setShowMovieModal(true);
  };

  const handleAddMovieToCategory = async (movieSlug) => {
    try {
      // Find the movie to get its ID and current categories
      const movieToAdd = allMovies.find(movie => movie.slug === movieSlug);
      if (!movieToAdd) {
        alert('Kino topilmadi!');
        return;
      }

      // Get current categories and add the new category ID
      const currentCategories = movieToAdd.categories || [];

      // Check if movie is already in this category
      if (currentCategories.includes(category.id)) {
        alert('Kino allaqachon bu kategoriyada mavjud!');
        return;
      }

      const newCategories = [...currentCategories, category.id];

      // Update the movie with new categories
      const updateData = {
        categories: newCategories
      };

      await directorAPI.updateMovie(movieSlug, updateData);
      alert('Kino kategoriyaga muvaffaqiyatli qo\'shildi!');
      setShowAddModal(false);
      setAddModalSearch('');
      setAddModalFilter('all');
      fetchCategoryData();
    } catch (error) {
      console.error('Error adding movie to category:', error);
      console.error('Error details:', error.response?.data);
      alert('Kinoni qo\'shishda xatolik yuz berdi: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDeleteMovie = async (movieSlug) => {
    if (window.confirm('Kinoni butunlay o\'chirmoqchimisiz?')) {
      try {
        await directorAPI.deleteMovie(movieSlug);
        alert('Kino muvaffaqiyatli o\'chirildi!');
        fetchCategoryData();
      } catch (error) {
        console.error('Error deleting movie:', error);
        alert('Kinoni o\'chirishda xatolik yuz berdi');
      }
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleMovieImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setMovieImageFiles(prev => ({ ...prev, [type]: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setMovieImagePreviews(prev => ({ ...prev, [type]: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Add text fields
      Object.keys(movieFormData).forEach(key => {
        if (movieFormData[key] && key !== 'categories') {
          formData.append(key, movieFormData[key]);
        }
      });

      // Add categories
      if (editingMovie && editingMovie.categories) {
        // For editing, keep existing categories
        editingMovie.categories.forEach(catId => {
          formData.append('categories', catId);
        });
      } else {
        // For new movie, add current category
        formData.append('categories', category.id);
      }

      // Add image files
      if (movieImageFiles.poster) {
        formData.append('poster', movieImageFiles.poster);
      }
      if (movieImageFiles.cover) {
        formData.append('cover', movieImageFiles.cover);
      }

      if (editingMovie) {
        await directorAPI.updateMovie(editingMovie.slug, formData);
        alert('Kino muvaffaqiyatli yangilandi!');
      } else {
        await directorAPI.createMovie(formData);
        alert('Kino muvaffaqiyatli yaratildi!');
      }

      // Reset form
      setMovieFormData({
        title: '',
        slug: '',
        description: '',
        release_date: '',
        duration: '',
        type: 'movie',
        director: '',
        actors: '',
        country: '',
        categories: []
      });
      setMovieImageFiles({ poster: null, cover: null });
      setMovieImagePreviews({ poster: null, cover: null });
      setEditingMovie(null);
      setShowMovieModal(false);

      // Refresh data
      fetchCategoryData();

    } catch (error) {
      console.error('Error saving movie:', error);
      alert('Kinoni saqlashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="cm">
        <div className="cm__loading">
          <div className="cm__spinner"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cm">
        <div className="cm__error">
          <h3>Xatolik yuz berdi</h3>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="cm__btn cm__btn--secondary">
            <FiArrowLeft /> Ortga qaytish
          </button>
        </div>
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="cm">
      {/* Header */}
      <div className="cm__header">
        <div className="cm__header-top">
          <button className="cm__back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft />
            <span>Ortga</span>
          </button>
        </div>

        <div className="cm__category-info">
          <div className="cm__category-banner">
            <img
              src={category.category_banner || category.category_img}
              alt={category.name}
              className="cm__banner-img"
            />
            <div className="cm__category-overlay">
              <div className="cm__category-details">
                <h1 className="cm__category-title">{category.name}</h1>
                <p className="cm__category-description">{category.description}</p>
                <div className="cm__category-stats">
                  <span className="cm__stat">
                    <FiFilm />
                    {movies.length} ta kino
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="cm__controls">
        <div className="cm__controls-left">
          <div className="cm__search">
            <FiSearch className="cm__search-icon" />
            <input
              type="text"
              placeholder="Kinolarni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="cm__search-input"
            />
          </div>

          <div className="cm__filter">
            <FiFilter className="cm__filter-icon" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="cm__filter-select"
            >
              <option value="all">Barcha turlar</option>
              <option value="movie">Kinolar</option>
              <option value="serial">Seriallar</option>
            </select>
          </div>
        </div>

        <div className="cm__controls-right">
          <button
            className="cm__btn cm__btn--secondary"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus />
            <span>Mavjud kinoni qo'shish</span>
          </button>
          <button
            className="cm__btn cm__btn--primary"
            onClick={() => openMovieModal()}
          >
            <FiFilm />
            <span>Yangi kino yaratish</span>
          </button>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="cm__content">
        {filteredMovies.length === 0 ? (
          <div className="cm__empty">
            <FiFilm className="cm__empty-icon" />
            <h3>Kinolar topilmadi</h3>
            <p>Ushbu kategoriyada hali kinolar yo'q yoki qidiruv bo'yicha natija topilmadi.</p>
            <button
              className="cm__btn cm__btn--primary"
              onClick={() => setShowAddModal(true)}
            >
              <FiPlus />
              <span>Birinchi kinoni qo'shish</span>
            </button>
          </div>
        ) : (
          <div className="cm__movies-grid">
            {filteredMovies.map(movie => (
              <div key={movie.id} className="cm__movie-card">
                <div className="cm__movie-poster">
                  <img src={BaseUrlReels + movie.poster} alt={movie.title} />
                  <div className="cm__movie-overlay">
                    <button
                      className="cm__overlay-btn"
                      onClick={() => openPreviewModal(movie)}
                      title="Ko'rish"
                    >
                      <FiEye />
                    </button>
                  </div>
                  <div className="cm__movie-type">
                    <span className={`cm__type-badge cm__type-badge--${movie.type}`}>
                      {movie.type === 'movie' ? 'Kino' : 'Serial'}
                    </span>
                  </div>
                  {movie.average_rating && (
                    <div className="cm__movie-rating">
                      <FiStar />
                      <span>{movie.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="cm__movie-info">
                  <div className="cm__movie-header">
                    <h3 className="cm__movie-title">{movie.title}</h3>
                    <div className={`cm__movie-type-badge cm__movie-type-badge--${movie.type}`}>
                      {movie.type === 'serial' ? 'Serial' : 'Kino'}
                    </div>
                  </div>

                  <div className="cm__movie-meta">
                    <div className="cm__meta-item">
                      <FiCalendar />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                    <div className="cm__meta-item">
                      <FiClock />
                      <span>{formatDuration(movie.duration)}</span>
                    </div>
                    {movie.type === 'serial' && movie.max_season > 0 && (
                      <div className="cm__meta-item">
                        <FiFilm />
                        <span>{movie.max_season} fasl, {movie.files_count} qism</span>
                      </div>
                    )}
                    {movie.type === 'movie' && movie.files_count > 0 && (
                      <div className="cm__meta-item">
                        <FiFilm />
                        <span>{movie.files_count} fayl</span>
                      </div>
                    )}
                    <div className="cm__meta-item">
                      <FiUser />
                      <span>{movie.director || 'Noma\'lum'}</span>
                    </div>
                    {movie.country && (
                      <div className="cm__meta-item">
                        <FiMapPin />
                        <span>{movie.country}</span>
                      </div>
                    )}
                  </div>

                  <p className="cm__movie-description">
                    {movie.description?.length > 100
                      ? `${movie.description.substring(0, 100)}...`
                      : movie.description
                    }
                  </p>

                  <div className="cm__movie-actions">
                    <button
                      className="cm__action-btn cm__action-btn--edit"
                      onClick={() => openMovieModal(movie)}
                      title="Tahrirlash"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className="cm__action-btn cm__action-btn--upload"
                      onClick={() => navigate(`/profile/director/movie-files/${movie.slug}`, {
                        state: {
                          movieType: movie.type,
                          // Default to first season/episode for serials; MovieFiles will show and allow change
                          ...(movie.type === 'serial' ? { season: 1, episode: 1 } : {})
                        }
                      })}
                      title="Video yuklash"
                      style={{
                        background: 'linear-gradient(90deg, #36d1c4, #5b86e5)',
                        color: '#fff',
                        borderRadius: '6px',
                        padding: '8px 16px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                    >
                      <FiUpload style={{ fontSize: '18px' }} />
                      <span>Video yuklash</span>
                    </button>
                    <button
                      className="cm__action-btn cm__action-btn--delete"
                      onClick={() => handleDeleteMovie(movie.slug)}
                      title="Kinoni butunlay o'chirish"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="cm__modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="cm__modal" onClick={(e) => e.stopPropagation()}>
            <div className="cm__modal-header">
              <h3>Kategoriyaga kino qo'shish</h3>
              <button className="cm__modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="cm__modal-body">
              {/* Search and Filter for Add Modal */}
              <div className="cm__add-modal-controls">
                <div className="cm__search">
                  <FiSearch className="cm__search-icon" />
                  <input
                    type="text"
                    placeholder="Kino qidirish..."
                    value={addModalSearch}
                    onChange={(e) => setAddModalSearch(e.target.value)}
                    className="cm__search-input"
                  />
                </div>
                <div className="cm__filter">
                  <FiFilter className="cm__filter-icon" />
                  <select
                    value={addModalFilter}
                    onChange={(e) => setAddModalFilter(e.target.value)}
                    className="cm__filter-select"
                  >
                    <option value="all">Barchasi</option>
                    <option value="movie">Kinolar</option>
                    <option value="serial">Seriallar</option>
                  </select>
                </div>
              </div>

              <div className="cm__available-movies">
                {(() => {
                  const filteredAvailable = availableMovies
                    .filter(movie => !movies.find(m => m.id === movie.id))
                    .filter(movie => {
                      const matchesSearch = movie.title.toLowerCase().includes(addModalSearch.toLowerCase());
                      const matchesFilter = addModalFilter === 'all' || movie.type === addModalFilter;
                      return matchesSearch && matchesFilter;
                    });

                  if (filteredAvailable.length === 0) {
                    return (
                      <div className="cm__empty">
                        <div className="cm__empty-icon"><FiFilm /></div>
                        <h3>Kinolar topilmadi</h3>
                        <p>Qidiruv shartlariga mos kinolar mavjud emas yoki barcha kinolar allaqachon qo'shilgan.</p>
                      </div>
                    );
                  }

                  return filteredAvailable.map(movie => (
                    <div key={movie.id} className="cm__available-movie">
                      <img src={BaseUrlReels + movie.poster} alt={movie.title} className="cm__available-poster" />
                      <div className="cm__available-info">
                        <h4>{movie.title}</h4>
                        <p>
                          {movie.director || 'Noma\'lum'} • {new Date(movie.release_date).getFullYear()}
                          {movie.type === 'serial' && movie.max_season > 0 && (
                            <span> • {movie.max_season} fasl, {movie.files_count} qism</span>
                          )}
                          {movie.type === 'movie' && movie.files_count > 0 && (
                            <span> • {movie.files_count} fayl</span>
                          )}
                        </p>
                        <div className="cm__movie-type-badge">
                          {movie.type === 'serial' ? 'Serial' : 'Kino'}
                        </div>
                      </div>
                      <button
                        className="cm__btn cm__btn--small cm__btn--primary"
                        onClick={() => handleAddMovieToCategory(movie.slug)}
                      >
                        Qo'shish
                      </button>
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Movie Creation Modal */}
      {showMovieModal && (
        <div className="cm__modal-overlay" onClick={() => setShowMovieModal(false)}>
          <div className="cm__modal cm__modal--large" onClick={(e) => e.stopPropagation()}>
            <div className="cm__modal-header">
              {/* Category Banner in Modal Header */}
              <div className="cm__modal-banner">

              </div>
              <button className="cm__modal-close" onClick={() => setShowMovieModal(false)}>×</button>
            </div>
            <div className="cm__modal-body">
              <form onSubmit={handleMovieSubmit} className="cm__movie-form">
                <div className="cm__form-grid">
                  {/* Basic Information */}
                  <div className="cm__form-section">
                    <h4>Asosiy ma'lumotlar</h4>
                    <div className="cm__form-row">
                      <div className="cm__form-group">
                        <label>Kino nomi *</label>
                        <input
                          type="text"
                          value={movieFormData.title}
                          onChange={(e) => {
                            setMovieFormData(prev => ({
                              ...prev,
                              title: e.target.value,
                              slug: generateSlug(e.target.value)
                            }));
                          }}
                          required
                          className="cm__form-input"
                          placeholder="Kino nomini kiriting"
                        />
                      </div>
                      <div className="cm__form-group">
                        <label>Slug *</label>
                        <input
                          type="text"
                          value={movieFormData.slug}
                          onChange={(e) => setMovieFormData(prev => ({ ...prev, slug: e.target.value }))}
                          required
                          className="cm__form-input"
                          placeholder="URL slug"
                        />
                      </div>
                    </div>

                    <div className="cm__form-group">
                      <label>Tavsif</label>
                      <textarea
                        value={movieFormData.description}
                        onChange={(e) => setMovieFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="cm__form-textarea"
                        rows="4"
                        placeholder="Kino haqida qisqacha ma'lumot"
                      />
                    </div>
                  </div>

                  {/* Movie Details */}
                  <div className="cm__form-section">
                    <h4>Kino ma'lumotlari</h4>
                    <div className="cm__form-row">
                      <div className="cm__form-group">
                        <label>Turi *</label>
                        <select
                          value={movieFormData.type}
                          onChange={(e) => setMovieFormData(prev => ({ ...prev, type: e.target.value }))}
                          className="cm__form-select"
                        >
                          <option value="movie">Kino</option>
                          <option value="serial">Serial</option>
                        </select>
                      </div>
                      <div className="cm__form-group">
                        <label>Chiqarilgan sana</label>
                        <input
                          type="date"
                          value={movieFormData.release_date}
                          onChange={(e) => setMovieFormData(prev => ({ ...prev, release_date: e.target.value }))}
                          className="cm__form-input"
                        />
                      </div>
                    </div>

                    <div className="cm__form-row">
                      <div className="cm__form-group">
                        <label>Davomiyligi (daqiqa)</label>
                        <input
                          type="number"
                          value={movieFormData.duration}
                          onChange={(e) => setMovieFormData(prev => ({ ...prev, duration: e.target.value }))}
                          className="cm__form-input"
                          placeholder="120"
                        />
                      </div>
                      <div className="cm__form-group">
                        <label>Mamlakat</label>
                        <input
                          type="text"
                          value={movieFormData.country}
                          onChange={(e) => setMovieFormData(prev => ({ ...prev, country: e.target.value }))}
                          className="cm__form-input"
                          placeholder="O'zbekiston"
                        />
                      </div>
                    </div>

                    <div className="cm__form-row">
                      <div className="cm__form-group">
                        <label>Rejissyor</label>
                        <input
                          type="text"
                          value={movieFormData.director}
                          onChange={(e) => setMovieFormData(prev => ({ ...prev, director: e.target.value }))}
                          className="cm__form-input"
                          placeholder="Rejissyor ismi"
                        />
                      </div>
                      <div className="cm__form-group">
                        <label>Aktyorlar</label>
                        <input
                          type="text"
                          value={movieFormData.actors}
                          onChange={(e) => setMovieFormData(prev => ({ ...prev, actors: e.target.value }))}
                          className="cm__form-input"
                          placeholder="Aktyorlar ro'yxati"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Images Upload */}
                  <div className="cm__form-section cm__form-section--full">
                    <h4>Rasmlar</h4>
                    <div className="cm__form-row">
                      <div className="cm__form-group">
                        <label>Poster</label>
                        <div className="cm__image-upload">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMovieImageChange(e, 'poster')}
                            className="cm__file-input"
                            id="poster-upload"
                          />
                          <label htmlFor="poster-upload" className="cm__file-label">
                            {movieImagePreviews.poster ? (
                              <img src={movieImagePreviews.poster} alt="Poster preview" className="cm__image-preview" />
                            ) : (
                              <div className="cm__upload-placeholder">
                                <FiFilm size={24} />
                                <span>Poster yuklash</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="cm__form-group">
                        <label>Muqova</label>
                        <div className="cm__image-upload">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMovieImageChange(e, 'cover')}
                            className="cm__file-input"
                            id="cover-upload"
                          />
                          <label htmlFor="cover-upload" className="cm__file-label">
                            {movieImagePreviews.cover ? (
                              <img src={movieImagePreviews.cover} alt="Cover preview" className="cm__image-preview" />
                            ) : (
                              <div className="cm__upload-placeholder">
                                <FiFilm size={24} />
                                <span>Muqova yuklash</span>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cm__form-actions">
                  <button
                    type="button"
                    className="cm__btn cm__btn--secondary"
                    onClick={() => setShowMovieModal(false)}
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="cm__btn cm__btn--primary"
                    disabled={loading}
                  >
                    {loading ? 'Saqlanmoqda...' : (editingMovie ? 'Yangilash' : 'Yaratish')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Movie Preview Modal */}
      {showPreviewModal && selectedMovie && (
        <div className="cm__modal-overlay" onClick={() => setShowPreviewModal(false)}>
          <div className="cm__modal cm__modal--large" onClick={(e) => e.stopPropagation()}>
            <div className="cm__modal-header">
              <h3>{selectedMovie.title}</h3>
              <button className="cm__modal-close" onClick={() => setShowPreviewModal(false)}>×</button>
            </div>
            <div className="cm__modal-body">
              <div className="cm__preview-content">
                <div className="cm__preview-poster">
                  <img src={BaseUrlReels + selectedMovie.poster} alt={selectedMovie.title} />
                </div>
                <div className="cm__preview-info">
                  <div className="cm__preview-meta">
                    <span className={`cm__type-badge cm__type-badge--${selectedMovie.type}`}>
                      {selectedMovie.type === 'movie' ? 'Kino' : 'Serial'}
                    </span>
                    {selectedMovie.average_rating && (
                      <div className="cm__rating">
                        <FiStar />
                        <span>{selectedMovie.average_rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  <div className="cm__preview-details">
                    <div className="cm__detail-row">
                      <strong>Rejissyor:</strong> {selectedMovie.director}
                    </div>
                    <div className="cm__detail-row">
                      <strong>Aktyorlar:</strong> {selectedMovie.actors}
                    </div>
                    <div className="cm__detail-row">
                      <strong>Chiqarilgan yili:</strong> {new Date(selectedMovie.release_date).getFullYear()}
                    </div>
                    <div className="cm__detail-row">
                      <strong>Davomiyligi:</strong> {formatDuration(selectedMovie.duration)}
                    </div>
                    {selectedMovie.country && (
                      <div className="cm__detail-row">
                        <strong>Mamlakat:</strong> {selectedMovie.country}
                      </div>
                    )}
                  </div>

                  <div className="cm__preview-description">
                    <h4>Tavsif</h4>
                    <p>{selectedMovie.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMovies;
