
import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  listCandidates,
  createCandidate,
  getCandidate,
  deleteCandidate,
  moveToEmployee,
} from "../controllers/candidateController.js";
import { candidateValidator } from "../validators/entityValidators.js";
import { uploadResume } from "../middleware/upload.js";

const router = express.Router();

router.use(protect);

router.get("/", listCandidates);
router.post("/", requireRole("HR"), uploadResume.single("resume"), candidateValidator, createCandidate);
router.get("/:id", getCandidate);
router.delete("/:id", requireRole("HR"), deleteCandidate);
router.post("/:id/move-to-employee", requireRole("HR"), moveToEmployee);

export default router;
