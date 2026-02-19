const express = require("express");
const router = express.Router();
const { getDashboardStat } = require("../controllers/dashboard.controllers");

router.get("/stats", getDashboardStat);

module.exports = router;
