const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
