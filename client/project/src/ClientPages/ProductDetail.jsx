/* eslint-disable react/prop-types */
import {
  faChevronRight,
  faMinus,
  faPlus,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { VoucherContext } from "../Context/GetListVoucher";
import QuickBuy from "../components/QuickBuy";
import { SideVoucherContext } from "../Context/SideVoucher";
import { billContext } from "../Context/Bill";
import Breadcrumb from "../components/Breadcrumb";

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

const TAB_KEYS = [
  "description",
  "specifications",
  "careInstructions",
  "storageInstructions",
];
const TAB_LABELS = {
  description: "Mô tả",
  specifications: "Thông số kỹ thuật",
  careInstructions: "Hướng dẫn bảo quản",
  storageInstructions: "Hướng dẫn lưu trữ",
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [buyingQuantity, setBuyingQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const { setIsOpenVoucher } = useContext(SideVoucherContext);
  const { listVoucher } = useContext(VoucherContext);
  const { setBill } = useContext(billContext);
  const { cartList, setCartList } = useOutletContext();

  useEffect(() => {
    const getProductDetail = async () => {
      try {
        const response = await axios.get(`/auth/admin/product/${id}`);
        setProduct(response.data);
        setSelectedSize("");
        setBuyingQuantity(1);
      } catch (error) {
        console.log(error);
      }
    };
    getProductDetail();
  }, [id]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 bg-gray-900 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Số lượng còn lại theo size đang chọn
  const stockOfSelected = selectedSize
    ? (product.sizes?.[selectedSize] ?? 0)
    : null;
  const isOutOfStock = selectedSize && stockOfSelected === 0;
  const hasStandardSizes = product.category !== "Khác";

  const handlePlus = () => {
    if (!selectedSize) return;
    setBuyingQuantity((prev) => Math.min(prev + 1, stockOfSelected));
  };

  const handleMinus = () => {
    setBuyingQuantity((prev) => Math.max(prev - 1, 1));
  };

  const buildCartItem = () => ({
    id: product._id,
    name: product.productName,
    brand: product.brand,
    price: product.price,
    category: product.category,
    size: hasStandardSizes ? selectedSize : undefined,
    quantity: buyingQuantity,
    image: product.images[0],
  });

  const handleAddingToCart = () => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    if (hasStandardSizes && !selectedSize) {
      alert("Vui lòng chọn size trước khi thêm vào giỏ hàng.");
      return;
    }

    const newCart = [...cartList];
    const existingIndex = newCart.findIndex((el) =>
      hasStandardSizes
        ? el.id === product._id && el.size === selectedSize
        : el.id === product._id,
    );
    if (existingIndex !== -1) newCart[existingIndex].quantity += buyingQuantity;
    else newCart.push(buildCartItem());

    setCartList(newCart);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
    setSelectedSize("");
    setBuyingQuantity(1);
  };

  const handleBuyNow = () => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    if (hasStandardSizes && !selectedSize) {
      alert("Vui lòng chọn size trước khi mua.");
      return;
    }

    const newCart = [...cartList];
    const existingIndex = newCart.findIndex((el) =>
      hasStandardSizes
        ? el.id === product._id && el.size === selectedSize
        : el.id === product._id,
    );
    if (existingIndex !== -1) newCart[existingIndex].quantity += buyingQuantity;
    else newCart.push(buildCartItem());

    setCartList(newCart);
    setSelectedSize("");
    setBuyingQuantity(1);

    const billPrice = newCart.reduce((t, el) => t + el.price * el.quantity, 0);
    const count = newCart.reduce((t, el) => t + el.quantity, 0);
    const fee = count <= 5 ? 25000 : count < 10 ? 50000 : 100000;

    setBill({
      price: billPrice,
      shippingFee: fee,
      priceDiscount: 0,
      shippingFeeDiscount: 0,
      total: billPrice + fee,
    });
    navigate("/checkOut");
  };

  return (
    <div>
      <Breadcrumb
        first="Sản phẩm"
        second={product.productName}
        secondLink="/collection"
      />
      <div className="container">
        <div className="mx-auto px-4 py-8">
          {/*  ảnh + info */}
          <div className="flex flex-wrap items-center -mx-4 border-b-2 border-dashed pb-10">
            {/* Ảnh sản phẩm */}
            <div className="lg:w-1/2 mb-8 sm:flex ">
              <div className="lg:w-full px-6 sm:w-3/4 ">
                <img
                  className="w-full h-auto rounded-xl shadow-md mb-4 object-cover aspect-square"
                  src={product.images[selectedImage]}
                  alt={product.productName}
                />
              </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="w-full  lg:w-1/2 px-3 text-left">
              {/* Brand & tên */}
              <p className="text-xl tracking-widest text-gray-400 uppercase font-semibold mb-1">
                {product.brand}
              </p>
              <h2 className="text-3xl font-black text-gray-900 mb-3 leading-tight">
                {product.productName}
              </h2>
              <p className="text-xl text-gray-500 mb-1 capitalize">
                {product.category}
              </p>

              {/* Giá */}
              <div className="flex items-baseline gap-5 mb-5">
                <span className="text-4xl text-red-500 font-black">
                  {product.price.toLocaleString("vi-VN")}₫
                </span>
                <span className="text-2xl text-black font-black line-through">
                  {(product.price + 1800000).toLocaleString("vi-VN")}₫
                </span>
              </div>

              {/* Voucher */}
              <div className="my-5 flex gap-x-3 items-center">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Mã giảm giá
                </h3>
                <div
                  onClick={() => setIsOpenVoucher(true)}
                  className="flex gap-x-2 items-center cursor-pointer flex-wrap"
                >
                  {listVoucher.map((el, i) => (
                    <p
                      key={i}
                      className="p-2 px-3 border border-red-400 rounded-lg text-red-500 text-sm font-medium"
                    >
                      {el.voucherName}
                    </p>
                  ))}
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-lg text-red-400"
                  />
                </div>
              </div>

              {/* Size selector */}
              {hasStandardSizes && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-700">
                      Size{" "}
                      {selectedSize ? (
                        <span className="text-gray-900 font-black">
                          — {SIZE_LABELS[selectedSize]}
                        </span>
                      ) : (
                        ""
                      )}
                    </h3>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {SIZE_KEYS.map((size) => {
                      const stock = product.sizes?.[size] ?? 0;
                      const isSelected = selectedSize === size;
                      const soldOut = stock === 0;
                      return (
                        <button
                          key={size}
                          disabled={soldOut}
                          onClick={() => {
                            setSelectedSize(size);
                            setBuyingQuantity(1);
                          }}
                          className={`relative py-2.5 border-2 rounded-lg text-sm font-semibold transition-all
                            ${
                              isSelected
                                ? "border-gray-900 bg-gray-900 text-white"
                                : soldOut
                                  ? "border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50 line-through"
                                  : "border-gray-300 text-gray-700 hover:border-gray-700"
                            }`}
                        >
                          {SIZE_LABELS[size]}
                          {!soldOut && (
                            <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                              {stock > 9 ? "9+" : stock}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSize && (
                    <p className="text-lg text-gray-500 mt-2">
                      Còn lại:{" "}
                      <span
                        className={`font-semibold ${stockOfSelected === 0 ? "text-red-500" : "text-green-600"}`}
                      >
                        {stockOfSelected} đôi
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Quantity + Add to cart */}
              {!isOutOfStock ? (
                <>
                  <div className="flex space-x-3 mb-3">
                    <div className="w-1/5 h-14 border-2 border-gray-300 flex justify-around items-center rounded-lg">
                      <button
                        onClick={handleMinus}
                        className="px-2 py-1 text-gray-600 hover:text-black"
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <span className="font-bold">{buyingQuantity}</span>
                      <button
                        onClick={handlePlus}
                        className="px-2 py-1 text-gray-600 hover:text-black"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>
                    <button
                      onClick={handleAddingToCart}
                      className="w-4/5 h-14 border-2 border-gray-800 rounded-lg font-bold text-gray-800 hover:bg-gray-800 hover:text-white transition-all"
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                  <button
                    onClick={handleBuyNow}
                    className="w-full h-14 bg-gray-900 text-white rounded-lg font-bold text-lg hover:bg-gray-700 transition-all mb-4"
                  >
                    Mua ngay
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full h-14 border-2 border-gray-200 rounded-lg text-gray-400 font-bold text-lg bg-gray-50 cursor-not-allowed mb-4"
                >
                  Size này đã hết hàng
                </button>
              )}

              {/* Hotline & ship */}
              <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-600 border-t pt-4 gap-2">
                <p>
                  Gọi đặt mua{" "}
                  <a
                    href="tel:0383300680"
                    className="text-blue-500 font-semibold"
                  >
                    0383300680
                  </a>{" "}
                  (8:30 – 20:00)
                </p>
                <p>
                  <FontAwesomeIcon
                    icon={faTruckFast}
                    className="text-red-500 mr-1"
                  />
                  Giao hàng toàn quốc
                </p>
              </div>
            </div>
          </div>

          {/* ── Tabs mô tả / thông số ── */}
          <div className="mt-10">
            {/* Tab headers */}
            <div className="flex gap-0 border-b border-gray-200 overflow-x-auto">
              {TAB_KEYS.filter((key) => product[key]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-5 py-3 text-2xl font-semibold whitespace-nowrap border-b-2 transition-all
                    ${
                      activeTab === key
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-400 hover:text-gray-700"
                    }`}
                >
                  {TAB_LABELS[key]}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="py-6 text-left text-black leading-relaxed whitespace-pre-line text-lg">
              {product[activeTab] || (
                <span className="text-gray-400 italic">Chưa có thông tin.</span>
              )}
            </div>
          </div>

          {/* Quick buy bar */}
          <QuickBuy
            product={product}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            setBuyingQuantity={setBuyingQuantity}
            buyingQuantity={buyingQuantity}
            handlePlus={handlePlus}
            handleMinus={handleMinus}
            handleAddingToCart={handleAddingToCart}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
