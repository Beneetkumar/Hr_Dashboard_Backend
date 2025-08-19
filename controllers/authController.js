import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "2h" });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite:"None",
  maxAge: 2 * 60 * 60 * 1000, // 2 hours
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = signToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  }
  res.status(401).json({ message: "Invalid email or password" });
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions,
    maxAge: 0,
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
  });
};
