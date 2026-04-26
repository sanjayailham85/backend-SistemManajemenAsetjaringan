const express = require("express");
const router = express.Router();
const routerController = require("../controllers/router.controllers");

router.get("/", routerController.getAllRouter);
router.get("/:id", routerController.getRouterById);
router.post("/", routerController.createRouter);
router.put("/:id", routerController.updateRouter);
router.delete("/:id", routerController.deleteRouter);

module.exports = router;
