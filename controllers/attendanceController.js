
import Attendance from "../models/attendanceModel.js";
import Employee from "../models/employeeModel.js";


export const listAttendance = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);
    const skip = (page - 1) * limit;
    const q = {};

    if (req.query.employee) q.employee = req.query.employee;

    if (req.query.date) {
      const d = new Date(req.query.date);
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));
      q.date = { $gte: start, $lte: end };
    }

    if (req.query.status) q.status = req.query.status;


    let items = await Attendance.find(q)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("employee", "name email employmentStatus");

    const total = await Attendance.countDocuments(q);


    if (req.query.onlyPresent === "true") {
      items = items.filter((a) => a.employee && a.employee.employmentStatus === "Present");
    }

    res.json({
      items,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching attendance", error: err.message });
  }
};


export const createAttendance = async (req, res) => {
  try {
    const { employee: employeeId, date, status } = req.body;

    if (!employeeId || !date) {
      return res.status(400).json({ message: "Employee and date are required" });
    }

    const emp = await Employee.findById(employeeId);
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    if (req.user?.role !== "HR" && emp.employmentStatus !== "Present") {
      return res.status(403).json({ message: "Not allowed to mark attendance for non-present employees" });
    }

    const attDate = new Date(date);
    attDate.setHours(0, 0, 0, 0); 

 
    const exists = await Attendance.findOne({ employee: emp._id, date: attDate });
    if (exists) return res.status(400).json({ message: "Attendance already marked for this date" });

    const doc = await Attendance.create({
      employee: emp._id,
      date: attDate,
      status: status || "Present",
    });


    const populatedDoc = await doc.populate("employee", "name email employmentStatus");

    res.status(201).json(populatedDoc);
  } catch (err) {
    res.status(500).json({ message: "Error creating attendance", error: err.message });
  }
};
