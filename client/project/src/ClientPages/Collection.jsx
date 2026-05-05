import Banner from "../components/Banner";
import VoucherList from "../components/VoucherList";
import AllProducts from "../components/AllProducts";
import Breadcrumb from "../components/Breadcrumb";

const Collection = () => {
  return (
    <div>
      <Breadcrumb first="Tất cả sản phẩm" />
      <div className="container">
        <Banner bannerSrc="./public/banner1.png" />
        {/*Liệt kê voucher*/}
        <VoucherList />
        {/*Liệt kê sản phẩm*/}
        <AllProducts />
        <div></div>
      </div>
    </div>
  );
};
export default Collection;
