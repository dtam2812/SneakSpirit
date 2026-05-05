/* eslint-disable react/prop-types */
import { faChevronRight, faMinus, faPlus, faTruckFast } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom"
import { VoucherContext } from "../Context/GetListVoucher";
import QuickBuy from "../components/QuickBuy";
import { SideVoucherContext } from "../Context/SideVoucher";
import { billContext } from "../Context/Bill";
import Breadcrumb from "../components/Breadcrumb";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [buyingQuantity, setBuyingQuantity] = useState(1);

  const { setIsOpenVoucher } = useContext(SideVoucherContext);
  const { listVoucher } = useContext(VoucherContext);
  const { setBill } = useContext(billContext);

  const { cartList, setCartList } = useOutletContext();

  //Lấy chi tiết sản phẩm
  useEffect(() => {
    const getProductDetail = async () => {
      try {
        const response = await axios.get(`/auth/admin/product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getProductDetail();
  }, [id])

  if (!product) {
    return <div>Loading...</div>;
  }

  //Thêm số lượng mua sản phẩm
  const handlePlus = () => {
    setBuyingQuantity(buyingQuantity + 1);
    if (buyingQuantity >= product.sizes[selectedSize]) {
      setBuyingQuantity(product.sizes[selectedSize]);
    };
  }

  //Giảm số lượng mua sản phẩm
  const handleMinus = () => {
    setBuyingQuantity(buyingQuantity - 1);
    if (buyingQuantity <= 1) {
      setBuyingQuantity(1);
    };
  }

  //Thêm sản phẩm vào giỏ hàng
  const handleAddingToCart = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    if (product.category !== 'Khác' && !selectedSize) {
      alert("Vui lòng chọn size trước khi thêm vào giỏ hàng.");
      return;
    }

    const newCart = [...cartList]
    const existingItemIndex = newCart.findIndex((element) => {
      return (
        (element.category !== 'Khác' && element.id === product._id && element.size === selectedSize) || (element.category === 'Khác' && element.id === product._id)
      )
    });
    if (existingItemIndex !== -1) {
      newCart[existingItemIndex].quantity += buyingQuantity;
    } else {
      const newItem = {
        id: product._id,
        name: product.productName,
        price: product.price,
        category: product.category,
        size: product.category !== "Khác" ? selectedSize : undefined,
        quantity: buyingQuantity,
        image: product.images[0],
      };
      newCart.push(newItem);
    }

    setCartList(newCart);
    alert("Đã thêm sản phẩm vào giỏ hàng!");
    setSelectedSize('');
    setBuyingQuantity(1);
  }

  //Mua ngay sản phẩm
  const handleBuyNow = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      navigate('/login');
      return;
    }

    if (product.category !== 'Khác' && !selectedSize) {
      alert("Vui lòng chọn size trước khi thêm vào giỏ hàng.");
      return;
    }

    const newCart = [...cartList]
    const existingItemIndex = newCart.findIndex((element) => {
      return (
        (element.category !== 'Khác' && element.id === product._id && element.size === selectedSize) || (element.category === 'Khác' && element.id === product._id)
      )
    });
    if (existingItemIndex !== -1) {
      newCart[existingItemIndex].quantity += buyingQuantity;
    } else {
      const newItem = {
        id: product._id,
        name: product.productName,
        price: product.price,
        category: product.category,
        size: product.category !== "Khác" ? selectedSize : undefined,
        quantity: buyingQuantity,
        image: product.images[0],
      };
      newCart.push(newItem);
    }

    setCartList(newCart);
    setSelectedSize('');
    setBuyingQuantity(1);

    const billPrice = newCart.reduce((total, element) => {
      return total + element.price * element.quantity
    }, 0);

    const count = newCart.reduce((total, element) => {
      return total += element.quantity;
    }, 0);
    let fee = 0;
    if (count <= 5) fee = 25000;
    else if (count < 10) fee = 50000;
    else fee = 100000;

    setBill({
      price: billPrice,
      shippingFee: fee,
      priceDiscount: 0,
      shippingFeeDiscount: 0,
      total: billPrice + fee,
    });

    navigate('/checkOut');
  }
  return (
    <div>
      <Breadcrumb first='Sản phẩm' second={product.productName} secondLink='/collection' />
      <div className='container'>
        <div className="mx-auto px-4 py-8 ">
          <div className="flex flex-wrap -mx-4 border-b-2 border-dashed">
            {/*Ảnh sản phẩm*/}
            <div className="w-full lg:w-1/2 px-4 mb-8 sm:flex flex-row-reverse">
              <img
                className="w-full sm:w-3/4 h-auto rounded-lg shadow-md mb-4 mr-5"
                src={product.images[selectedImage]}
              />
              <div className="flex sm:block w-full sm:w-1/4 gap-2 py-4 justify-center">
                {product.images.map((element, index) => {
                  if (element) {
                    return (
                      <>
                        <img
                          className="cursor-pointer py-2 rounded-lg w-20 sm:w-32"
                          src={element}
                          onClick={() => setSelectedImage(index)}
                        />
                      </>
                    )
                  }
                })}
              </div>
            </div>
            {/*Thông tin sản phẩm*/}
            <div className="w-full lg:w-1/2 px-3 text-left">
              <h2 className="text-3xl font-bold mb-2">{product.productName}</h2>
              <p className="text-gray-600 mb-4 text-xl">Thương hiệu:
                <Link to={'/collection'}>
                  <span className='text-blue-500 cursor-pointer'> HYBID®</span>
                </Link>
              </p>
              <div className="mb-4">
                <span className="text-4xl text-red-500 font-bold mr-2">{product.price.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className='my-5'>
                <h3 className="text-xl font-semibold mb-2">Mã giảm giá:</h3>
                <div onClick={() => { setIsOpenVoucher(true) }} className='flex gap-x-2 items-center cursor-pointer'>
                  {
                    listVoucher.map((element) => {
                      return (
                        <>
                          <p className='p-3 border border-red-500 rounded-lg text-red-500'>{element.voucherName}</p>
                        </>
                      )
                    })
                  }
                  <FontAwesomeIcon icon={faChevronRight} className=' text-2xl rounded-lg text-red-500' />
                </div>
              </div>
              {product.category !== 'Khác' && (<div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Size: {selectedSize}</h3>
                <div className="flex space-x-2">

                  {["S", "M", "L", 'XL'].map((size) => (
                    <p
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-3 border rounded-lg text-xl cursor-pointer ${selectedSize === size ? "text-white bg-blue-500" : "text-black"
                        }`}
                    >
                      {size}
                    </p>
                  ))}
                </div>
              </div>)}

              {
                (!selectedSize || product.sizes[selectedSize] >= 1) ? (
                  <div className="flex space-x-4  align-middle">
                    <div className="w-1/5 mb-6 h-14 border border-[#919191] flex justify-around items-center rounded-lg">
                      <FontAwesomeIcon icon={faMinus} className='cursor-pointer' onClick={handleMinus} />
                      <p>{buyingQuantity}</p>
                      <FontAwesomeIcon icon={faPlus} className='cursor-pointer' onClick={handlePlus} />
                    </div>
                    <button onClick={handleAddingToCart}
                      className='border border-[#919191] h-14 rounded-lg w-4/5 text-[#919191] text-xl font-bold hover:text-white hover:bg-[#919191] transition-colors'>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                ) : (
                  <div className=" mb-3">
                    <button onClick={handleAddingToCart} disabled
                      className='border border-[#919191] h-14 rounded-lg w-full text-[#919191] text-xl font-bold'>
                      Sản phẩm hết hàng
                    </button>
                  </div>
                )
              }
              {
                (!selectedSize || product.sizes[selectedSize] >= 1) ? (
                  <div className='text-center'>
                    <button onClick={handleBuyNow}
                      className='border border-[#919191] bg-[#919191] h-14 rounded-lg w-full text-white text-xl font-bold hover:text-white hover:opacity-80 transition-colors'>
                      Mua ngay
                    </button>
                    <div className='sm:flex justify-between'>
                      <div>
                        <p className='p-3 text-lg'>Gọi đặt mua <a href="tel:0383300680">
                          <span className="text-blue-500 cursor-pointer">0383300680</span>
                        </a> (8:30 - 20:00)</p>
                      </div>
                      <div className='text-lg sm:pt-3 text-center lg:text-left'>
                        <p><FontAwesomeIcon icon={faTruckFast} className='px-2 text-red-500' />Giao hàng toàn quốc </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  ''
                )
              }
            </div>
          </div>
          {/*Bar mua sản phẩm thu nhỏ*/}
          <div>
            <h2 className="text-3xl font-bold my-5">Mô tả sản phẩm</h2>
            <div className="text-left whitespace-pre-line">
              {product.description}
            </div>
          </div>
          <QuickBuy product={product} selectedSize={selectedSize} setSelectedSize={setSelectedSize}
            setBuyingQuantity={setBuyingQuantity} buyingQuantity={buyingQuantity} handlePlus={handlePlus}
            handleMinus={handleMinus} handleAddingToCart={handleAddingToCart} />
        </div>
      </div>
    </div >
  )
}
export default ProductDetail