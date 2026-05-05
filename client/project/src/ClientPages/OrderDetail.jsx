import { faAt, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { CitiesContext } from "../Context/Cities";
import axios from "axios";
import Breadcrumb from "../components/Breadcrumb";

const OrderDetail = () => {
  const { id } = useParams();
  const { cities, selectedCity, setSelectedCity, districts, selectedDistrict, setSelectedDistrict,
    wards, selectedWard, setSelectedWard } = useContext(CitiesContext);
  const [order, setOrder] = useState(null);
  const [detailedAddress, setDetailedAddress] = useState('');
  const navigate = useNavigate();

  //Lấy chi tiết sản phẩm
  useEffect(() => {
    const getOrderDetail = async () => {
      try {
        const response = await axios.get(`/api/auth/order/${id}`);
        setOrder(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getOrderDetail();
  }, [id])

  //Lấy địa chỉ đơn hàng
  const address = order.shippingAddress.address.split(',').reverse();
  const cityName = address[0];
  const districtName = address[1];
  const wardName = address[2];
  address[4] ? setDetailedAddress(`${address[4]}, ${address[3]}`) : setDetailedAddress(address[3]);

  const city = cities.find(element => element.name === cityName);
  const district = districts?.find(element => element.name === districtName);
  const ward = wards?.find(element => element.name === wardName);
  if (city) {
    setSelectedCity({ id: city._id, name: city.name, code: city.code });
  }

  if (district) {
    setSelectedDistrict({ id: district._id, name: district.name, code: district.code });
  }

  if (ward) {
    setSelectedWard({ id: ward._id, name: ward.name, code: ward.code });
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  }

  const handleDeleteOrder = async (orderId) => {
    try {
      await axios.delete(`api/auth/order/delete/${orderId}`);
      alert('Hủy đơn hàng thành công');
      navigate('/');
    } catch (error) {
      console.log(error)
    }
  }

  return (!order ? (
    <div className="h-5/6">Loading...</div>
  ) : (
    <div>
      <Breadcrumb first='Chi tiết đơn hàng' />
      <div>
        <div className="container">
          <div className="grid text-left my-4 sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
            <div className="px-4 pt-8">
              <p className="text-xl font-medium pb-1">Chi tiết đơn hàng</p>
              <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                {
                  //Liệt kê sản phẩm
                  order.orderItems.map((element) => {
                    return (
                      <>
                        <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                          <img className="m-2 h-24 w-28 rounded-md border object-cover object-center" src={element.image} />
                          <div className="flex w-full flex-col px-4 py-4">
                            <span className="font-semibold">{element.name}</span>
                            <div className='flex justify-between'>
                              <p className="float-right text-gray-400">{element.size}</p>
                              <p className="float-right text-gray-400">x{element.quantity}</p>
                            </div>
                            <p className="text-lg font-bold">{element.price.toLocaleString('vi-VN')}đ</p>
                          </div>
                        </div>
                      </>
                    )
                  })
                }
              </div>
              {/*Phương thức thanh toán*/}
              <p className="mt-8 text-lg font-medium">Phương thức thanh toán</p>
              <form className="mt-5 grid gap-6">
                <div className="relative">
                  <input className="peer hidden" defaultChecked id={order.paymentMethod} type="radio" name="radio" />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                  <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" htmlFor={order.paymentMethod}>
                    <img className="w-14 h-10 object-contain"
                      src={order.paymentMethod === 'COD' ? 'https://vantaithanhphat.vn/wp-content/uploads/2022/04/ship-cod-la-gi.jpg' : 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png'} />
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">
                        {order.paymentMethod === 'COD' ? 'Thanh toán COD (Thanh toán khi nhận hàng)' : 'Thanh toán qua MoMo'}
                      </span>
                    </div>
                  </label>
                </div>
              </form>
            </div>
            {/*Thông tin thanh toán*/}
            <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
              <p className="text-xl font-medium">Thông tin thanh toán</p>
              <div className>
                <label htmlFor="email" className="mt-4 mb-2 block text-sm font-medium">Email</label>
                <div className="relative">
                  <input disabled type="text" id="email" value={order.shippingAddress.email} className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="your.email@gmail.com" />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                    <FontAwesomeIcon icon={faAt} />
                  </div>
                </div>
                <label className="mt-4 mb-2 block text-sm font-medium">Họ và tên</label>
                <div className="relative">
                  <input disabled type="text" id="name" value={order.shippingAddress.fullName} className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Họ và tên" />
                  <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                </div>
                <label className="mt-4 mb-2 block text-sm font-medium">Số điện thoại</label>
                <div className="flex">
                  <div className="relative w-full flex-shrink-0">
                    <input disabled type="telephone" id="telephone" value={order.shippingAddress.telephone} className="w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="xxxx-xxxx-xxxx-xxxx" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                  </div>
                </div>
                <div className='flex gap-x-4'>
                  <div className='w-1/3'>
                    <label className="mt-4 mb-2 block text-sm font-medium">
                      Tỉnh thành<span className="text-red-500">*</span>
                    </label>
                    <div >
                      <input
                        id="city" disabled
                        className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        value={selectedCity.name}
                      >
                      </input>
                    </div>
                  </div>

                  <div className='w-1/3'>
                    <label className="mt-4 mb-2 block text-sm font-medium">
                      Quận/Huyện<span className="text-red-500">*</span>
                    </label>
                    <div >
                      <input
                        id="district" disabled
                        className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        value={selectedDistrict.name}
                      >
                      </input>
                    </div>
                  </div>

                  <div className='w-1/3'>
                    <label className="mt-4 mb-2 block text-sm font-medium">
                      Phường/Xã<span className="text-red-500">*</span>
                    </label>
                    <div >
                      <input
                        id="ward" disabled
                        className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        value={selectedWard.name}
                      >
                      </input>
                    </div>
                  </div>
                </div>
                <label className="mt-4 mb-2 block text-sm font-medium">Địa chỉ</label>
                <div >
                  <div className=" sm:w-full">
                    <input value={detailedAddress} disabled
                      type="text" id="address" placeholder='Địa chỉ' className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>
                <label className="mt-4 mb-2 block text-sm font-medium">Ghi chú</label>
                <div >
                  <div className=" sm:w-full">
                    <textarea type="text" disabled
                      id="note" value={order.note} className="w-full h-28 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="mt-6  border-b py-2">
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Ngày đặt hàng</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(order.orderTime)}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Tổng</p>
                  <p className="text-2xl font-semibold text-gray-900">{order.totalPrice.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>
              {/*Hủy đơn hàng*/}
              <button onClick={() => handleDeleteOrder(id)}
                className="mt-4 mb-8 w-full rounded-md bg-red-600 px-6 py-3 text-xl font-semibold hover:opacity-75 duration-200 text-white">Hủy đơn hàng</button>
            </div>
          </div>
        </div>
      </div>
    </div >
  ))
}
export default OrderDetail