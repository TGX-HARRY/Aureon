import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { server_url } from './config/config';
import './AdminDashboard.css';

function AdminDashboard() {
    const [stats, setStats] = useState({ users: '-', movies: '-' });
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [formData, setFormData] = useState({
        title: '', genre: '', rating: '', img: '', trailer: '', sectionTitle: 'Recently Added'
    });
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAndLoad = async () => {
            try {
                const { data: user } = await axios.get(server_url + '/api/users/subscribers/me', { withCredentials: true });
                if (user.role !== 'admin') {
                    alert("Access denied! Admins only.");
                    navigate('/');
                    return;
                }
                fetchData();
            } catch {
                navigate('/login');
            }
        };
        verifyAndLoad();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const [userCountRes, movieCountRes, moviesRes] = await Promise.all([
                axios.get(server_url + '/api/admin/users/count', { withCredentials: true }),
                axios.get(server_url + '/api/admin/movies/count', { withCredentials: true }),
                axios.get(server_url + '/api/movies/', { withCredentials: true })
            ]);
            setStats({
                users: userCountRes.data.count,
                movies: movieCountRes.data.count
            });
            setMovies([...moviesRes.data].reverse());
            setLoading(false);
        } catch (err) {
            console.error("Error fetching admin data", err);
        }
    };

    const openAddModal = () => {
        setEditingMovie(null);
        setFormData({ title: '', genre: '', rating: '', img: '', trailer: '', sectionTitle: 'Recently Added' });
        setShowModal(true);
    };

    const openEditModal = (movie) => {
        setEditingMovie(movie);
        setFormData({
            title: movie.title,
            genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre,
            rating: movie.rating,
            img: movie.img,
            trailer: movie.trailer,
            sectionTitle: movie.sectionTitle || 'Recently Added'
        });
        setShowModal(true);
    };

    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingMovie ? `/api/movies/update/${editingMovie._id}` : '/api/movies/add';
            const method = editingMovie ? 'patch' : 'post';
            await axios[method](server_url + url, formData, { withCredentials: true });
            alert(editingMovie ? "Movie updated!" : "Movie added!");
            setShowModal(false);
            fetchData();
        } catch (err) {
            alert("Operation failed: " + (err.response?.data?.message || "Unknown error"));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this movie?")) return;
        try {
            await axios.delete(server_url + `/api/movies/delete/${id}`, { withCredentials: true });
            alert("Movie deleted!");
            setMovies(prev => prev.filter(m => m._id !== id));
            setStats(prev => ({ ...prev, movies: Number(prev.movies) - 1 }));
        } catch {
            alert("Error deleting movie.");
        }
    };

    const closeModal = () => setShowModal(false);

    if (loading) return <div className="loading-screen">Loading Admin Panel...</div>;

    return (
        <div style={{ background: '#0d0d0d', minHeight: '100vh' }}>

            {/* Main content */}
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Dashboard Overview</h1>
                    <button className="add-btn" onClick={openAddModal}>
                        <i className="fa fa-plus"></i> Add Content
                    </button>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fa fa-users"></i></div>
                        <div className="stat-details"><h3>Total Users</h3><p id="ucount">{stats.users}</p></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fa fa-film"></i></div>
                        <div className="stat-details"><h3>Total Movies</h3><p id="mcount">{stats.movies}</p></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fa fa-tv"></i></div>
                        <div className="stat-details"><h3>Total Shows</h3><p id="scount">4</p></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><i className="fa fa-eye"></i></div>
                        <div className="stat-details"><h3>Active Views</h3><p>8,904</p></div>
                    </div>
                </div>

                {/* Content table */}
                <div className="management-section">
                    <h2>Recent Uploads / Content Management</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Genre</th>
                                <th>Rating</th>
                                <th>Date Added</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movies.map(movie => (
                                <tr key={movie._id}>
                                    <td>{movie.title}</td>
                                    <td>{Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre}</td>
                                    <td><span className="rating-badge">{movie.rating}</span></td>
                                    <td>{movie.createdAt ? new Date(movie.createdAt).toLocaleDateString() : 'N/A'}</td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="action-btn edit-btn" onClick={() => openEditModal(movie)} title="Edit">
                                                <i className="fa fa-edit"></i>
                                            </button>
                                            <button className="action-btn delete-btn" onClick={() => handleDelete(movie._id)} title="Delete">
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <div className={`admin-modal-overlay${showModal ? ' open' : ''}`} onClick={(e) => { if (e.target.classList.contains('admin-modal-overlay')) closeModal(); }}>
                <div className="admin-modal-content">
                    <div className="admin-modal-header">
                        <h2 id="modalTitle">{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
                        <button className="close-btn" onClick={closeModal}>&times;</button>
                    </div>
                    <form id="addMovieForm" onSubmit={handleSubmit}>
                        <input type="hidden" value={editingMovie?._id || ''} />
                        <div className="modal-input-group">
                            <label>Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleFormChange} required />
                        </div>
                        <div className="modal-grid-2">
                            <div className="modal-input-group">
                                <label>Genre</label>
                                <input type="text" name="genre" value={formData.genre} onChange={handleFormChange} required />
                            </div>
                            <div className="modal-input-group">
                                <label>Rating</label>
                                <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleFormChange} required />
                            </div>
                        </div>
                        <div className="modal-input-group">
                            <label>Image URL</label>
                            <input type="text" name="img" value={formData.img} onChange={handleFormChange} required />
                        </div>
                        <div className="modal-input-group">
                            <label>Trailer URL (YouTube Embed)</label>
                            <input type="text" name="trailer" value={formData.trailer} onChange={handleFormChange} required />
                        </div>
                        {!editingMovie && (
                            <div className="modal-input-group" id="sectionGroup">
                                <label>Section Title (e.g. Trending, New Releases)</label>
                                <input type="text" name="sectionTitle" value={formData.sectionTitle} onChange={handleFormChange} placeholder="Recently Added" />
                            </div>
                        )}
                        <button type="submit" id="modalSubmitBtn" className="save-btn">
                            {editingMovie ? 'Save Changes' : 'Add Movie'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
