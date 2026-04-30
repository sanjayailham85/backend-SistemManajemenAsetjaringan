const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");

const { searchAll } = require("../controllers/search.controllers");

router.get("/", authMiddleware, searchAll);

module.exports = router;
