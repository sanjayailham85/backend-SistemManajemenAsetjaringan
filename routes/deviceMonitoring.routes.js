const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const {
  getAllDevicesMonitoring,
} = require("../controllers/deviceMonitoring.controllers");

router.get("/", authMiddleware, getAllDevicesMonitoring);

module.exports = router;
