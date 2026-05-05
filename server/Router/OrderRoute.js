const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/OrderController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router.get(
  "/order",
  [authMiddleware.isAuthentication],
  orderController.getListOrder
);

router.post(
  "/order/create",
  [authMiddleware.isAuthentication],
  orderController.postOrder
);

router.delete(
  "/order/delete/:orderId",
  [authMiddleware.isAuthentication],
  orderController.deleteOrder
);

router.get(
  "/order/:id",
  [authMiddleware.isAuthentication],
  orderController.getOrderDetail
);

router.get(
  "/user/:id/orders",
  [authMiddleware.isAuthentication],
  orderController.getUserOrders
);

module.exports = router;
