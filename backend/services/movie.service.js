const fs = require("fs").promises;
const path = require("path");

const moviesFilePath = path.join(__dirname, "../../data/movies.json");

async function getMoviesData() {
    try {
        const data = await fs.readFile(moviesFilePath, 'utf-8');
        if (!data) {
            return null;
        }
        return JSON.parse(data);
    }
    catch (err) {
        console.error("Error reading file:", err);
        return null;
    }
}

async function getUserMovies(id) {
    const data = await getUsersData();
    const userdata = data.find(u => u.id === id);
    return userdata.movies;
}

module.exports = { getMoviesData, getUserMovies };