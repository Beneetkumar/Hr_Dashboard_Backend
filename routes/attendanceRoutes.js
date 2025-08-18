
import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { listAttendance, createAttendance } from "../controllers/attendanceController.js";

const router = express.Router();
router.use(protect);

router.get("/", listAttendance);
router.post("/", requireRole("HR"), createAttendance); 

export default router;
