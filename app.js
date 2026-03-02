// app.js

const express = require("express");
const userRoutes = require("./Routing/user.routes");
const { applyMiddlewares, setupRoutes } = require("./utils/helper");

const app = express();

// apply middleware
applyMiddlewares(app);

// setup routes
setupRoutes(app, userRoutes);

module.exports = app;