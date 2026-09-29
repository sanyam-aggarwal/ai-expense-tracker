const express = require("express");
const authenticate = require("../middlewares/authenticate");
const { getSummary } = require("../controllers/analyticsController");

const router = express.Router();
router.get("/summary", authenticate, getSummary);

module.exports = router;
