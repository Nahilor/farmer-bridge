/**
 * App Configuration
 * Contains all Express app setup and routes
 * Exported for reuse in server and tests
 */

const express = require('express');
const authRoutes = require("./src/routes/authRoutes.js")
const adminRoutes = require("./src/routes/adminRoutes.js")
const farmerRoutes = require("./src/routes/farmerRoutes.js");
const farmerOrderRoutes = require("./src/routes/farmerOrderRoutes");
const retailerProfileRoutes = require("./src/routes/retailerProfileRoutes");
const retailerFarmerRoutes = require("./src/routes/retailerFarmerRoutes");
const retailerOrderRoutes = require("./src/routes/retailerOrderRoutes");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/farmer", farmerOrderRoutes);
app.use("/api/retailer/profile", retailerProfileRoutes);
app.use("/api/retailer/farmers", retailerFarmerRoutes);
app.use("/api/retailer/orders", retailerOrderRoutes);

// Health check endpoint
app.get("/api/working", (req, res) => {
  res.json({ status: " Server is running",});
});

module.exports = app;
