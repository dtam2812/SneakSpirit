/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const ProductContext = createContext({});

const GetListProduct = ({ children }) => {
  const [listProduct, setListProduct] = useState([]);
  const navigate = useNavigate();

  //Lấy danh sách sản phẩm
  useEffect(() => {
    const getListProduct = async () => {
      try {
        const response = await axios.get(`/auth/admin/product`);
        setListProduct(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };
    getListProduct();
  }, [listProduct])

  return (
    <ProductContext.Provider value={{ listProduct, setListProduct }}>
      {children}
    </ProductContext.Provider>
  )
}
export default GetListProduct