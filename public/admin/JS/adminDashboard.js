import { clearUser, setUser, getUser } from "../../JS/Auth.js";

function getUserData() {
    const data = getUser();
    console.log(data);
    return getUser();
}
 
async function getMovieCount() {
    const response = await fetch("/api/admin/movies/count");
    if (!response.ok) {
        throw new Error("Failed to fetch movie count");
    }
    const data = await response.json();
    const element = document.getElementById("mcount");
    element.innerHTML = data.count;
}


document.addEventListener("DOMContentLoaded", () => {
    getMovieCount();
    const loginLink = document.getElementById("loginStatus");
    const storedData = getUserData();
    console.log(storedData);
    if (storedData) {
        const user = JSON.parse(storedData);
        loginLink.innerHTML = `<a href="./profile.html"><i class="fa fa-user"></i> ${user.name}</a>`;
    }
});
