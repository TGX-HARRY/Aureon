import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { server_url } from "./config/config";
import "./movie.css";

function Movie() {
  const [movie, setMovie] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const playerRef = useRef(null);
  const ytScriptLoadedRef = useRef(false);

  const extractYouTubeId = (raw) => {
    if (!raw) return null;
    try {
      const s = decodeURIComponent(raw.trim());
      const m = s.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
      return m ? m[1] : null;
    } catch {
      return null;
    }
  };

  const buildYoutubeEmbed = (raw) => {
    const id = extractYouTubeId(raw);
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=1&mute=1`;
  };

  // load YT iframe API once
  const loadYouTubeApi = () =>
    new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        ytScriptLoadedRef.current = true;
        return resolve(window.YT);
      }
      if (ytScriptLoadedRef.current) return resolve(window.YT);
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      window.onYouTubeIframeAPIReady = () => {
        ytScriptLoadedRef.current = true;
        resolve(window.YT);
      };
      document.body.appendChild(tag);
    });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trailerParam = params.get("trailer");
    const titleParam = params.get("title");

    if (trailerParam) {
      const ytId = extractYouTubeId(trailerParam);
      if (ytId) {
        // use YT player (detect play/pause)
        setMovie({
          id: null,
          title: titleParam || "Trailer",
          trailer: buildYoutubeEmbed(trailerParam),
          ytId,
          isYouTube: true,
        });
      } else {
        // not youtube — just embed iframe (can't detect play/pause reliably)
        setMovie({
          id: null,
          title: titleParam || "Trailer",
          trailer: trailerParam,
          isYouTube: false,
        });
      }
      return;
    }

    const name = params.get("name");
    if (!name) return;

    axios.get(server_url + "/api/movies/", { withCredentials: true })
      .then((res) => {
        const movies = res.data || [];
        const found = movies.find((m) => m._id === name || m.id === name || m.title === name);
        
        if (!found) {
          setMovie(null);
          return;
        }
        
        const trailer = found.trailer || found.url || "";
        const ytId = extractYouTubeId(trailer);
        setMovie({
          id: found._id || found.id,
          title: found.title || name,
          trailer: trailer, // Use provided link directly
          ytId,
          isYouTube: Boolean(ytId),
          genre: found.genre || "",
          rating: found.rating || "",
          overview: found.overview || found.description || found.synopsis || "",
          img: found.img || "",
        });
      })
      .catch((err) => {
        console.error("Failed to load movies from API", err);
        setMovie(null);
      });
  }, []);

  // create/destroy YouTube player and toggle details on play/pause/end
  useEffect(() => {
    let player;
    let didCreate = false;
    if (movie && movie.isYouTube && movie.ytId) {
      loadYouTubeApi().then((YT) => {
        if (!document.getElementById("yt-player")) return;
        // if a previous player exists, destroy it first
        if (playerRef.current && playerRef.current.destroy) {
          try { playerRef.current.destroy(); } catch {}
          playerRef.current = null;
        }
        player = new YT.Player("yt-player", {
          height: "100%",
          width: "100%",
          videoId: movie.ytId,
          playerVars: {
            autoplay: 1,
            mute: 1, // required for autoplay on many browsers
            rel: 0,
            modestbranding: 1,
            controls: 1,
          },
          events: {
            onStateChange: (e) => {
              const state = e.data;
              // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0, BUFFERING = 3
              if (state === 1) {
                setShowDetails(false);
              } else if (state === 2 || state === 0) {
                setShowDetails(true);
              }
            },
            onReady: (e) => {
              // if it autoplays, hide details
              const playerState = e.target.getPlayerState && e.target.getPlayerState();
              if (playerState === 1) setShowDetails(false);
            },
          },
        });
        playerRef.current = player;
        didCreate = true;
      });
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try { playerRef.current.destroy(); } catch {}
        playerRef.current = null;
      }
      if (didCreate && window.YT && window.YT.Player) {
        // nothing else
      }
    };
  }, [movie && movie.ytId]);

  if (!movie) {
    return (
      <div style={{ padding: "48px 4%", minHeight: "100vh" }}>
        <p style={{ fontSize: "20px", marginBottom: "24px" }}>Movie not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="video-container" style={{ marginTop: "var(--nav-height)" }}>
        {movie.isYouTube && movie.ytId ? (
          <div id="yt-player" style={{ position: "absolute", inset: 0 }} />
        ) : movie.trailer ? (
          <iframe
            id="trailerFrame"
            key={movie.trailer}
            width="100%"
            height="100%"
            frameBorder={0}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            title={movie.title}
            src={movie.trailer}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#000",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            No trailer available
          </div>
        )}
      </div>

      <div className={`movie-details ${showDetails ? "" : "hidden-details"}`}>
        <h1 id="movieTitle">{movie.title}</h1>

        <div className="info-row">
          <span className="match-score">98% Match</span>
          <span className="year">2024</span>
          {movie.rating && <span className="maturity-rating">{movie.rating}</span>}
          <span className="quality-badge">4K</span>
        </div>

        <p id="movieOverview">
          {movie.overview || "An incredible story that will captivate you from start to finish."}
        </p>

        {movie.genre && (
          <div className="metadata-section">
            <span className="metadata-label">Genre:</span>
            <span className="metadata-value" id="movieGenre">
              {movie.genre}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export default Movie;