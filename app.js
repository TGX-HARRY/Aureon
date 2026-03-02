const express = require("express");
const userRoutes = require("./Routing/user.routes");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api", userRoutes);

module.exports = app;