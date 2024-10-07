import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sandbox from "../cart/Sandbox";
import Cart from "../cart/Cart";

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/cart/sandbox" element={<Sandbox />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;