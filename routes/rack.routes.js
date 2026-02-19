const express = require("express");
const router = express.Router();
const rackController = require("../controllers/rack.controllers");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/", rackController.getAllRacks);

router.get("/:id", rackController.getRackById);

router.post("/", rackController.createRack);

router.put("/:id", rackController.updateRack);

router.delete("/:id", rackController.deleteRack);

module.exports = router;
