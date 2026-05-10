const express = require("express");
const router = express.Router();
const { sendMessage, clearSession } = require("../Controllers/chatController");

router.post("/", sendMessage);

router.delete("/session/:sessionId", clearSession);

module.exports = router;
