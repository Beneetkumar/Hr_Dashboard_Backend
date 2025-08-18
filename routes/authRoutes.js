import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Get profile (protected)
router.get("/profile", protect, getProfile);

// ✅ Fixed: require auth for /me
router.get("/me", protect, (req, res) => {
  res.json({ user: req.user });
});
router.stack.forEach(r => {
  if (r.route && r.route.path) {
    console.log("Loaded route in <filename>: ", r.route.path);
  }
});


export default router;
