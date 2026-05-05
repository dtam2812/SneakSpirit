import ProductCard from "../ProductCard"
import { useContext } from "react";
import { ProductContext } from "../Context/GetListProduct";

const FeaturedJacket = () => {
  const { listProduct } = useContext(ProductContext);

  if (!listProduct) {
    return <div className='h-5/6'>Loading...</div>;
  }

  return (
    <div className='my-11'>
      <div className=' w-80 mx-auto mt-6'>
        <h1 className="block w-80 text-4xl hover:text-slate-400 group transition duration-100">
          Áo khoác HYBID®
          <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
        </h1>
      </div>
      <div className='w-full my-3 flex flex-wrap'>
        {
          listProduct.filter((element) => element.category === 'Áo khoác')
            .map((element) => {
              return <ProductCard key={element._id} id={element._id} productName={element.productName} pic1={element.images[0]}
                pic2={element.images[1] || element.images[0]} price={element.price} />
            })
        }
      </div>
    </div>
  )
}
export default FeaturedJacket