import Application from '../models/Application.js';

export const applyJob = async (req, res) => {
  try {
    const { job } = req.body;
    const userId = req.user._id;

    // ─── DUPLICATE CHECK ───
    const existingApplication = await Application.findOne({
      job: job,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job.",
        alreadyApplied: true,
        applicationId: existingApplication._id,
      });
    }

    const applicationData = {
      ...req.body,
      applicant: userId,
    };

    // If file was uploaded, add the path
    if (req.file) {
      applicationData.resume = `/uploads/${req.file.filename}`;
    }

    const application = await Application.create(applicationData);
    const populated = await application.populate('job', 'title company location');
    res.status(201).json(populated);
  } catch (err) {
    console.error("Apply job error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getApplicants = async (req, res) => {
  const apps = await Application.find()
    .populate('applicant', 'name email avatar')
    .populate('job', 'title company location isInternational')
    .sort({ createdAt: -1 });
  res.json(apps);
};

export const updateStatus = async (req, res) => {
  const app = await Application.findByIdAndUpdate(
    req.params.id, 
    { status: req.body.status }, 
    { new: true }
  ).populate('applicant', 'name email avatar')
   .populate('job', 'title company');
  res.json(app);
};

export const getStats = async (req, res) => {
  const total = await Application.countDocuments();
  const shortlisted = await Application.countDocuments({ status: 'Shortlisted' });
  const pending = await Application.countDocuments({ status: 'Pending' });
  const approved = await Application.countDocuments({ status: 'Approved' });
  res.json({ total, shortlisted, pending, approved });
};

export const getYearlyData = async (req, res) => {
  const data = await Application.aggregate([
    { $group: { _id: { $month: '$createdAt' }, received: { $sum: 1 }, approved: { $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] } } } },
    { $sort: { _id: 1 } },
  ]);
  res.json(data);
};

export const getAnalytics = async (req, res) => {
  try {
    const { period = "yearly" } = req.query;
    const now = new Date();
    let chartData = [];
    const stats = {};

    if (period === "yearly") {
      // Aggregate by month for current year
      const raw = await Application.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(now.getFullYear(), 0, 1),
              $lte: new Date(now.getFullYear(), 11, 31, 23, 59, 59),
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            received: { $sum: 1 },
            approved: { $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      chartData = months.map((m, i) => {
        const found = raw.find((r) => r._id === i + 1);
        return {
          name: m,
          received: found?.received || 0,
          approved: found?.approved || 0,
        };
      });
    } else if (period === "monthly") {
      // Aggregate by day for current month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

      const raw = await Application.aggregate([
        { $match: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } } },
        {
          $group: {
            _id: { $dayOfMonth: "$createdAt" },
            received: { $sum: 1 },
            approved: { $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const daysInMonth = endOfMonth.getDate();
      chartData = Array.from({ length: daysInMonth }, (_, i) => {
        const found = raw.find((r) => r._id === i + 1);
        return {
          name: `${i + 1}`,
          received: found?.received || 0,
          approved: found?.approved || 0,
        };
      });
    } else if (period === "weekly") {
      // Aggregate by day for current week (Sun-Sat)
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const raw = await Application.aggregate([
        { $match: { createdAt: { $gte: weekStart, $lte: weekEnd } } },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" }, // 1=Sun, 7=Sat
            received: { $sum: 1 },
            approved: { $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      chartData = days.map((d, i) => {
        const found = raw.find((r) => r._id === i + 1); // MongoDB $dayOfWeek: 1=Sunday
        return {
          name: d,
          received: found?.received || 0,
          approved: found?.approved || 0,
        };
      });
    }

    // Stats (all-time totals)
    stats.totalReceived = await Application.countDocuments();
    stats.totalApproved = await Application.countDocuments({ status: "Approved" });
    stats.totalPending = await Application.countDocuments({ status: "Pending" });
    stats.totalRejected = await Application.countDocuments({ status: "Rejected" });

    res.json({ chartData, stats });
  } catch (err) {
    console.error("Analytics error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  const apps = await Application.find({ applicant: req.user._id })
    .populate('job', 'title company location type salary')
    .sort({ createdAt: -1 });
  res.json(apps);
};

// ─── NEW: Check if user already applied to a specific job ───
export const checkApplicationStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const existing = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    res.json({
      hasApplied: !!existing,
      application: existing ? {
        _id: existing._id,
        status: existing.status,
        createdAt: existing.createdAt,
      } : null,
    });
  } catch (err) {
    console.error("Check application status error:", err);
    res.status(500).json({ message: err.message });
  }
};