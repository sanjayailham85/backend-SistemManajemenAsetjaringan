const express = require("express");
const router = express.Router();
const rackController = require("../controllers/rack.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, rackController.getAllRacks);

router.get("/:id", authMiddleware, rackController.getRackById);

router.post("/", authMiddleware, rackController.createRack);

router.put("/:id", authMiddleware, rackController.updateRack);

router.delete("/:id", authMiddleware, rackController.deleteRack);

module.exports = router;
