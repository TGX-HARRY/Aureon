async function getMovieData() {
  const response = await fetch("/api/movies");

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  const data = await response.json();
  return data; // returns array of movies
}

async function playMovie() {
  // Check login first
  const loginRes = await fetch("/api/users/subscribers/me");
  if (!loginRes.ok) {
    alert("Please log in to watch the movie!");
    window.location.href = "/login.html";
    return;
  }

  const movies = await getMovieData().catch(err => {
    console.error(err);
    return null;
  });

  if (!movies) {
    alert("Movie data unavailable.");
    return;
  }

  // Get movie ID from URL
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("watch") || params.get("id");
  console.log("Movie ID:", movieId);

  if (!movieId) {
    alert("Invalid movie request.");
    window.location.href = "/";
    return;
  }

  const movie = movies.find(m => m._id === movieId || m.slug === movieId);

  if (!movie) {
    document.body.innerHTML =
      "<h2 style='color:white;text-align:center;'>Movie not found!</h2>" +
      "<p style='text-align:center;'><a href='/' style='color:red;'>Back to Home</a></p>";
    return;
  }

  // Render movie details
  document.title = `${movie.title} | Aureon Originals`;
  document.getElementById("movieTitle").textContent = movie.title;
  document.getElementById("movieGenre").textContent = movie.genre;
  document.getElementById("movieRating").innerHTML = `<i class="fa fa-star"></i> ${movie.rating}`;
  document.getElementById("movieOverview").textContent = movie.overview || "Watch this exciting title and more, exclusively on Aureon Originals.";
  
  // Set dynamic background
  const dynamicBg = document.getElementById("dynamicBg");
  if (dynamicBg && movie.img) {
      dynamicBg.style.backgroundImage = `url('${movie.img}')`;
  }

  const trailerFrame = document.getElementById("trailerFrame");
  if (movie.trailer.includes("youtube.com") || movie.trailer.includes("youtu.be")) {
      // Ensure embed URL format
      let videoId = "";
      if (movie.trailer.includes("v=")) videoId = movie.trailer.split("v=")[1].split("&")[0];
      else videoId = movie.trailer.split("/").pop();
      // Use autoplay=1 and enable JS API
      trailerFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0`;
  } else {
      trailerFrame.src = movie.trailer;
  }
}

playMovie();