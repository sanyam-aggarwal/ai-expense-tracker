const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: { type: String, unique: true, sparse: true, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  googleId: { type: String, unique: true, sparse: true },
  name: { type: String, trim: true, maxlength: 100 },
  avatarUrl: { type: String, trim: true },
  providers: { phone: { type: Boolean, default: false }, google: { type: Boolean, default: false } },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
