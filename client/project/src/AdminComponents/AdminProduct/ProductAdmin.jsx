/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { PlusOutlined } from "@ant-design/icons";
import ProductTable from "./ProductTable";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../../components/SearchBar";

const SIZE_KEYS = [
  "US6",
  "US6_5",
  "US7",
  "US7_5",
  "US8",
  "US8_5",
  "US9",
  "US9_5",
  "US10",
  "US10_5",
];
const SIZE_LABELS = {
  US6: "US 6",
  US6_5: "US 6.5",
  US7: "US 7",
  US7_5: "US 7.5",
  US8: "US 8",
  US8_5: "US 8.5",
  US9: "US 9",
  US9_5: "US 9.5",
  US10: "US 10",
  US10_5: "US 10.5",
};

const EMPTY_VALUE = {
  idValue: "",
  productName: "",
  brand: "",
  price: 0,
  originalPrice: "",
  discountPercent: 0,
  sizes: {
    US6: 0,
    US6_5: 0,
    US7: 0,
    US7_5: 0,
    US8: 0,
    US8_5: 0,
    US9: 0,
    US9_5: 0,
    US10: 0,
    US10_5: 0,
  },
  Category: "Sneaker",
  quantity: 0,
  description: "",
  specifications: "",
  careInstructions: "",
  storageInstructions: "",
  pic1: "",
  pic2: "",
  pic3: "",
  pic4: "",
};

const ProductAdmin = ({ listProduct, setListProduct }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchingValue, setSearchingValue] = useState("");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searched, setSearched] = useState(false);
  const [value, setValue] = useState(EMPTY_VALUE);
  const [sortedProduct, setSortedProduct] = useState(listProduct);

  useEffect(() => {
    if (isAdding || isEditing) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }

    if (!isAdding && !isEditing) {
      setValue(EMPTY_VALUE);
    }

    if (isEditing && currentProduct) {
      setValue({
        idValue: currentProduct._id || "",
        productName: currentProduct.productName || "",
        brand: currentProduct.brand || "",
        price: currentProduct.price || 0,
        originalPrice: currentProduct.originalPrice ?? "",
        discountPercent: currentProduct.discountPercent || 0,
        sizes: {
          US6: currentProduct.sizes?.US6 || 0,
          US6_5: currentProduct.sizes?.US6_5 || 0,
          US7: currentProduct.sizes?.US7 || 0,
          US7_5: currentProduct.sizes?.US7_5 || 0,
          US8: currentProduct.sizes?.US8 || 0,
          US8_5: currentProduct.sizes?.US8_5 || 0,
          US9: currentProduct.sizes?.US9 || 0,
          US9_5: currentProduct.sizes?.US9_5 || 0,
          US10: currentProduct.sizes?.US10 || 0,
          US10_5: currentProduct.sizes?.US10_5 || 0,
        },
        Category: currentProduct.category || "Sneaker",
        quantity: currentProduct.quantity || 0,
        description: currentProduct.description || "",
        specifications: currentProduct.specifications || "",
        careInstructions: currentProduct.careInstructions || "",
        storageInstructions: currentProduct.storageInstructions || "",
        pic1: currentProduct.images?.[0] || "",
        pic2: currentProduct.images?.[1] || "",
        pic3: currentProduct.images?.[2] || "",
        pic4: currentProduct.images?.[3] || "",
      });
    }
  }, [isAdding, isEditing, currentProduct]);

  const handleChange = (e) => {
    const { id, value: val } = e.target;

    setValue((prev) => {
      if (id.startsWith("size_")) {
        const sizeKey = id.replace("size_", "");
        return { ...prev, sizes: { ...prev.sizes, [sizeKey]: val } };
      }
      return { ...prev, [id]: val };
    });
  };

  const buildPayload = () => ({
    productName: value.productName,
    brand: value.brand,
    price: value.price,
    originalPrice: value.originalPrice === "" ? null : value.originalPrice,
    discountPercent: value.discountPercent,
    sizes: { ...value.sizes },
    quantity: value.quantity,
    description: value.description,
    specifications: value.specifications,
    careInstructions: value.careInstructions,
    storageInstructions: value.storageInstructions,
    category: value.Category,
    images: [value.pic1, value.pic2, value.pic3, value.pic4].filter(Boolean),
  });

  const handleAddProduct = async () => {
    try {
      await axios.post("auth/admin/product/create", buildPayload());
      setValue(EMPTY_VALUE);
      setIsAdding(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProduct = async (productId) => {
    try {
      await axios.put(`auth/admin/product/update/${productId}`, buildPayload());
      setValue(EMPTY_VALUE);
      setIsEditing(false);
    } catch (error) {
      if (error.response?.status === 401) {
        // handle unauthorized
      }
    }
  };

  const handleClose = () => {
    setValue(EMPTY_VALUE);
    setIsAdding(false);
    setIsEditing(false);
    setCurrentProduct(null);
  };

  const sorting = () => {
    const sortingBy = document.getElementById("sort").value;
    const copy = [...listProduct];
    if (sortingBy === "priceASC")
      setSortedProduct(copy.sort((a, b) => a.price - b.price));
    else if (sortingBy === "priceDESC")
      setSortedProduct(copy.sort((a, b) => b.price - a.price));
    else if (sortingBy === "latest") setSortedProduct(copy.reverse());
    else setSortedProduct(copy);
  };

  const inputCls =
    "block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black text-sm";
  const labelCls = "block font-medium text-sm mb-1";

  return (
    <>
      <div className="text-left">
        <h2 className="text-2xl">Quản lý sản phẩm</h2>
        <div className="flex items-center justify-between">
          <div
            onClick={() => setIsAdding(true)}
            className="border border-dashed border-black my-3 cursor-pointer text-center w-48"
          >
            <PlusOutlined className="px-6 py-16 text-5xl" />
          </div>
          <div className="w-2/5">
            <SearchBar
              searchingValue={searchingValue}
              setSearchingValue={setSearchingValue}
              setSearched={setSearched}
              productTable={true}
            />
            <form className="mx-auto w-2/5">
              <select
                onChange={sorting}
                id="sort"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option>Sắp xếp theo</option>
                <option value="priceASC">Giá tăng dần</option>
                <option value="priceDESC">Giá giảm dần</option>
                <option value="latest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </form>
          </div>
        </div>
        <ProductTable
          listProduct={sortedProduct}
          setIsEditing={setIsEditing}
          setCurrentProduct={setCurrentProduct}
          searchingValue={searchingValue}
          searched={searched}
        />
      </div>

      {(isAdding || isEditing) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg w-2/3 max-w-3xl max-h-[90vh] overflow-y-auto p-6 border shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-5">
              {isEditing ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
            </h2>

            <div className="space-y-4 text-left">
              {/* Tên & Brand */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="productName"
                    type="text"
                    value={value.productName}
                    onChange={handleChange}
                    placeholder="Tên sản phẩm"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>
                    Thương hiệu <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="brand"
                    type="text"
                    value={value.brand}
                    onChange={handleChange}
                    placeholder="Nike, Adidas..."
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Loại */}
              <div>
                <label className={labelCls}>
                  Loại <span className="text-red-500">*</span>
                </label>
                <select
                  id="Category"
                  className={inputCls}
                  value={value.Category}
                  onChange={handleChange}
                >
                  <option value="Sneaker">Sneaker</option>
                  <option value="Chạy bộ">Chạy bộ</option>
                  <option value="Đi bộ">Đi bộ</option>
                  <option value="Thể thao">Thể thao</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              {/* Giá */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>
                    Giá bán <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="price"
                    type="number"
                    value={value.price}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Giá gốc</label>
                  <input
                    id="originalPrice"
                    type="number"
                    value={value.originalPrice}
                    onChange={handleChange}
                    placeholder="Không bắt buộc"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Giảm giá (%)</label>
                  <input
                    id="discountPercent"
                    type="number"
                    min="0"
                    max="100"
                    value={value.discountPercent}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Sizes */}
              {value.Category !== "Khác" ? (
                <div>
                  <label className={labelCls}>
                    Số lượng theo size <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {SIZE_KEYS.map((key) => (
                      <div key={key}>
                        <label className="block text-xs text-center font-medium mb-1">
                          {SIZE_LABELS[key]}
                        </label>
                        <input
                          id={`size_${key}`}
                          type="number"
                          min="0"
                          value={value.sizes[key]}
                          onChange={handleChange}
                          className="block w-full border border-gray-300 p-1.5 rounded-md outline-none focus:ring-2 focus:ring-black text-sm text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className={labelCls}>
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="0"
                    value={value.quantity}
                    onChange={handleChange}
                    placeholder="Số lượng"
                    className={inputCls}
                  />
                </div>
              )}

              {/* Mô tả & Thông số */}
              <div>
                <label className={labelCls}>Mô tả</label>
                <textarea
                  id="description"
                  value={value.description}
                  onChange={handleChange}
                  placeholder="Mô tả sản phẩm"
                  rows={3}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Thông số kỹ thuật</label>
                <textarea
                  id="specifications"
                  value={value.specifications}
                  onChange={handleChange}
                  placeholder="Chất liệu, đế giày..."
                  rows={2}
                  className={inputCls}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Hướng dẫn bảo quản</label>
                  <textarea
                    id="careInstructions"
                    value={value.careInstructions}
                    onChange={handleChange}
                    placeholder="Hướng dẫn vệ sinh..."
                    rows={2}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Hướng dẫn lưu trữ</label>
                  <textarea
                    id="storageInstructions"
                    value={value.storageInstructions}
                    onChange={handleChange}
                    placeholder="Nơi cất giữ..."
                    rows={2}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Hình ảnh */}
              <div>
                <label className={labelCls}>
                  Hình ảnh (URL) <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n}>
                      <label className="block text-xs font-medium mb-1">
                        Hình {n}
                      </label>
                      <input
                        id={`pic${n}`}
                        type="text"
                        value={value[`pic${n}`]}
                        onChange={handleChange}
                        placeholder={`URL hình ${n}`}
                        className={inputCls}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-around mt-6 gap-x-2">
              <button
                onClick={handleClose}
                className="border border-gray-800 w-1/2 hover:bg-gray-800 hover:text-white transition-colors py-2 px-6 rounded-lg"
              >
                Đóng
              </button>
              {isEditing ? (
                <button
                  onClick={() => handleUpdateProduct(value.idValue)}
                  className="border border-gray-800 w-1/2 bg-black text-white hover:bg-gray-700 transition-colors py-2 px-6 rounded-lg"
                >
                  Cập nhật
                </button>
              ) : (
                <button
                  onClick={handleAddProduct}
                  className="border border-gray-800 w-1/2 bg-black text-white hover:bg-gray-700 transition-colors py-2 px-6 rounded-lg"
                >
                  Chấp nhận
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductAdmin;
