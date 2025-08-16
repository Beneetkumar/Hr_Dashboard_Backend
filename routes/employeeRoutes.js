// routes/employeeRoutes.js
import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  listEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";

const router = express.Router();
router.use(protect);

router.get("/", listEmployees);
router.post("/", requireRole("HR"), createEmployee);
router.get("/:id", getEmployee);
router.put("/:id", requireRole("HR"), updateEmployee);
router.delete("/:id", requireRole("HR"), deleteEmployee);

export default router;
