import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const signToken = (id, role = "HR") =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "2h" });

// Helper for cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  maxAge: 2 * 60 * 60 * 1000, // 2 hours
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password, role: "HR" });
    const token = signToken(user._id, user.role);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = signToken(user._id, user.role);

    res.cookie("token", token, cookieOptions);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  }
  res.status(401).json({ message: "Invalid email or password" });
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions,
    maxAge: 0, // ensure removal
  });
  res.json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "Not authenticated" });
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};
