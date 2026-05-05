import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../ProductCard";
import { ProductContext } from "../Context/GetListProduct";

const BRANDS = [
  "Tất cả",
  "Nike",
  "Adidas",
  "Crocs",
  "Puma",
  "Asics",
  "Under Armour",
  "Hoka",
];

const FeaturedProducts = () => {
  const { listProduct } = useContext(ProductContext);
  const [activeBrand, setActiveBrand] = useState("Tất cả");
  const navigate = useNavigate();
  if (!listProduct) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  const featured = listProduct.slice(0, 10);

  const byBrand =
    activeBrand === "Tất cả"
      ? listProduct.slice(0, 10)
      : listProduct
          .filter((p) => p.brand?.toLowerCase() === activeBrand.toLowerCase())
          .slice(0, 10);

  return (
    <section className="my-16 px-2">
      {/*header*/}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-lg text-gray-400 uppercase mb-2">Bộ sưu tập</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            SẢN PHẨM NỔI BẬT
          </h2>
        </div>
        <button
          onClick={() => navigate("/products")}
          className="group flex items-center gap-2 text-sm font-semibold text-gray-900 border-b-2 border-gray-900 pb-0.5 hover:border-red-500 hover:text-red-500 transition-colors self-start sm:self-auto"
        >
          Xem tất cả
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Featured grid  */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-20">
        {featured.map((element) => (
          <ProductCard
            key={element._id}
            id={element._id}
            productName={element.productName}
            brand={element.brand}
            pic1={
              element.images.length > 1 ? element.images[1] : element.images[0]
            }
            price={element.price}
            originalPrice={element.originalPrice}
            discountPercent={element.discountPercent}
          />
        ))}
      </div>

      {/* Lọc thương hiệu  */}
      <div className="border-t border-gray-100 pt-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-lg text-gray-400 uppercase mb-2">Thương hiệu</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              CHỌN THEO HÃNG
            </h2>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="group flex items-center gap-2 text-sm font-semibold text-gray-900 border-b-2 border-gray-900 pb-0.5 hover:border-red-500 hover:text-red-500 transition-colors self-start sm:self-auto"
          >
            Xem tất cả
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Thương hiệu */}
        <div className="flex flex-wrap gap-2 mb-8">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200
                ${
                  activeBrand === brand
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900"
                }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {byBrand.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {byBrand.map((element) => (
              <ProductCard
                key={element._id}
                id={element._id}
                productName={element.productName}
                brand={element.brand}
                pic1={
                  element.images.length > 1
                    ? element.images[1]
                    : element.images[0]
                }
                price={element.price}
                originalPrice={element.originalPrice}
                discountPercent={element.discountPercent}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg
              className="w-12 h-12 mb-4 opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-sm font-medium">
              Chưa có sản phẩm từ hãng <strong>{activeBrand}</strong>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
