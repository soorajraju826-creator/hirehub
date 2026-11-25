const mongoose = require("mongoose");

module.exports = async function connectDB() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI environment variable is required");
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};
