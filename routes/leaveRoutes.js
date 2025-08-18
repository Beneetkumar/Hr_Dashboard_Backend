
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


router.get("/", listLeaves);
router.post("/", uploadDoc.single("doc"), createLeave);

router.get("/calendar/approved", getApprovedLeavesForCalendar);

router.put("/:id/status", requireRole("HR"), updateLeaveStatus);


export default router;
