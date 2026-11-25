const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ["seeker", "recruiter", "admin"], default: "seeker" },
  headline: { type: String, trim: true, maxlength: 120, default: "" },
  location: { type: String, trim: true, maxlength: 100, default: "" },
  skills: [{ type: String, trim: true }],
  companyName: { type: String, trim: true, maxlength: 120, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
