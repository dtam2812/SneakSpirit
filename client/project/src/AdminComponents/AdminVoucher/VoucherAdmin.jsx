/* eslint-disable react/prop-types */
import { PlusOutlined } from '@ant-design/icons';
import VoucherTable from './VoucherTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../../components/SearchBar';

const VoucherAdmin = ({ listVoucher }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchingValue, setSearchingValue] = useState('');
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [searched, setSearched] = useState(false);
  const [value, setValue] = useState({
    idValue: '',
    voucherName: '',
    type: '',
    discountType: '',
    discount: 0,
    maximumDiscount: 0,
    appliedFor: 0,
    pic: ''
  });

  useEffect(() => {
    //Khi thêm sản phẩm thì sẽ hiện form và không scroll được
    if (isAdding || isEditing) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = 'scroll'
    }

    //Nếu không phải đang thêm hay sửa thì value là rỗng
    if (!isAdding && !isEditing) {
      setValue({
        idValue: '',
        voucherName: '',
        type: '',
        discountType: '',
        discount: 0,
        maximumDiscount: 0,
        appliedFor: 0,
        pic: ''
      });
    }

    //Nếu đang sửa thì lấy giá trị currentVoucher gán vào value
    if (isEditing && currentVoucher) {
      setValue((prev) => ({
        ...prev,
        idValue: currentVoucher._id,
        voucherName: currentVoucher.voucherName,
        type: currentVoucher.type,
        discountType: currentVoucher.discountType,
        discount: currentVoucher.discount,
        maximumDiscount: currentVoucher.maximumDiscount,
        appliedFor: currentVoucher.appliedFor,
        pic: currentVoucher.pic
      }));
    }
  }, [isAdding, isEditing, currentVoucher])

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  //Thêm voucher
  const handleAddVoucher = async () => {
    try {
      //1. Lấy value trên form
      const voucherName = document.getElementById('voucherName').value;
      const type = document.getElementById('type').value;
      const discountType = document.getElementById('discountType').value;
      const discount = document.getElementById('discount').value;
      const maximumDiscount = document.getElementById('maximumDiscount').value
      const appliedFor = document.getElementById('appliedFor').value;
      const pic = document.getElementById('pic').value;

      //2. Gửi value từ client đến server
      if (voucherName !== '' && type !== '' && discount !== '' && appliedFor !== '' && pic !== '') {
        const response = await axios.post(`auth/admin/voucher/create`, {
          voucherName: voucherName,
          type: type,
          discountType: discountType,
          discount: discount,
          maximumDiscount: maximumDiscount,
          appliedFor: appliedFor,
          pic: pic
        });
        setIsAdding(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Cập nhật voucher
  const handleUpdateVoucher = async (voucherId) => {
    try {
      const response = await axios.put(`auth/admin/voucher/update/${voucherId}`, {
        voucherName: value.voucherName,
        type: value.type,
        discountType: value.discountType,
        discount: value.discount,
        maximumDiscount: value.maximumDiscount,
        appliedFor: value.appliedFor,
        pic: value.pic
      });
      setValue({
        idValue: '',
        voucherName: '',
        type: '',
        discountType: '',
        discount: 0,
        maximumDiscount: 0,
        appliedFor: 0,
        pic: ''
      });
      setIsEditing(false);
    } catch (error) {
      if (error.response.status === 401) {
        //solution 1
      }
    }
  }

  return (
    <>
      <div className='text-left'>
        <h2 className='text-2xl'>Quản lý mã khuyến mãi</h2>
        <div className="flex items-center justify-between">
          {/*Nơi thêm voucher*/}
          <div onClick={() => setIsAdding(true)} className='border border-dashed border-black my-3 cursor-pointer text-center w-48'>
            <PlusOutlined className='px-6 py-16 text-5xl' />
          </div>
          {/*Thanh tìm kiếm*/}
          <SearchBar searchingValue={searchingValue} setSearchingValue={setSearchingValue}
            setSearched={setSearched} />
        </div>
        {/*Bảng các voucher*/}
        <VoucherTable listVoucher={listVoucher} setCurrentVoucher={setCurrentVoucher} setIsEditing={setIsEditing}
          searchingValue={searchingValue} searched={searched} />
      </div>
      {
        //Nếu đang thêm hoặc đang sửa thì hiện form
        (isAdding === true || isEditing === true) && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-96 h-auto p-5 border shadow-lg">
              <div >
                <h2 className="text-2xl font-semibold text-center mb-5">Thêm mã khuyến mãi mới</h2>
                <div className="space-y-4 text-left">
                  <form>
                    <label className="block font-medium">
                      Tên mã khuyến mãi <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="voucherName"
                      type="text"
                      value={value.voucherName}
                      onChange={handleChange}
                      placeholder="Tên mã khuyến mãi "
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  <form>
                    <label className="block font-medium">
                      Loại mã <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="type"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                      value={value.type}
                      onChange={handleChange}
                      defaultValue=""
                    >
                      <option value="" disabled hidden>
                        Loại mã
                      </option>
                      <option >Giao hàng</option>
                      <option >Giảm giá</option>
                    </select>
                  </form>
                  <form>
                    <label className="block font-medium">
                      Giảm theo <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="discountType"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                      value={value.discountType}
                      onChange={handleChange}
                      defaultValue=""
                    >
                      <option value="" disabled hidden>
                        Giảm theo
                      </option>
                      <option >Tiền</option>
                      <option >Phần trăm</option>
                    </select>
                  </form>
                  <form>
                    <label className="block font-medium">
                      Giảm <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="discount"
                      type="text"
                      value={value.discount}
                      onChange={handleChange}
                      placeholder="Giảm"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  <form>
                    <label className="block font-medium">
                      Giảm tối đa <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="maximumDiscount"
                      type="text"
                      value={value.maximumDiscount}
                      onChange={handleChange}
                      placeholder="Giảm tối đa"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  <form>
                    <label className="block font-medium">
                      Áp dụng cho đơn hàng trên <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="appliedFor"
                      type="text"
                      value={value.appliedFor}
                      onChange={handleChange}
                      placeholder="Áp dụng cho đơn hàng trên"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  <form>
                    <label className="block font-medium">
                      Hình  <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="pic"
                      type="text"
                      value={value.pic}
                      onChange={handleChange}
                      placeholder=" Hình "
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                </div>
                <div className="flex justify-around mt-8 gap-x-2">
                  <button
                    onClick={() => {
                      setValue({
                        idValue: '',
                        voucherName: '',
                        type: '',
                        discountType: '',
                        discount: 0,
                        maximumDiscount: 0,
                        appliedFor: 0,
                        pic: ''
                      });
                      setIsAdding(false)
                      setIsEditing(false)
                      setCurrentVoucher(null)
                    }}
                    className="border border-gray-800 w-1/2 hover:bg-gray-800 hover:text-white transition-colors py-2 px-6 rounded-lg"
                  >
                    Đóng
                  </button>
                  {isEditing === false ? <button onClick={handleAddVoucher}
                    className="border border-gray-800 w-1/2 bg-black text-white hover:bg-gray-700 transition-colors py-2 px-6 rounded-lg">Chấp nhận
                  </button> : <button onClick={() => handleUpdateVoucher(value.idValue)}
                    className="border border-gray-800 w-1/2 bg-black text-white hover:bg-gray-700 transition-colors py-2 px-6 rounded-lg">Cập nhật
                  </button>}
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  )
}
export default VoucherAdmin