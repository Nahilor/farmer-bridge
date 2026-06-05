const User = require("../models/userModel");

const requireRole = (allowedRoles) => {
  const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return async (req, res, next) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Not authorized" });
      }

      if (!allowed.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.currentUser = user;
      next();
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
};

module.exports = { requireRole };

