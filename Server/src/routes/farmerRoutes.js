const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const verifyFarmer = require("../middlewares/farmerMiddleware");

const {
    addProduct,
    getMyProducts,
    getProduct,
    editProduct,
    removeProduct
} = require("../controllers/farmerController");

router.post(
    "/products",
    protect,
    verifyFarmer,
    addProduct
);

router.get(
    "/products",
    protect,
    verifyFarmer,
    getMyProducts
);

router.get(
    "/products/:productId",
    protect,
    verifyFarmer,
    getProduct
);

router.patch(
    "/products/:productId",
    protect,
    verifyFarmer,
    editProduct
);

router.delete(
    "/products/:productId",
    protect,
    verifyFarmer,
    removeProduct
);

module.exports = router;