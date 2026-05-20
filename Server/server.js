const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const authRoutes = require("./src/routes/authRoutes.js")
const protect = require("./src/middlewares/authMiddleware.js")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();
app.use(express.json());
app.use("/api/auth", authRoutes); // this is expected to add the register and login route like this: 
// /api/auth/login & /api/auth/register with POST method



// Test
app.get("/", protect , (req, res) => {
  res.send("HELLO WORLD")
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
