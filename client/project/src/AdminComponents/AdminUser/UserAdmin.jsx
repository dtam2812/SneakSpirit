/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { PlusOutlined } from '@ant-design/icons';
import UserTable from './UserTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../../components/SearchBar';

const UserAdmin = ({ listUser }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchingValue, setSearchingValue] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    //Khi thêm sản phẩm thì sẽ hiện form và không scroll được
    if (isAdding) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = 'scroll'
    }
  }, [isAdding])

  //Thêm user
  const handleAddUser = async () => {
    try {
      //1. Lấy value trên form
      const lastName = document.getElementById('lastName').value;
      const firstName = document.getElementById('firstName').value;
      const userName = `${lastName} ${firstName}`;

      const telephone = document.getElementById('telephone').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;

      //2. Gửi value từ client đến server
      if (userName !== '' && telephone !== '' && email !== '' && password !== '' && role !== '') {
        const response = await axios.post(`auth/admin/user/create`, {
          userName: userName,
          telephone: telephone,
          email: email,
          password: password,
          role: role
        });
        setIsAdding(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className='text-left'>
        <h2 className='text-2xl'>Quản lý người dùng</h2>
        <div className="flex items-center justify-between">
          {/*Nơi thêm user*/}
          <div onClick={() => setIsAdding(true)} className='border border-dashed border-black my-3 cursor-pointer text-center w-48'>
            <PlusOutlined className='px-6 py-16 text-5xl' />
          </div>
          {/*Thanh tìm kiếm*/}
          <SearchBar searchingValue={searchingValue} setSearchingValue={setSearchingValue}
            setSearched={setSearched} />
        </div>
        {/*Table các user*/}
        <UserTable listUser={listUser} searchingValue={searchingValue} searched={searched} />
      </div>
      {
        //Khi đang thêm user thì form hiện
        isAdding === true && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-96 h-auto p-5 border shadow-lg">
              <div>
                <h2 className="text-2xl font-semibold text-center mb-5">Thêm người dùng mới</h2>
                <div className="space-y-4 text-left">
                  <form>
                    <label className="block font-medium">
                      Họ <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Họ"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  <form>
                    <label className="block font-medium">
                      Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Tên"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  <form>
                    <label className="block font-medium">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="telephone"
                      type="tel"
                      placeholder="Số điện thoại"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  <form>
                    <label className="block font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="text"
                      placeholder="Email"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  <form>
                    <label className="block font-medium">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Mật khẩu"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  <form>
                    <label className="block font-medium">
                      Vai trò <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="role"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                      defaultValue=""
                    >
                      <option value="" disabled hidden>
                        Chọn vai trò
                      </option>
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </form>

                </div>
                <div className="flex justify-around mt-8 gap-x-2">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="border border-gray-800 w-1/2 hover:bg-gray-800 hover:text-white transition-colors py-2 px-6 rounded-lg"
                  >
                    Đóng
                  </button>
                  <button onClick={handleAddUser} className="border border-gray-800 w-1/2 bg-black text-white hover:bg-gray-700 transition-colors py-2 px-6 rounded-lg">
                    Chấp nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}
export default UserAdmin