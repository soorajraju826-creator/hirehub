const User = require("../models/User");
const Job = require("../models/Job");

exports.users = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) { next(error); }
};

exports.jobs = async (req, res, next) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email").sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) { next(error); }
};
