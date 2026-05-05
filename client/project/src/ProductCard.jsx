/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const ProductCard = ({ id, productName, brand, pic1, price }) => {
  return (
    <Link to={`/product/${id}`} className="group block h-full">
      <div className="shadow-lg rounded-lg flex flex-col h-full bg-white overflow-hidden">
        <div className="relative overflow-hidden bg-[#f5f5f3] aspect-square">
          <img
            src={pic1}
            alt={productName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Xem nhanh */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <span className="bg-white text-black text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              Xem nhanh
            </span>
          </div>
        </div>

        <div className="px-4 py-4 flex flex-col flex-grow">
          {brand && (
            <p className="text-md text-gray-400 uppercase tracking-[0.2em] font-bold mb-1">
              {brand}
            </p>
          )}

          <p className="font-semibold text-start text-lg text-gray-900 leading-tight line-clamp-2 group-hover:text-red-600 transition-colors mb-2 min-h-[2.5rem]">
            {productName}
          </p>

          <div className="text-end mt-auto pt-2 border-t border-gray-50">
            <p className="text-gray-400 font-medium text-lg line-through">
              {(price + 1800000).toLocaleString("vi-VN")}₫
            </p>
            <p className="text-red-500 font-bold text-xl">
              {price.toLocaleString("vi-VN")}₫
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
