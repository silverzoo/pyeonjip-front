import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cart from "../cart/Cart";

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </Router>
    );
}

export default AppRouter;