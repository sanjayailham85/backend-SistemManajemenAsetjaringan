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

router.get("/", guestController.getAllGuest);
// router.get(
//   "/",
//   authMiddleware,
//   roleMiddleware(["superadmin", "admin", "operator", "guest"]),
//   guestController.getAllGuest
// );

router.get("/:id", guestController.getGuestById);

router.post("/", guestController.createGuest);

router.put("/:id", guestController.updateGuest);

router.delete("/:id", guestController.deleteGuest);

module.exports = router;
