const express = require("express");
const router = express.Router();
const CCTVMerkController = require("../controllers/cctvMerk.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, CCTVMerkController.getAll);
router.get("/:id", authMiddleware, CCTVMerkController.getById);

router.post("/", authMiddleware, CCTVMerkController.create);
router.put("/:id", authMiddleware, CCTVMerkController.update);

router.delete("/:id", authMiddleware, CCTVMerkController.deleteCCTVMerk);

module.exports = router;
