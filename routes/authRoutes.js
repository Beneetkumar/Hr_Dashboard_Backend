import express from "express";
import { registerUser, loginUser, logoutUser, getProfile, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser); 
router.post("/login", loginUser); 
router.post("/logout", logoutUser);

// Protected routes
router.get("/profile", protect, getProfile);
router.get("/me", protect, getMe);   // ✅ now uses middleware

export default router;
