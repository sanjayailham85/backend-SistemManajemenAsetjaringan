const express = require("express");
const router = express.Router();
const osVersionController = require("../controllers/osVersion.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, osVersionController.getAllOsVersion);
router.get("/:id", authMiddleware, osVersionController.getOsVersionById);

router.post("/", authMiddleware, osVersionController.createOsVersion);
router.put("/:id", authMiddleware, osVersionController.updateOsVersion);

router.delete("/:id", authMiddleware, osVersionController.deleteOsVersion);

module.exports = router;
