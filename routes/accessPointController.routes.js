const express = require("express");
const router = express.Router();
const AccessPointController = require("../controllers/accessPointController.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, AccessPointController.getAll);
router.get("/:id", authMiddleware, AccessPointController.getById);

router.post("/", authMiddleware, AccessPointController.create);
router.put("/:id", authMiddleware, AccessPointController.update);

router.delete(
  "/:id",
  authMiddleware,
  AccessPointController.deleteAccessPointController
);

module.exports = router;
