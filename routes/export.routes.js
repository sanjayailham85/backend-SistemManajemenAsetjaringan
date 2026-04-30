const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const exportController = require("../controllers/export.controller");

router.post("/", authMiddleware, exportController.exportModule);

module.exports = router;
