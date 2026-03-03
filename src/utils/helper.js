// utils/helper.js

const express = require("express");

// setup middlewares
function applyMiddlewares(app) {
  app.use(express.json());
  app.use(express.static("public"));
}

// setup routes
function setupRoutes(app, userRoutes) {
  app.use("/api", userRoutes);
}

module.exports = {
  applyMiddlewares,
  setupRoutes,
};