const bcrypt = require("bcryptjs");
const User = require("../models/User");
const createToken = require("../utils/token");

function safeUser(user) {
  return {
    id: user._id, name: user.name, email: user.email, role: user.role,
    headline: user.headline, location: user.location, skills: user.skills,
    companyName: user.companyName
  };
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: "Name, email and password are required" });
    if (password.length < 8) return res.status(400).json({ success: false, message: "Password must contain at least 8 characters" });
    if (!["seeker", "recruiter"].includes(role || "seeker")) return res.status(400).json({ success: false, message: "Invalid account role" });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ success: false, message: "An account with this email already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email: normalizedEmail, password: hashedPassword, role: role || "seeker", companyName: companyName || "" });
    res.status(201).json({ success: true, token: createToken(user._id), user: safeUser(user) });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ success: false, message: "Incorrect email or password" });
    res.json({ success: true, token: createToken(user._id), user: safeUser(user) });
  } catch (error) { next(error); }
};

exports.me = async (req, res) => res.json({ success: true, user: safeUser(req.user) });
