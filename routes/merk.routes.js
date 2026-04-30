const express = require("express");
const router = express.Router();
const merkController = require("../controllers/merk.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, merkController.getAllMerk);
router.get("/:id", authMiddleware, merkController.getMerkById);

router.post("/", authMiddleware, merkController.createMerk);
router.put("/:id", authMiddleware, merkController.updateMerk);

router.delete("/:id", authMiddleware, merkController.deleteMerk);

module.exports = router;
