import { useContext, useState } from "react";
import { OrderContext } from "../../Context/GetListOrder";
import axios from "axios";
import { Link } from "react-router-dom";
import removeAccents from 'remove-accents';
import SearchBar from "../../components/SearchBar";

const OrderAdmin = () => {
  const { listOrder } = useContext(OrderContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchingValue, setSearchingValue] = useState('');
  const [searched, setSearched] = useState(false);
  const [sortedListOrder, setSortedListOrder] = useState(listOrder);
  const itemsPerPage = 5;

  //Format ngày đặt hàng 
  const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN');

  //Xóa đơn hàng
  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`api/auth/order/delete/${orderId}`);
    } catch (error) {
      console.log(error);
    }
  };

  //Function sắp xếp
  const sorting = () => {
    const sortingBy = document.getElementById('sort').value;

    if (sortingBy === 'priceASC') {
      setSortedListOrder(listOrder.sort((a, b) => a.totalPrice - b.totalPrice));
    }
    else if (sortingBy === 'priceDESC') {
      setSortedListOrder(listOrder.sort((a, b) => b.totalPrice - a.totalPrice));
    }
    else if (sortingBy === 'latest') {
      setSortedListOrder(listOrder.reverse());
    }
    else {
      setSortedListOrder(listOrder);
    }
  }

  const totalPages = Math.ceil(listOrder.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = sortedListOrder.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <div className='flex justify-between items-center'>
        {/*Thanh tìm kiếm*/}
        <SearchBar searchingValue={searchingValue} setSearchingValue={setSearchingValue}
          setSearched={setSearched} />
        {/*Thanh sắp xếp*/}
        <form className=" w-1/5">
          <select onChange={sorting}
            id="sort" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <option selected>Sắp xếp theo</option>
            <option value="priceASC">Giá trị đơn hàng tăng dần</option>
            <option value="priceDESC">Giá trị đơn hàng giảm dần</option>
            <option value="latest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </form>
      </div>
      {/*Table các đơn hàng*/}
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th className="px-6 py-4">#</th>
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
                  {currentOrders.length > 0 ? (
                    searched === true ? (
                      currentOrders.filter((element) => {
                        const orderDetail = element.shippingAddress;
                        const orderName = removeAccents((`${orderDetail.fullName} ${orderDetail.email} ${orderDetail.telephone}`).toLowerCase());
                        const searchValue = removeAccents(searchingValue.toLowerCase());

                        return searchValue === '' ? element : orderName.includes(searchValue);
                      })
                        .map((element, index) => {
                          return (
                            <tr key={element._id} className="border-b dark:border-neutral-500">
                              <td className="whitespace-nowrap px-6 py-4 font-medium">
                                {startIndex + index + 1}
                              </td>
                              <td className="whitespace-nowrap px-6 py-4">{element.shippingAddress.email}</td>
                              <td className="whitespace-nowrap px-6 py-4">{element.shippingAddress.fullName}</td>
                              <td className="whitespace-nowrap px-6 py-4">{element.shippingAddress.telephone}</td>
                              <td className="whitespace-nowrap px-6 py-4">{element.totalPrice.toLocaleString('vi-VN')}đ</td>
                              <td className="whitespace-nowrap px-6 py-4">{element.paymentMethod}</td>
                              <td className="whitespace-nowrap px-6 py-4">{formatDate(element.orderTime)}</td>
                              <td className="whitespace-nowrap px-6 py-4 flex">
                                <button
                                  onClick={() => handleDeleteOrder(element._id)}
                                  className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                >
                                  Xóa
                                </button>
                                <Link to={`/order/${element._id}`}>
                                  <button
                                    className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                  >
                                    Chi tiết
                                  </button>
                                </Link>
                              </td>
                            </tr>
                          )
                        })
                    ) : (
                      currentOrders.map((element, index) => {
                        return (
                          <tr key={element._id} className="border-b dark:border-neutral-500">
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {startIndex + index + 1}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">{element.shippingAddress.email}</td>
                            <td className="whitespace-nowrap px-6 py-4">{element.shippingAddress.fullName}</td>
                            <td className="whitespace-nowrap px-6 py-4">{element.shippingAddress.telephone}</td>
                            <td className="whitespace-nowrap px-6 py-4">{element.totalPrice.toLocaleString('vi-VN')}đ</td>
                            <td className="whitespace-nowrap px-6 py-4">{element.paymentMethod}</td>
                            <td className="whitespace-nowrap px-6 py-4">{formatDate(element.orderTime)}</td>
                            <td className="whitespace-nowrap px-6 py-4 flex">
                              <button
                                onClick={() => handleDeleteOrder(element._id)}
                                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                              >
                                Xóa
                              </button>
                              <Link to={`/order/${element._id}`}>
                                <button
                                  className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                >
                                  Chi tiết
                                </button>
                              </Link>
                            </td>
                          </tr>
                        )
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
    </>
  );
};
export default OrderAdmin