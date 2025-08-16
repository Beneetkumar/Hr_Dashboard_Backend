import { body } from "express-validator";

export const createAttendanceValidator = [
  body("employee").notEmpty().withMessage("Employee is required"),
  body("date").notEmpty().withMessage("Date is required"),
  body("status").optional().isIn(["Present", "Absent", "Leave", "Half-Day"])
];
