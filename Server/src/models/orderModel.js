const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        farmerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        retailerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        productName: String,
        quantity: Number,
        pricePerUnit: Number,
        totalPrice: Number,
        status: {
            type: String,
            enum: [
                "PENDING",
                "ACCEPTED",
                "REJECTED",
                "DELIVERED"
            ],
            default: "PENDING"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);