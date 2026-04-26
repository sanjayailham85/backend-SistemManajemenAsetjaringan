const express = require("express");
const router = express.Router();
const accessPointController = require("../controllers/accessPoint.controllers");

router.get("/", accessPointController.getAllAccessPoint);
router.get("/:id", accessPointController.getAccessPointById);
router.post("/", accessPointController.createAccessPoint);
router.put("/:id", accessPointController.updateAccessPoint);
router.delete("/:id", accessPointController.deleteAccessPoint);

module.exports = router;
