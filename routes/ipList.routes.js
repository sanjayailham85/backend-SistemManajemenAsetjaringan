const express = require("express");
const router = express.Router();

const ipListController = require("../controllers/ipList.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, ipListController.getAll);
router.get("/:id", authMiddleware, ipListController.getById);

router.post("/", authMiddleware, ipListController.create);
router.put("/:id", authMiddleware, ipListController.update);
router.delete("/:id", authMiddleware, ipListController.deleteIP);

module.exports = router;
