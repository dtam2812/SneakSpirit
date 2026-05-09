import axios from "../AdminComponents/Common";
import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Password from "../components/Password";
import Breadcrumb from "../components/Breadcrumb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [forgetPassword, setForgetPassword] = useState(false);
  const [isSeen, setIsSeen] = useState(false);
  const navigate = useNavigate();

  const { setAccessToken } = useOutletContext();

  //Login
  const handleLogin = async () => {
    try {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const response = await axios.post(`api/auth/login`, {
        email: email,
        password: password,
      });
      if (response.status == 200) {
        const accessToken = response.data.accessToken;

        localStorage.setItem("accessToken", accessToken);
        setAccessToken(accessToken);
        const payloadDecoded = jwtDecode(accessToken);

        if (payloadDecoded.role === "customer") {
          navigate("/");
        } else {
          navigate("/admin");
        }
        //save access token đến client
        localStorage.setItem("accessToken", accessToken);
      }
    } catch (error) {
      const message =
        error.response?.data || "Đăng nhập thất bại, vui lòng thử lại";
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
      });
      document.getElementById("password").value = "";
      document.getElementById("email").value = "";
    }
  };

  return (
    <div>
      <Breadcrumb first="Đăng nhập tài khoản" />
      <div className="container">
        <ToastContainer />
        <div className="w-full sm:w-1/2 my-11 mx-auto">
          <div>
            <h2 className="text-2xl">ĐĂNG NHẬP TÀI KHOẢN</h2>
            <div className="py-4">
              <p className="text-lg">
                Bạn chưa có tài khoản ?
                <Link to={"/register"}>
                  {" "}
                  <span className="text-blue-500 text-lg underline cursor-pointer">
                    Đăng ký tại đây
                  </span>
                </Link>
              </p>
            </div>
            {forgetPassword === false ? (
              <>
                <div className="text-left px-5 xl:px-16 w-full space-y-3">
                  <form>
                    <label>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="text"
                      placeholder="Email"
                      className="block border border-[#e1e1e1] p-2 w-full my-2 rounded-md outline-none"
                    />
                  </form>

                  <Password isSeen={isSeen} setIsSeen={setIsSeen} />
                  <p className="text-sm">
                    Quên mật khẩu ? Nhấn vào{" "}
                    <span
                      onClick={() => setForgetPassword(true)}
                      className="text-blue-500 underline cursor-pointer"
                    >
                      đây
                    </span>
                  </p>
                </div>
                <div className="px-16 py-6 w-full">
                  <button
                    onClick={handleLogin}
                    type="button"
                    className="bg-[#919191] w-full py-3 rounded-lg cursor-pointer text-[#fff]"
                  >
                    Đăng nhập
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg py-2">Đặt lại mật khẩu</h3>
                <p className="pb-2">
                  Chúng tôi sẽ gửi cho bạn một email để kích hạot việc đặt lại
                  mật khẩu
                </p>
                <div className="text-left px-5 xl:px-16 w-full space-y-3">
                  <form>
                    <label>
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="text"
                      placeholder="Email"
                      className="block border border-[#e1e1e1] p-2 w-full my-2 rounded-md outline-none"
                    />
                  </form>
                </div>
                <div className="px-16 pt-6 w-full">
                  <button
                    type="submit"
                    className="bg-[#919191] w-full py-3 rounded-lg cursor-pointer text-[#fff]"
                  >
                    Lấy lại mật khẩu
                  </button>
                </div>
                <div className="px-16 py-6 w-full">
                  <button
                    onClick={() => setForgetPassword(false)}
                    className="hover:text-blue-500 w-full pb-3 rounded-lg cursor-pointer"
                  >
                    Quay lại
                  </button>
                </div>
              </>
            )}
            <div>
              <p className="text-[#919191]">Hoặc đăng nhập bằng</p>
              <div className="flex gap-x-2 justify-center py-3">
                <img
                  className="w-1/4 xl:w-2/12 cursor-pointer"
                  src="https://bizweb.dktcdn.net/assets/admin/images/login/fb-btn.svg"
                />
                <img
                  className="w-1/4 xl:w-2/12 cursor-pointer"
                  src="https://bizweb.dktcdn.net/assets/admin/images/login/gp-btn.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
