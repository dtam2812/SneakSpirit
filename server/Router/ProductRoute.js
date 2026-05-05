const express = require("express");
const router = express.Router();
const productController = require("../Controllers/ProductController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router.get("/product", productController.getListProduct);

router.post(
  "/product/create",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  productController.postProduct
);

router.delete(
  "/product/delete/:productId",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  productController.deleteProduct
);

router.put(
  "/product/update/:productId",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  productController.updateProduct
);

router.get("/product/:id", productController.getProductDetail);

module.exports = router;
