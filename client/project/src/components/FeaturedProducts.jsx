import ProductCard from "../ProductCard"
import { useContext } from "react";
import { ProductContext } from "../Context/GetListProduct";

const FeaturedProducts = () => {
  const { listProduct } = useContext(ProductContext);

  if (!listProduct) {
    return <div className='h-5/6'>Loading...</div>;
  }

  return (
    <div className='my-11'>
      <h1 className='text-4xl'>SẢN PHẨM NỔI BẬT CỦA HYBID®</h1>
      <div className=' w-9 mx-auto mt-6'>
        <h5 className="block w-9 text-2xl hover:text-slate-400 group transition duration-100">
          HIT
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
        </h5>
      </div>
      <div className='w-full my-3 flex flex-wrap'>
        {
          listProduct.slice(0, 3).map((element) => {
            return <ProductCard key={element._id} id={element._id} productName={element.productName} pic1={element.images[0]}
              pic2={element.images[1] || element.images[0]} price={element.price} />
          })
        }
      </div>
    </div>
  )
}
export default FeaturedProducts