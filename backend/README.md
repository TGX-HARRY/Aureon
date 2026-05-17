# 🎬 AUREON

AUREON is a basic movie streaming website built using HTML, CSS, JavaScript, Node.js, and Express.

This project demonstrates full-stack fundamentals including frontend rendering, backend API development, managing databses and basic server-side routing.

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

<pre>
backend/
│
├── config/                  # App configuration (DB, env setup)
│   └── db.js                # MongoDB connection setup
│
├── controllers/             # Handle request/response logic
│   ├── auth.controller.js   # Authentication (login/signup)
│   ├── user.controller.js   # User operations (profile, watchlist)
│   ├── movie.controller.js  # Movie CRUD operations
│   └── admin.controller.js  # Admin-specific actions
│
├── services/                # Business logic layer
│   ├── auth.service.js      # Auth logic (JWT, hashing)
│   ├── user.service.js      # User-related logic
│   └── movie.service.js     # Movie-related logic
│
├── models/                  # Database schemas (Mongoose)
│   ├── user.model.js        # User schema
│   └── movie.model.js       # Movie schema
│
├── routes/                  # API route definitions
│   ├── auth.routes.js       # Auth endpoints
│   ├── user.routes.js       # User endpoints
│   ├── movie.routes.js      # Movie endpoints
│   └── admin.routes.js      # Admin endpoints
│
├── middleware/              # Custom middleware
│   ├── auth.middleware.js   # JWT authentication
│   ├── error.middleware.js  # Central error handler
│   ├── validate.middleware.js # Request validation
│   └── upload.middleware.js # File uploads (Multer)
│
├── validators/              # Request validation schemas
│   ├── auth.validator.js    # Auth validation rules
│   ├── user.validator.js    # User validation rules
│   └── movie.validator.js   # Movie validation rules
│
├── utils/                   # Helper utilities
│   ├── file.utils.js        # File handling helpers
│   └── asyncHandler.js      # Async error wrapper
│
├── data/                    # Static/mock data
│   ├── movies.json
│   └── users.json
│
├── app.js                   # Express app setup (middlewares, routes)
├── server.js                # Server entry point
│
├── .env                     # Environment variables
├── .env.example             # Sample env file
├── package.json             # Dependencies & scripts
└── README.md                # Project documentation
</pre>

---

## 🏗️ Architecture Overview

- **Controllers** → Handle HTTP layer (req/res)
- **Services** → Contain business logic
- **Models** → Define database structure
- **Routes** → Define API endpoints
- **Middleware** → Reusable request processing logic
- **Validators** → Ensure incoming data is valid
- **Utils** → Shared helper functions

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
