/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"

const ProductCard = ({ id, productName, pic1, price }) => {
  return (
    <div className='w-1/2 sm:w-1/4 xl:w-1/5 h-80 xl:h-3/5 rounded-lg'>
      <Link to={`/product/${id}`}>
        <div className="cursor-pointer transition duration-300 hover:shadow-md rounded-lg">
          <img
            src={pic1}
            className="w-full h-40 sm:h-52 xl:h-80 object-cover group-hover:hidden rounded-lg"
            alt="Default Image"
          />
        </div>
      </Link>
      <div>
        <Link to={`/product/${id}`}>
          <p className='font-bold p-3 pb-1 text-left hover:text-blue-400 cursor-pointer transition-colors'>{productName}</p>
        </Link>
        <p className='text-left p-3 pt-0 text-red-500 font-bold'>{price.toLocaleString('vi-VN')}đ</p>
      </div>
    </div>
  )
}
export default ProductCard