
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const signToken = (id, role = "HR") => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "2h" });
};


export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

   
    const user = await User.create({ name, email, password, role: "HR" });

    const token = signToken(user._id, "HR");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60 * 1000, 
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: "HR",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    user.role = "HR";
    await user.save();

    const token = signToken(user._id, "HR");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: "HR",
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};


export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};

export const getProfile = async (req, res) => {
  try {
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: "HR",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
