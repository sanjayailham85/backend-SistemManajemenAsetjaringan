const express = require("express");
const router = express.Router();
const SwitchController = require("../controllers/switchController.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, SwitchController.getAll);
router.get("/:id", authMiddleware, SwitchController.getById);

router.post("/", authMiddleware, SwitchController.create);
router.put("/:id", authMiddleware, SwitchController.update);

router.delete("/:id", authMiddleware, SwitchController.deleteSwitchController);

module.exports = router;
