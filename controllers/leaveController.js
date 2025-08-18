
import Leave from "../models/leaveModel.js";
import Employee from "../models/employeeModel.js";


export const listLeaves = async (req, res) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);
    const skip = (page - 1) * limit;

    const q = {};

   
    if (req.query.status) q.status = req.query.status;


    if (req.query.search) {
      const employees = await Employee.find({
        name: { $regex: req.query.search, $options: "i" },
      }).select("_id");
      q.employee = { $in: employees.map((e) => e._id) };
    }

    const total = await Leave.countDocuments(q);
    const items = await Leave.find(q)
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate("employee", "name email");

    res.json({
      items,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const createLeave = async (req, res) => {
  try {
    const { employee: employeeId, startDate, endDate, reason, type } = req.body;
    if (!employeeId || !startDate || !endDate || !type) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const emp = await Employee.findById(employeeId);
    if (!emp) return res.status(400).json({ message: "Employee not found" });

   
    if (req.user.role !== "HR" && emp.employmentStatus !== "Present") {
      return res
        .status(400)
        .json({ message: "Only Present employees can apply for leaves" });
    }

    const data = {
      employee: emp._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      type,
    };

    if (req.file) {
      data.docsUrl = `/uploads/docs/${req.file.filename}`;
    }

    const leave = await Leave.create(data);
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    return res.json({ message: "Leave status updated", leave });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
};


// GET /api/leaves/calendar
export const getApprovedLeavesForCalendar = async (req, res) => {
  try {
    const items = await Leave.find({ status: "Approved" }).populate(
      "employee",
      "name"
    );
    const events = items.map((l) => ({
      id: l._id,
      title: l.employee?.name || "Leave",
      start: l.startDate,
      end: l.endDate,
      reason: l.reason,
      type: l.type,
    }));
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
