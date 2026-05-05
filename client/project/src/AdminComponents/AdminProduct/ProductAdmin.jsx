/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { PlusOutlined } from '@ant-design/icons';
import ProductTable from './ProductTable';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchBar from '../../components/SearchBar';

const ProductAdmin = ({ listProduct, setListProduct }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [searchingValue, setSearchingValue] = useState('');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searched, setSearched] = useState(false);
  const [value, setValue] = useState({
    idValue: '',
    productName: '',
    price: 0,
    sizes: {
      S: 0,
      M: 0,
      L: 0,
      XL: 0
    },
    Category: '',
    quantity: 0,
    description: '',
    pic1: '',
    pic2: '',
    pic3: '',
    pic4: ''
  })
  const [sortedProduct, setSortedProduct] = useState(listProduct);

  useEffect(() => {
    //Khi thêm sản phẩm thì sẽ hiện form và không scroll được
    if (isAdding || isEditing) {
      document.body.style.overflow = 'hidden'
    }
    else {
      document.body.style.overflow = 'scroll'
    }

    //Nếu không thêm hay sửa thì state value là rỗng
    if (!isAdding && !isEditing) {
      setValue({
        idValue: '',
        productName: '',
        price: 0,
        sizes: {
          S: 0,
          M: 0,
          L: 0,
          XL: 0
        },
        Category: '',
        quantity: 0,
        description: '',
        pic1: '',
        pic2: '',
        pic3: '',
        pic4: ''
      });
    }

    //Nếu đang sửa thì lấy giá trị currentProduct gán vào value
    if (isEditing && currentProduct) {
      setValue((prev) => ({
        ...prev,
        idValue: currentProduct._id || '',
        productName: currentProduct.productName || '',
        price: currentProduct.price || 0,
        sizes: {
          S: currentProduct.sizes.S || 0,
          M: currentProduct.sizes.M || 0,
          L: currentProduct.sizes.L || 0,
          XL: currentProduct.sizes.XL || 0,
        },
        quantity: currentProduct.quantity || 0,
        description: currentProduct.description || '',
        Category: currentProduct.category || '',
        pic1: currentProduct.images?.[0] || '',
        pic2: currentProduct.images?.[1] || '',
        pic3: currentProduct.images?.[2] || '',
        pic4: currentProduct.images?.[3] || ''
      }));
    }
  }, [isAdding, isEditing, currentProduct])

  const handleChange = (e) => {
    const { id, value } = e.target;

    setValue((prev) => {
      if (id.startsWith("size")) {
        const sizeKey = id.replace("size", "");

        return {
          ...prev,
          sizes: {
            ...prev.sizes,
            [sizeKey]: value
          }
        };
      }

      return {
        ...prev,
        [id]: value
      };
    });
  };

  //Cập nhật sản phẩm
  const handleUpdateProduct = async (productId) => {
    try {
      const response = await axios.put(`auth/admin/product/update/${productId}`, {
        productName: value.productName,
        price: value.price,
        sizes: {
          S: value.sizes.S,
          M: value.sizes.M,
          L: value.sizes.L,
          XL: value.sizes.XL,
        },
        quantity: value.quantity,
        description: value.description,
        category: value.Category,
        images: [value.pic1, value.pic2, value.pic3, value.pic4]
      });
      setValue({
        idValue: '',
        productName: '',
        price: 0,
        sizes: {
          S: 0,
          M: 0,
          L: 0,
          XL: 0
        },
        Category: '',
        quantity: 0,
        description: '',
        pic1: '',
        pic2: '',
        pic3: '',
        pic4: ''
      });
      setIsEditing(false);
    } catch (error) {
      if (error.response.status === 401) {
        //solution 1
      }
    }
  }

  //Thêm sản phẩm
  const handleAddProduct = async () => {
    try {
      //1. Lấy value trên form
      const productName = document.getElementById('productName')?.value;
      const sizeS = document.getElementById('sizeS')?.value;
      const sizeM = document.getElementById('sizeM')?.value;
      const sizeL = document.getElementById('sizeL')?.value;
      const sizeXL = document.getElementById('sizeXL')?.value;
      const price = document.getElementById('price')?.value;
      const category = document.getElementById('Category')?.value;
      const quantity = document.getElementById('quantity')?.value;
      const description = document.getElementById('description')?.value;
      const pic1 = document.getElementById('pic1')?.value;
      const pic2 = document.getElementById('pic2')?.value;
      const pic3 = document.getElementById('pic3')?.value;
      const pic4 = document.getElementById('pic4')?.value;

      //2. Gửi value từ client đến server
      const response = await axios.post(`auth/admin/product/create`, {
        productName: productName,
        category: category,
        price: price,
        sizes: {
          S: sizeS,
          M: sizeM,
          L: sizeL,
          XL: sizeXL,
        },
        quantity: quantity,
        description: description,
        images: [pic1, pic2, pic3, pic4]
      });
      setIsAdding(false);
    } catch (error) {
      console.log(error);
    }
  }

  //Function sắp xếp
  const sorting = () => {
    const sortingBy = document.getElementById('sort').value;

    if (sortingBy === 'priceASC') {
      setSortedProduct(listProduct.sort((a, b) => a.price - b.price));
    }
    else if (sortingBy === 'priceDESC') {
      setSortedProduct(listProduct.sort((a, b) => b.price - a.price));
    }
    else if (sortingBy === 'latest') {
      setSortedProduct(listProduct.reverse());
    }
    else {
      setSortedProduct(listProduct);
    }
  }
  return (
    <>
      <div className='text-left'>
        <h2 className='text-2xl'>Quản lý sản phẩm</h2>
        <div className="flex items-center justify-between">
          {/*Nơi thêm sản phẩm*/}
          <div onClick={() => setIsAdding(true)} className='border border-dashed border-black my-3 cursor-pointer text-center w-48'>
            <PlusOutlined className='px-6 py-16 text-5xl' />
          </div>
          <div className='w-2/5'>
            {/*Thanh tìm kiếm*/}
            <SearchBar searchingValue={searchingValue} setSearchingValue={setSearchingValue}
              setSearched={setSearched} productTable={true} />
            {/*Thanh sắp xếp*/}
            <form className=" mx-auto w-2/5">
              <select onChange={sorting}
                id="sort" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <option selected>Sắp xếp theo</option>
                <option value="priceASC">Giá tăng dần</option>
                <option value="priceDESC">Giá giảm dần</option>
                <option value="latest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </form>
          </div>
        </div>
        {/*Bảng các sản phẩm*/}
        <ProductTable listProduct={sortedProduct} setIsEditing={setIsEditing} setCurrentProduct={setCurrentProduct}
          searchingValue={searchingValue} searched={searched} />
      </div>
      {
        //Nếu đang thêm hoặc đang sửa thì hiện form
        (isAdding === true || isEditing === true) && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg w-1/3 h-auto p-5 border shadow-lg">
              <div>
                <h2 className="text-2xl font-semibold text-center mb-5">Thêm sản phẩm mới</h2>
                <div className="space-y-4 text-left">
                  <form>
                    <label className="block font-medium">
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="productName"
                      type="text"
                      value={value.productName}
                      onChange={handleChange}
                      placeholder="Tên sản phẩm"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  <form>
                    <label className="block font-medium">
                      Loại <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="Category"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                      value={value.Category}
                      onChange={handleChange}
                    >
                      <option value="" disabled hidden>Chọn loại sản phẩm</option>
                      <option value="Quần">Quần</option>
                      <option value="Áo sơ mi">Áo sơ mi</option>
                      <option value="Áo thun">Áo thun</option>
                      <option value="Áo khoác">Áo khoác</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </form>
                  <form>
                    <label className="block font-medium">
                      Giá <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="price"
                      type="text"
                      value={value.price}
                      onChange={handleChange}
                      placeholder="Giá"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  {value.Category !== 'Khác' ? (
                    <div>
                      <h2 className='pb-2'>Size</h2>
                      <div className='flex gap-x-5'>
                        <form>
                          <label className="block font-medium">
                            S <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="sizeS"
                            type="number"
                            value={value.sizes.S}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                          />
                        </form>
                        <form>
                          <label className="block font-medium">
                            M <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="sizeM"
                            type="number"
                            value={value.sizes.M}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                          />
                        </form>
                        <form>
                          <label className="block font-medium">
                            L <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="sizeL"
                            type="number"
                            value={value.sizes.L}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                          />
                        </form>
                        <form>
                          <label className="block font-medium">
                            XL <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="sizeXL"
                            type="number"
                            value={value.sizes.XL}
                            onChange={handleChange}
                            className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                          />
                        </form>
                      </div>
                    </div>
                  ) :
                    (<form>
                      <label className="block font-medium">
                        Số lượng <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="quantity"
                        type="number"
                        value={value.quantity}
                        onChange={handleChange}
                        placeholder="Số lượng"
                        className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                      />
                    </form>)
                  }
                  <form>
                    <label className="block font-medium">
                      Mô tả <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      type="text"
                      value={value.description}
                      onChange={handleChange}
                      placeholder="Mô tả"
                      className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                    />
                  </form>
                  <div className='flex gap-x-5'>
                    <form>
                      <label className="block font-medium">
                        Hình 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pic1"
                        type="text"
                        value={value.pic1}
                        onChange={handleChange}
                        placeholder="Hình 1"
                        className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                      />
                    </form>
                    <form>
                      <label className="block font-medium">
                        Hình 2 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pic2"
                        type="text"
                        value={value.pic2}
                        onChange={handleChange}
                        placeholder="Hình 2"
                        className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                      />
                    </form>
                    <form>
                      <label className="block font-medium">
                        Hình 3 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pic3"
                        type="text"
                        value={value.pic3}
                        onChange={handleChange}
                        placeholder="Hình 3"
                        className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                      />
                    </form>
                    <form>
                      <label className="block font-medium">
                        Hình 4 <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="pic4"
                        type="text"
                        value={value.pic4}
                        onChange={handleChange}
                        placeholder="Hình 4"
                        className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                      />
                    </form>
                  </div>
                </div>
                <div className="flex justify-around mt-8 gap-x-2">
                  <button
                    onClick={() => {
                      setValue({
                        idValue: '',
                        productName: '',
                        price: 0,
                        sizes: {
                          S: 0,
                          M: 0,
                          L: 0,
                          XL: 0
                        },
                        Category: '',
                        quantity: 0,
                        description: '',
                        pic1: '',
                        pic2: '',
                        pic3: '',
                        pic4: ''
                      });
                      setIsAdding(false)
                      setIsEditing(false)
                      setCurrentProduct(null)
                    }}
                    className="border border-gray-800 w-1/2 hover:bg-gray-800 hover:text-white transition-colors py-2 px-6 rounded-lg"
                  >
                    Đóng
                  </button>
                  {isEditing === false ? <button onClick={handleAddProduct}
                    className="border border-gray-800 w-1/2 bg-black text-white hover:bg-gray-700 transition-colors py-2 px-6 rounded-lg">Chấp nhận
                  </button> : <button onClick={() => handleUpdateProduct(value.idValue)}
                    className="border border-gray-800 w-1/2 bg-black text-white hover:bg-gray-700 transition-colors py-2 px-6 rounded-lg">Cập nhật
                  </button>}

                </div>
              </div>
            </div >
          </div >
        )
      }
    </>
  )
}
export default ProductAdmin