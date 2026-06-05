const express = require("express");

const router = express.Router();

const protect = require(
    "../middlewares/authMiddleware"
);

const verifyFarmer = require(
    "../middlewares/farmerMiddleware"
);

const {
    getOrders,
    getOrder,
    changeOrderStatus
} = require(
    "../controllers/farmerOrderController"
);

router.get(
    "/orders",
    protect,
    verifyFarmer,
    getOrders
);

router.get(
    "/orders/:orderId",
    protect,
    verifyFarmer,
    getOrder
);

router.patch(
    "/orders/:orderId/status",
    protect,
    verifyFarmer,
    changeOrderStatus
);

module.exports = router;