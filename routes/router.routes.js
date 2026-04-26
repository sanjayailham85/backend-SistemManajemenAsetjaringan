const express = require("express");
const router = express.Router();
const routerController = require("../controllers/router.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, routerController.getAllRouter);
router.get("/:id", authMiddleware, routerController.getRouterById);
router.post("/", authMiddleware, routerController.createRouter);
router.put("/:id", authMiddleware, routerController.updateRouter);
router.delete("/:id", authMiddleware, routerController.deleteRouter);

module.exports = router;
