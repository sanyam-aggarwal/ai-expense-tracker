const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../uploads/avatars"),
  filename: (req, file, callback) => callback(null, `${req.user.sub}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`),
});

const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callback) => callback(null, ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)),
});

module.exports = uploadAvatar;
