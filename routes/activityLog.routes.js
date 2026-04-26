const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const activityLog = require("../controllers/activityLog.controllers");

router.get("/recent", authMiddleware, activityLog.getRecent);
router.get("/", authMiddleware, activityLog.getAll);

module.exports = router;
