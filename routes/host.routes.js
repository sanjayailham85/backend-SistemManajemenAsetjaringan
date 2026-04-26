const express = require("express");
const router = express.Router();
const hostController = require("../controllers/host.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, hostController.getAllHost);
router.get("/:id", authMiddleware, hostController.getHostById);
router.post("/", authMiddleware, hostController.createHost);
router.put("/:id", authMiddleware, hostController.updateHost);
router.delete("/:id", authMiddleware, hostController.deleteHost);

module.exports = router;
