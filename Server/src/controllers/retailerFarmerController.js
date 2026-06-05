const mongoose = require("mongoose");
const User = require("../models/userModel");

const farmerSelect = "firstName lastName address phone email role status products createdAt updatedAt";

const getFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: "FARMER", status: "ACTIVE" })
      .select(farmerSelect)
      .sort({ createdAt: -1 });

    res.json({ farmers });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Simple "popular" implementation: farms with more listed products first.
const getPopularFarmers = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);

    // Using aggregation for sorting by embedded array length.
    const farmers = await User.aggregate([
      { $match: { role: "FARMER", status: "ACTIVE" } },
      { $addFields: { productCount: { $size: { $ifNull: ["$products", []] } } } },
      { $sort: { productCount: -1, createdAt: -1 } },
      { $limit: limit },
      {
        $project: {
          password: 0,
          __v: 0,
          productCount: 0,
        },
      },
    ]);

    res.json({ farmers });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getFarmerById = async (req, res) => {
  try {
    const { farmerId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      return res.status(400).json({ message: "Invalid farmer id" });
    }

    const farmer = await User.findOne({ _id: farmerId, role: "FARMER", status: "ACTIVE" }).select(
      farmerSelect
    );
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    res.json({ farmer });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getFarmers, getPopularFarmers, getFarmerById };

