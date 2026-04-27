const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/dashboard.controllers");

router.get("/", getDashboardSummary);

module.exports = router;
