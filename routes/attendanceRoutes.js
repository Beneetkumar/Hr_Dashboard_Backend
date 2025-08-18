
import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import { listAttendance, createAttendance } from "../controllers/attendanceController.js";

const router = express.Router();
router.use(protect);

router.get("/", listAttendance);
router.post("/", requireRole("HR"), createAttendance); 
router.stack.forEach(r => {
  if (r.route && r.route.path) {
    console.log("Loaded route in <filename>: ", r.route.path);
  }
});


export default router;
