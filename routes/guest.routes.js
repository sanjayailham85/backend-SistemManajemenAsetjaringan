// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/guest.controllers");

// router.get("/", controller.getAllGuest);
// router.get("/:id", controller.getGuestById);
// router.post("/", controller.createGuest);
// router.put("/:id", controller.updateGuest);
// router.delete("/:id", controller.deleteGuest);

// module.exports = router;

// routes/guestRoutes.js
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
