const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require("./src/routes/authRoutes.js")
const adminRoutes = require("./src/routes/adminRoutes.js")
const farmerRoutes = require("./src/routes/farmerRoutes.js");
const farmerOrderRoutes = require("./src/routes/farmerOrderRoutes");
const retailerProfileRoutes = require("./src/routes/retailerProfileRoutes");
const retailerFarmerRoutes = require("./src/routes/retailerFarmerRoutes");
const retailerOrderRoutes = require("./src/routes/retailerOrderRoutes");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
app.use(express.json());
app.use("/api/auth", authRoutes); // this is expected to add the register and login route like this: 
// /api/auth/login & /api/auth/register with POST method
app.use("/api/admin", adminRoutes)
app.use("/api/farmer", farmerRoutes);
app.use("/api/farmer", farmerOrderRoutes);
app.use("/api/retailer/profile", retailerProfileRoutes);
app.use("/api/retailer/farmers", retailerFarmerRoutes);
app.use("/api/retailer/orders", retailerOrderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
