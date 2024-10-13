import React from 'react';
import './App.css';
import AppRouter from './pages/router';
import Footer from './components/Footer/Footer';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import SidePanel from './components/SidePanel/sidePanel'

function App() {
  return (
      <div className="app">
        <div className='leftSidebar'>
          <LeftSidebar />
        </div>
        <div className='sidePannel'>
            <SidePanel />
        </div>
        <div className='content'>
          <AppRouter />
        </div>
        <div className='footer'>
          <Footer />
        </div>
      </div>
  );
}
export default App;