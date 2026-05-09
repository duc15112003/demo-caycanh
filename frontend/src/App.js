import React, { useEffect, useRef } from "react";
import { BrowserRouter, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import AllProducts from "./pages/AllProducts";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import userApi from "./api/userApi";
import { loginSuccess, logoutSuccess } from "./redux/slices/authSlice";
import Plants from "./pages/Plants";
import Pots from "./pages/Pots";
import Accessories from "./pages/Accessories";
import GuidePage from "./pages/GuidePage";
import OrderHistory from "./pages/OrderHistory";
import Wishlist from "./pages/Wishlist";
import SearchResults from "./pages/SearchResults";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderDetail from "./pages/OrderDetail";
import Contact from "./pages/Contact";
import AboutUs from "./pages/AboutUs";
import VnpayReturn from "./pages/VnpayReturn";
import AccessDenied from "./pages/AccessDenied";
import AdminApp from "./admin/AdminApp";

const PublicLayout = () => {
  return (
    <div className="app-shell">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

function AppRoutes() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const handledOauthErrorRef = useRef("");

  useEffect(() => {
    const verifySession = async () => {
      try {
        const userProfile = await userApi.getMe();
        dispatch(loginSuccess({ user: userProfile }));
      } catch (error) {
        dispatch(logoutSuccess());
      }
    };

    verifySession();
  }, [dispatch]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const oauthError = searchParams.get("error");

    if (oauthError !== "google_login_failed" || handledOauthErrorRef.current === location.search) {
      return;
    }

    handledOauthErrorRef.current = location.search;
    toast.error("Dang nhap Google that bai.");
    searchParams.delete("error");

    navigate(
      {
        pathname: location.pathname,
        search: searchParams.toString() ? `?${searchParams.toString()}` : "",
      },
      { replace: true }
    );
  }, [location.pathname, location.search, navigate]);

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<AllProducts />} />
        <Route path="/product/cay" element={<Plants />} />
        <Route path="/product/chau" element={<Pots />} />
        <Route path="/product/phukien" element={<Accessories />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/product/search" element={<SearchResults />} />
        <Route path="/instruction" element={<GuidePage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/vnpay-return" element={<VnpayReturn />} />
        <Route path="/order/success" element={<OrderSuccess />} />
        <Route path="/order/history" element={<OrderHistory />} />
        <Route path="/order/confirm/:orderId" element={<OrderDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
      </Route>

      <Route path="/403" element={<AccessDenied />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 999999 }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
