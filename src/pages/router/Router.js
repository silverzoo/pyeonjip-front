import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sandbox from "../Product/Product";
import ProductDetail from "../Product/ProductDetail";
import Cart from "../Cart/Cart";
import Home from "../Home/Home";
import AdminCategory from "../Admin/Category/category";
import AdminOrder from "../Admin/Order/Order";
import Login from "../User/Login";
import SignUp from '../User/SignUp';
import Logout from '../User/Logout';
import OrderPage from '../Order/OrderPage';
import OrderSuccess from '../Order/OrderSuccess';
import ChatPage from '../Chat/ChatPage';
import ProductAdmin from '../Admin/Product/ProductAdmin';
import ProductOptionAdmin from '../Admin/Product/ProductOptionAdmin';
import ProductOptionEdit from '../Admin/Product/ProductOptionEdit';
import Coupon from "../Admin/Coupon/Coupon";
import ProductCreate from '../Admin/Product/ProductCreate';
import SignUpResult from "../User/SignUpResult";
import MyPage from "../User/MyPage";
import FindAccount from "../User/FindAccount";
import FindAccountResult from "../User/FindAccountResult";

function AppRouter() {
    return (
        <Routes>
            <Route path="/category/:categoryId" element={<Sandbox />} />
            <Route path="/category" element={<Sandbox />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<Home />} />
            <Route path="/admin/category" element={<AdminCategory />} />
            <Route path="/admin/order" element={<AdminOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signup/result" element={<SignUpResult />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/find" element={<FindAccount />} />
            <Route path="/found" element={<FindAccountResult />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/admin/product" element={<ProductAdmin />} />
            <Route path="/admin/edit-product/:productId" element={<ProductOptionAdmin />} />
            <Route path="/admin/edit-option/:detailId" element={<ProductOptionEdit />} />
            <Route path="/admin/createProduct" element={<ProductCreate />} />
            <Route path="/admin/coupon" element={<Coupon />} />

        </Routes>
    );
}
export default AppRouter;
