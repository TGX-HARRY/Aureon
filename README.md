# 🎬 AUREON

AUREON is a basic movie streaming website built using HTML, CSS, JavaScript, Node.js, and Express.

This project demonstrates full-stack fundamentals including frontend rendering, backend API development, and basic server-side routing.

---

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Backend
- Node.js
- Express.js

---

## Features

- View list of movies
- Dynamic movie rendering
- REST API for movie data
- Basic CRUD functionality
- Clean UI layout
- Backend routing using Express

---

## 📂 Project Structure

AUREON/
│
├── public/
│ ├── index.html
│ ├── styles.css
│ └── script.js
│
├── routes/
│ └── movieRoutes.js
│
├── data/
│ └── movies.json
│
├── app.js
├── package.json
└── README.md


---

## ⚙️ How It Works

### 1️⃣ Backend (Node.js + Express)

- Express server handles API routes.
- Movies are stored in a JSON file.
- Server sends movie data as JSON response.
- API endpoints follow REST structure.

Example API endpoint:

GET /api/movies


The backend reads movie data from `movies.json` and sends it to the frontend.

---

### 2️⃣ Frontend (HTML, CSS, JS)

- HTML structures the webpage.
- CSS styles the layout.
- JavaScript fetches movie data from backend.
- Movies are dynamically rendered on the page.

Example:

```javascript
fetch('/api/movies')
  .then(res => res.json())
  .then(data => {
    console.log(data);
  });
  ```