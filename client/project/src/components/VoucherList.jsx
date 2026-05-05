import { useContext } from "react";
import VoucherCard from "../VoucherCard";
import { VoucherContext } from "../Context/GetListVoucher";

const VoucherList = () => {
  const { listVoucher } = useContext(VoucherContext);

  if (!listVoucher) {
    return <div className='h-5/6'>Loading...</div>;
  }

  return (
    <div className='my-5'>
      <div className='flex overflow-x-auto  whitespace-nowrap'>
        <div className={`flex flex-none ${listVoucher.length > 3 ? '' : 'xl:flex-auto'} rounded-md mx-2 xl:mx-4`}>
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
  )
}
export default VoucherList