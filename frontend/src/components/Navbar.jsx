import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import { server_url } from "../pages/config/config";

function Navbar() {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const authPages = ["/login", "/signup"];
  const aboutPages = ["/about", "/contact"];

  const hideAuthButtons = authPages.includes(location.pathname);
  const hideMovieButtons = aboutPages.includes(location.pathname);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // load logged-in user from backend
  useEffect(() => {
    axios.get(server_url + '/api/users/subscribers/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(err => setUser(null));
  }, []);

  async function handleSignOut() {
    try { await axios.post(server_url + '/api/users/logout', {}, { withCredentials: true }); } catch (e) { }
    setUser(null);
    // redirect to homepage
    window.location.href = '/';
  }

  function avatarInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function avatarColor(name) {
    // simple deterministic color from name
    const colors = ['#e74c3c', '#9b59b6', '#3498db', '#e67e22', '#2ecc71', '#f39c12', '#1abc9c'];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  }

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => (window.location.href = "/")}>
        Aureon
      </div>

      {/* Search container: only show on Home page */}
      {location.pathname === '/' && (
        <div className={`search-container ${showSearch ? "active" : ""}`} ref={searchRef}>
          {showSearch ? (
            <>
              <form
                className={`search-bar ${showSearch ? "active" : ""}`}
                action="#"
                method="get"
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = (e.target.search && e.target.search.value) ? e.target.search.value.trim() : '';
                  if (val) {
                    window.location.href = `/?q=${encodeURIComponent(val)}`;
                  } else {
                    window.location.href = '/';
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Search movies, shows..."
                  name="search"
                  id="search-input"
                  autoFocus={showSearch}
                />
              </form>

              <button
                className={`search-toggle ${showSearch ? "active" : ""}`}
                aria-expanded={showSearch}
                onClick={() => setShowSearch(!showSearch)}
              >
                <i className="fa fa-search" style={{ fontSize: 22, color: "white" }}></i>
              </button>
            </>
          ) : (
            <>
              <button
                className={`search-toggle ${showSearch ? "active" : ""}`}
                aria-expanded={showSearch}
                onClick={() => setShowSearch(!showSearch)}
              >
                <i className="fa fa-search" style={{ fontSize: 22, color: "white" }}></i>
              </button>

              <form
                className={`search-bar ${showSearch ? "active" : ""}`}
                action="#"
                method="get"
              >
                <input
                  type="text"
                  placeholder="Search movies, shows..."
                  name="search"
                  id="search-input"
                  autoFocus={showSearch}
                />
              </form>
            </>
          )}
        </div>
      )}

      {/* Navbar Links */}
      <ul className="nav-links">
        {location.pathname === '/' ? (
          <>
            <li><Link to="/">Home</Link></li>
            <li className="dropdown">
              <a href="#">Genres</a>
              <ul className="dropdown-menu">
                <li><a href="/#action">Action</a></li>
                <li><a href="/#drama">Drama</a></li>
                <li><a href="/#comedy">Comedy</a></li>
                <li><a href="/#horror">Horror</a></li>
                <li><a href="/#sci-fi">Sci-Fi</a></li>
                <li><a href="/#thriller">Thriller</a></li>
              </ul>
            </li>
            <li><a href="/#trending-movies">Movies</a></li>
          </>
        ) : (
          <li><Link to="/">Home</Link></li>
        )}

        {!hideAuthButtons && (
          <>
            {!user ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
              </>
            ) : (
              <li className="nav-profile" ref={profileRef}>
                <button
                  className="profile-avatar"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-expanded={showProfileMenu}
                >
                  <span
                    className="avatar-inner"
                    style={{ background: avatarColor(user.username) }}
                  >{avatarInitials(user.username)}</span>
                </button>
                {showProfileMenu && (
                  <div className="profile-dropdown">
                    <div className="profile-info">
                      <div className="profile-name">{user.username}</div>
                      <div className="profile-email">{user.email}</div>
                    </div>
                    <div className="profile-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="btn-signout" style={{ textAlign: 'center', background: '#333' }}>Admin Dashboard</Link>
                      )}
                      <Link to="/profile" className="btn-signout" style={{ textAlign: 'center', background: '#333' }}>Edit Profile</Link>
                      <button onClick={handleSignOut} className="btn-signout">Sign out</button>
                    </div>
                  </div>
                )}
              </li>
            )}
          </>
        )}
      </ul>

      {/* Background overlay */}
      {showSearch && <div className="search-overlay"></div>}
    </nav>
  );
}

export default Navbar;