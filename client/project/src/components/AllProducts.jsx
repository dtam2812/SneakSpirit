import { useContext, useState } from "react";
import { ProductContext } from "../Context/GetListProduct";
import ProductCard from "../ProductCard";
import Loading from "./Loading";

const ITEMS_PER_PAGE = 10;

const Pagination = ({ currentPage, totalPages, onChange }) => {
  const getPages = () => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = [];
    const showLeft = currentPage > 3;
    const showRight = currentPage < totalPages - 2;

    pages.push(1);
    if (showLeft) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (showRight) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-10 mb-4">
      <button
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ←
      </button>

      {getPages().map((page, i) =>
        page === "..." ? (
          <span
            key={`dot-${i}`}
            className="w-10 h-10 flex items-center justify-center text-black select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`w-10 h-10 rounded-lg text-sm font-semibold border-2 transition-all
              ${
                currentPage === page
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900"
              }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border-2 border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        →
      </button>
    </div>
  );
};

const AllProducts = () => {
  const { listProduct } = useContext(ProductContext);
  const [sortedProduct, setSortedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  if (!listProduct || listProduct.length === 0) {
    return <Loading />;
  }

  const products = sortedProduct ?? listProduct;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginated = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleSort = (e) => {
    const value = e.target.value;
    const copy = [...listProduct];
    if (value === "priceASC")
      setSortedProduct(copy.sort((a, b) => a.price - b.price));
    else if (value === "priceDESC")
      setSortedProduct(copy.sort((a, b) => b.price - a.price));
    else if (value === "latest") setSortedProduct(copy.reverse());
    else setSortedProduct(null);
    setCurrentPage(1);
  };

  return (
    <div className="my-11">
      <div className="w-full mt-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Tất cả sản phẩm</h1>
        <select
          onChange={handleSort}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-48"
        >
          <option value="">Sắp xếp theo</option>
          <option value="priceASC">Giá tăng dần</option>
          <option value="priceDESC">Giá giảm dần</option>
          <option value="latest">Mới nhất</option>
        </select>
      </div>

      <div className="w-full my-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {paginated.map((element) => (
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
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AllProducts;
