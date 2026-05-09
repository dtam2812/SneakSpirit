import { useState } from "react";
import axios from "../AdminComponents/Common";
import { Link, useNavigate } from "react-router-dom";
import Password from "../components/Password";
import Breadcrumb from "../components/Breadcrumb";

const Register = () => {
  const navigate = useNavigate();
  const [isSeen, setIsSeen] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    const telephone = document.getElementById("telephone").value;
    const email = document.getElementById("email").value;

    if (!/^\d+$/.test(telephone)) {
      newErrors.telephone = "Số điện thoại chỉ được chứa chữ số";
    }

    if (!email.includes("@")) {
      newErrors.email = "Email không hợp lệ, phải chứa @";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  //Đăng ký user
  const handleRegister = async () => {
    if (!validate()) return;

    try {
      //1. Lấy value trên form
      const lastName = document.getElementById("lastName").value;
      const firstName = document.getElementById("firstName").value;
      const userName = `${lastName} ${firstName}`;

      const telephone = document.getElementById("telephone").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      //2. Gửi value từ client đến server
      const response = await axios.post(`api/auth/register`, {
        userName: userName,
        telephone: telephone,
        email: email,
        password: password,
      });
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Breadcrumb first="Đăng ký tài khoản" />
      <div className="container">
        <div className="w-full sm:w-1/2 my-11 mx-auto">
          <div>
            <h2 className="text-2xl">ĐĂNG KÝ TÀI KHOẢN</h2>
            <div className="py-4">
              <p className="text-lg">
                Bạn đã có tài khoản ?
                <Link to={"/login"}>
                  {" "}
                  <span className="text-blue-500 text-lg underline cursor-pointer">
                    Đăng nhập tại đây
                  </span>
                </Link>
              </p>
            </div>
            <h3 className="text-xl py-5">THÔNG TIN CÁ NHÂN</h3>
            <div className="text-left px-5 xl:px-16 w-full space-y-3">
              <form>
                <label>
                  Họ <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Họ"
                  className="block border border-[#e1e1e1] p-2 w-full my-2 rounded-md outline-none"
                />
              </form>

              <form>
                <label>
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Tên"
                  className="block border border-[#e1e1e1] p-2 w-full my-2 rounded-md outline-none"
                />
              </form>

              <form>
                <label>
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  id="telephone"
                  type="tel"
                  placeholder="Số điện thoại"
                  // onKeyDown chặn nhập ký tự không phải số
                  onKeyDown={(e) => {
                    const allowed = [
                      "Backspace",
                      "Delete",
                      "ArrowLeft",
                      "ArrowRight",
                      "Tab",
                    ];
                    if (!/^\d$/.test(e.key) && !allowed.includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className={`block border p-2 w-full my-2 rounded-md outline-none ${errors.telephone ? "border-red-500" : "border-[#e1e1e1]"}`}
                />
                {errors.telephone && (
                  <p className="text-red-500 text-sm">{errors.telephone}</p>
                )}
              </form>

              <form>
                <label>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="Email"
                  className={`block border p-2 w-full my-2 rounded-md outline-none ${errors.email ? "border-red-500" : "border-[#e1e1e1]"}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </form>

              <Password isSeen={isSeen} setIsSeen={setIsSeen} />
            </div>
            <div className="px-16 py-6 w-full">
              <button
                onClick={handleRegister}
                type="button"
                className="bg-[#919191] w-full py-3 rounded-lg cursor-pointer text-[#fff]"
              >
                Đăng ký
              </button>
            </div>
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
export default Register;
