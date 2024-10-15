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
import ChatPage from '../Chat/chatPage';
import ProductAdmin from '../Admin/ProductAdmin';
import FindAccount from "../User/FindAccount";
import FindAccountResult from "../User/FindAccountResult";

import OptionAdmin from '../Admin/OptionAdmin';
import OptionEdit from '../Admin/OptionEdit';

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
            <Route path="/find" element={<FindAccount />} />
            <Route path="/found" element={<FindAccountResult />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/admin/product" element={<ProductAdmin />} />
            <Route path="/admin/edit-product/:productId" element={<OptionAdmin />} />
            <Route path="/admin/edit-option/:detailId" element={<OptionEdit />} />
        </Routes>
    );
}
export default AppRouter;