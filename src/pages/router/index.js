import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sandbox from "../Product/Sandbox";
import Cart from "../Cart/Cart";
import Home from "../Home/home";
import AdminCategory from "../Admin/category";
import AdminOrder from "../Admin/order";
import Login from "../User/login";
import Signup from '../User/signup';
import Logout from '../User/logout';
import OrderPage from '../Order/OrderPage';

function AppRouter() {
    return (
        <Routes>
            <Route path="/product" element={<Sandbox />} />
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