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
                <HiddenUtils whitelist={['/chat', '/login', '/signup', '/reset-password', '/find', '/not-found']}>
                    <div className='leftSide'>
                        <LeftSide/>
                    </div>
                </HiddenUtils>
                <CartProvider>
                    <HiddenUtils whitelist={['/chat', '/login', '/signup', '/reset-password', 'order', '/find', '/not-found']}>
                        <div className='rightSide'>
                            <RightSide/>
                        </div>
                    </HiddenUtils>
                    <div className='content'>
                        <AppRouter/>
                    </div>
                </CartProvider>
                <HiddenUtils whitelist={['/chat', '/login', '/signup', '/reset-password', '/find', '/not-found']}>
                    <div className='chatButton'>
                        <ChatDashboardButton/>
                    </div>
                </HiddenUtils>
            </AuthProvider>
            <div className='footer'>
                <Footer/>
            </div>
        </div>
    );
}
export default App;