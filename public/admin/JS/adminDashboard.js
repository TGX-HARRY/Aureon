async function getMovieCount() {
    const response = await fetch("/api/movies/count");
    if (!response.ok) {
        throw new Error("Failed to fetch movie count");
    }
    const data = await response.json();
    const element = document.getElementById("mcount");
    element.innerHTML = data.count;
}



document.addEventListener("DOMContentLoaded", () => {
    getMovieCount();
});
