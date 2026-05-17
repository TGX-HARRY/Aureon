import React, { useState, useEffect } from 'react'
import axios from 'axios'
import "./Login.css"
import { Link } from 'react-router-dom'
import { server_url } from './config/config';

function Login() {
    const [values, setValues] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const initGoogleSignIn = async () => {
            try {
                const configResponse = await axios.get(server_url + "/api/config/google-client-id");
                const clientId = configResponse.data?.clientId;
                if (!clientId) return;

                if (window.google && window.google.accounts) {
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: handleCredentialResponse
                    });
                    window.google.accounts.id.renderButton(
                        document.getElementById("google-signin-btn"),
                        { theme: "outline", size: "large", width: 350, text: "signin_with" }
                    );
                } else {
                    // Retry initialization if google script is not yet loaded
                    setTimeout(initGoogleSignIn, 500);
                }
            } catch (error) {
                console.error("Error initializing Google Sign-In:", error);
            }
        };
        initGoogleSignIn();
    }, []);

    const handleCredentialResponse = async (response) => {
        try {
            const res = await axios.post(server_url + "/api/users/subscribers/google", { token: response.credential }, { withCredentials: true });
            if (res.status === 200 || res.status === 201) {
                window.location.href = "/";
            }
        } catch (err) {
            console.error("Google Login Failed", err);
            setError(err.response?.data?.message || 'Google Sign-In failed.');
        }
    };

    function handleChange(e) {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const { email, password } = values;
        if (!email) return setError('Please enter your email');

        try {
            await axios.post(server_url + '/api/users/subscribers/login', { email, password }, { withCredentials: true });
            window.location.href = '/';
        } catch (err) {
            console.warn('login error', err);
            setError(err.response?.data?.message || 'Invalid credentials');
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-box">
                    <h1 className="login-title">Sign In</h1>
                    <form id="loginForm" method="post" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email or Username</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                                value={values.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                required
                                value={values.password}
                                onChange={handleChange}
                            />
                        </div>
                        <button type="submit" className="login-btn" >
                            Sign In
                        </button>

                        <div className="auth-divider">
                            <span>or continue with</span>
                        </div>

                        <div id="google-signin-btn" className="google-btn-wrapper"></div>
                        {error && <p id="error-message" className="error-msg">{error}</p>}
                    </form>
                    <div className="signup-link">
                        <p>
                            New to Aureon? <Link to="/signup">Sign up now</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
