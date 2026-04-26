const express = require("express");
const router = express.Router();
const switchController = require("../controllers/switch.controllers");

router.get("/", switchController.getAllSwitch);
router.get("/:id", switchController.getSwitchById);
router.post("/", switchController.createSwitch);
router.put("/:id", switchController.updateSwitch);
router.delete("/:id", switchController.deleteSwitch);

module.exports = router;
