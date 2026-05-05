import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { ProductContext } from "../Context/GetListProduct";
import ProductCard from '../ProductCard';
import removeAccents from 'remove-accents';
import Breadcrumb from "../components/Breadcrumb";

const SearchPage = () => {
  const location = useLocation();
  const { searchingValue } = location.state;
  const { listProduct } = useContext(ProductContext);

  return (
    <div>
      <Breadcrumb first='Tìm kiếm' />
      <div className="container">
        <h2 className='text-left text-3xl p-7'>{`Kết quả cho tìm kiếm "${searchingValue}"`}</h2>
        <div className='w-full my-3 flex flex-wrap'>
          {
            listProduct.filter((element) => {
              const productName = removeAccents(element.productName.toLowerCase());
              const searchValue = removeAccents(searchingValue.toLowerCase());

              return searchValue === '' ? element : productName.includes(searchValue);
            })
              .map((element) => {
                return <ProductCard key={element._id} id={element._id} productName={element.productName} pic1={element.images[0]}
                  pic2={element.images[1] || element.images[0]} price={element.price} />
              })
          }
        </div>
      </div>
    </div>
  )
}
export default SearchPage