const express = require("express");
const router = express.Router();
const osVersionController = require("../controllers/osVersion.controllers");

router.get("/", osVersionController.getAllOsVersion);
router.get("/:id", osVersionController.getOsVersionById);

router.post("/", osVersionController.createOsVersion);
router.put("/:id", osVersionController.updateOsVersion);

router.delete("/:id", osVersionController.deleteOsVersion);

module.exports = router;
