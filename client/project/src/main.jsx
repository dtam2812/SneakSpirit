import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./ClientPages/HomePage.jsx";
import RootLayout from "./ClientPages/RootLayout.jsx";
import Introduction from "./ClientPages/Introduction.jsx";
import DataSecurityPolicy from "./ClientPages/DataSecurityPolicy.jsx";
import Policy from "./ClientPages/Policy.jsx";
import TransportPolicy from "./ClientPages/TransportPolicy.jsx";
import GeneralTransactionPolicy from "./ClientPages/GeneralTransactionPolicy.jsx";
import PaymentPolicy from "./ClientPages/PaymentPolicy.jsx";
import Instruction from "./ClientPages/Instruction.jsx";
import Terms from "./ClientPages/Terms.jsx";
import Login from "./ClientPages/Login.jsx";
import Register from "./ClientPages/Register.jsx";
import Admin from "./AdminComponents/Admin.jsx";
import Collection from "./ClientPages/Collection.jsx";
import ProductDetail from "./ClientPages/ProductDetail.jsx";
import UserDetail from "./ClientPages/UserDetail/UserDetail.jsx";
import Cart from "./ClientPages/Cart.jsx";
import Contact from "./ClientPages/Contact.jsx";
import CheckOut from "./ClientPages/CheckOut.jsx";
import OrderDetail from "./ClientPages/OrderDetail.jsx";
import SearchPage from "./ClientPages/SearchPage.jsx";
import NotFound from "./ClientPages/404.jsx";

const router = createBrowserRouter([
  {
    //Các đường dẫn
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/introduction",
        element: <Introduction />,
      },
      {
        path: "/dataSecurityPolicy",
        element: <DataSecurityPolicy />,
      },
      {
        path: "/policy",
        element: <Policy />,
      },
      {
        path: "/transportPolicy",
        element: <TransportPolicy />,
      },
      {
        path: "/generalTransactionPolicy",
        element: <GeneralTransactionPolicy />,
      },
      {
        path: "/paymentPolicy",
        element: <PaymentPolicy />,
      },
      {
        path: "/instruction",
        element: <Instruction />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/collection",
        element: <Collection />,
      },
      {
        path: "/product/:id",
        element: <ProductDetail />,
      },
      {
        path: "/user/:id",
        element: <UserDetail />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "/checkOut",
        element: <CheckOut />,
      },
      {
        path: "/order/:id",
        element: <OrderDetail />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />,
);
