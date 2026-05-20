const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const emailreg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonereg = /^\+?[\d\s-]{10,15}$/;


const ROLES = ['RETAILER', 'FARMER', 'ADMIN'];
/**
 * Role-specific signup messages
 */
const message = () => {
 return 'Account created successfully';
};

/**
 * POST /api/auth/register
 * Handles farmer, retailer, and admin signup
 */
const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Basic validation
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone, password, and role',
      });
    }

    const email1 = email.trim().toLowerCase();
    const phone1 = phone.trim().replace(/\s/g, '');
    const role1 = role.toLowerCase();

    if (!ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be farmer, retailer, or admin',
      });
    }

    if (!emailreg.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address',
      });
    }

    if (!phonereg.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number (10–15 digits)',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Prevent duplicate email or phone
    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    const existingPhone = await User.findOne({ phone: phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is already registered',
      });
    }

    // Hash password before saving

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name,
      email: email1,
      phone: phone1,
      password: hashedPassword,
      role: role1,
    });

    const userInfo = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    res.status(201).json({
      success: true,
      message: message(),
      user: userInfo,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
  
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
  };

module.exports = { register };

