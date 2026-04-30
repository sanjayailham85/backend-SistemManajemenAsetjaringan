const express = require("express");
const router = express.Router();
const CCTVController = require("../controllers/cctvController.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, CCTVController.getAll);
router.get("/:id", authMiddleware, CCTVController.getById);

router.post("/", authMiddleware, CCTVController.create);
router.put("/:id", authMiddleware, CCTVController.update);

router.delete("/:id", authMiddleware, CCTVController.deleteCCTVController);

module.exports = router;
