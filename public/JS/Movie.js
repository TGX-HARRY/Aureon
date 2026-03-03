async function getMovieData() {
  const response = await fetch("/api/movies");

    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }

    const data = await response.json();
    if (!data || !data.data) {
      alert("Movie data unavailable.");
      return;
    }

    return data.data;
}

async function playMovie() {
    const sessionData = localStorage.getItem("sessionData");
    if (!sessionData) {
      alert("Please log in to watch the movie!");
      window.location.href = "/login.html";
      return;
    }

    const mainData = await getMovieData();
    
    // Get movie ID from URL
    const params = new URLSearchParams(window.location.search);
    const movieName = params.get("watch");
    console.log("Movie Key:", movieName);

    if (!movieName) {
      alert("Invalid movie request.");
      return;
    }
    
    // Flatten all movies
    const allMovies = mainData.sections.flatMap(section => section.movies);

    const movie = allMovies.find(m => m.id === movieName);

    if (!movie) {
      document.body.innerHTML =
        "<h2 style='color:white;text-align:center;'>Movie not found!</h2>";
      return;
    }

    // Render movie details
    document.title = `${movie.title} | Aureon Originals`;
    document.getElementById("movieTitle").textContent = movie.title;
    document.getElementById("movieGenre").textContent = movie.genre;
    document.getElementById("movieRating").textContent = movie.rating;
    document.getElementById("movieOverview").textContent = movie.overview;
    document.getElementById("trailerFrame").src =
      `${movie.trailer}?autoplay=1&mute=1`;
}

playMovie();