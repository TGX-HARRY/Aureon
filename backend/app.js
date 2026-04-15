const express = require("express");
const cookieparser = require("cookie-parser");

// import routes
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const movieRoutes = require("./routes/movie.routes");

const app = express();

app.use(express.json());
app.use(cookieparser(process.env.COOKIE_SECRET));
app.use(express.static("public"));

app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/movies", movieRoutes);

module.exports = app;