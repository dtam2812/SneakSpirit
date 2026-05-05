import { Outlet } from "react-router-dom"
import Footer from "../components/Footer"
import Header from "../components/Header"
import ModalProvider from "../Context/ModalProvider"
import GetListProduct from "../Context/GetListProduct";
import GetListVoucher from "../Context/GetListVoucher";
import SideVoucher from "../Context/SideVoucher";
import { useEffect, useState } from "react";
import GetListOrder from "../Context/GetListOrder";
import { jwtDecode } from "jwt-decode";
import Bill from "../Context/Bill";
import { Cities } from "../Context/Cities";

const RootLayout = () => {
  const [cartList, setCartList] = useState([])
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    if (accessToken) {
      try {
        const user = jwtDecode(accessToken);
        setUserId(user._id);
      } catch (error) {
        console.log(error);
      }
    } else {
      setUserId(null);
    }
  }, [accessToken]);

  useEffect(() => {
    if (userId) {
      const cart = localStorage.getItem(`cartList_${userId}`);
      setCartList(cart ? JSON.parse(cart) : []);
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      localStorage.setItem(`cartList_${userId}`, JSON.stringify(cartList));
    }
  }, [cartList, userId]);

  return (
    <div>
      <ModalProvider>
        <Header cartList={cartList} setCartList={setCartList} setAccessToken={setAccessToken} accessToken={accessToken} />
      </ModalProvider>
      <GetListProduct>
        <GetListVoucher>
          <SideVoucher>
            <Cities>
              <GetListOrder>
                <Bill>
                  <Outlet context={{ cartList, setCartList, setAccessToken }} />
                </Bill>
              </GetListOrder>
            </Cities>
          </SideVoucher>
        </GetListVoucher>
      </GetListProduct>
      <Footer />
    </div>
  );
};
export default RootLayout