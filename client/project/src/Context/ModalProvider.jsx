/* eslint-disable react/prop-types */
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const ModalContext = createContext({});

const ModalProvider = ({ children }) => {
  const [isOpenSideMenu, setIsOpenSideMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");
  const decodeJwt = accessToken ? jwtDecode(accessToken) : null;
  const role = decodeJwt?.role;

  useEffect(() => {
    //Khi mở side menu lên thì không scroll được
    if (isOpenSideMenu) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }

    const accessToken = localStorage.getItem("accessToken");
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
      setIsLoggedIn(false);
    }
  }, [isOpenSideMenu, isLoggedIn]);

  //Đăng xuất
  const handleLogoutUser = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken");
    setIsOpenSideMenu(false);
    navigate("/login");
  };

  return (
    <ModalContext.Provider value={{ isOpenSideMenu, setIsOpenSideMenu }}>
      {children}
      {
        //Side menu
        isOpenSideMenu && (
          <div className="fixed inset-0 z-20">
            <div
              className="absolute inset-0 bg-slate-600/60"
              onClick={() => setIsOpenSideMenu(false)}
            ></div>
            <div className="absolute top-32 left-0 h-full w-2/3 bg-white">
              <div className="flex items-center w-full h-20 bg-[#919191] p-4 text-white">
                <p>
                  <FontAwesomeIcon className="text-2xl" icon={faCircleUser} />
                </p>
                {isLoggedIn ? (
                  <div>
                    <div className="px-4">
                      <Link
                        to={`/user/${userId}`}
                        onClick={() => setIsOpenSideMenu(false)}
                      >
                        <p className="text-base cursor-pointer py-1">
                          Tài khoản
                        </p>
                      </Link>
                      {role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpenSideMenu(false)}
                        >
                          <p className="text-sm cursor-pointer pb-1">Quản lý</p>
                        </Link>
                      )}
                      <p
                        onClick={handleLogoutUser}
                        className="text-sm cursor-pointer"
                      >
                        Đăng xuất
                      </p>
                    </div>
                  </div>
                ) : (
                  <Link to={"/login"} onClick={() => setIsOpenSideMenu(false)}>
                    <div className="px-4">
                      <p className="text-base cursor-pointer pb-1">Tài khoản</p>
                      <p className="text-xs cursor-pointer">Đăng nhập</p>
                    </div>
                  </Link>
                )}
              </div>
              <div>
                <Link to={"/"}>
                  <p
                    onClick={() => setIsOpenSideMenu(false)}
                    className="py-2 px-3 cursor-pointer text-left"
                  >
                    Trang chủ
                  </p>
                </Link>
                <Link to={"/introduction"}>
                  <p
                    onClick={() => setIsOpenSideMenu(false)}
                    className="py-2 px-3 cursor-pointer text-left"
                  >
                    Giới thiệu
                  </p>
                </Link>
                <Link to={"/collection"}>
                  <p
                    onClick={() => setIsOpenSideMenu(false)}
                    className="py-2 px-3 cursor-pointer text-left"
                  >
                    Sản phẩm
                  </p>
                </Link>
                <Link to={"/contact"}>
                  <p
                    onClick={() => setIsOpenSideMenu(false)}
                    className="py-2 px-3 cursor-pointer text-left"
                  >
                    Liên hệ
                  </p>
                </Link>
              </div>
            </div>
          </div>
        )
      }
    </ModalContext.Provider>
  );
};
export default ModalProvider;
