const jwt = require("jsonwebtoken");

// Generate Access Token (short-lived)
const generateAccessToken = (user, role) => {
  return jwt.sign(
    { id: user._id, email: user.email, role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } // Short expiry for security
  );
};
// const token = jwt.sign(
//     { id: user._id, email: user.email, role },
//     process.env.JWT_SECRET,
//     { expiresIn: "1d" }
//   );

// Generate Refresh Token (longer-lived)
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // Lasts 7 days
  );
};

module.exports = { generateAccessToken, generateRefreshToken };
