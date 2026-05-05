import Banner from "../components/Banner"
import VoucherList from "../components/VoucherList"
import AllProducts from "../components/AllProducts"
import Breadcrumb from "../components/Breadcrumb"

const Collection = () => {
  return (
    <div>
      <Breadcrumb first='Tất cả sản phẩm' />
      <div className="container">
        <Banner bannerSrc='https://bizweb.dktcdn.net/100/472/913/themes/888429/assets/collection_main_banner.jpg?1725935235961' />
        {/*Liệt kê voucher*/}
        <VoucherList />
        {/*Liệt kê sản phẩm*/}
        <AllProducts />
        <div>
        </div>
      </div>
    </div>
  )
}
export default Collection