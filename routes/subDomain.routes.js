const express = require("express");
const router = express.Router();

const subDomainController = require("../controllers/subDomain.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, subDomainController.getAll);
router.get("/:id", authMiddleware, subDomainController.getById);

router.post("/", authMiddleware, subDomainController.create);
router.put("/:id", authMiddleware, subDomainController.update);
router.delete("/:id", authMiddleware, subDomainController.deleteSubDomain);

module.exports = router;
