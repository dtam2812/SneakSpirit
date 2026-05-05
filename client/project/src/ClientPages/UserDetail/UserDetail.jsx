import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import InfoUser from "./InfoUser";
import OrdersInfo from "./OrdersInfo";
import ChangePassword from "./ChangePassword";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faCartShopping, faLock, faUserTie } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../components/Breadcrumb";

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [keySelected, setKeySelected] = useState('');

  //Chi tiết user
  useEffect(() => {
    const getProductDetail = async () => {
      try {
        const response = await axios.get(`/auth/admin/user/${id}`);
        setUser(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getProductDetail();
  }, [id])

  //Chọn thông tin user muốn xem
  const renderPage = (key) => {
    switch (key) {
      case 'info': return <InfoUser user={user} />
      case 'orders': return <OrdersInfo user={user} />
      case 'changePassword': return <ChangePassword user={user} />
      default: return <></>
    }
  }

  const handleOnclick = (key) => {
    setKeySelected(key);
  }

  if (!user) {
    return <div className='h-5/6'>Loading...</div>;
  }


  return (
    <div>
      <Breadcrumb first='Thông tin cá nhân' />
      <div className='container'>
        <div className='sm:flex '>
          <div className='p-3 space-y-2 rounded-lg sm:h-[100vh] sm:w-2/5 lg:w-1/5 text-left shadow-xl'>
            <div onClick={() => handleOnclick('info')} className='hover:bg-[#ccc] flex items-center cursor-pointer rounded-lg transition-colors'>
              <FontAwesomeIcon icon={faUser} className='p-5 pr-5' />
              <span className='px-3 '>Thông tin người dùng</span>
            </div>
            <div onClick={() => handleOnclick('orders')} className='hover:bg-[#ccc] flex items-center cursor-pointer rounded-lg transition-colors'>
              <FontAwesomeIcon icon={faCartShopping} className='p-5 pr-5' />
              <span className='px-3'>Đơn hàng</span>
            </div>
            <div onClick={() => handleOnclick('changePassword')} className='hover:bg-[#ccc] flex items-center cursor-pointer rounded-lg transition-colors'>
              <FontAwesomeIcon icon={faLock} className='p-5 pr-5' />
              <span className='px-3'>Đổi mật khẩu</span>
            </div>
            {
              user && user.role === 'admin' && (
                <Link to={'/admin'}>
                  <div className='hover:bg-[#ccc] flex items-center cursor-pointer rounded-lg transition-colors'>
                    <FontAwesomeIcon icon={faUserTie} className='p-5 pr-5' />
                    <span className='px-3'>Admin</span>
                  </div>
                </Link>
              )
            }
          </div>
          <div className='p-4 w-4/5'>
            {renderPage(keySelected)}
          </div>
        </div >
      </div >
    </div>
  )
}
export default UserDetail