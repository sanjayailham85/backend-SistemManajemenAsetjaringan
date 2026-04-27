const express = require("express");
const router = express.Router();
const guestController = require("../controllers/guest.controllers");
const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

router.get("/", authMiddleware, guestController.getAllGuest);

router.get("/:id", authMiddleware, guestController.getGuestById);

router.post("/", authMiddleware, guestController.createGuest);

router.put("/:id", authMiddleware, guestController.updateGuest);

router.delete("/:id", authMiddleware, guestController.deleteGuest);

module.exports = router;
