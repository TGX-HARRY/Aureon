import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css";
import Validate from "./Backend/Validation";
import { server_url } from "./config/config";

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

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
            document.getElementById("google-signup-btn"),
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
      const res = await axios.post(server_url + "/api/users/subscribers/google", { token: response.credential });
      if (res.status === 200 || res.status === 201) {
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Google Login Failed", err);
      setErrors({ email: err.response?.data?.message || 'Google Sign-In failed.' });
    }
  };

  function handleBlur(event) {
    const { name } = event.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Re-run validation when leaving a field
    const validationErrors = Validate(values);
    setErrors(validationErrors);
  }
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));

  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = Validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post(server_url + '/api/users/subscribers/register', {
          username: values.name,
          email: values.email,
          password: values.password
        });
        alert('Registration successful! Please login.');
        navigate('/login');
      } catch (err) {
        console.warn('Signup error', err);
        setErrors({ email: err.response?.data?.message || 'Signup failed' });
      }
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-box">
          <h1 className="signup-title">Sign Up</h1>

          <form id="signUpForm" onSubmit={handleSubmit}>

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name"
                required
                autoComplete="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
              {touched.name && errors.name && <small className="error-msg">{errors.name}</small>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                required
                autoComplete="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {touched.email && errors.email && <small className="error-msg">{errors.email}</small>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Create a password"
                required
                autoComplete="new-password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {touched.password && errors.password && <small className="error-msg">{errors.password}</small>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirmPassword}
              />
              {touched.confirmPassword && errors.confirmPassword && (<small className="error-msg">{errors.confirmPassword}</small>)}
            </div>

            <button className="signup-btn" type="submit">
              Create Account
            </button>

            <div className="auth-divider">
              <span>or continue with</span>
            </div>

            <div id="google-signup-btn" className="google-btn-wrapper"></div>
          </form>

          <div className="login-link">
            <p>
              Already have an account? <Link to="/login">Sign In</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
