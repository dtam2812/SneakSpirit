import { Link } from "react-router-dom";
import "../HomePage.css";
import Banner from "../components/Banner";
import FeaturedProducts from "../components/FeaturedProducts";
import VoucherList from "../components/VoucherList";

function HomePage() {
  return (
    <div className="container">
      <Link to="/collection">
        <Banner bannerSrc="/banner2.jpg" />
      </Link>
      {/*Liệt kê voucher*/}
      <VoucherList />

      {/*Sản phẩm nổi bật*/}
      <FeaturedProducts />
    </div>
  );
}

export default HomePage;
