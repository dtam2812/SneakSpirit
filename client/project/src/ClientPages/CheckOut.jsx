import { faAt, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { CitiesContext } from "../Context/Cities";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ProductContext } from "../Context/GetListProduct";
import { billContext } from "../Context/Bill";
import Breadcrumb from "../components/Breadcrumb";

const CheckOut = () => {
  const { cartList, setCartList } = useOutletContext();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [doneCheckOut, setDoneCheckOut] = useState(false);
  const navigate = useNavigate();

  const {
    cities,
    selectedCity,
    districts,
    selectedDistrict,
    wards,
    selectedWard,
    handleCityChange,
    handleDistrictChange,
    handleWardChange,
  } = useContext(CitiesContext);
  const { listProduct } = useContext(ProductContext);
  const { bill } = useContext(billContext);

  useEffect(() => {
    document.body.style.overflow = doneCheckOut ? "hidden" : "scroll";
  }, [doneCheckOut]);

  const handleAddingOrder = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const userId = jwtDecode(accessToken)._id;

      const email = document.getElementById("email").value;
      const name = document.getElementById("name").value;
      const telephone = document.getElementById("telephone").value;
      const address = document.getElementById("address").value;
      const note = document.getElementById("note").value;
      const fullAddress = `${address}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedCity.name}`;

      if (
        !email ||
        !name ||
        !telephone ||
        !address ||
        !selectedWard.name ||
        !selectedDistrict.name ||
        !selectedCity.name ||
        !paymentMethod
      ) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }

      const orderItems = cartList.map((element) => ({
        name: element.name,
        quantity: element.quantity,
        size: element.size,
        price: element.price,
        image: element.image,
        product: element._id,
      }));

      await axios.post(`/api/auth/order/create`, {
        user: userId,
        orderItems,
        shippingAddress: {
          fullName: name,
          email,
          address: fullAddress,
          telephone,
        },
        note,
        orderTime: new Date(),
        paymentMethod,
        totalPrice: bill.total,
      });

      await Promise.all(
        cartList.map(async (cartElement) => {
          const product = listProduct.find((p) => p._id === cartElement._id);

          if (!product) {
            console.warn("Không tìm thấy product:", cartElement._id);
            return; // bỏ qua, không throw lỗi
          }

          const update =
            cartElement.category !== "Khác"
              ? {
                  sizes: {
                    ...product.sizes,
                    [cartElement.size]:
                      product.sizes[cartElement.size] - cartElement.quantity,
                  },
                }
              : { quantity: product.quantity - cartElement.quantity };

          await axios.put(`/auth/admin/product/update/${product._id}`, update);
        }),
      );

      setCartList([]);
      setDoneCheckOut(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (!cartList || !bill) return <div className="h-5/6">Loading...</div>;

  return (
    <>
      <div>
        <Breadcrumb first="Thanh toán" />
        <div className="container">
          <div className="grid text-left my-4 sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
            <div className="px-4 pt-8">
              <p className="text-xl font-medium pb-1">Thanh toán</p>
              <p className="text-gray-400">
                Kiểm tra kĩ thông tin và sản phẩm trước khi thanh toán
              </p>

              <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
                {cartList.map((element) => (
                  <div
                    key={element._id}
                    className="flex flex-col rounded-lg bg-white sm:flex-row"
                  >
                    <img
                      className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                      src={element.image}
                    />
                    <div className="flex w-full flex-col px-4 py-4">
                      <span className="font-semibold">{element.name}</span>
                      <div className="flex justify-between">
                        <p className="text-gray-400">{element.size}</p>
                        <p className="text-gray-400">x{element.quantity}</p>
                      </div>
                      <p className="text-lg font-bold">
                        {element.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-lg font-medium">Phương thức thanh toán</p>
              <form className="mt-5 grid gap-6">
                <div
                  onClick={() => setPaymentMethod("COD")}
                  className="relative"
                >
                  <input
                    className="peer hidden"
                    id="COD"
                    type="radio"
                    name="radio"
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                  <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="COD"
                  >
                    <img
                      className="w-14 h-10 object-contain"
                      src="https://vantaithanhphat.vn/wp-content/uploads/2022/04/ship-cod-la-gi.jpg"
                    />
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">
                        Thanh toán COD (Thanh toán khi nhận hàng)
                      </span>
                    </div>
                  </label>
                </div>
                <div
                  onClick={() => setPaymentMethod("MoMo")}
                  className="relative"
                >
                  <input
                    className="peer hidden"
                    id="MoMo"
                    type="radio"
                    name="radio"
                  />
                  <span className="peer-checked:border-gray-700 absolute right-4 top-1/2 box-content block h-3 w-3 -translate-y-1/2 rounded-full border-8 border-gray-300 bg-white" />
                  <label
                    className="peer-checked:border-2 peer-checked:border-gray-700 peer-checked:bg-gray-50 flex cursor-pointer select-none rounded-lg border border-gray-300 p-4"
                    htmlFor="MoMo"
                  >
                    <img
                      className="w-14 h-10 object-contain"
                      src="./public/momo.webp"
                    />
                    <div className="ml-5">
                      <span className="mt-2 font-semibold">
                        Thanh toán qua MoMo
                      </span>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
              <p className="text-xl font-medium">Thông tin thanh toán</p>
              <p className="text-gray-400">
                Hãy điền thông tin nhận hàng của bạn
              </p>

              <label
                htmlFor="email"
                className="mt-4 mb-2 block text-sm font-medium"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="your.email@gmail.com"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <FontAwesomeIcon icon={faAt} />
                </div>
              </div>

              <label className="mt-4 mb-2 block text-sm font-medium">
                Họ và tên
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Họ và tên"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              </div>

              <label className="mt-4 mb-2 block text-sm font-medium">
                Số điện thoại
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="telephone"
                  className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="0xxx-xxx-xxx"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
              </div>

              <div className="flex gap-x-4">
                <div className="w-1/3">
                  <label className="mt-4 mb-2 block text-sm font-medium">
                    Tỉnh thành <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="city"
                    defaultValue=""
                    onChange={handleCityChange}
                    className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="" disabled hidden>
                      Tỉnh thành
                    </option>
                    {cities.map((element) => (
                      <option key={element.code} value={element.code}>
                        {element.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-1/3">
                  <label className="mt-4 mb-2 block text-sm font-medium">
                    Quận/Huyện <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="district"
                    defaultValue=""
                    onChange={handleDistrictChange}
                    className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="" disabled hidden>
                      Quận/Huyện
                    </option>
                    {districts.map((element) => (
                      <option key={element.code} value={element.code}>
                        {element.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-1/3">
                  <label className="mt-4 mb-2 block text-sm font-medium">
                    Phường/Xã <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="ward"
                    defaultValue=""
                    onChange={handleWardChange}
                    className="w-full rounded-md border border-gray-200 px-2 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="" disabled hidden>
                      Phường/Xã
                    </option>
                    {wards.map((element) => (
                      <option key={element.code} value={element.code}>
                        {element.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="mt-4 mb-2 block text-sm font-medium">
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                placeholder="Số nhà, tên đường..."
                className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
              />

              <label className="mt-4 mb-2 block text-sm font-medium">
                Ghi chú
              </label>
              <textarea
                id="note"
                className="w-full h-28 rounded-md border border-gray-200 px-4 py-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
              />

              <div className="mt-6 border-t border-b py-2 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Thành tiền
                  </p>
                  <p className="font-semibold text-gray-900">
                    {bill.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    Phí giao hàng
                  </p>
                  <p className="font-semibold text-gray-900">
                    {bill.shippingFee.toLocaleString("vi-VN")}đ
                  </p>
                </div>
                {bill.priceDiscount !== 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Chiết khấu
                    </p>
                    <p className="font-semibold text-gray-900">
                      {bill.priceDiscount.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                )}
                {bill.shippingFeeDiscount !== 0 && (
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      Giảm giá phí giao hàng
                    </p>
                    <p className="font-semibold text-gray-900">
                      {bill.shippingFeeDiscount.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Tổng</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {bill.total.toLocaleString("vi-VN")}đ
                </p>
              </div>

              <button
                onClick={handleAddingOrder}
                className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 text-xl font-semibold hover:opacity-75 duration-200 text-white"
              >
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>

      {doneCheckOut && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-600/60">
          <div className="bg-white rounded-lg border p-6 md:mx-auto">
            <svg
              viewBox="0 0 24 24"
              className="text-green-600 w-16 h-16 mx-auto my-6"
            >
              <path
                fill="currentColor"
                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
              />
            </svg>
            <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 font-semibold">
                Đặt hàng thành công!
              </h3>
              <p className="text-gray-600 my-2">
                Sneak Spirit xin chân thành cảm ơn vì đã tin tưởng mua hàng
              </p>
              <p>Chúc bạn một ngày may mắn!</p>
              <div className="py-10">
                <button
                  onClick={() => {
                    setDoneCheckOut(false);
                    navigate("/collection");
                  }}
                  className="px-12 bg-gray-900 hover:opacity-75 duration-200 text-white font-semibold py-3 rounded-lg"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckOut;
