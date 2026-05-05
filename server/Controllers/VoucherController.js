const jwt = require("jsonwebtoken");
const voucherModel = require("../Models/VoucherModel");

const getListVoucher = async (req, res) => {
  try {
    const vouchers = await voucherModel.find();
    return res.status(200).send(vouchers);
  } catch (error) {}
};

const postVoucher = async (req, res) => {
  try {
    const {
      voucherName,
      type,
      discountType,
      discount,
      maximumDiscount,
      appliedFor,
      pic,
    } = req.body;

    await voucherModel.create({
      voucherName: voucherName,
      type: type,
      discountType: discountType,
      discount: discount,
      maximumDiscount: maximumDiscount,
      appliedFor: appliedFor,
      pic: pic,
    });
    return res.status(200).send("create voucher successfully");
  } catch (error) {}
};

const deleteVoucher = async (req, res) => {
  try {
    const voucherId = req.params.voucherId;

    await voucherModel.findByIdAndDelete(voucherId);
    return res.status(200).send("delete voucher successfully");
  } catch (error) {}
};

const updateVoucher = async (req, res) => {
  try {
    const voucherId = req.params.voucherId;
    const updateData = req.body;

    await voucherModel.findByIdAndUpdate(voucherId, updateData, { new: true });
    return res.status(200).send("update voucher successfully");
  } catch (error) {}
};

module.exports = {
  getListVoucher: getListVoucher,
  postVoucher: postVoucher,
  deleteVoucher: deleteVoucher,
  updateVoucher: updateVoucher,
};
