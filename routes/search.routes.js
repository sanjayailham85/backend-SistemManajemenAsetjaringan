const express = require("express");
const router = express.Router();

const { searchAll } = require("../controllers/search.controllers");

router.get("/", searchAll);

module.exports = router;
