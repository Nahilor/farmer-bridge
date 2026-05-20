const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// sign up features will be implemented here by nebil


// This is for login
module.exports.loginUserService = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found.");
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("User exists but the password passed is incorrect.");
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return { user, token }
}; 