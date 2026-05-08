import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

const QuickBuy = ({
  product,
  selectedSize,
  setSelectedSize,
  setBuyingQuantity,
  buyingQuantity,
  handlePlus,
  handleMinus,
  handleAddingToCart,
}) => {
  return (
    <div className="hidden border lg:flex justify-between items-center my-5">
      <div className="w-1/2 p-3 flex items-center">
        <img src={product.images[0]} className="h-32" />
        <div className="font-semibold text-left px-3">
          <h3 className="text-2xl py-2">{product.productName}</h3>
          <h4 className="text-xl text-red-500">
            {product.price.toLocaleString("vi-VN")}đ
          </h4>
        </div>
      </div>
      <div className="flex items-center px-3">
        <p className="px-2">Số lượng:</p>
        {product.category !== "Khác" && (
          <select
            className="border px-2 py-1 rounded"
            value={selectedSize}
            onChange={(e) => {
              setSelectedSize(e.target.value);
              setBuyingQuantity(1);
            }}
          >
            <option value="" disabled hidden>
              Chọn size
            </option>
            {SIZE_KEYS.map((size) => (
              <option key={size} value={size} disabled={!product.sizes?.[size]}>
                {SIZE_LABELS[size]}
              </option>
            ))}
          </select>
        )}
        <div className="flex space-x-4 items-center">
          <div className="mx-3 w-20 h-10 border border-[#919191] flex justify-around items-center rounded-lg">
            <FontAwesomeIcon
              icon={faMinus}
              className="cursor-pointer"
              onClick={handleMinus}
            />
            <p>{buyingQuantity}</p>
            <FontAwesomeIcon
              icon={faPlus}
              className="cursor-pointer"
              onClick={handlePlus}
            />
          </div>
          <button
            onClick={handleAddingToCart}
            className="border border-[#919191] h-14 px-3 rounded-lg text-[#919191] text-xl font-bold hover:text-white hover:bg-[#919191] transition-colors"
          >
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickBuy;
