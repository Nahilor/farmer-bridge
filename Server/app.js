const authRoutes = require("./src/routes/authRoutes.js")

app.use("/api/auth", authRoutes); // this is expected to add the register and login route like this: 
// /api/auth/login & /api/auth/register with POST method
