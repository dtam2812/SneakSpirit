/* eslint-disable react/no-unescaped-entities */
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom"
import { SideVoucherContext } from "../Context/SideVoucher";
import { VoucherContext } from "../Context/GetListVoucher";
import { billContext } from "../Context/Bill";
import Breadcrumb from "../components/Breadcrumb";

const Cart = () => {
  const [vouchersApplied, setVouchersApplied] = useState([]);
  const [discountInput, setDiscountInput] = useState('');

  const { cartList, setCartList } = useOutletContext();

  const { setIsOpenVoucher } = useContext(SideVoucherContext);
  const { listVoucher } = useContext(VoucherContext);
  const { bill, setBill } = useContext(billContext);

  //Cập nhật voucher
  useEffect(() => {
    let billPrice = 0;
    cartList.forEach((element) => {
      billPrice += (element.price * element.quantity);
    });

    let fee = 0;
    let count = 0;
    cartList.forEach((element) => {
      count += element.quantity;
    });
    if (count <= 5) fee = 25000;
    else if (count < 10) fee = 50000;
    else fee = 100000;

    let priceDiscount = 0;
    let shippingFeeDiscount = 0;

    vouchersApplied.forEach(voucher => {
      if (voucher.type === "Giảm giá") {
        if (voucher.discountType === "Phần trăm") {
          priceDiscount = Math.min((billPrice * voucher.discount) / 100, voucher.maximumDiscount);
        } else {
          priceDiscount = Math.min(voucher.discount, voucher.maximumDiscount);
        }
      } else if (voucher.type === "Giao hàng") {
        if (voucher.discountType === "Phần trăm") {
          shippingFeeDiscount = Math.min((fee * voucher.discount) / 100, voucher.maximumDiscount);
        } else {
          shippingFeeDiscount = Math.min(voucher.discount, voucher.maximumDiscount);
        }

        if (fee < shippingFeeDiscount) {
          shippingFeeDiscount = Math.min(shippingFeeDiscount, fee);
        }
      }
    });

    setBill({
      price: billPrice,
      shippingFee: fee,
      priceDiscount: priceDiscount,
      shippingFeeDiscount: shippingFeeDiscount,
      total: billPrice - priceDiscount + fee - shippingFeeDiscount,
    });
  }, [cartList, vouchersApplied])

  //Thêm số lượng sản phẩm vào giỏ hàng
  const handlePlus = (index) => {
    const newCart = [...cartList];
    newCart[index].quantity += 1;
    setCartList(newCart);
  }

  //Giảm số lượng sản phẩm trong giỏ hàng
  const handleMinus = (index, id) => {
    const newCart = [...cartList];
    newCart[index].quantity -= 1;
    if (newCart[index].quantity < 1) {
      setCartList(newCart.filter((element) => element.id !== id))
      return;
    }
    setCartList(newCart);
  }

  //Xóa sản phẩm khỏi giỏ hàng
  const handleRemove = (id) => {
    const newCart = [...cartList];
    setCartList(newCart.filter((element) => element.id !== id))
  }

  //Thay đổi size
  const handleSizeChange = (index, newSize) => {
    const newCart = [...cartList];
    newCart[index].size = newSize;
    setCartList(newCart);
  }

  const changeDiscountInput = (e) => {
    setDiscountInput(e.target.value);
  }

  //Áp dụng voucher
  const applyingVoucher = (e) => {
    e.preventDefault();

    const foundVoucher = listVoucher.find((element) => element.voucherName === discountInput);

    if (!foundVoucher) {
      alert('Voucher không tồn tại');
      setDiscountInput('');
      return;
    }

    if (bill.total < foundVoucher.appliedFor) {
      alert('Voucher không hợp lệ');
      setDiscountInput('');
      return;
    }

    let newVouchers = [...vouchersApplied];

    const isProductVoucher = foundVoucher.type === "Giảm giá";
    const isShippingVoucher = foundVoucher.type === "Giao hàng";

    if (isProductVoucher) {
      newVouchers = newVouchers.filter(element => element.type !== "Giảm giá");
    } else if (isShippingVoucher) {
      newVouchers = newVouchers.filter(element => element.type !== "Giao hàng");
    }

    newVouchers.push(foundVoucher);
    setVouchersApplied(newVouchers);
    setDiscountInput('');
  };


  return (
    <div>
      <Breadcrumb first='Giỏ hàng' />
      <div className="container">
        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-8">
          <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Giỏ hàng sản phẩm</h2>
            {
              //Liệt kê sản phẩm
              cartList.length > 0 ? (<div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                  <div className="space-y-6">
                    {
                      cartList.map((element, index) => {
                        return (
                          <>
                            <div key={element._id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                              <div className=" sm:flex sm:items-center sm:justify-between">
                                <div className='flex items-center gap-x-5 mr-3 mb-3 sm:mb-0'>
                                  <div>
                                    <img className="h-20 w-20 " src={element.image} />
                                  </div>
                                  <div >
                                    <Link to={`/product/${element.id}`}>
                                      <p className="font-semibold text-gray-900 hover:underline dark:text-white cursor-pointer">{element.name}</p>
                                    </Link>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between gap-x-6">
                                  {
                                    element.category !== 'Khác' && (
                                      <form>
                                        <select
                                          id="size"
                                          value={element.size}
                                          onChange={(e) => handleSizeChange(index, e.target.value)}
                                          className="block w-16 border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                                        >
                                          <option value="S">S</option>
                                          <option value="M">M</option>
                                          <option value="L">L</option>
                                          <option value="XL">XL</option>
                                        </select>
                                      </form>
                                    )
                                  }
                                  <div className=" h-9 w-24 border border-[#919191] flex justify-around items-center rounded-lg">
                                    <FontAwesomeIcon icon={faMinus} className='cursor-pointer' onClick={() => handleMinus(index, element.id)} />
                                    <p>{element.quantity}</p>
                                    <FontAwesomeIcon icon={faPlus} className='cursor-pointer' onClick={() => handlePlus(index)} />
                                  </div>
                                  <div className=" sm:w-32">
                                    <p className=" font-bold text-gray-900">{element.price.toLocaleString('vi-VN')}đ</p>
                                  </div>
                                  <button onClick={() => handleRemove(element.id)} type="button" className="py-3 px-4 border border-red-600 hover:bg-red-600 hover:text-white duration-300 rounded-2xl text-sm font-medium text-red-600">
                                    Xóa
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })
                    }
                  </div>
                </div>
                {/*Side bar thanh toán*/}
                <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                  <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">Thanh toán</p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Giá</dt>
                          <dd className="text-base font-medium text-gray-900 dark:text-white"> {bill.price.toLocaleString('vi-VN')}đ</dd>
                        </dl>
                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Phí giao hàng</dt>
                          <dd className="text-base font-medium text-gray-900 dark:text-white">{bill.shippingFee.toLocaleString('vi-VN')}đ</dd>
                        </dl>
                        {
                          bill.priceDiscount !== 0 && (
                            <dl className="flex items-center justify-between gap-4">
                              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Chiết khấu</dt>
                              <dd className="text-base font-medium text-gray-900 dark:text-white"> {bill.priceDiscount.toLocaleString('vi-VN')}đ</dd>
                            </dl>
                          )
                        }
                        {
                          bill.shippingFeeDiscount !== 0 && (
                            <dl className="flex items-center justify-between gap-4">
                              <dt className="text-base font-normal text-gray-500 dark:text-gray-400">Giảm giá giao hàng</dt>
                              <dd className="text-base font-medium text-gray-900 dark:text-white"> {bill.shippingFeeDiscount.toLocaleString('vi-VN')}đ</dd>
                            </dl>
                          )
                        }
                      </div>
                      <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                        <dt className="text-base font-bold text-gray-900 dark:text-white">Tổng</dt>
                        <dd className="text-base font-bold text-gray-900 dark:text-white">{bill.total.toLocaleString('vi-VN')}đ</dd>
                      </dl>
                    </div>
                    <Link to={'/checkOut'}>
                      <button className='bg-blue-600 border border-blue-600 h-12 w-full px-5 mt-3 rounded-lg text-white text-xl font-bold hover:text-blue-600 hover:bg-white duration-300'>
                        Thanh toán
                      </button>
                    </Link>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> hoặc </span>
                      <Link to={'/collection'}>
                        <p title className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline ">
                          Tiếp tục mua sắm
                          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m14 0-4 4m4-4-4-4" />
                          </svg>
                        </p>
                      </Link>
                    </div>
                  </div>
                  {/*Side bar voucher*/}
                  <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                    <form type='button' className="space-y-4">
                      <div>
                        <label htmlFor="voucher" className="mb-2 text-sm font-medium text-gray-900 "> Mã khuyến mãi </label>
                        <input value={discountInput}
                          onChange={changeDiscountInput}
                          type="text" id="voucher" className=" w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500" />
                        <button onClick={applyingVoucher}
                          className='bg-[#919191] my-4 border w-full h-10 px-5 rounded-lg text-white text-md font-bold hover:opacity-75 duration-300'>
                          Áp dụng
                        </button>
                        <p onClick={() => setIsOpenVoucher(true)} title className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-700 underline hover:no-underline">
                          Bạn có mã khuyến mãi chưa ?
                          <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m14 0-4 4m4-4-4-4" />
                          </svg>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>) : (<div className='space-y-4 text-center mx-auto py-5' >
                <img className='mx-auto' src="https://bizweb.dktcdn.net/100/472/913/themes/888429/assets/cart_empty_background.png?1725935235961" />
                <h2 className='text-3xl'>"Hổng" có gì trong giỏ hàng hết</h2>
                <p>Về trang cửa hàng để chọn mua sản phẩm bạn nhé !!!</p>
                <Link to={'/collection'}>
                  <button className='py-3 my-4 px-5 text-xl font-semibold border-2 border-[#919191] rounded-lg text-[#919191] hover:bg-[#919191] hover:text-white  duration-300'>Mua sắm ngay</button>
                </Link>
              </div>)
            }
          </div>
        </section>
      </div>
    </div>
  )
}
export default Cart