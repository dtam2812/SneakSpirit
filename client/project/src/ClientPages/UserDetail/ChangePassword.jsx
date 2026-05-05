/* eslint-disable react/prop-types */
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({ user }) => {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newPassConfirm, setNewPassConfirm] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  //Update password
  const handleUpdateUserPassword = async () => {

    if (newPass !== newPassConfirm) {
      setMessage('Mật khẩu mới và xác nhận không khớp.');
      return;
    }

    try {
      const response = await axios.put(`auth/admin/user/update_password/${user._id}`, {
        oldPassword: oldPass,
        newPassword: newPass,
      });

      if (response.status === 200) {
        setMessage('Đổi mật khẩu thành công!');
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    } catch (error) {
      if (error.response.status === 401) {
        if (error.response && error.response.status === 401) {
          setMessage('Mật khẩu cũ không đúng.');
        }
      }
    }
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='p-3 text-left'>
      <h2 className='text-2xl font-semibold pb-3'>Đổi mật khẩu</h2>
      <div className='space-y-5 text-lg'>
        <form>
          <label className="block font-medium">
            Mật khẩu cũ <span className="text-red-500">*</span>
          </label>
          <input
            id="oldPass"
            type="text"
            placeholder="Mật khẩu cũ"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
          />
        </form>

        <form>
          <label className="block font-medium">
            Mật khẩu mới <span className="text-red-500">*</span>
          </label>
          <input
            id="newPass"
            type="text"
            placeholder="Mật khẩu mới"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
          />
        </form>

        <form>
          <label className="block font-medium">
            Xác nhận lại mật khẩu <span className="text-red-500">*</span>
          </label>
          <input
            id="newPassConfirm"
            type="text"
            placeholder="Xác nhận lại mật khẩu"
            value={newPassConfirm}
            onChange={(e) => setNewPassConfirm(e.target.value)}
            className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
          />
        </form>
        <button onClick={handleUpdateUserPassword} className='border border-[#919191] bg-[#919191] h-10 rounded-lg w-2/3 sm:w-1/4 xl:w-1/6 text-white text-md font-bold hover:text-white hover:opacity-80 transition-colors'>
          Đặt lại mật khẩu
        </button>
        {message && <p className='text-red-500 pt-2'>{message}</p>}
      </div>
    </div>
  )
}
export default ChangePassword