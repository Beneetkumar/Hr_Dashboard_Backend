import { body } from "express-validator";

export const createCandidateValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("position").optional().isString()
];
