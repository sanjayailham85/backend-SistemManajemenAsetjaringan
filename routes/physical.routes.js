const express = require("express");
const router = express.Router();
const physicalController = require("../controllers/physical.controllers");
const upload = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, physicalController.getAllPhysical);
router.get("/:id", authMiddleware, physicalController.getPhysicalById);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  physicalController.createPhysical
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  physicalController.updatePhysical
);

router.delete("/:id", authMiddleware, physicalController.deletePhysical);

module.exports = router;
