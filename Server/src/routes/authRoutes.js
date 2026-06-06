const express = require("express");
const { login, register } = require("../controllers/authController");


const router = express.Router();

router.post('/register', register);
// use POST for login so request body is available and aligns with client
router.post('/login', login);




module.exports = router;
