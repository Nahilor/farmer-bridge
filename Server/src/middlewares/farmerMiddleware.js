const verifyFarmer = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    if (req.user.role !== "FARMER") {
        return res.status(403).json({
            message: "Access denied. Farmers only."
        });
    }

    next();
};

module.exports = verifyFarmer;