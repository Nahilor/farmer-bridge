const {
    getAllUsers,
    getUserById,
    updateUserStatus,
    updateUserRole,
    deleteUser,
    getAllFarmers,
    getAllRetailers
} = require("../services/adminService");

// Get all users
const getUserCollection = async (req, res) => {
    try {
        const users = await getAllUsers();

        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};

// Get user by ID
const getUser = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Update user status
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const user = await updateUserStatus(
            req.params.id,
            status
        );

        return res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update user role
const updateRole = async (req, res) => {
    try {
        const { role } = req.body;

        const user = await updateUserRole(
            req.params.id,
            role
        );

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: user
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete user
const removeUser = async (req, res) => {
    try {
        const result = await deleteUser(req.params.id);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Get all farmers
const getFarmers = async (req, res) => {
    try {
        const farmers = await getAllFarmers();

        return res.status(200).json({
            success: true,
            data: farmers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get all retailers
const getRetailers = async (req, res) => {
    try {
        const retailers = await getAllRetailers();

        return res.status(200).json({
            success: true,
            data: retailers
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getUserCollection,
    getUser,
    updateStatus,
    updateRole,
    removeUser,
    getFarmers,
    getRetailers
};