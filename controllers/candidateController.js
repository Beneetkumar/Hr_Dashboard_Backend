
import Candidate from "../models/candidateModel.js";
import Employee from "../models/employeeModel.js";
import { validationResult } from "express-validator";


export const listCandidates = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 20);
    const skip = (page - 1) * limit;
    const q = {};

    if (req.query.search) {
      const s = req.query.search;
      q.$or = [{ name: new RegExp(s, "i") }, { email: new RegExp(s, "i") }, { position: new RegExp(s, "i") }];
    }

    const total = await Candidate.countDocuments(q);
    const items = await Candidate.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit);
    res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createCandidate = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const data = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      position: req.body.position,
    };

    if (req.file) {
      data.resumeUrl = `/uploads/resumes/${req.file.filename}`;
    }

    const cand = await Candidate.create(data);
    res.status(201).json(cand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCandidate = async (req, res) => {
  try {
    const cand = await Candidate.findById(req.params.id);
    if (!cand) return res.status(404).json({ message: "Candidate not found" });
    res.json(cand);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const cand = await Candidate.findById(req.params.id);
    if (!cand) return res.status(404).json({ message: "Candidate not found" });
    await cand.deleteOne();
    res.json({ message: "Candidate deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const moveToEmployee = async (req, res) => {
  try {
    const cand = await Candidate.findById(req.params.id);
    if (!cand) return res.status(404).json({ message: "Candidate not found" });

    const emp = await Employee.create({
      name: cand.name,
      email: cand.email,
      phone: cand.phone,
      position: cand.position,
      employmentStatus: "Present",
      role: "Staff",
    });

    await cand.deleteOne();

    res.json({ message: "Candidate moved to employee", employee: emp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
