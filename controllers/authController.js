const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Employee = require("../models/employee");
const Employer = require("../models/employer");
const SuperAdmin = require("../models/super_admin");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");

dotenv.config();

// Register a new user (Employee, Employer, or SuperAdmin)
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    let user;
    if (role === "Employee") {
      user = new Employee({ name, email, password: hashedPassword });
    } else if (role === "Employer") {
      user = new Employer({ companyName: name, email, password: hashedPassword });
    } else if (role === "SuperAdmin") {
      user = new SuperAdmin({ name, email, password: hashedPassword });
    } else {
      return res.status(200).json({ message: "Invalid Role" });
    }

    await user.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user;
    if (role === "Employee") {
      user = await Employee.findOne({ email });
    } else if (role === "Employer") {
      user = await Employer.findOne({ email });
    } else if (role === "SuperAdmin") {
      user = await SuperAdmin.findOne({ email });
    } else {
      return res.status(200).json({ message: "Invalid Role" });
    }

    if (!user) return res.status(200).json({ message: "User not found,Register First!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(200).json({ message: "Invalid Credentials" });

    // const token = jwt.sign(
    //   { id: user._id, email: user.email, role },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1d" }
    // );
    const accessToken = generateAccessToken(user,role);
    const refreshToken = generateRefreshToken(user);
    res.set({
      'Authorization': `Bearer ${accessToken}`
    });
    // Store refresh token in a secure HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({ accessToken, role,message:"Logged in successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const refreshAccessToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No refresh token provided" });

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid refresh token" });

      const newAccessToken = generateAccessToken({ _id: decoded.id, role: decoded.role });
      res.json({ accessToken: newAccessToken });
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};



const logoutUser = (req, res) => {
  res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "Strict" });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, refreshAccessToken, logoutUser };
