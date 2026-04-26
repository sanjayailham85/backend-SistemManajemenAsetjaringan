const express = require("express");
const router = express.Router();
const cctvController = require("../controllers/cctv.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, cctvController.getAllCCTV);
router.get("/:id", authMiddleware, cctvController.getCCTVById);
router.post("/", authMiddleware, cctvController.createCCTV);
router.put("/:id", authMiddleware, cctvController.updateCCTV);
router.delete("/:id", authMiddleware, cctvController.deleteCCTV);

module.exports = router;
