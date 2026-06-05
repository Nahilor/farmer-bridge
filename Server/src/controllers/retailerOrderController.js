const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const User = require("../models/userModel");

const sanitizeOrderForRetailer = (orderDoc) => {
  // Ensure we never accidentally include pricing fields (none exist in schema).
  return orderDoc;
};

const validateItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return "Items are required";
  }
  for (const item of items) {
    if (!item?.productName || typeof item.productName !== "string" || !item.productName.trim()) {
      return "Each item must include productName";
    }
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      return "Each item must include quantity (integer >= 1)";
    }
  }
  return null;
};

const createOrder = async (req, res) => {
  try {
    const retailerId = req.user?.id;
    const { farmerId, items } = req.body;

    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ message: "Invalid farmerId" });
    }

    const itemsError = validateItems(items);
    if (itemsError) {
      return res.status(400).json({ message: itemsError });
    }

    const farmer = await User.findOne({ _id: farmerId, role: "FARMER", status: "ACTIVE" }).select(
      "products firstName lastName address"
    );
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const farmerProducts = (farmer.products || []).map((p) => p.productName.toLowerCase());
    for (const item of items) {
      if (!farmerProducts.includes(item.productName.trim().toLowerCase())) {
        return res.status(400).json({
          message: `Farmer does not have product: ${item.productName}`,
        });
      }
    }

    const order = await Order.create({
      retailerId,
      farmerId,
      items: items.map((i) => ({ productName: i.productName.trim(), quantity: i.quantity })),
      status: "PENDING",
    });

    const populated = await Order.findById(order._id)
      .populate("farmerId", "firstName lastName address phone email")
      .select("-__v");

    res.status(201).json({ order: sanitizeOrderForRetailer(populated) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getRetailerActiveOrders = async (req, res) => {
  try {
    const retailerId = req.user?.id;
    const orders = await Order.find({
      retailerId,
      status: { $in: ["PENDING", "SHIPPED"] },
    })
      .sort({ createdAt: -1 })
      .populate("farmerId", "firstName lastName address phone email")
      .select("-__v");

    res.json({ orders: orders.map(sanitizeOrderForRetailer) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getRetailerOrderHistory = async (req, res) => {
  try {
    const retailerId = req.user?.id;
    const orders = await Order.find({
      retailerId,
      status: { $in: ["DELIVERED", "REJECTED"] },
    })
      .sort({ createdAt: -1 })
      .populate("farmerId", "firstName lastName address phone email")
      .select("-__v");

    res.json({ orders: orders.map(sanitizeOrderForRetailer) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const retailerId = req.user?.id;
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(orderId)
      .populate("farmerId", "firstName lastName address phone email")
      .select("-__v");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.retailerId) !== String(retailerId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json({ order: sanitizeOrderForRetailer(order) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const markOrderDelivered = async (req, res) => {
  try {
    const retailerId = req.user?.id;
    const { orderId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(orderId).select("-__v");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.retailerId) !== String(retailerId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (order.status !== "SHIPPED") {
      return res.status(400).json({
        message: "Only SHIPPED orders can be marked as DELIVERED",
      });
    }

    order.status = "DELIVERED";
    await order.save();

    const populated = await Order.findById(order._id)
      .populate("farmerId", "firstName lastName address phone email")
      .select("-__v");

    res.json({ order: sanitizeOrderForRetailer(populated) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrder,
  getRetailerActiveOrders,
  getRetailerOrderHistory,
  getSingleOrder,
  markOrderDelivered,
};

