const { loginUserService, registerUserService } = require('../services/authService.js');

const register = async (req, res) => {
  try {
    const result = await registerUserService(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.message) {
      console.error(error); // <---- add this
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginUserService(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { register, login };
