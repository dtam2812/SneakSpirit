const jwt = require("jsonwebtoken");
const productModel = require("../Models/ProductModel");

const getListProduct = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).send(products);
  } catch (error) {}
};

const getProductDetail = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    return res.status(200).send(product);
  } catch (error) {}
};

const postProduct = async (req, res) => {
  try {
    const {
      productName,
      price,
      category,
      sizes,
      description,
      quantity,
      images,
    } = req.body;
    await productModel.create({
      productName: productName,
      price: price,
      category: category,
      sizes: sizes,
      description: description,
      quantity: quantity,
      images: images,
    });
    return res.status(200).send("create product successfully");
  } catch (error) {
    console.log(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    await productModel.findByIdAndDelete(productId);
    return res.status(200).send("delete product successfully");
  } catch (error) {}
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updateData = req.body;

    await productModel.findByIdAndUpdate(productId, updateData, { new: true });
    return res.status(200).send("update product successfully");
  } catch (error) {}
};

module.exports = {
  postProduct: postProduct,
  getListProduct: getListProduct,
  deleteProduct: deleteProduct,
  updateProduct: updateProduct,
  getProductDetail: getProductDetail,
};
