const express = require("express");
const protect = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const {
  createOrder,
  getRetailerActiveOrders,
  getRetailerOrderHistory,
  getSingleOrder,
  markOrderDelivered,
} = require("../controllers/retailerOrderController");

const router = express.Router();

router.use(protect, requireRole("RETAILER"));

router.post("/", createOrder);
router.get("/active", getRetailerActiveOrders);
router.get("/history", getRetailerOrderHistory);
router.get("/:orderId", getSingleOrder);
router.patch("/:orderId/delivered", markOrderDelivered);

module.exports = router;

