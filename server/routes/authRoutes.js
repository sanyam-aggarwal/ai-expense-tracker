const express = require("express");
const rateLimit = require("express-rate-limit");
const auth = require("../middlewares/authenticate");
const uploadAvatar = require("../middlewares/uploadAvatar");
const controller = require("../controllers/authController");

const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => !isProduction,
  message: {
    success: false,
    message: "Too many verification requests. Try again later.",
  },
});

router.post("/phone/request-otp", otpLimiter, controller.requestOtp);
router.post("/phone/verify-otp", otpLimiter, controller.verifyOtp);
router.post("/google", controller.googleSignIn);
router.get("/me", auth, controller.me);
router.patch("/profile", auth, controller.updateProfile);
router.post("/profile/avatar", auth, uploadAvatar.single("avatar"), controller.uploadAvatar);
module.exports = router;
