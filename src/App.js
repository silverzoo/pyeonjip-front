import React from 'react';
import './App.css';
import AppRouter from './pages/router/Router';
import Footer from './components/Footer/Footer';
import LeftSide from './components/LeftSide/LeftSide';
import RightSide from './components/RIghtSide/RightSide'
import HiddenUtils from "./utils/HiddenUtils";
import {AuthProvider} from "./context/AuthContext";

function App() {

    return (

        <div className="app">
            <div className='leftSide'>
                <HiddenUtils whitelist={['/chat']}>
                    <LeftSide/>
                </HiddenUtils>
            </div>
            <AuthProvider><div className='rightSide'>
                <RightSide/>
            </div>
            <div className='content'>
                <AppRouter/>
            </div> </AuthProvider>
            <div className='footer'>
                <Footer/>
            </div>
        </div>

    );
}
export default App;