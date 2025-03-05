const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true }, // Unique but optional
  mobile: { type: String, unique: true, sparse: true }, // Unique but optional
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
