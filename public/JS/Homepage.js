async function loadMovies() {
  try {
    const response = await fetch("/api/movies");

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json();

    // If your API returns { sections: [...] }
    const filteredSections = data.data.sections;

    const container = document.getElementById("moviesContainer");
    container.innerHTML = ""; // Clear existing content

    filteredSections.forEach(section => {
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

// Run it
loadMovies();