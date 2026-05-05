/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "axios";
import removeAccents from "remove-accents";

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

const ProductTable = ({
  listProduct,
  setIsEditing,
  setCurrentProduct,
  searchingValue,
  searched,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSizes, setSelectedSizes] = useState({});
  const itemsPerPage = 5;

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`auth/admin/product/delete/${productId}`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Unauthorized request");
      }
    }
  };

  const handleChangeSize = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const filteredProducts = searched
    ? listProduct.filter((element) => {
        const productName = removeAccents(element.productName.toLowerCase());
        const searchValue = removeAccents(searchingValue.toLowerCase());
        return searchValue === "" ? true : productName.includes(searchValue);
      })
    : listProduct;

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const renderRow = (element, index) => {
    const currentSize = selectedSizes[element._id] || "US8";
    const hasStandardSizes = element.category !== "Khác";
    const stockQty = hasStandardSizes
      ? (element.sizes?.[currentSize] ?? 0)
      : element.quantity;

    return (
      <tr className="border-b dark:border-neutral-500" key={element._id}>
        <td className="whitespace-nowrap px-6 py-4 font-medium">
          {startIndex + index + 1}
        </td>

        <td className="px-6 py-4">
          <div className="font-medium">{element.productName}</div>
          <div className="text-xs text-gray-500">{element.brand}</div>
        </td>

        <td className="whitespace-nowrap px-6 py-4">{element.category}</td>

        {/* Size selector */}
        <td className="whitespace-nowrap px-6 py-4">
          {hasStandardSizes ? (
            <select
              className="border px-2 py-1 rounded text-sm"
              value={currentSize}
              onChange={(e) => handleChangeSize(element._id, e.target.value)}
            >
              {SIZE_KEYS.map((key) => (
                <option key={key} value={key}>
                  {SIZE_LABELS[key]}
                </option>
              ))}
            </select>
          ) : (
            "—"
          )}
        </td>

        {/* Giá */}
        <td className="whitespace-nowrap px-6 py-4">
          <div>{element.price.toLocaleString("vi-VN")} ₫</div>
          {element.discountPercent > 0 && (
            <div className="text-xs text-red-500">
              -{element.discountPercent}%
            </div>
          )}
        </td>

        {/* Số lượng */}
        <td className="whitespace-nowrap px-6 py-4">
          <span className={stockQty === 0 ? "text-red-500 font-semibold" : ""}>
            {stockQty}
          </span>
        </td>

        {/* Hành động */}
        <td className="whitespace-nowrap px-6 py-4 flex">
          <button
            onClick={() => {
              setIsEditing(true);
              setCurrentProduct(element);
            }}
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            Sửa
          </button>
          <button
            onClick={() => handleDelete(element._id)}
            className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            Xóa
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Tên sản phẩm</th>
                  <th className="px-6 py-4">Loại</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Giá</th>
                  <th className="px-6 py-4">Số lượng</th>
                  <th className="px-6 py-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  currentProducts.map((element, index) =>
                    renderRow(element, index),
                  )
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      Không có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="mx-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-4 py-2">
                {currentPage} / {totalPages || 1}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="mx-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
