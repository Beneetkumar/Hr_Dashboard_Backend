// models/candidateModel.js
import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: false },
    phone: { type: String, required: true },
    position: { type: String },
    resumeUrl: { type: String }, // like /uploads/resumes/xxx.pdf
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);
export default Candidate;
