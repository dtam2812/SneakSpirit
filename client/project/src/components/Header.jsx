/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faCartShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "../Context/ModalProvider";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Header = ({ cartList, setCartList, setAccessToken, accessToken }) => {
  const { isOpenSideMenu, setIsOpenSideMenu } = useContext(ModalContext);
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchingValue, setSearchingValue] = useState("");
  const navigate = useNavigate();

  const decodedPayload = accessToken ? jwtDecode(accessToken) : null;
  const role = decodedPayload ? decodedPayload.role : null;

  //Quản lý đăng nhập
  useEffect(() => {
    if (accessToken) {
      try {
        const decodeJwt = jwtDecode(accessToken);
        if (decodeJwt) {
          setUserId(decodeJwt._id);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsLoggedIn(false);
      }
    } else {
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [accessToken, isLoggedIn]);

  //Đăng xuất
  const handleLogoutUser = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setTimeout(() => setCartList([]), 100); // Delay để tránh ghi đè localStorage ngay lập tức
    setAccessToken(null);
    navigate("/login");
  };

  const handleUserInfoPage = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) navigate("/login");
  };

  return (
    <header className="shadow-md z-50 sticky top-0 bg-white">
      <div className="container">
        <nav className="bg-white relative border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 ">
          <div className="flex justify-between items-center mx-auto">
            <button
              onClick={() => setIsOpenSideMenu(!isOpenSideMenu)}
              data-collapse-toggle="navbar-default"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg sm:hidden "
              aria-controls="navbar-default"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
            <Link to="/">
              <p
                className={`flex items-center ${isSearching ? "sm:flex hidden" : ""}`}
              >
                <img src="./public/logo.png" className="mr-3 w-36 h-28 " />
              </p>
            </Link>

            {isSearching ? (
              <div className=" flex sm:w-3/5 lg:w-2/5 gap-x-2 items-center">
                <form className="w-4/5">
                  <label className="mb-2 text-sm font-medium text-gray-900 sr-only">
                    Search
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                    <input
                      value={searchingValue}
                      onChange={(e) => setSearchingValue(e.target.value)}
                      type="search"
                      id="search"
                      className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-5"
                      placeholder="Tìm kiếm"
                    />
                    <Link
                      to={"/search"}
                      onClick={() => {
                        setIsSearching(false);
                        setTimeout(() => setSearchingValue(""), 100);
                      }}
                      state={{ searchingValue }}
                    >
                      <button
                        type="button"
                        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-xs sm:text-sm px-2 sm:px-4 py-2 "
                      >
                        Tìm kiếm
                      </button>
                    </Link>
                  </div>
                </form>
                <button
                  onClick={() => {
                    setIsSearching(false);
                    setSearchingValue("");
                  }}
                  type="button"
                  className="text-white bg-slate-700 hover:bg-slate-800 font-medium rounded-lg text-xs sm:text-sm w-14 sm:w-1/5 lg:px-4 h-9"
                >
                  Trở về
                </button>
              </div>
            ) : (
              <div
                className="hidden justify-between items-center w-full md:flex md:w-auto"
                id="mobile-menu-2"
              >
                <ul className="flex flex-col mt-4 font-medium md:flex-row lg:space-x-8 lg:mt-0">
                  <li>
                    <Link>
                      <a className="block py-2 pr-2 pl-3 cursor-pointer hover:text-slate-400 group transition duration-300">
                        Trang chủ
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/introduction"}>
                      <a className="block py-2 pr-2 pl-3 cursor-pointer hover:text-slate-400 group transition duration-300">
                        Giới thiệu
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/collection"}>
                      <a className="block py-2 pr-2 pl-3 cursor-pointer hover:text-slate-400 group transition duration-300">
                        Sản phẩm
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/contact"}>
                      <a className="block py-2 pr-2 pl-3 cursor-pointer hover:text-slate-400 group transition duration-300">
                        Liên hệ
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
                      </a>
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            <div className="flex items-center ">
              <p
                onClick={() => setIsSearching(true)}
                data-popover-target="popover-hover"
                data-popover-trigger="hover"
                className={`${isSearching ? "sm:block hidden" : ""} cursor-pointer size-9 rounded-lg px-4 lg:px-5 py-2 mr-2`}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </p>
              <div
                className="relative"
                onMouseEnter={() => setPopoverVisible(true)}
                onMouseLeave={() => setPopoverVisible(false)}
              >
                <p
                  onClick={handleUserInfoPage}
                  className="cursor-pointer hidden sm:block size-9 rounded-lg px-4 lg:px-5 py-2 mr-2"
                >
                  <FontAwesomeIcon icon={faUser} />
                </p>
                {isPopoverVisible && (
                  <div
                    id="popover-hover"
                    role="tooltip"
                    className="absolute z-50 inline-block w-36 -translate-x-16 bg-[#333] text-sm text-[#fff] rounded-lg shadow-sm dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
                  >
                    {isLoggedIn === false ? (
                      <>
                        <Link to="/login">
                          <div className="px-3 py-2 cursor-pointer hover:bg-slate-500 transition-colors rounded-lg">
                            <p>Đăng nhập</p>
                          </div>
                        </Link>
                        <Link to="/register">
                          <div className="px-3 py-2 cursor-pointer hover:bg-slate-500 transition-colors rounded-lg">
                            <p>Đăng ký</p>
                          </div>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to={`/user/${userId}`}>
                          <div className="px-3 py-2 cursor-pointer hover:bg-slate-500 transition-colors rounded-lg">
                            <p>Tài khoản</p>
                          </div>
                        </Link>
                        {role === "admin" && (
                          <Link to={`/admin`}>
                            <div className="px-3 py-2 cursor-pointer hover:bg-slate-500 transition-colors rounded-lg">
                              <p>Quản lý</p>
                            </div>
                          </Link>
                        )}
                        <div
                          onClick={handleLogoutUser}
                          className="px-3 py-2 cursor-pointer hover:bg-slate-500 transition-colors rounded-lg"
                        >
                          <p>Đăng xuất</p>
                        </div>
                      </>
                    )}
                    <div data-popper-arrow></div>
                  </div>
                )}
              </div>
              <Link to={isLoggedIn ? "/cart" : "/login"}>
                <div className="relative">
                  <p className=" cursor-pointer size-9 rounded-lg px-4 lg:px-5 py-2 mr-2">
                    <FontAwesomeIcon icon={faCartShopping} />
                  </p>
                  <div className="absolute w-4 h-4 bg-red-600 rounded-lg text-xs text-white top-0 right-0">
                    <p>{cartList.length}</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
export default Header;
