import { faAt, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState, } from "react";
import { Link, useOutletContext } from "react-router-dom"
import { CitiesContext } from "../Context/Cities";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ProductContext } from "../Context/GetListProduct";
import { billContext } from "../Context/Bill";
import Breadcrumb from "../components/Breadcrumb";

const CheckOut = () => {
  const { cartList, setCartList } = useOutletContext();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [doneCheckOut, setDoneCheckOut] = useState(false);

  const { cities, selectedCity, districts, selectedDistrict, wards, selectedWard,
    handleCityChange, handleDistrictChange, handleWardChange } = useContext(CitiesContext);
  const { listProduct } = useContext(ProductContext);
  const { bill } = useContext(billContext);

  useEffect(() => {
    //Khi hoàn thành mua hàng thì hiện cảm ơn và không thể scroll
    if (doneCheckOut) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = 'scroll'
    }
  }, [doneCheckOut])

  //Mua hàng thành công và thêm đơn hàng vào data
  const handleAddingOrder = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const jwtDecoded = jwtDecode(accessToken);
      const userId = jwtDecoded._id;

      const email = document.getElementById('email').value;
      const name = document.getElementById('name').value;
      const telephone = document.getElementById('telephone').value;
      const address = document.getElementById('address').value;

      const fullAddress = `${address},${selectedWard.name},${selectedDistrict.name},${selectedCity.name}`;
      const note = document.getElementById('note').value;

      const orderItems = cartList.map(element => ({
        name: element.name,
        quantity: element.quantity,
        size: element.size,
        price: element.price,
        image: element.image,
        product: element._id,
      }));

      if (email !== '' && name !== '' && telephone !== '' && selectedWard.name !== '' && selectedDistrict.name !== ''
        && selectedCity.name !== '' && address !== '' && paymentMethod !== '') {
        const response = await axios.post(`/api/auth/order/create`, {
          user: userId,
          orderItems: orderItems,
          shippingAddress: {
            fullName: name,
            email: email,
            address: fullAddress,
            telephone: telephone,
          },
          note: note,
          orderTime: new Date(),
          paymentMethod: paymentMethod,
          totalPrice: bill.total,
        });

        await Promise.all(
          listProduct.map(async (proElement) => {
            for (const cartElement of cartList) {
              if (proElement._id === cartElement.id) {
                try {
                  const productUpdateQuantity = {};

                  if (cartElement.category !== "Khác") {
                    productUpdateQuantity.sizes = {
                      ...proElement.sizes,
                      [cartElement.size]: proElement.sizes[cartElement.size] - cartElement.quantity,
                    };
                  } else {
                    productUpdateQuantity.quantity = proElement.quantity - cartElement.quantity;
                  }

                  await axios.put(`/auth/admin/product/update/${proElement._id}`, productUpdateQuantity);
                } catch (error) {
                  console.log(error);
                }
              }
            }
          })
        )

        setCartList([]);
        setDoneCheckOut(true);
      } else {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (!cartList || !bill) {
    return <div className='h-5/6'>Loading...</div>;
  }

  return (
    <>
      <div>
        <Breadcrumb first='Thanh toán' />
        <div>
          <div className="container">
            <div className="grid text-left my-4 sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
              <div className="px-4 pt-8">
                <p className="text-xl font-medium pb-1">Thanh toán</p>
                <p className="text-gray-400">Kiểm tra kĩ thông tin và sản phẩm trước khi thanh toán</p>
                <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                  {
                    //Liệt kê sản phẩms
                    cartList.map((element) => {
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
                  <div onClick={() => setPaymentMethod('COD')} className="relative">
                    <input className="peer hidden" id="COD" type="radio" name="radio" />
                    <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                    <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" htmlFor="COD">
                      <img className="w-14 h-10 object-contain" src="https://vantaithanhphat.vn/wp-content/uploads/2022/04/ship-cod-la-gi.jpg" />
                      <div className="ml-5">
                        <span className="mt-2 font-semibold">Thanh toán COD (Thanh toán khi nhận hàng)</span>
                      </div>
                    </label>
                  </div>
                  <div onClick={() => setPaymentMethod('MoMo')} className="relative">
                    <input className="peer hidden" id="MoMo" type="radio" name="radio" />
                    <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                    <label className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4" htmlFor="MoMo">
                      <img className="w-14 h-10 object-contain" src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" />
                      <div className="ml-5">
                        <span className="mt-2 font-semibold">Thanh toán qua MoMo</span>
                      </div>
                    </label>
                  </div>
                </form>
              </div>
              {/*Thông tin thanh toán*/}
              <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                <p className="text-xl font-medium">Thông tin thanh toán</p>
                <p className="text-gray-400">Hãy điền thông tin nhận hàng của bạn</p>
                <div className>
                  <label htmlFor="email" className="mt-4 mb-2 block text-sm font-medium">Email</label>
                  <div className="relative">
                    <input type="text" id="email" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="your.email@gmail.com" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                      <FontAwesomeIcon icon={faAt} />
                    </div>
                  </div>
                  <label className="mt-4 mb-2 block text-sm font-medium">Họ và tên</label>
                  <div className="relative">
                    <input type="text" id="name" className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="Họ và tên" />
                    <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                  </div>
                  <label className="mt-4 mb-2 block text-sm font-medium">Số điện thoại</label>
                  <div className="flex">
                    <div className="relative w-full flex-shrink-0">
                      <input type="telephone" id="telephone" className="w-full rounded-md border border-gray-200 px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" placeholder="xxxx-xxxx-xxxx-xxxx" />
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
                        <select
                          id="city"
                          className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          defaultValue=""
                          onChange={handleCityChange}
                        >
                          <option value="" disabled hidden>
                            Tỉnh thành
                          </option>
                          {
                            cities.map((element) => {
                              return (<option key={element._id} value={element.code}>{element.name}</option>)
                            })
                          }
                        </select>
                      </div>
                    </div>

                    <div className='w-1/3'>
                      <label className="mt-4 mb-2 block text-sm font-medium">
                        Quận/Huyện<span className="text-red-500">*</span>
                      </label>
                      <div >
                        <select
                          id="district"
                          className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          defaultValue=""
                          onChange={handleDistrictChange}
                        >
                          <option value="" disabled hidden>
                            Quận/Huyện
                          </option>
                          {
                            districts?.map((element) => {
                              return (<option key={element._id} value={element.code}>{element.name}</option>)
                            })
                          }
                        </select>
                      </div>
                    </div>

                    <div className='w-1/3'>
                      <label className="mt-4 mb-2 block text-sm font-medium">
                        Phường/Xã<span className="text-red-500">*</span>
                      </label>
                      <div >
                        <select
                          id="ward"
                          className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          defaultValue=""
                          onChange={handleWardChange}
                        >
                          <option value="" disabled hidden>
                            Phường/Xã
                          </option>
                          {
                            wards?.map((element) => {
                              return (<option key={element._id} value={element.code}>{element.name}</option>)
                            })
                          }
                        </select>
                      </div>
                    </div>
                  </div>
                  <label className="mt-4 mb-2 block text-sm font-medium">Địa chỉ</label>
                  <div >
                    <div className=" sm:w-full">
                      <input type="text" id="address" placeholder='Địa chỉ' className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                  </div>
                  <label className="mt-4 mb-2 block text-sm font-medium">Ghi chú</label>
                  <div >
                    <div className=" sm:w-full">
                      <textarea type="text" id="note" className="w-full h-28 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500" />
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mt-6 border-t border-b py-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">Thành tiền</p>
                      <p className="font-semibold text-gray-900">{bill.price.toLocaleString('vi-VN')}đ</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">Phí giao hàng</p>
                      <p className="font-semibold text-gray-900">{bill.shippingFee.toLocaleString('vi-VN')}đ</p>
                    </div>
                    {
                      bill.priceDiscount !== 0 && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">Chiết khấu </p>
                          <p className="font-semibold text-gray-900">{bill.priceDiscount.toLocaleString('vi-VN')}đ</p>
                        </div>
                      )
                    }
                    {
                      bill.shippingFeeDiscount !== 0 && (
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">Giảm giá phí giao hàng</p>
                          <p className="font-semibold text-gray-900">{bill.shippingFeeDiscount.toLocaleString('vi-VN')}đ</p>
                        </div>
                      )
                    }
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Tổng</p>
                    <p className="text-2xl font-semibold text-gray-900">{bill.total.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
                <button onClick={handleAddingOrder}
                  className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 text-xl font-semibold hover:opacity-75 duration-200 text-white">Đặt hàng</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        //Form cảm ơn
        doneCheckOut === true && (
          <div className='fixed inset-0 flex items-center justify-center bg-slate-600/60 '>
            <div className='absolute bg-white rounded-lg w-[100] h-72 border '>
              <div className="">
                <div className="bg-white p-6  md:mx-auto">
                  <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
                    <path fill="currentColor" d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
                    </path>
                  </svg>
                  <div className="text-center">
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Đặt hàng thành công!</h3>
                    <p className="text-gray-600 my-2">HYBID® xin chân thành cảm ơn vì đã tin tưởng mua hàng</p>
                    <p> Chúc bạn một ngày may mắn!</p>
                    <div className="py-10 gap-x-5">
                      <Link onClick={() => setDoneCheckOut(false)} to={'/collection'}>
                        <button className="px-12 bg-gray-900 hover:opacity-75 duration-200 text-white font-semibold py-3 rounded-lg">
                          Tiếp tục mua sắm
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )
      }
    </>
  )
}
export default CheckOut