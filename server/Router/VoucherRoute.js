const express = require("express");
const router = express.Router();
const voucherController = require("../Controllers/VoucherController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router.get("/voucher", voucherController.getListVoucher);

router.post(
  "/voucher/create",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  voucherController.postVoucher
);

router.delete(
  "/voucher/delete/:voucherId",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  voucherController.deleteVoucher
);

router.put(
  "/voucher/update/:voucherId",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  voucherController.updateVoucher
);

module.exports = router;
