/* eslint-disable react/prop-types */
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react"

const VoucherCard = ({ voucherName, pic, discount, maximumDiscount, discountType, type, appliedFor }) => {
  const [isOpenVoucherCondition, setIsOpenVoucherCondition] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  //Copy mã voucher
  const handleCopy = () => {
    if (!isCopied) {
      navigator.clipboard.writeText(voucherName)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => {
            setIsCopied(false);
          }, 5000);
        })
    }
  };

  return (
    <>
      <div className='flex flex-none xl:flex-auto border rounded-md shadow-md mx-2 '>
        <img className='w-2/12 h-full pl-2' src={pic} />
        <div className='p-3 pl-2 sm:pl-5'>
          <h3 className='font-bold '>NHẬP MÃ: {voucherName}</h3>
          <p className='text-[#727272] text-sm pt-2'>Mã giảm giá {discount.toLocaleString('vi-VN')}{discountType === 'Phần trăm' ? '%' : 'đ'} cho đơn hàng tối thiểu {appliedFor.toLocaleString('vi-VN')}</p>
          <div className='flex pt-5 justify-between items-center'>
            {
              isCopied === false ? <button onClick={handleCopy}
                className='border p-1 bg-black text-white text-sm cursor-pointer'>Sao chép</button>
                : <button disabled className="cursor-not-allowed border bg-[#727272] text-white text-sm p-1">Đã sao chép</button>
            }
            <p onClick={() => setIsOpenVoucherCondition(true)} className='cursor-pointer text-[#727272] text-sm underline'>Điều kiện</p>
          </div>
        </div>
      </div>
      { //Chi tiết voucher
        isOpenVoucherCondition === true && (
          <div className='fixed inset-0 flex items-center justify-center'>
            <div className='absolute bg-white rounded-lg w-[100] h-72 border '>
              <div className='relative'>
                <p onClick={() => setIsOpenVoucherCondition(false)} className='absolute top-0 right-1 cursor-pointer'><FontAwesomeIcon icon={faXmark} /></p>
                <h2 className='text-2xl py-3'>NHẬP MÃ: {voucherName}</h2>
                <div className='w-full h-10 bg-slate-300 flex items-center'>
                  <p className=' p-2 text-[#727272]'>Mã khuyến mãi:</p>
                  <p className='text-black pl-5'>{voucherName}</p>
                </div>
                <div className='text-left p-3'>
                  <p className='text-[#727272]'>Điều kiện:</p>
                  <p>- Mã giảm giá {discount.toLocaleString('vi-VN')}{discountType === 'Phần trăm' ? '%' : 'đ'} cho đơn hàng tối thiểu {appliedFor.toLocaleString('vi-VN')}</p>
                  <p>- Giảm tối đa {maximumDiscount.toLocaleString('vi-VN')}</p>
                </div>
                <div className='flex justify-around mt-11'>
                  <button onClick={() => setIsOpenVoucherCondition(false)} className='border border-black hover:bg-black hover:text-white transition-colors py-2 w-48 rounded-lg'>Đóng</button>
                  {
                    isCopied === false ? <button onClick={handleCopy}
                      className='border border-black bg-black text-white py-2 w-48 rounded-lg'>Sao chép</button>
                      : <button disabled className="cursor-not-allowed border p-1 bg-[#727272] text-white py-2 w-48 rounded-lg">Đã sao chép</button>
                  }
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}
export default VoucherCard