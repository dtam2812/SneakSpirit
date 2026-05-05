const express = require("express");
const router = express.Router();
const userController = require("../Controllers/UserController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router.get(
  "/user",
  [authMiddleware.isAuthentication],
  userController.getListUser
);
router.post(
  "/user/create",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  userController.postUser
);

router.delete(
  "/user/delete/:userId",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  userController.deleteUser
);

router.get(
  "/user/:id",
  [authMiddleware.isAuthentication],
  userController.getUserDetail
);

router.put(
  "/user/update_password/:id",
  [authMiddleware.isAuthentication],
  userController.updateUserPassword
);

module.exports = router;
