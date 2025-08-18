
import Employee from "../models/employeeModel.js";


export const listEmployees = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);
    const skip = (page - 1) * limit;
    const q = {};

    if (req.query.search) {
      const s = req.query.search;
      q.$or = [{ name: new RegExp(s, "i") }, { email: new RegExp(s, "i") }, { position: new RegExp(s, "i") }];
    }
    if (req.query.status) q.employmentStatus = req.query.status;

    const total = await Employee.countDocuments(q);
    const items = await Employee.find(q).sort({ name: 1 }).skip(skip).limit(limit);
    res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, phone, position, employmentStatus, role } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Name and email required" });

    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ message: "Employee with email exists" });

    const emp = await Employee.create({ name, email, phone, position, employmentStatus, role });
    res.status(201).json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    const { name, email, phone, position, employmentStatus, role } = req.body;
    emp.name = name ?? emp.name;
    emp.email = email ?? emp.email;
    emp.phone = phone ?? emp.phone;
    emp.position = position ?? emp.position;
    emp.employmentStatus = employmentStatus ?? emp.employmentStatus;
    emp.role = role ?? emp.role;

    await emp.save();
    res.json(emp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    await emp.deleteOne();
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
