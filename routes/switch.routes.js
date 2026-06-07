const express = require("express");
const router = express.Router();
const switchController = require("../controllers/switch.controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.get("/", authMiddleware, switchController.getAllSwitch);
router.get("/:id", authMiddleware, switchController.getSwitchById);
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  switchController.createSwitch
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  switchController.updateSwitch
);
router.delete("/:id", authMiddleware, switchController.deleteSwitch);

module.exports = router;
