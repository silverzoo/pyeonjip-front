import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Sandbox from "../Product/Product";
import ProductDetail from "../Product/ProductDetail";
import Cart from "../Cart/Cart";
import Home from "../Home/Home";
import AdminMain from "../Admin/Main/Main";
import AdminCategory from "../Admin/Category/Category";
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
import ProductDetailCreate from '../Admin/Product/ProductDetailCreate';
import SignUpResult from "../User/SignUpResult";
import MyPage from "../User/MyPage";
import FindAccount from "../User/FindAccount";
import FindAccountResult from "../User/FindAccountResult";
import NotFound from "../Error/NotFound";
import AdminLayout from "../Admin/AdminLayout";
import ResetPassword from "../User/ResetPassword";
import ResetPasswordResult from "../User/ResetPasswordResult";

function AppRouter() {

    return (
        <Routes>
            <Route path="/category/:categoryId" element={<Sandbox/>}/>
            <Route path="/category" element={<Sandbox/>}/>
            <Route path="/category/:categoryId/product-detail" element={<ProductDetail/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/logout" element={<Logout/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/signup/result" element={<SignUpResult/>}/>
            <Route path="/mypage" element={<MyPage/>}/>
            <Route path="/find" element={<FindAccount/>}/>
            <Route path="/found" element={<FindAccountResult/>}/>
            <Route path="/order" element={<OrderPage/>}/>
            <Route path="/order-success" element={<OrderSuccess/>}/>
            <Route path="/chat" element={<ChatPage/>}/>
            <Route path="/reset" element={<ResetPassword/>}/>
            <Route path="/reset/result" element={<ResetPasswordResult/>}/>

            <Route path="/admin" element={<AdminLayout/>}>
                <Route index element={<AdminMain/>}/>
                <Route path="category" element={<AdminCategory/>}/>
                <Route path="order" element={<AdminOrder/>}/>
                <Route path="product" element={<ProductAdmin/>}/>
                <Route path="edit-product/:productId" element={<ProductOptionAdmin/>}/>
                <Route path="edit-option/:detailId" element={<ProductOptionEdit/>}/>
                <Route path="createProduct" element={<ProductCreate/>}/>
                <Route path="product/:productId/add-option" element={<ProductDetailCreate/>}/>
                <Route path="coupon" element={<Coupon/>}/>
            </Route>

            <Route path="*" element={<Navigate to="/not-found" replace/>}/>
            <Route path="/not-found" element={<NotFound/>}/>
        </Routes>
    );
}
export default AppRouter;
