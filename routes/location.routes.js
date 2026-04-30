const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location.contoller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, locationController.getAllLocation);
router.get("/:id", authMiddleware, locationController.getLocationById);

router.post("/", authMiddleware, locationController.createLocation);
router.put("/:id", authMiddleware, locationController.updateLocation);

router.delete("/:id", authMiddleware, locationController.deleteLocation);

module.exports = router;
