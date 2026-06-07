const express = require("express");
const router = express.Router();
const accessPointController = require("../controllers/accessPoint.controllers");
const upload = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, accessPointController.getAllAccessPoint);
router.get("/:id", authMiddleware, accessPointController.getAccessPointById);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  accessPointController.createAccessPoint
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  accessPointController.updateAccessPoint
);
router.delete("/:id", authMiddleware, accessPointController.deleteAccessPoint);

module.exports = router;
