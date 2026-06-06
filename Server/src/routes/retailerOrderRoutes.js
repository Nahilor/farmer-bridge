// Server/src/routes/retailerOrderRoutes.js
const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { requireRole } = require("../middlewares/roleMiddleware");
const {
  createOrder,
  getRetailerActiveOrders,
  getRetailerOrderHistory,
  getSingleOrder,
  markOrderDelivered
} = require("../controllers/retailerOrderController");

// All routes require authentication and retailer role
router.use(protect);
router.use(requireRole("RETAILER"));

// IMPORTANT: These are relative to /api/retailer
router.post("/orders", createOrder);              // Full path: /api/retailer/orders
router.get("/orders/active", getRetailerActiveOrders);  // Full path: /api/retailer/orders/active
router.get("/orders/history", getRetailerOrderHistory); // Full path: /api/retailer/orders/history
router.get("/orders/:orderId", getSingleOrder);   // Full path: /api/retailer/orders/:orderId
router.patch("/orders/:orderId/delivered", markOrderDelivered);

module.exports = router;