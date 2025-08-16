// routes/leaveRoutes.js
import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  listLeaves,
  createLeave,
  updateLeaveStatus,
  getApprovedLeavesForCalendar,
} from "../controllers/leaveController.js";
import { uploadDoc } from "../middleware/upload.js";

const router = express.Router();
router.use(protect);

// routes/leaveRoutes.js
router.get("/", listLeaves);
router.post("/", uploadDoc.single("doc"), createLeave);

// FIX: put static route BEFORE :id
router.get("/calendar/approved", getApprovedLeavesForCalendar);

// dynamic update route
router.put("/:id/status", requireRole("HR"), updateLeaveStatus);


export default router;
