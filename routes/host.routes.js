const express = require("express");
const router = express.Router();
const hostController = require("../controllers/host.controllers");

router.get("/", hostController.getAllHost);
router.get("/:id", hostController.getHostById);
router.post("/", hostController.createHost);
router.put("/:id", hostController.updateHost);
router.delete("/:id", hostController.deleteHost);

module.exports = router;
