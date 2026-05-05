const jwt = require("jsonwebtoken");
const orderModel = require("../Models/OrderModel");

const getListOrder = async (req, res) => {
  try {
    const orders = await orderModel.find();
    return res.status(200).send(orders);
  } catch (error) {}
};

const getOrderDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findById(id);
    return res.status(200).send(order);
  } catch (error) {
    console.log(error);
  }
};

const getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const orders = await orderModel
      .find({ user: id })
      .populate("orderItems.product");
    return res.status(200).send(orders);
  } catch (error) {
    console.log(error);
  }
};

const postOrder = async (req, res) => {
  try {
    const {
      user,
      orderItems,
      shippingAddress,
      note,
      orderTime,
      paymentMethod,
      totalPrice,
    } = req.body;
    await orderModel.create({
      user: user,
      orderItems: orderItems,
      shippingAddress: shippingAddress,
      note: note,
      orderTime: orderTime,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
    });
    return res.status(200).send("create order successfully");
  } catch (error) {
    console.log(error);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    await orderModel.findByIdAndDelete(orderId);
    return res.status(200).send("delete order successfully");
  } catch (error) {}
};

module.exports = {
  getListOrder: getListOrder,
  postOrder: postOrder,
  deleteOrder: deleteOrder,
  getOrderDetail: getOrderDetail,
  getUserOrders: getUserOrders,
};
