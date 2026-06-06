const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const cors = require('cors');
const authRoutes = require("./src/routes/authRoutes.js")
const adminRoutes = require("./src/routes/adminRoutes.js")
const farmerRoutes = require("./src/routes/farmerRoutes.js");
const farmerOrderRoutes = require("./src/routes/farmerOrderRoutes");
const retailerFarmerRoutes = require('./src/routes/retailerFarmerRoutes');
const retailerOrderRoutes = require('./src/routes/retailerOrderRoutes');
dotenv.config();

const app = express();
// enable CORS for development (Vite default dev server runs on 5173)
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
const PORT = process.env.PORT || 3000;
connectDB();
app.use(express.json());
app.use("/api/auth", authRoutes); // this is expected to add the register and login route like this: 
// /api/auth/login & /api/auth/register with POST method
app.use("/api/admin", adminRoutes)
app.use("/api/farmer", farmerRoutes);
app.use("/api/farmer", farmerOrderRoutes);
// Mount retailer APIs
app.use('/api/retailer/farmers', retailerFarmerRoutes);
app.use('/api/retailer/orders', retailerOrderRoutes);

const contactRoutes = require('./src/routes/contactRoutes');
app.use('/api/contact', contactRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
