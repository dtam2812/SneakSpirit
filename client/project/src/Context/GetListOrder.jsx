/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react"

export const OrderContext = createContext({});

const GetListOrder = ({ children }) => {
  const [listOrder, setListOrder] = useState([]);

  //Lấy danh sách đơn hàng
  useEffect(() => {
    const getListOrder = async () => {
      try {
        const response = await axios.get(`/api/auth/order`);
        setListOrder(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(error);
        }
      }
    };

    getListOrder();
  }, [listOrder])
  return (
    <OrderContext.Provider value={{ listOrder, setListOrder }}>
      {children}
    </OrderContext.Provider>
  )
}
export default GetListOrder