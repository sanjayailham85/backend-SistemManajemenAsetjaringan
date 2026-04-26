const express = require("express");
const router = express.Router();

const {
  getAllDevicesMonitoring,
} = require("../controllers/deviceMonitoring.controllers");

router.get("/", getAllDevicesMonitoring);

module.exports = router;
