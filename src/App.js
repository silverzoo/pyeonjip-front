import React from 'react';
import './App.css';
import AppRouter from './pages/router/Router';
import Footer from './components/Footer/Footer';
import LeftSide from './components/LeftSide/LeftSide';
import RightSide from './components/RIghtSide/RightSide'
import HiddenUtils from "./utils/HiddenUtils";
import {AuthProvider} from "./context/AuthContext";
import {CartProvider} from "./context/CartContext";
import ChatDashboardButton from './components/Chat/ChatDashboardButton';

function App() {

    return (

        <div className="app">
            <AuthProvider>
            <div className='leftSide'>
                <HiddenUtils whitelist={['/chat', '/login', '/signup', '/reset-password', '/find', '/not-found']}>
                    <LeftSide/>
                </HiddenUtils>
            </div>
                <CartProvider>
            <div className='rightSide'>
                <RightSide/>
            </div>
            <div className='content'>
                <AppRouter/>
            </div>
                </CartProvider>
            </AuthProvider>
            <div className='footer'>
                <Footer/>
            </div>
            <ChatDashboardButton/>
        </div>

    );
}
export default App;