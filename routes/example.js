const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const roleMiddleware = require("../middlewares/role.middleware");

// protected route khusus super admin
router.get(
  "/superadminonly",
  authMiddleware,
  roleMiddleware(["superadmin"]),
  (req, res) => {
    res.json({
      message: "Welcome Super Admin",
      user: req.user,
    });
  }
);

module.exports = router;
