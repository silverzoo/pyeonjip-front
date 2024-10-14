import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sandbox from "../Product/Product";
import ProductDetail from "../Product/ProductDetail";
import Cart from "../Cart/Cart";
import Home from "../Home/home";
import AdminCategory from "../Admin/category";
import AdminOrder from "../Admin/Order";
import Login from "../User/login";
import Signup from '../User/signup';
import Logout from '../User/logout';
import OrderPage from '../Order/OrderPage';
import Main from "../Product/Main";

function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/category/:categoryId" element={<Sandbox />} />
            <Route path="/product-detail" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<Home />} />
            <Route path="/admin/category" element={<AdminCategory />} />
            <Route path="/admin/order" element={<AdminOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/order" element={<OrderPage />} />
        </Routes>
    );
}

export default AppRouter;