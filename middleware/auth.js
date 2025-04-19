const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = (requiredRole) => {
  return (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

    try {
      const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
      req.user = decoded;
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: Insufficient Permissions" });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
    }
  };
};

module.exports = auth;
