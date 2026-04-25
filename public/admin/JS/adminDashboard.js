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


async function verifyAdmin() {
    try {
        const response = await fetch("/api/users/subscribers/me");
        if (!response.ok) {
            window.location.href = "../login.html";
            return;
        }
        const user = await response.json();
        if (user.role !== "admin") {
            alert("Access denied! Admins only.");
            window.location.href = "../index.html";
            return;
        }
        
        // Populate UI
        const loginLink = document.getElementById("loginStatus");
        if (loginLink) {
            loginLink.innerHTML = `<a href="../profile.html"><i class="fa fa-user"></i> ${user.username}</a>`;
        }
        
        getMovieCount();
        getUserCount();
        setupModal();
    } catch (error) {
        console.error("Verification failed:", error);
        window.location.href = "../login.html";
    }
}

async function getUserCount() {
    try {
        const response = await fetch("/api/admin/users/count");
        const data = await response.json();
        document.getElementById("ucount").textContent = data.count || "0";
    } catch (e) { console.error(e); }
}

function setupModal() {
    const modal = document.getElementById("addMovieModal");
    const addBtn = document.querySelector(".add-btn");
    const closeBtn = document.querySelector(".close-btn");
    const form = document.getElementById("addMovieForm");

    addBtn.onclick = () => modal.style.display = "block";
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const movieData = {
            title: document.getElementById("mTitle").value,
            genre: document.getElementById("mGenre").value,
            rating: document.getElementById("mRating").value,
            img: document.getElementById("mImg").value,
            trailer: document.getElementById("mTrailer").value
        };

        const res = await fetch("/api/movies/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(movieData)
        });

        if (res.ok) {
            alert("Movie added successfully!");
            modal.style.display = "none";
            getMovieCount();
        } else {
            alert("Failed to add movie.");
        }
    };
}

document.addEventListener("DOMContentLoaded", verifyAdmin);
