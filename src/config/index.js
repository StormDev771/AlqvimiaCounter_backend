/**
 * Main configuration module
 *
 * Centralizes configuration from environment variables and other sources
 */
require("dotenv").config();
const firebaseConfig = require("./firebase");

// Server configuration
const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Export all configurations
module.exports = {
  ...SERVER_CONFIG,
  firebase: firebaseConfig,
};
