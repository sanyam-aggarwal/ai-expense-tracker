const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const Otp = require("../models/Otp");

const OTP_TTL_MS = 50 * 60 * 1000;
const OTP_RESEND_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 50;
const googleClient = new OAuth2Client();
const normalizePhone = (value) => String(value || "").replace(/[\s()-]/g, "");
const validPhone = (phone) => /^\+[1-9]\d{7,14}$/.test(phone);
const issueToken = (user) => jwt.sign({ sub: user._id.toString(), phone: user.phone, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
const publicUser = (user) => ({ id: user._id, name: user.name, phone: user.phone, email: user.email, avatarUrl: user.avatarUrl });

exports.requestOtp = async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  if (!validPhone(phone)) return res.status(400).json({ success: false, message: "Use an E.164 phone number, for example +919876543210" });
  const existing = await Otp.findOne({ phone }).sort({ createdAt: -1 });
  if (existing && Date.now() - existing.createdAt.getTime() < OTP_RESEND_MS) return res.status(429).json({ success: false, message: "Please wait 60 seconds before requesting another code" });

  const code = crypto.randomInt(100000, 1000000).toString();
  await Otp.deleteMany({ phone });
  await Otp.create({ phone, code, expiresAt: new Date(Date.now() + OTP_TTL_MS) });
  const production = process.env.NODE_ENV === "production";
  if (production) {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_FROM_NUMBER) return res.status(503).json({ success: false, message: "SMS service is not configured" });
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({ body: `Your expense tracker verification code is ${code}. It expires in 5 minutes.`, from: process.env.TWILIO_FROM_NUMBER, to: phone });
  }
  res.json({ success: true, message: production ? "Verification code sent" : "Development verification code created", ...(production ? {} : { developmentCode: code }) });
};

exports.verifyOtp = async (req, res) => {
  const phone = normalizePhone(req.body.phone);
  const code = String(req.body.code || "");
  const otp = await Otp.findOne({ phone }).sort({ createdAt: -1 });
  if (!otp || otp.expiresAt < new Date()) return res.status(400).json({ success: false, message: "Code is invalid or expired" });
  if (otp.attempts >= MAX_OTP_ATTEMPTS) return res.status(429).json({ success: false, message: "Too many attempts. Request a new code." });
  if (otp.code !== code) {
    await Otp.updateOne({ _id: otp._id }, { $inc: { attempts: 1 } });
    return res.status(400).json({ success: false, message: "Incorrect verification code" });
  }
  await Otp.deleteMany({ phone });
  const user = await User.findOneAndUpdate({ phone }, { $set: { phone, "providers.phone": true } }, { returnDocument: "after", upsert: true, setDefaultsOnInsert: true });
  res.json({ success: true, token: issueToken(user), user: publicUser(user) });
};

exports.googleSignIn = async (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ success: false, message: "Google sign-in is not configured" });
  const ticket = await googleClient.verifyIdToken({ idToken: req.body.credential, audience: process.env.GOOGLE_CLIENT_ID });
  const profile = ticket.getPayload();
  if (!profile?.sub || !profile.email_verified) return res.status(401).json({ success: false, message: "Google account could not be verified" });
  const user = await User.findOneAndUpdate({ $or: [{ googleId: profile.sub }, { email: profile.email }] }, { $set: { googleId: profile.sub, email: profile.email, name: profile.name, avatarUrl: profile.picture, "providers.google": true } }, { returnDocument: "after", upsert: true, setDefaultsOnInsert: true });
  res.json({ success: true, token: issueToken(user), user: publicUser(user) });
};

exports.me = async (req, res) => {
  const user = await User.findById(req.user.sub);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user: publicUser(user) });
};

exports.updateProfile = async (req, res) => {
  const name = String(req.body.name || "").trim();
  const email = String(req.body.email || "").trim().toLowerCase();
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ success: false, message: "Enter a valid email address" });
  try {
    const user = await User.findByIdAndUpdate(req.user.sub, { $set: { name, ...(email ? { email } : {}) } }, { returnDocument: "after", runValidators: true });
    res.json({ success: true, user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: "That email is already connected to another account" });
    throw error;
  }
};

exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "Choose a PNG, JPEG, or WebP image under 2 MB" });
  const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/avatars/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.user.sub, { $set: { avatarUrl } }, { returnDocument: "after" });
  res.json({ success: true, user: publicUser(user) });
};
