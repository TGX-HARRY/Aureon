const express = require("express");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;