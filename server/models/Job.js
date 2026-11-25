const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  company: { type: String, required: true, trim: true, maxlength: 120 },
  location: { type: String, required: true, trim: true, maxlength: 100 },
  type: { type: String, enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"], required: true },
  category: { type: String, trim: true, default: "Other" },
  salaryMin: { type: Number, min: 0, default: null },
  salaryMax: { type: Number, min: 0, default: null },
  description: { type: String, required: true, trim: true, maxlength: 8000 },
  requirements: [{ type: String, trim: true }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

jobSchema.index({ title: "text", company: "text", description: "text", category: "text" });
module.exports = mongoose.model("Job", jobSchema);
