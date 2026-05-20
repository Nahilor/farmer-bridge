import {
  registerUserService,
  loginUserService
} from "../services/auth.service.js";

// nebils login Service should be also imported here
const { loginUserService } = require("../services/authService.js")


// also register controller function should be here



// This is the login controller
export const login = async (req, res) => {
  try {
    const result = await loginUserService(req.body);
    res.status(200).json(result);
  } catch (error) {
    // this should show the error that is thrown from the authService
    res.status(400).json({ message: error.message });
  }
};