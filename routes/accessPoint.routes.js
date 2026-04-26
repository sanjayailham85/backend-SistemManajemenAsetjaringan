const express = require("express");
const router = express.Router();

const accessPointController = require("../controllers/accessPoint.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

// PUBLIC (boleh tanpa login kalau memang dibutuhkan)
router.get("/", accessPointController.getAllAccessPoint);
router.get("/:id", accessPointController.getAccessPointById);

// PROTECTED (WAJIB LOGIN untuk perubahan data)
router.post("/", authMiddleware, accessPointController.createAccessPoint);
router.put("/:id", authMiddleware, accessPointController.updateAccessPoint);
router.delete("/:id", authMiddleware, accessPointController.deleteAccessPoint);

module.exports = router;
