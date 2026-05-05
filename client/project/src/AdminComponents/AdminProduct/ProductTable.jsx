/* eslint-disable react/prop-types */
import { useState } from 'react';
import axios from 'axios';
import removeAccents from 'remove-accents'

const ProductTable = ({ listProduct, setIsEditing, setCurrentProduct, searchingValue, searched }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSizes, setSelectedSizes] = useState({});
  const itemsPerPage = 5;

  //Xóa sản phẩm
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`auth/admin/product/delete/${productId}`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Unauthorized request");
      }
    }
  };

  //Thay đổi size
  const handleChangeSize = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const totalPages = Math.ceil(listProduct.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = listProduct.slice(startIndex, startIndex + itemsPerPage);

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
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4">Giá</th>
                  <th className="px-6 py-4">Số lượng</th>
                  <th className="px-6 py-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.length > 0 ? (
                  searched === true ? (
                    currentProducts.filter((element) => {
                      const productName = removeAccents(element.productName.toLowerCase());
                      const searchValue = removeAccents(searchingValue.toLowerCase());

                      return searchValue === '' ? element : productName.includes(searchValue);
                    })
                      .map((element, index) => {
                        const currentSize = selectedSizes[element._id] || 'S';

                        return (
                          <tr className="border-b dark:border-neutral-500" key={element._id}>
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {startIndex + index + 1}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">{element.productName}</td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.category !== 'Khác' ? (
                                <select
                                  id="size"
                                  className="border px-2 py-1 rounded"
                                  value={currentSize}
                                  onChange={(e) => handleChangeSize(element._id, e.target.value)}
                                >
                                  <option value="S">S</option>
                                  <option value="M">M</option>
                                  <option value="L">L</option>
                                  <option value="XL">XL</option>
                                </select>
                              ) : (
                                ''
                              )}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">{element.price.toLocaleString('vi-VN')}</td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.category !== 'Khác'
                                ? element.sizes?.[currentSize]
                                : element.quantity}
                            </td>
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
                      })
                  ) : (
                    currentProducts.map((element, index) => {
                      const currentSize = selectedSizes[element._id] || 'S';

                      return (
                        <tr className="border-b dark:border-neutral-500" key={element._id}>
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {startIndex + index + 1}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">{element.productName}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.category !== 'Khác' ? (
                              <select
                                id="size"
                                className="border px-2 py-1 rounded"
                                value={currentSize}
                                onChange={(e) => handleChangeSize(element._id, e.target.value)}
                              >
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                              </select>
                            ) : (
                              ''
                            )}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">{element.price.toLocaleString('vi-VN')}</td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.category !== 'Khác'
                              ? element.sizes?.[currentSize]
                              : element.quantity}
                          </td>
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
                    })
                  )
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
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
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
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
