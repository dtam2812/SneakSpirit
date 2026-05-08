/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import removeAccents from "remove-accents";
import Loading from "../../components/Loading";

const OrdersInfo = ({ user }) => {
  const { id } = useParams();
  const [searchingValue, setSearchingValue] = useState("");
  const [items, setListItems] = useState([]);

  //Lấy danh sách đơn hàng mà tài khoản này đã đặt
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
  }, [id, items]);

  //Format ngày đặt hàng
  const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");
  if (!user) {
    return <Loading />;
  }
  return (
    <div className="p-3 text-left">
      <h2 className="text-2xl font-semibold pb-3">Đơn hàng của bạn</h2>
      <div className="w-full text-lg">
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
                    {items.length > 0 ? (
                      items
                        .filter((element) => {
                          const orderDetail = element.shippingAddress;
                          const orderName = removeAccents(
                            `${orderDetail.fullName} ${orderDetail.email} ${orderDetail.telephone}`.toLowerCase(),
                          );
                          const searchValue = removeAccents(
                            searchingValue.toLowerCase(),
                          );

                          return searchValue === ""
                            ? element
                            : orderName.includes(searchValue);
                        })
                        .map((element) => (
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
                            <td className="whitespace-nowrap px-6 py-4 ">
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
                        <td colSpan="6" className="text-center py-4">
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
      </div>
    </div>
  );
};
export default OrdersInfo;
