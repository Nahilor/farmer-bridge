const protect = require("../middlewares/authMiddleware");
const verifyAdmin = require("../middlewares/adminMiddleware");
const { getUserCollection, getUser, updateStatus, updateRole, removeUser, getFarmers, getRetailers } = require("../controllers/adminController")
const express = require("express");


const router = express.Router();

router.get("/users", protect, verifyAdmin, getUserCollection);
router.get("/users/:id", protect, verifyAdmin, getUser);

router.patch("/users/:id/status", protect, verifyAdmin, updateStatus);
router.patch("/users/:id/role", protect, verifyAdmin, updateRole);

router.delete("/users/:id", protect, verifyAdmin, removeUser);

router.get("/farmers", protect, verifyAdmin, getFarmers);
router.get("/retailers", protect, verifyAdmin, getRetailers);
module.exports = router;