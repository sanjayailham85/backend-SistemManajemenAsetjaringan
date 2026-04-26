const express = require("express");
const router = express.Router();
const switchController = require("../controllers/switch.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, switchController.getAllSwitch);
router.get("/:id", authMiddleware, switchController.getSwitchById);
router.post("/", authMiddleware, switchController.createSwitch);
router.put("/:id", authMiddleware, switchController.updateSwitch);
router.delete("/:id", authMiddleware, switchController.deleteSwitch);

module.exports = router;
