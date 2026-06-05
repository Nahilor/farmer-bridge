const express = require("express");
const protect = require("../middlewares/authMiddleware");
const { getRetailerProfile, updateRetailerProfile } = require("../controllers/retailerProfileController");

const router = express.Router();

router.get("/", protect, getRetailerProfile);
router.patch("/", protect, updateRetailerProfile);

module.exports = router;
