import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sandbox from "../Cart/Sandbox";
import Cart from "../Cart/index";
import Home from "../Home/home";
import AdminCategory from "../Admin/category";
import AdminOrder from "../Admin/order";

function AppRouter() {
    return (
        <Routes>
            <Route path="/cart/sandbox" element={<Sandbox />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/" element={<Home />} />
            <Route path="/admin/category" element={<AdminCategory />} />
            <Route path="/admin/order" element={<AdminOrder />} />
        </Routes>
    );
}

export default AppRouter;