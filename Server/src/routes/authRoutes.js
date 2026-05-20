const express = requrie("express");
// register controller should be imported here 
const { login } = require("../controllers/authController");

const router = express.Router();

// register route should be created here


// /login route
router.post("/login", login);

export default router;