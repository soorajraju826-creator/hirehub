const Application = require("../models/Application");
const Job = require("../models/Job");

exports.apply = async (req, res, next) => {
  try {
    const job = await Job.findOne({ _id: req.params.jobId, isActive: true });
    if (!job) return res.status(404).json({ success: false, message: "Job is no longer available" });
    if (job.postedBy.toString() === req.user._id.toString()) return res.status(400).json({ success: false, message: "You cannot apply to your own job posting" });
    const application = await Application.create({ job: job._id, applicant: req.user._id, coverLetter: req.body.coverLetter || "" });
    res.status(201).json({ success: true, application });
  } catch (error) { next(error); }
};

exports.myApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id }).populate("job").sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) { next(error); }
};

exports.receivedApplications = async (req, res, next) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).select("_id");
    const applications = await Application.find({ job: { $in: jobs.map((job) => job._id) } })
      .populate("job", "title company").populate("applicant", "name email headline location skills").sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) { next(error); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const allowed = ["Reviewed", "Shortlisted", "Rejected", "Accepted"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid application status" });
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });
    if (application.job.postedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") return res.status(403).json({ success: false, message: "You cannot update this application" });
    application.status = req.body.status;
    await application.save();
    res.json({ success: true, application });
  } catch (error) { next(error); }
};
