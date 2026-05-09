/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import removeAccents from "remove-accents";

const VoucherTable = ({
  listVoucher,
  setListVoucher,
  setCurrentVoucher,
  setIsEditing,
  searchingValue,
  searched,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(listVoucher.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVouchers = listVoucher.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  //Xóa voucher
  const handleDelete = async (voucherId) => {
    try {
      await axios.delete(`auth/admin/voucher/delete/${voucherId}`);
      setListVoucher((prev) => prev.filter((v) => v._id !== voucherId));
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Unauthorized request");
      }
    }
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
                  <th className="px-6 py-4">Mã khuyến mãi</th>
                  <th className="px-6 py-4">Loại mã</th>
                  <th className="px-6 py-4">Giảm theo</th>
                  <th className="px-6 py-4">Giảm</th>
                  <th className="px-6 py-4">Giảm tối đa</th>
                  <th className="px-6 py-4">Áp dụng cho đơn hàng trên</th>
                  <th className="px-6 py-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentVouchers.length > 0 ? (
                  searched === true ? (
                    currentVouchers
                      .filter((element) => {
                        const voucherName = removeAccents(
                          `${element.voucherName} ${element.type} ${element.discountType}`.toLowerCase(),
                        );
                        const searchValue = removeAccents(
                          searchingValue.toLowerCase(),
                        );

                        return searchValue === ""
                          ? element
                          : voucherName.includes(searchValue);
                      })
                      .map((element, index) => {
                        return (
                          <tr
                            className="border-b dark:border-neutral-500"
                            key={element._id}
                          >
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {startIndex + index + 1}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.voucherName}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.type}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.discountType}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.discount.toLocaleString("vi-VN")}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.maximumDiscount.toLocaleString("vi-VN")}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.appliedFor.toLocaleString("vi-VN")}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 flex">
                              <button
                                onClick={() => {
                                  setIsEditing(true);
                                  setCurrentVoucher(element);
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
                    currentVouchers.map((element, index) => {
                      return (
                        <tr
                          className="border-b dark:border-neutral-500"
                          key={element._id}
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {startIndex + index + 1}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.voucherName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.type}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.discountType}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.discount.toLocaleString("vi-VN")}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.maximumDiscount.toLocaleString("vi-VN")}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.appliedFor.toLocaleString("vi-VN")}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 flex">
                            <button
                              onClick={() => {
                                setIsEditing(true);
                                setCurrentVoucher(element);
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
                    <td colSpan="8" className="text-center py-4">
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
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
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

export default VoucherTable;
