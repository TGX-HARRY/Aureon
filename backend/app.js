const express = require("express");
const cookieparser = require("cookie-parser");
const dbconfig = require("./config/db")
// import routes
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const movieRoutes = require("./routes/movie.routes");

const app = express();
app.use(express.json());
app.use(cookieparser());
app.use(express.static("public"));
dbconfig.connectDB();
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/movies", movieRoutes);

module.exports = app;