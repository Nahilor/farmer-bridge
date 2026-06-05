const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require("../services/farmerService");

const addProduct = async (req, res) => {
    try {
        const result = await createProduct(
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getMyProducts = async (req, res) => {
    try {
        const products = await getProducts(req.user.id);

        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getProduct = async (req, res) => {
    try {
        const product = await getProductById(
            req.user.id,
            req.params.productId
        );

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const editProduct = async (req, res) => {
    try {
        const product = await updateProduct(
            req.user.id,
            req.params.productId,
            req.body
        );

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const removeProduct = async (req, res) => {
    try {
        const result = await deleteProduct(
            req.user.id,
            req.params.productId
        );

        res.status(200).json(result);
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addProduct,
    getMyProducts,
    getProduct,
    editProduct,
    removeProduct
};