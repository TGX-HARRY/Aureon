import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { server_url } from './config/config';

const AVATARS = [
    '/images/avatar1.jpg',
    '/images/avatar2.jpg',
    '/images/avatar3.jpg',
    '/images/avatar4.jpg'
];

function Profile() {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullName: '',
        phone: '',
        address: '',
        dob: '',
        gender: '',
        avatar: '/images/avatar1.jpg'
    });
    const sliderRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const { data } = await axios.get(server_url + '/api/users/subscribers/me', { withCredentials: true });
                const genderVal = data.gender
                    ? data.gender.charAt(0).toUpperCase() + data.gender.slice(1).toLowerCase()
                    : 'None';
                setFormData({
                    username: data.username || '',
                    email: data.email || '',
                    fullName: data.fullName || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    dob: data.dob ? data.dob.slice(0, 10) : '',
                    gender: genderVal,
                    avatar: data.avatar || '/images/avatar1.jpg'
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                navigate('/login');
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'phone') {
            setFormData(prev => ({ ...prev, [id]: value.replace(/[^0-9]/g, '') }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleAvatarClick = (av) => {
        setFormData(prev => ({ ...prev, avatar: av }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(server_url + '/api/users/subscribers/changeinfo', {
                ...formData,
                gender: formData.gender ? formData.gender.toLowerCase() : ''
            }, { withCredentials: true });
            alert("Profile updated successfully!");
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred while updating the profile.");
        }
    };

    const scrollSlider = (dir) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: dir * 120, behavior: 'smooth' });
        }
    };

    if (loading) return <div className="loading-screen">Loading...</div>;

    return (
        <div className="profile-container">
            <div className="profile-form-card">
                <h1>Edit Profile</h1>
                <form onSubmit={handleSubmit}>
                    {/* Avatar */}
                    <div className="avatar-section">
                        <div className="avatar-preview">
                            <img src={formData.avatar} alt="Preview" />
                        </div>
                        <div className="avatar-carousel">
                            <button type="button" className="avatar-btn" onClick={() => scrollSlider(-1)}>&#10094;</button>
                            <div className="avatar-slider" ref={sliderRef}>
                                {AVATARS.map((av, i) => (
                                    <img
                                        key={i}
                                        src={av}
                                        alt={`Avatar ${i + 1}`}
                                        className={`avatar-option${formData.avatar === av ? ' selected' : ''}`}
                                        onClick={() => handleAvatarClick(av)}
                                    />
                                ))}
                            </div>
                            <button type="button" className="avatar-btn" onClick={() => scrollSlider(1)}>&#10095;</button>
                        </div>
                        <input type="hidden" id="avatarUrl" value={formData.avatar} />
                    </div>

                    {/* Full Name */}
                    <div className="input-group">
                        <input type="text" id="fullName" placeholder=" " value={formData.fullName} onChange={handleChange} required />
                        <label htmlFor="fullName">Full Name</label>
                    </div>

                    {/* Username */}
                    <div className="input-group">
                        <input type="text" id="username" placeholder=" " value={formData.username} onChange={handleChange} required />
                        <label htmlFor="username">Username</label>
                    </div>

                    {/* Email */}
                    <div className="input-group">
                        <input type="email" id="email" placeholder=" " value={formData.email} disabled />
                        <label htmlFor="email" className="fixed-label">Email</label>
                    </div>

                    {/* Phone */}
                    <div className="input-group">
                        <input type="tel" id="phone" placeholder=" " maxLength="10" value={formData.phone} onChange={handleChange} required />
                        <label htmlFor="phone">Phone Number</label>
                    </div>

                    {/* Address */}
                    <div className="input-group">
                        <input type="text" id="address" placeholder=" " value={formData.address} onChange={handleChange} required />
                        <label htmlFor="address">Address</label>
                    </div>

                    {/* Date of Birth */}
                    <div className="input-group">
                        <input type="date" id="dob" value={formData.dob} onChange={handleChange} required />
                        <label htmlFor="dob" className="fixed-label">Date of Birth</label>
                    </div>

                    {/* Gender */}
                    <div className="input-group">
                        <select id="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="" disabled></option>
                            <option>Female</option>
                            <option>Male</option>
                            <option>None</option>
                            <option>Others</option>
                        </select>
                        <label htmlFor="gender" className="fixed-label">Gender</label>
                    </div>

                    {/* Buttons */}
                    <div className="btn-group">
                        <button type="button" className="profile-btn profile-cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className="profile-btn profile-save-btn">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Profile;
