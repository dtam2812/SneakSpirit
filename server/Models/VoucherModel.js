const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  voucherName: {
    type: String,
    unique: true,
  },
  type: String,
  discountType: String,
  discount: Number,
  maximumDiscount: Number,
  appliedFor: Number,
});

const Voucher = mongoose.model("Voucher", voucherSchema);
module.exports = Voucher;
