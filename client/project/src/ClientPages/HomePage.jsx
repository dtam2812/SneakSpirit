import "../HomePage.css";
import Banner from "../components/Banner";
import FeaturedProducts from "../components/FeaturedProducts";
import VoucherList from "../components/VoucherList";

function HomePage() {
  return (
    <div className="container">
      <Banner bannerSrc="https://bizweb.dktcdn.net/100/472/913/themes/888429/assets/imgtext_1_img.jpg?1725935235961" />
      {/*Liệt kê voucher*/}
      <VoucherList />

      {/*Sản phẩm nổi bật*/}
      <FeaturedProducts />
    </div>
  );
}

export default HomePage;
