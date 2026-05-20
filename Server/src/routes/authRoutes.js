const express = require("express");
// register controller should be imported here 
const { login } = require("../controllers/authController");
const { register } = require("../services/signService");

const router = express.Router();

// register route should be created here
router.post('/register', register);


// Login route
router.post("/login", login);

module.exports = router;
