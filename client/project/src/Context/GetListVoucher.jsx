/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const VoucherContext = createContext({});

const GetListVoucher = ({ children }) => {
  const [listVoucher, setListVoucher] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  //Lấy danh sách voucher
  useEffect(() => {
    const getListVoucher = async () => {
      try {
        const response = await axios.get(`/auth/admin/voucher`);
        setListVoucher(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    getListVoucher();
  }, [refresh]);

  return (
    <VoucherContext.Provider value={{ listVoucher, setListVoucher }}>
      {children}
    </VoucherContext.Provider>
  );
};
export default GetListVoucher;
