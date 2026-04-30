const express = require("express");
const router = express.Router();
const AccessPointMerkController = require("../controllers/accessPointMerk.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, AccessPointMerkController.getAll);
router.get("/:id", authMiddleware, AccessPointMerkController.getById);

router.post("/", authMiddleware, AccessPointMerkController.create);
router.put("/:id", authMiddleware, AccessPointMerkController.update);

router.delete(
  "/:id",
  authMiddleware,
  AccessPointMerkController.deleteAccessPointMerk
);

module.exports = router;
