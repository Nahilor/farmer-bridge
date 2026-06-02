const {
    getFarmerOrders,
    getFarmerOrderById,
    updateOrderStatus
} = require("../services/farmerOrderService");

const getOrders = async (req, res) => {
    try {
        const orders = await getFarmerOrders(
            req.user.id
        );

        return res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getOrder = async (req, res) => {
    try {
        const order =
            await getFarmerOrderById(
                req.user.id,
                req.params.orderId
            );

        return res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

const changeOrderStatus = async (
    req,
    res
) => {
    try {
        const { status } = req.body;

        const order =
            await updateOrderStatus(
                req.user.id,
                req.params.orderId,
                status
            );

        return res.status(200).json({
            success: true,
            message:
                "Order status updated successfully",
            data: order
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getOrders,
    getOrder,
    changeOrderStatus
};