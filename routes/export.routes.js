const express = require("express");
const router = express.Router();

const exportController = require("../controllers/export.controller");

router.post("/", exportController.exportModule);

module.exports = router;
