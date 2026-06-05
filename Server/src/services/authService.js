const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const emailreg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonereg = /^\+?[\d\s-]{10,15}$/;

const ROLES = ['RETAILER', 'FARMER', 'ADMIN'];

const registerUserService = async (data) => {
    const { firstName, lastName, email, phone, password, address, role } = data;

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !phone?.trim() || !password || !role) {
        throw new Error('Please provide first name, last name, email, phone, password, and role');
    }

    const firstName1 = firstName.trim();
    const lastName1 = lastName.trim();

    const email1 = email.trim().toLowerCase();
    const phone1 = String(phone).trim().replace(/\s/g, '');
    const address1 = address;
    const role1 = role;

    if (!ROLES.includes(role)) {
        throw new Error('Role must be farmer, retailer, or admin');
    }

    if (!emailreg.test(email)) {
        throw new Error('Please enter a valid email address');
    }

    if (!phonereg.test(phone1)) {
        throw new Error('Please enter a valid phone number (10–15 digits)');
    }

    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }

    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
        throw new Error('Email is already registered');
    }

    const existingPhone = await User.findOne({ phone: phone });
    if (existingPhone) {
        throw new Error('Phone number is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({
        firstName: firstName1,
        lastName: lastName1,
        email: email1,
        phone: phone1,
        password: hashedPassword,
        address: address1,
        role: role1,
        });

        return {
        success: true,
        message: 'Account created successfully',
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role,
        },
        };
    } catch (error) {
        if (error.code === 11000) {
        throw new Error('User already exists');
        }
        throw error;
    }
};

const loginUserService = async (data) => {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('User exists but the password passed is incorrect.');
    }

    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    return { user, token };
};

module.exports = { loginUserService, registerUserService };
