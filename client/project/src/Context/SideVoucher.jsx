/* eslint-disable react/prop-types */
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createContext, useContext, useEffect, useState } from "react"
import { VoucherContext } from "./GetListVoucher";
import VoucherCard from "../VoucherCard";

export const SideVoucherContext = createContext({});

const SideVoucher = ({ children }) => {
  const [isOpenVoucher, setIsOpenVoucher] = useState(false);

  const { listVoucher } = useContext(VoucherContext);

  //Khi mở side voucher thì không scroll được
  useEffect(() => {
    if (isOpenVoucher) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = 'scroll'
    }
  }, [isOpenVoucher])

  return (
    <SideVoucherContext.Provider value={{ setIsOpenVoucher }}>
      {children}
      { //Side voucher
        isOpenVoucher && (
          <div className='fixed inset-0 z-40'>
            <div className='absolute inset-0 bg-slate-600/60' onClick={() => setIsOpenVoucher(false)}></div>
            <div className='absolute top-0 right-0 h-full w-full lg:w-1/4 bg-white'>
              <div className='flex p-2 shadow-md items-center justify-between mb-3'>
                <FontAwesomeIcon icon={faLeftLong} className='text-xl cursor-pointer' onClick={() => setIsOpenVoucher(false)} />
                <p>Mã giảm giá</p>
                <p></p>
              </div>
              <div className='rounded-md w-max space-y-3'>
                {
                  listVoucher.map((element) => {
                    return (
                      <VoucherCard key={element._id} voucherName={element.voucherName} pic={element.pic} discount={element.discount}
                        maximumDiscount={element.maximumDiscount} discountType={element.discountType} type={element.type} appliedFor={element.appliedFor} />
                    )
                  })
                }
              </div>
            </div>
          </div>
        )}
    </SideVoucherContext.Provider>
  )
}
export default SideVoucher