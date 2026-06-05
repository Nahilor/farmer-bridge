const Order = require("../models/orderModel");

const getFarmerOrders = async (farmerId) => {
    return await Order.find({ farmerId })
        .sort({ createdAt: -1 });
};

const getFarmerOrderById = async (
    farmerId,
    orderId
) => {
    const order = await Order.findOne({
        _id: orderId,
        farmerId
    });

    if (!order) {
        throw new Error("Order not found");
    }

    return order;
};

const updateOrderStatus = async (
    farmerId,
    orderId,
    status
) => {
    const allowedStatuses = [
        "ACCEPTED",
        "REJECTED",
        "DELIVERED"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid status");
    }

    const order = await Order.findOne({
        _id: orderId,
        farmerId
    });

    if (!order) {
        throw new Error("Order not found");
    }

    order.status = status;

    await order.save();

    return order;
};

module.exports = {
    getFarmerOrders,
    getFarmerOrderById,
    updateOrderStatus
};