const express = require("express");
const router = express.Router();
const { turn, connect } = require("../controllers/controller");

router.post("/turn", turn);
router.post("/connect", connect);

module.exports = router;
