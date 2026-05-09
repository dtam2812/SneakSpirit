const productModel = require("../Models/ProductModel");

const getListProduct = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

const getProductDetail = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (!product) return res.status(404).send("Product not found");
    return res.status(200).send(product);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

const postProduct = async (req, res) => {
  try {
    const {
      productName,
      brand,
      price,
      originalPrice,
      discountPercent,
      category,
      sizes,
      quantity,
      description,
      specifications,
      careInstructions,
      storageInstructions,
      images,
    } = req.body;

    await productModel.create({
      productName,
      brand,
      price,
      originalPrice: originalPrice ?? null,
      discountPercent: discountPercent ?? 0,
      category,
      sizes,
      quantity: quantity ?? 0,
      description,
      specifications,
      careInstructions,
      storageInstructions,
      images,
    });

    return res.status(200).send("create product successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    await productModel.findByIdAndDelete(productId);
    return res.status(200).send("delete product successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;

    const updateData = {};
    const fields = [
      "productName",
      "brand",
      "price",
      "originalPrice",
      "discountPercent",
      "category",
      "sizes",
      "quantity",
      "description",
      "specifications",
      "careInstructions",
      "storageInstructions",
      "images",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    await productModel.findByIdAndUpdate(productId, updateData, { new: true });
    return res.status(200).send("update product successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};

module.exports = {
  postProduct,
  getListProduct,
  deleteProduct,
  updateProduct,
  getProductDetail,
};
