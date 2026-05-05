import { useContext, useState } from "react";
import { ProductContext } from "../Context/GetListProduct"
import ProductCard from "../ProductCard";

const AllProducts = () => {
  const { listProduct } = useContext(ProductContext);
  const [sortedProduct, setSortedProduct] = useState(listProduct);

  if (!listProduct) {
    return <div className='h-5/6'>Loading...</div>;
  }

  //Sắp xếp
  const sorting = () => {
    const sortingBy = document.getElementById('sort').value;

    if (sortingBy === 'priceASC') {
      setSortedProduct(listProduct.sort((a, b) => a.price - b.price));
    }
    else if (sortingBy === 'priceDESC') {
      setSortedProduct(listProduct.sort((a, b) => b.price - a.price));
    }
    else if (sortingBy === 'latest') {
      setSortedProduct(listProduct.reverse());
    }
    else {
      setSortedProduct(listProduct);
    }
  }

  return (
    <div className='my-11'>
      <div className=' w-full mt-6 flex justify-between'>
        <h1 className="block w-80 text-4xl hover:text-slate-400 group transition duration-100">
          Tất cả sản phẩm
        </h1>
        <form className=" w-1/6">
          <select onChange={sorting}
            id="sort" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
            <option selected>Sắp xếp theo</option>
            <option value="priceASC">Giá tăng dần</option>
            <option value="priceDESC">Giá giảm dần</option>
            <option value="latest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </form>
      </div>
      <div className='w-full my-3 flex flex-wrap'>
        {
          sortedProduct.map((element) => {
            return <ProductCard key={element._id} id={element._id} productName={element.productName} pic1={element.images[0]}
              pic2={element.images[1] || element.images[0]} price={element.price} />
          })
        }
      </div>
    </div>
  )
}
export default AllProducts