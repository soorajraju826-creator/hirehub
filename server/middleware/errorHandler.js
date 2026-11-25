module.exports = (error, req, res, next) => {
  console.error(error);
  if (error.code === 11000) return res.status(409).json({ success: false, message: "This record already exists" });
  if (error.name === "ValidationError") {
    return res.status(400).json({ success: false, message: Object.values(error.errors).map((item) => item.message).join(", ") });
  }
  if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid record ID" });
  res.status(error.status || 500).json({ success: false, message: error.message || "Internal server error" });
};
