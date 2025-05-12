const express = require("express");
const router = express.Router();

// Import route modules
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");

// Use route modules
router.use("/users", userRoutes);
router.use("/auth", authRoutes);

// Base route for API
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to AWER API",
    version: "1.0.0",
    endpoints: ["/api/users", "/api/auth"],
  });
});

module.exports = router;
