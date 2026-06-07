const express = require("express");
const router = express.Router();
const SwitchMerkController = require("../controllers/switchMerk.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, SwitchMerkController.getAll);
router.get("/:id", authMiddleware, SwitchMerkController.getById);

router.post("/", authMiddleware, SwitchMerkController.create);
router.put("/:id", authMiddleware, SwitchMerkController.update);

router.delete("/:id", authMiddleware, SwitchMerkController.deleteSwitchMerk);

module.exports = router;
