/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

export const billContext = createContext();

const Bill = ({ children }) => {
  const [bill, setBill] = useState({
    price: 0,
    shippingFee: 0,
    priceDiscount: 0,
    shippingFeeDiscount: 0,
    total: 0,
  });
  return (
    <billContext.Provider value={{ bill, setBill }}>
      {children}
    </billContext.Provider>
  )
}
export default Bill