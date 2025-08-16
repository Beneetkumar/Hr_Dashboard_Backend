import { body } from "express-validator";

export const createEmployeeValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("role").optional().isIn(["Admin", "HR", "Staff", "Intern"]),
  body("employmentStatus").optional().isIn(["Present", "Exited"])
];
