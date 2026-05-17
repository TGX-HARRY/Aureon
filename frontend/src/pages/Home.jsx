import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { server_url } from "./config/config";
import "./homepage.css";

function Home() {
  const [moviesData, setMoviesData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);

  // Load movie data from backend
  useEffect(() => {
    axios.get(server_url + "/api/movies/sections", { withCredentials: true })
      .then((res) => setMoviesData(res.data || []))
      .catch((err) => console.error("Error loading movies:", err));
  }, []);

  // Update searchTerm when query param q changes (so navbar-search can link here)
  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setSearchTerm(q);
  }, [location.search]);

  // Close modal when clicking outside (kept)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList && event.target.classList.contains("modal-overlay")) {
        setModalOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Close search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchActive &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchActive(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [searchActive]);

  // Filter movies by title or genre
  const filteredSections = moviesData.map((section) => {
    const filteredMovies = (section.movies || []).filter((movie) => {
      const title = (movie.title || "").toLowerCase();
      // genre can be an array in the backend
      const genre = Array.isArray(movie.genre) ? movie.genre.join(" ").toLowerCase() : (movie.genre || "").toLowerCase();
      const term = searchTerm.toLowerCase();
      return term === "" || title.includes(term) || genre.includes(term);
    });
    return { ...section, movies: filteredMovies };
  });

  // navigate to Movie page (movie.jsx) with query param; this loads and plays trailer there
  const handleMovieClick = (movie) => {
    window.location.href = `/movie?name=${encodeURIComponent(movie._id || movie.id)}`;
  };

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1>Stranger Things</h1>
          <p>
            When a young boy disappears, his friends and family uncover a world
            of supernatural mysteries, dark secrets, and dangerous experiments.
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => (window.location.href = `/movie?name=stranger-things`)}
              className="btn-play"
            >
              ▶ Play
            </button>
            <button
              id="openModal"
              className="btn-info"
              onClick={() => {
                // prefer a matching movie from loaded data, otherwise fallback
                const hero = (moviesData && moviesData.length && moviesData[0].movies && moviesData[0].movies[0]) || {
                  id: "stranger-things",
                  title: "Stranger Things",
                  description:
                    "When a young boy disappears, his friends and family uncover a world of supernatural mysteries, dark secrets, and dangerous experiments.",
                  img: "",
                  trailer: null,
                };
                setCurrentMovie(hero);
                setModalOpen(true);
              }}
            >
              <i className="fa fa-circle-info" /> More Info
            </button>
          </div>
        </div>
      </section>

      {/* MOVIE SECTIONS */}
      {filteredSections.map((section) => (
        section.movies.length > 0 && (
          <div key={section._id || section.id || section.title} className="movie-section" id={section.id}>
            <h2 className="section-title">{section.title}</h2>
            <div className="movie-row">
              {section.movies.map((movie) => (
                <div
                  key={movie._id || movie.id}
                  className="movie-card"
                  onClick={() => handleMovieClick(movie)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") handleMovieClick(movie); }}
                >
                  <img src={movie.img} alt={movie.title} />
                  <div className="movie-info">
                    <span>{movie.title}</span>
                    <div className="movie-rating">
                      <span className="star">{movie.rating}</span>
                    </div>
                    <div className="movie-genre">{Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      {/* Modal for More Info */}
      {isModalOpen && currentMovie && (
        <div className="modal-overlay">
          <div className="modal" role="dialog" aria-modal="true" aria-label="Movie details">
            <button
              className="modal-close"
              onClick={() => {
                setModalOpen(false);
                setCurrentMovie(null);
              }}
              aria-label="Close"
            >
              ×
            </button>

            <div className="modal-body">
              <div className="modal-media">
                {currentMovie.trailer ? (
                  // if trailer is an embed URL already, show iframe
                  <iframe
                    src={currentMovie.trailer}
                    title={currentMovie.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : currentMovie.img ? (
                  <img src={currentMovie.img} alt={currentMovie.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "#000" }} />
                )}
              </div>
              <div className="modal-details">
                <h3>{currentMovie.title}</h3>
                <p className="modal-meta">{Array.isArray(currentMovie.genre) ? currentMovie.genre.join(", ") : currentMovie.genre} • {currentMovie.rating}</p>
                <p>{currentMovie.description || currentMovie.overview}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;