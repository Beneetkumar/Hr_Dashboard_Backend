import express from "express";
import { protect } from "../middleware/authMiddleware.js";
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
router.post("/", uploadResume.single("resume"), candidateValidator, createCandidate);
router.get("/:id", getCandidate);
router.delete("/:id", deleteCandidate);
router.post("/:id/move-to-employee", moveToEmployee);

export default router;
