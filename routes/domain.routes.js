const express = require("express");
const router = express.Router();

const domainController = require("../controllers/domain.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, domainController.getAll);
router.get("/:id", authMiddleware, domainController.getById);

router.post("/", authMiddleware, domainController.create);
router.put("/:id", authMiddleware, domainController.update);
router.delete("/:id", authMiddleware, domainController.deleteDomain);

module.exports = router;
