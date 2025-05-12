/**
 * AWER Backend Server
 *
 * Main application entry point with server configuration
 */
// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const routes = require("./routes");
const { initializeFirebase } = require("./config/firebase");
// const { createWebSocketServer } = require("./services/websocket.service");

// Initialize express app
const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const SOCKET_PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add Firebase to request object
app.use((req, res, next) => {
  req.firebase = global.firebase;
  next();
});

// Routes
app.use("/api", routes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    wsClients: telnyxWsServer.clients.size,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

process.on("SIGINT", () => {
  console.log("Shutting down...");

  // Clean up resources

  // Close servers
  server.close(() => {
    console.log("HTTP Server closed.");
    process.exit();
  });
});

// Start Express server

const expressServer = app.listen(SERVER_PORT, () => {
  console.log(`Backend express server running on port ${SERVER_PORT}`);
});

// Start WebSocket server
// wsHttpServer.listen(SOCKET_PORT, () => {
// console.log(`WebSocket Server running on port ${SOCKET_PORT}`);
// });

module.exports = app;
