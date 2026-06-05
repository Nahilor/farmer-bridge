const express = require("express");
const protect = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const {
  getFarmers,
  getPopularFarmers,
  getFarmerById,
} = require("../controllers/retailerFarmerController");

const router = express.Router();

// Retailer-only access
router.use(protect, requireRole("RETAILER"));

router.get("/", getFarmers);
router.get("/popular", getPopularFarmers);
router.get("/:farmerId", getFarmerById);

module.exports = router;

