const User = require("../models/userModel");

// Get all users (optional filter)
const getAllUsers = async (filter = {}) => {
    return await User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 });
};

// Get user by ID
const getUserById = async (userId) => {
    const user = await User.findById(userId)
        .select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

// Update user status
const updateUserStatus = async (userId, status) => {
    const allowedStatuses = [
        "PENDING_VERIFICATION",
        "ACTIVE",
        "SUSPENDED",
        "REJECTED"
    ];

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid status");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { status },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

// Update user role
const updateUserRole = async (userId, role) => {
    const allowedRoles = [
        "ADMIN",
        "FARMER",
        "RETAILER"
    ];

    if (!allowedRoles.includes(role)) {
        throw new Error("Invalid role");
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { role },
        { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

// Delete user
const deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return {
        success: true,
        message: "User deleted successfully"
    };
};

// Get all farmers
const getAllFarmers = async () => {
    return await User.find({ role: "FARMER" })
        .select("-password")
        .sort({ createdAt: -1 });
};

// Get all retailers
const getAllRetailers = async () => {
    return await User.find({ role: "RETAILER" })
        .select("-password")
        .sort({ createdAt: -1 });
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    getAllFarmers,
    getAllRetailers
};
