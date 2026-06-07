const express = require("express");
const router = express.Router();
const routerController = require("../controllers/router.controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.get("/", authMiddleware, routerController.getAllRouter);
router.get("/:id", authMiddleware, routerController.getRouterById);
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  routerController.createRouter
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  routerController.updateRouter
);
router.delete("/:id", authMiddleware, routerController.deleteRouter);

module.exports = router;
