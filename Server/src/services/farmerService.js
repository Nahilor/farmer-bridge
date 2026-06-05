const User = require("../models/userModel");

// Create product
const createProduct = async (userId, productData) => {
    const farmer = await User.findById(userId);

    if (!farmer) {
        throw new Error("Farmer not found");
    }

    farmer.products.push(productData);

    await farmer.save();

    return farmer.products;
};

// Get all products
const getProducts = async (userId) => {
    const farmer = await User.findById(userId);

    if (!farmer) {
        throw new Error("Farmer not found");
    }

    return farmer.products;
};

// Get product by id
const getProductById = async (userId, productId) => {
    const farmer = await User.findById(userId);

    if (!farmer) {
        throw new Error("Farmer not found");
    }

    const product = farmer.products.id(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
};

// Update product
const updateProduct = async (userId, productId, updateData) => {
    const farmer = await User.findById(userId);

    if (!farmer) {
        throw new Error("Farmer not found");
    }

    const product = farmer.products.id(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    Object.assign(product, updateData);

    await farmer.save();

    return product;
};

// Delete product
const deleteProduct = async (userId, productId) => {
    const farmer = await User.findById(userId);

    if (!farmer) {
        throw new Error("Farmer not found");
    }

    const product = farmer.products.id(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    product.deleteOne();

    await farmer.save();

    return {
        success: true,
        message: "Product deleted successfully"
    };
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
