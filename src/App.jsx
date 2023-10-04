import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "./components/loading/Index";
import { PATH } from "./constants/paths";
import MainLayout from "./layouts/mainLayout/MainLayout";
import Login from "./pages/login";
import ForgotPassword from "./pages/login/ForgotPassword";
import ProductForm from "./pages/products2/product-form";
import { useBadgesStore } from "./store/badgesStore";
import { getToken } from "./utils/auth";
import { Order } from "./pages/order/index.jsx";
import OrderDetail from "./pages/order/OrderDetail.jsx";
import { useCategoriesStore } from "./store/categoriesStore";
import ConfirmOTP from './pages/login/ConfirmOTP.jsx';
import Vouchers from './pages/vouchers/index.jsx';
import VoucherForm from './pages/vouchers/VourcherForm.jsx';
import DiscountProduct from './pages/vouchers/DiscountProducts.jsx'
import DiscountForm from './pages/vouchers/DiscountForm.jsx'
import LoginByPass from "./pages/login/LoginByPass.jsx";
import Register from "./pages/login/Register.jsx"
import { useInfoStore } from "./store/infoStore.js";
import ResetPassword from "./pages/login/ResetPasswors.jsx";
import Finance from "./pages/finance/index.jsx";
import BankAccount from "./pages/finance/components/BankAccount.jsx";
import WithdrawMoney from "./pages/finance/WithdrawMoney.jsx"
import AddBankAccount from "./pages/finance/components/AddBankAccount.jsx"
import UpdateBankAccount from "./pages/finance/components/UpdateBankAccount.jsx";
import MultiAddProducts from "./pages/products2/MultiAddProducts.jsx";

const Home = lazy(() => import("./pages/home/Index.jsx"));
const Products = lazy(() => import("./pages/products2"));
const IdentityRequest = lazy(() => import("./pages/identityRequest/Index"));
const StoreInfo = lazy(() => import("./pages/store-info"));
const InventoryProduct = lazy(() => import("./pages/inventoryProduct"));
const Warehouse = lazy(() => import("./pages/branches"));
const Chat = lazy(() => import("./pages/chat"));

const PrivateRoute = () => {
  const { getAllBadges } = useBadgesStore();
  const { getAllCategories } = useCategoriesStore((state) => state);
  const { getInfoStore } = useInfoStore();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const categories = JSON.parse(localStorage.getItem("categories"));
  const profile = JSON.parse(localStorage.getItem("profile"));

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = await getToken();
      console.log('token: ', token);
      setAuthenticated(token !== null);
      setLoading(false);
    };

    checkAuthentication();
    getAllBadges();
    if(!profile) getInfoStore();
    if (!categories) getAllCategories();
  }, []);

  if (loading) {
    return null;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

function App() {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route
                path={PATH.HOME}
                element={
                  <Suspense fallback={<Loading />}>
                    <Home />
                  </Suspense>
                }
              />
              {/* Order page */}
              <Route
                path="/order"
                element={
                  <Suspense fallback={<Loading />}>
                    <Order />
                  </Suspense>
                }
              ></Route>
              <Route
                path="/order/detail/:order_code"
                element={
                  <Suspense fallback={<Loading />}>
                    <OrderDetail />
                  </Suspense>
                }
              ></Route>

              <Route
                path="/store-info"
                element={
                  <Suspense fallback={<Loading />}>
                    <StoreInfo />
                  </Suspense>
                }
              ></Route>

              {/* Yêu cầu định danh */}
              <Route
                path="/identity-request"
                element={
                  <Suspense fallback={<Loading />}>
                    <IdentityRequest />
                  </Suspense>
                }
              ></Route>
              {/* Products */}
              <Route
                path="/products"
                element={
                  <Suspense fallback={<Loading />}>
                    <Products />
                  </Suspense>
                }
              ></Route>
              <Route
                path="/products/status/:productStatus"
                element={
                  <Suspense fallback={<Loading />}>
                    <Products />
                  </Suspense>
                }
              ></Route>
              <Route path="/products/create" element={<ProductForm />}></Route>
              <Route path="/products/multi_create" element={<MultiAddProducts />}></Route>
              <Route path="/products/edit/:id" element={<ProductForm />}></Route>
              {/* sản phẩm tồn kho */}
              <Route
                path="/product-inventory"
                element={
                  <Suspense fallback={<Loading />}>
                    <InventoryProduct />
                  </Suspense>
                }
              ></Route>
              {/* vourcher */}
              <Route
                path="/vouchers"
                element={
                  <Suspense fallback={<Loading />}>
                    <Vouchers />
                  </Suspense>
                }
              ></Route>
              <Route
                path="/vouchers/create"
                element={
                  <Suspense fallback={<Loading />}>
                    <VoucherForm />
                  </Suspense>
                }
              ></Route>
              <Route
                path="/vouchers/:voucherId"
                element={
                  <Suspense fallback={<Loading />}>
                    <VoucherForm />
                  </Suspense>
                }
              ></Route>
              {/* discound products */}
              <Route
                path="/discounts"
                element={
                  <Suspense fallback={<Loading />}>
                    <DiscountProduct />
                  </Suspense>
                }
              ></Route>
              <Route
                path="/discount/:discountId"
                element={
                  <Suspense fallback={<Loading />}>
                    <DiscountForm />
                  </Suspense>
                }
              ></Route>
               {/* kho */}
               <Route
                path="/branches"
                element={
                  <Suspense fallback={<Loading />}>
                    <Warehouse />
                  </Suspense>
                }
              ></Route>
              {/* chat */}
              <Route
                path="/chat"
                element={
                  <Suspense fallback={<Loading />}>
                    <Chat />
                  </Suspense>
                }
              ></Route>
              {/* Finance */}
              <Route
                path="/finance"
                element={
                  <Suspense fallback={<Loading />}>
                    <Finance />
                  </Suspense>
                }
              ></Route>
              {/* withdraw_money */}
              <Route
                path="/withdraw_money"
                element={
                  <Suspense fallback={<Loading />}>
                    <WithdrawMoney />
                  </Suspense>
                }
              ></Route>
              <Route
                path="/bank_account"
                element={
                  <Suspense fallback={<Loading />}>
                    <BankAccount />
                  </Suspense>
                }
              ></Route>
              <Route
                path="/add_bank_account"
                element={
                  <Suspense fallback={<Loading />}>
                    <AddBankAccount />
                  </Suspense>
                }
              ></Route>
              <Route
                path="/update_bank_account"
                element={
                  <Suspense fallback={<Loading />}>
                    <UpdateBankAccount />
                  </Suspense>
                }
              ></Route>
            </Route>
          </Route>
          {/* login route */}
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forgot_password" element={<ForgotPassword />}></Route>
          <Route path="/confirm_otp" element={<ConfirmOTP />}></Route>
          <Route path="/login_by_pass" element={<LoginByPass />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/reset_password" element={<ResetPassword />}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer></ToastContainer>
    </React.Fragment>
  );
}
export default App;
