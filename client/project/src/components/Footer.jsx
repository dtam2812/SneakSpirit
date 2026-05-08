import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronDown,
  faLocationDot,
  faMobileScreenButton,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showPolicy, setShowPolicy] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);

  return (
    <footer className=" bg-[#2e2e2e] text-[#a9a9a9]">
      <div className="container">
        <div className="xl:flex py-20 gap-x-5 px-2 sm:px-8">
          <div className="xl:w-1/4 ">
            <img
              className="w-60 h-40 sm:mx-auto lg:mx-0"
              src="./public/logo.png"
              alt=""
            />
            <div className="flex gap-x-3 items-center pb-2 ">
              <p>
                <FontAwesomeIcon icon={faLocationDot} />
              </p>
              <p>Địa chỉ: Thủ Đức, TP. Hồ Chí Minh</p>
            </div>
            <div className="flex gap-x-3 items-center pb-2">
              <p>
                <FontAwesomeIcon icon={faMobileScreenButton} />
              </p>
              <p>Số điện thoại: 0396528253</p>
            </div>
            <div className="flex gap-x-3 items-center pb-2">
              <p>
                <FontAwesomeIcon icon={faEnvelope} />
              </p>
              <p>Email: 23521384@gm.uit.edu.vn</p>
            </div>
            <div className="text-left space-y-2">
              <p>
                © Bản quyền thuộc về Sneak Spirit | Cung cấp bởi{" "}
                <a
                  className="cursor-pointer hover:text-blue-300"
                  target="_blank"
                  href="https://www.sapo.vn/?utm_campaign=cpn:site_khach_hang-plm:footer&utm_source=site_khach_hang&utm_medium=referral&utm_content=fm:text_link-km:-sz:&utm_term=&campaign=site_khach_hang"
                >
                  Sapo
                </a>
              </p>
              <p>CÔNG TY TNHH MTV Sneak Spirit</p>
              <p>MST: 3901347965</p>
              <p>Ngày cấp: 01/07/2024</p>
              <p>Nơi cấp: Sở Kế Hoạch Và Đầu Tư TP. Hồ Chí Minh</p>
            </div>
          </div>
          <div className="xl:w-1/4 pt-10 xl:pt-0 text-left xl:relative sm:flex-none flex justify-between">
            <div className="space-y-2">
              <h3 className="font-bold">Chính sách</h3>
              <div
                className={`space-y-2 ${showPolicy ? "block" : "hidden"} sm:block`}
              >
                <Link to={"/dataSecurityPolicy"} className="block">
                  <p className="cursor-pointer hover:text-blue-300">
                    Chính sách bảo mật thông tin
                  </p>
                </Link>
                <Link to={"/policy"} className="block">
                  <p className="cursor-pointer hover:text-blue-300">
                    Chính sách bảo mật thông tin cá nhân
                  </p>
                </Link>
                <Link to={"/transportPolicy"} className="block">
                  <p className="cursor-pointer hover:text-blue-300">
                    Chính sách vận chuyển
                  </p>
                </Link>
                <Link to={"/generalTransactionPolicy"} className="block">
                  <p className="cursor-pointer hover:text-blue-300">
                    Chính sách giao dịch chung
                  </p>
                </Link>
                <Link to={"/paymentPolicy"} className="block">
                  <p className="cursor-pointer hover:text-blue-300">
                    Chính sách thanh toán
                  </p>
                </Link>
                <div className="xl:flex xl:absolute xl:bottom-0 hidden">
                  <a
                    href="http://online.gov.vn/Home/WebDetails/122551"
                    target="_blank"
                  >
                    <img
                      src="https://bizweb.dktcdn.net/100/472/913/themes/888429/assets/logo_bct.png?1725935235961"
                      alt=""
                    />
                  </a>
                </div>
              </div>
            </div>
            <div>
              <p
                onClick={() => setShowPolicy(!showPolicy)}
                className={`cursor-pointer sm:hidden ${showPolicy === true ? "rotate-180" : ""}`}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </p>
            </div>
          </div>
          <div className="xl:w-1/5 xl:pt-0 pt-10 text-left sm:flex-none flex justify-between transition-all">
            <div className="space-y-2">
              <h3 className="font-bold">Thông tin hỗ trợ</h3>
              <div
                className={`space-y-2 ${showInstruction ? "block" : "hidden"} sm:block`}
              >
                <Link to={"/instruction"} className="block">
                  <p className="cursor-pointer hover:text-blue-300">
                    Hướng dẫn mua hàng
                  </p>
                </Link>
                <Link to={"/instruction"} className="block">
                  <p className="cursor-pointer hover:text-blue-300">
                    Hướng dẫn thanh toán
                  </p>
                </Link>
                <Link to={"/instruction"} className="block">
                  <p className="cursor-pointer hover:text-blue-300">
                    Hướng dẫn giao nhận
                  </p>
                </Link>
                <Link to={"/terms"} className="block">
                  <p className="cursor-pointer hover:text-blue-300">
                    Điều khoản dịch vụ
                  </p>
                </Link>
              </div>
            </div>
            <div>
              <p
                onClick={() => setShowInstruction(!showInstruction)}
                className={`cursor-pointer sm:hidden ${showInstruction === true ? "rotate-180" : ""}`}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </p>
            </div>
          </div>
          <div className="w-full sm:w-1/2 xl:w-1/4 text-left xl:pt-0 pt-10 space-y-2">
            <h3 className="font-bold">Fanpage</h3>
            <p className="cursor-pointer text-blue-300">
              <a
                href="https://www.facebook.com/tam.dinh.31924792/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </p>
            <p>Bạn muốn nhận khuyến mãi đặc biệt? Đăng ký ngay.</p>
            <form className="relative flex items-center py-3">
              <input
                className="w-full p-2 py-3 rounded-3xl"
                type="text"
                placeholder="Nhập địa chỉ email"
              />
              <button className="absolute bg-[#2e2e2e] text-white p-2 w-1/4 rounded-3xl right-0 mx-1 ">
                Đăng ký
              </button>
            </form>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/tam.dinh.31924792/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="https://bizweb.dktcdn.net/100/472/913/themes/888429/assets/facebook.png?1725935235961" />
              </a>
              <a
                href="https://id.zalo.me/account?continue=http%3A%2F%2Fzalo%2Eme%2F0383300680"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="https://bizweb.dktcdn.net/100/472/913/themes/888429/assets/zalo.png?1725935235961" />
              </a>
              <a
                href="https://www.instagram.com/hybidshop/?igshid=MzNlNGNkZWQ4Mg%3D%3D"
                target="_blank"
              >
                <img src="https://bizweb.dktcdn.net/100/472/913/themes/888429/assets/instagram.png?1725935235961" />
              </a>
              <a href="https://www.youtube.com/c/L%C3%A2mVlog" target="_blank">
                <img src="https://bizweb.dktcdn.net/100/472/913/themes/888429/assets/youtube.png?1725935235961" />
              </a>
              <a href="https://www.tiktok.com/@lamvlog" target="_blank">
                <img src="https://bizweb.dktcdn.net/100/472/913/themes/888429/assets/tiktok.png?1725935235961" />
              </a>
            </div>
          </div>
          <div className="flex pt-4 xl:hidden">
            <a
              href="http://online.gov.vn/Home/WebDetails/122551"
              target="_blank"
            >
              <img
                src="https://bizweb.dktcdn.net/100/472/913/themes/888429/assets/logo_bct.png?1725935235961"
                alt=""
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
