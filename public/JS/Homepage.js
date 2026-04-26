import { clearUser, setUser, getUser } from "./Auth.js";

async function loadMovies(user = null) {
  try {
    const response = await fetch("/api/movies/sections");

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    const fetchedData = await response.json();

    const container = document.getElementById("moviesContainer");
    container.innerHTML = ""; // Clear existing content

    fetchedData.forEach(section => {
      if (section.movies && section.movies.length > 0) {

        const sectionDiv = document.createElement("div");
        sectionDiv.className = "movie-section";
        sectionDiv.id = section.id;

        const title = document.createElement("h2");
        title.className = "section-title";
        title.textContent = section.title;

        sectionDiv.appendChild(title);

        const movieRow = document.createElement("div");
        movieRow.className = "movie-row";

        section.movies.forEach(movie => {

          const movieCard = document.createElement("div");
          movieCard.className = "movie-card";
          movieCard.setAttribute("role", "button");
          movieCard.setAttribute("tabIndex", "0");

          movieCard.addEventListener("click", () => {
            handleMovieClick(movie);
          });

          movieCard.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              handleMovieClick(movie);
            }
          });

          const img = document.createElement("img");
          img.src = movie.img;
          img.alt = movie.title;

          const info = document.createElement("div");
          info.className = "movie-info";

          const spanTitle = document.createElement("span");
          spanTitle.textContent = movie.title;

          const ratingDiv = document.createElement("div");
          ratingDiv.className = "movie-rating";

          const star = document.createElement("span");
          star.className = "star";
          star.textContent = movie.rating;

          const genreDiv = document.createElement("div");
          genreDiv.className = "movie-genre";
          genreDiv.textContent = movie.genre;

          ratingDiv.appendChild(star);

          info.appendChild(spanTitle);
          info.appendChild(ratingDiv);
          info.appendChild(genreDiv);

          movieCard.appendChild(img);
          movieCard.appendChild(info);

          // Add delete button for admins
          if (user && user.role === 'admin') {
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "delete-movie-btn";
            deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
            deleteBtn.title = "Delete Movie";
            deleteBtn.onclick = async (e) => {
              e.stopPropagation(); // Don't trigger movie click
              if (confirm(`Are you sure you want to delete "${movie.title}"?`)) {
                const res = await fetch(`/api/movies/delete/${movie._id}`, { method: "DELETE" });
                if (res.ok) {
                  alert("Movie deleted!");
                  loadMovies(user); // Reload
                } else {
                  alert("Failed to delete movie.");
                }
              }
            };
            movieCard.appendChild(deleteBtn);
          }

          movieRow.appendChild(movieCard);
        });

        sectionDiv.appendChild(movieRow);
        container.appendChild(sectionDiv);
      }
    });

  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

async function handleMovieClick(movie) {
  const user = getUser();
  if (!user) {
    alert("Please log in to watch the movie.");
    window.location.href = "/login.html";
    return;
  }
  
  // Navigate directly, the backend will verify the session via cookie
  window.location.href = `movie.html?watch=${encodeURIComponent(movie.id)}`;
}

// Run it
// Remove initial call, will be called in DOMContentLoaded
// loadMovies();

async function postLogin() {
  try {
    const response = await fetch("/api/users/subscribers/me", {
      credentials: "include"
    });

    const data = await response.json();

    if (!response.ok) {
      clearUser();
      localStorage.removeItem("sessionData");
      return null;
    }

    setUser(data);
    localStorage.removeItem("sessionData");

    return data;

  } catch (error) {
    clearUser();
    return null;
  }
}


document.addEventListener("DOMContentLoaded", async () => {
  const user = await postLogin();
  const loginStatus = document.getElementById("loginStatus");
  if (!user) {
    console.log("No user logged in");
    return;
  }
  
  loginStatus.innerHTML = `
    <a href="#" class="user-profile">
        <img src="${user.avatar}" class="nav-avatar">
        ${user.username}
    </a>
    <ul class="dropdown-menu">
        ${user.role === 'admin' ? '<li><a href="./adminDashboard.html">Admin Dashboard</a></li>' : ''}
        <li><a href="./profile.html">Edit Profile</a></li>
        <li id="logout"><a href="#">Log Out</a></li>
    </ul>
  `;

  loginStatus.classList.add("dropdown");

  const logoutBtn = document.getElementById("logout");

  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    await fetch("/api/users/logout", {
      method: "POST",
      credentials: "include"
    });

    clearUser();
    window.location.href = "/login.html";
  });

  // Load movies with user info (to show admin features)
  loadMovies(user);
});