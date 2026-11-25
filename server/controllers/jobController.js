const Job = require("../models/Job");

exports.listJobs = async (req, res, next) => {
  try {
    const { search = "", location = "", type = "", page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (search.trim()) filter.$text = { $search: search.trim() };
    if (location.trim()) filter.location = { $regex: location.trim(), $options: "i" };
    if (type) filter.type = type;
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
    const [jobs, total] = await Promise.all([
      Job.find(filter).populate("postedBy", "name companyName").sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
      Job.countDocuments(filter)
    ]);
    res.json({ success: true, jobs, pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) } });
  } catch (error) { next(error); }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name companyName email");
    if (!job || !job.isActive) return res.status(404).json({ success: false, message: "Job not found" });
    res.json({ success: true, job });
  } catch (error) { next(error); }
};

exports.createJob = async (req, res, next) => {
  try {
    const { title, company, location, type, category, salaryMin, salaryMax, description, requirements } = req.body;
    if (!title || !company || !location || !type || !description) return res.status(400).json({ success: false, message: "Please complete all required job fields" });
    const job = await Job.create({
      title, company, location, type, category,
      salaryMin: salaryMin === "" || salaryMin == null ? null : Number(salaryMin),
      salaryMax: salaryMax === "" || salaryMax == null ? null : Number(salaryMax),
      description, requirements: Array.isArray(requirements) ? requirements : [],
      postedBy: req.user._id
    });
    res.status(201).json({ success: true, job });
  } catch (error) { next(error); }
};

exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") return res.status(403).json({ success: false, message: "You cannot edit this job" });
    const fields = ["title", "company", "location", "type", "category", "salaryMin", "salaryMax", "description", "requirements", "isActive"];
    fields.forEach((field) => { if (req.body[field] !== undefined) job[field] = req.body[field]; });
    await job.save();
    res.json({ success: true, job });
  } catch (error) { next(error); }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") return res.status(403).json({ success: false, message: "You cannot delete this job" });
    await job.deleteOne();
    res.json({ success: true, message: "Job deleted" });
  } catch (error) { next(error); }
};
