/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import removeAccents from "remove-accents";
import Loading from "../../components/Loading";

const ITEMS_PER_PAGE = 8; // số đơn hàng mỗi trang

const OrdersInfo = ({ user }) => {
  const { id } = useParams();
  const [searchingValue, setSearchingValue] = useState("");
  const [items, setListItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const getUserOrders = async () => {
      try {
        const response = await axios.get(`/api/auth/user/${id}/orders`);
        setListItems(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getUserOrders();
  }, [id]); // ← bỏ items khỏi dependency

  const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");

  // Lọc theo search
  const filtered = items.filter((element) => {
    const orderDetail = element.shippingAddress;
    const orderName = removeAccents(
      `${orderDetail.fullName} ${orderDetail.email} ${orderDetail.telephone}`.toLowerCase(),
    );
    const searchValue = removeAccents(searchingValue.toLowerCase());
    return searchValue === "" ? true : orderName.includes(searchValue);
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Reset về trang 1 khi search thay đổi
  const handleSearch = (e) => {
    setSearchingValue(e.target.value);
    setCurrentPage(1);
  };

  if (!user) return <Loading />;

  return (
    <div className="p-3 text-left">
      <h2 className="text-2xl font-semibold pb-3">Đơn hàng của bạn</h2>

      {/* Search */}
      <input
        type="text"
        value={searchingValue}
        onChange={handleSearch}
        placeholder="Tìm theo tên, email, SĐT..."
        className="mb-4 border border-gray-300 rounded-md px-4 py-2 w-full sm:w-1/2 outline-none focus:border-blue-500"
      />

      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Họ tên</th>
                    <th className="px-6 py-4">SĐT</th>
                    <th className="px-6 py-4">Thành tiền</th>
                    <th className="px-6 py-4">PT thanh toán</th>
                    <th className="px-6 py-4">Ngày đặt hàng</th>
                    <th className="px-6 py-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length > 0 ? (
                    paginated.map((element) => (
                      <tr
                        key={element._id}
                        className="border-b dark:border-neutral-500"
                      >
                        <td className="whitespace-nowrap px-6 py-4">
                          {element.shippingAddress.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {element.shippingAddress.fullName}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {element.shippingAddress.telephone}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {element.totalPrice.toLocaleString("vi-VN")}đ
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {element.paymentMethod}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {formatDate(element.orderTime)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Link to={`/order/${element._id}`}>
                            <button className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                              Chi tiết
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        Không có dữ liệu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-gray-100"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded border ${
                currentPage === page
                  ? "bg-blue-700 text-white border-blue-700"
                  : "hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-gray-100"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};
export default OrdersInfo;
