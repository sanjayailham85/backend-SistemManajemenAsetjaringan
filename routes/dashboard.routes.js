const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/dashboard.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, getDashboardSummary);

module.exports = router;
