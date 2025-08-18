
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    position: { type: String },
    employmentStatus: { type: String, enum: ["Present", "Left", "Probation"], default: "Present" },
    role: { type: String, enum: ["HR", "Admin", "Staff"], default: "Staff" },
  },
  { timestamps: true }
);

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
