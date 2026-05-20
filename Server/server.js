const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
const authRoutes = require("./src/routes/authRoutes.js")

app.use("/api/auth", authRoutes); // this is expected to add the register and login route like this: 
// /api/auth/login & /api/auth/register with POST method



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
