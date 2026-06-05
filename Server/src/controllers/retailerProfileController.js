const User = require("../models/userModel");

const getRetailerProfile = async (req, res) => {
  try {
    // `roleMiddleware` already loaded full user into req.currentUser
    const user = req.currentUser || (await User.findById(req.user.id).select("-password"));
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      profile: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateRetailerProfile = async (req, res) => {
  try {
    const allowedFields = ["firstName", "lastName", "phone", "address"];
    const updates = {};

    for (const key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.firstName !== undefined && (!String(updates.firstName).trim())) {
      return res.status(400).json({ message: "firstName cannot be empty" });
    }
    if (updates.lastName !== undefined && (!String(updates.lastName).trim())) {
      return res.status(400).json({ message: "lastName cannot be empty" });
    }
    if (updates.address !== undefined && (!String(updates.address).trim())) {
      return res.status(400).json({ message: "address cannot be empty" });
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      profile: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getRetailerProfile, updateRetailerProfile };

