import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

/* eslint-disable react/prop-types */
const QuickBuy = ({ product, selectedSize, setSelectedSize,
  setBuyingQuantity, buyingQuantity, handlePlus,
  handleMinus, handleAddingToCart }) => {

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value)
  }

  return (
    <div className='hidden border lg:flex justify justify-between items-center my-5'>
      <div className='w-2/3 p-3 flex items-center'>
        <img src={product.images[0]} className='h-32' />
        <div className='font-semibold text-left px-3'>
          <h3 className='text-2xl py-2'>{product.productName}</h3>
          <h4 className='text-xl text-red-500'>{product.price.toLocaleString('vi-VN')}đ</h4>
        </div>
      </div>
      <div className='flex items-center px-3'>
        <p className={'px-2'}>Số lượng:</p>
        {
          product.category !== 'Khác' && (
            <select
              id="size"
              className="border px-2 py-1 rounded"
              value={selectedSize}
              onChange={handleSizeChange}
            >
              <option value="" disabled hidden>
              </option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          )
        }
        <div className="flex space-x-4 align-middle items-center">
          <div className=" mx-3 w-20 h-10 border border-[#919191] flex justify-around items-center rounded-lg">
            <FontAwesomeIcon icon={faMinus} className='cursor-pointer' onClick={handleMinus} />
            <p>{buyingQuantity}</p>
            <FontAwesomeIcon icon={faPlus} className='cursor-pointer' onClick={handlePlus} />
          </div>
          <button onClick={handleAddingToCart} className='border border-[#919191] h-14 px-3 rounded-lg  text-[#919191] text-xl font-bold hover:text-white hover:bg-[#919191] transition-colors'>
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  )
}
export default QuickBuy