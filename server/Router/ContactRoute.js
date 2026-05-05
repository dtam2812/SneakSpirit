const express = require("express");
const router = express.Router();
const contactController = require("../Controllers/ContactController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router.get(
  "/contact",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  contactController.getListContact
);

router.post(
  "/contact/create",
  [authMiddleware.isAuthentication],
  contactController.postContact
);

router.delete(
  "/contact/delete/:contactId",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  contactController.deleteContact
);

module.exports = router;
