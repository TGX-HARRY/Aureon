const dotenv = require("dotenv");
dotenv.config(); // 🔥 FIRST

const express = require("express");
const cookieparser = require("cookie-parser");
const dbconfig = require("./config/db")
const cors = require("cors");
// import routes
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const movieRoutes = require("./routes/movie.routes");

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "https://aureon-tau.vercel.app"], credentials: true }));
app.use(express.json());
app.use(cookieparser());
app.use(express.static("public"));
dbconfig.connectDB();
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/movies", movieRoutes);

app.get("/api/config/google-client-id", (req, res) => {
    res.json({ clientId: process.env.CLIENT_ID });
});
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`API and Webpage live at http://localhost:${PORT}`);
});
module.exports = app;