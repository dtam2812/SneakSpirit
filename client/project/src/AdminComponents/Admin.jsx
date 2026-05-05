import { AppstoreOutlined, MailOutlined, MessageOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { useContext, useEffect, useState } from 'react';
import VoucherAdmin from './AdminVoucher/VoucherAdmin';
import UserAdmin from './AdminUser/UserAdmin';
import ProductAdmin from './AdminProduct/ProductAdmin'
import axios from './Common';
import { useNavigate } from 'react-router-dom';
import { ProductContext } from '../Context/GetListProduct';
import { VoucherContext } from '../Context/GetListVoucher';
import OrderTable from './AdminOrder/OrderTable';
import ContactTable from './AdminContact/ContactTable';

const Admin = () => {
  const [keySelected, setKeySelected] = useState('');
  const [listUser, setListUser] = useState([])
  const navigate = useNavigate();

  const { listProduct, setListProduct } = useContext(ProductContext);
  const { listVoucher, setListVoucher } = useContext(VoucherContext);

  //Lấy danh sách user
  useEffect(() => {
    const getListUser = async () => {
      try {
        const response = await axios.get(`/auth/admin/user`);
        setListUser(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    getListUser();
  }, [listUser]);


  //Chọn page quản lý
  const renderPage = (key) => {
    switch (key) {
      case 'user': return <UserAdmin listUser={listUser} />
      case 'product': return <ProductAdmin listProduct={listProduct} setListProduct={setListProduct} />
      case 'voucher': return <VoucherAdmin listVoucher={listVoucher} setListVoucher={setListVoucher} />
      case 'order': return <OrderTable />
      case 'contact': return <ContactTable />
      default: return <></>
    }
  }

  const handleOnclick = (key) => {
    setKeySelected(key);
  }

  return (
    <div className='container'>
      <div className='flex '>
        <div className='p-3 space-y-2 h-[100vh] w-1/5 text-left shadow-xl'>
          <div onClick={() => handleOnclick('user')} className='hover:bg-[#ccc] cursor-pointer rounded-lg transition-colors'>
            <UserOutlined className='p-5 pr-5 ' />
            <span className='px-3'>Người dùng</span>
          </div>
          <div onClick={() => handleOnclick('product')} className='hover:bg-[#ccc] cursor-pointer rounded-lg transition-colors'>
            <AppstoreOutlined className='p-5 pr-5' />
            <span className='px-3'>Sản phẩm</span>
          </div>
          <div onClick={() => handleOnclick('voucher')} className='hover:bg-[#ccc] cursor-pointer rounded-lg transition-colors'>
            <MailOutlined className='p-5 pr-5' />
            <span className='px-3'>Mã khuyến mãi</span>
          </div>
          <div onClick={() => handleOnclick('order')} className='hover:bg-[#ccc] cursor-pointer rounded-lg transition-colors'>
            <ShoppingCartOutlined className='p-5 pr-5' />
            <span className='px-3'>Đơn hàng</span>
          </div>
          <div onClick={() => handleOnclick('contact')} className='hover:bg-[#ccc] cursor-pointer rounded-lg transition-colors'>
            <MessageOutlined className='p-5 pr-5' />
            <span className='px-3'>Liên hệ</span>
          </div>
        </div>
        <div className='p-4 w-4/5'>
          {renderPage(keySelected)}
        </div>
      </div >
    </div >
  );
};
export default Admin;