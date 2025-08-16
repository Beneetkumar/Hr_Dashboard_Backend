import { body } from "express-validator";

export const createLeaveValidator = [
  body("employee").notEmpty().withMessage("Employee is required"),
  body("type").optional().isIn(["Sick", "Casual", "Earned", "Maternity", "Paternity", "Other"]),
  body("startDate").notEmpty().withMessage("startDate is required"),
  body("endDate").notEmpty().withMessage("endDate is required")
];
