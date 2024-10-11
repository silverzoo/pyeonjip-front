import React from 'react';
import './App.css';
import AppRouter from './pages/router';
import Footer from './components/Footer/footer';
import Header from './components/Header/header';
import SidePanel from './components/SidePanel/sidePanel'

function App() {
  return (
      <div className="App">
        <div className='header'>
          <Header />
        </div>
        <div className='sidePannel'>
            {/*<SidePanel />*/}
        </div>
        <div className="content">
          <AppRouter />
        </div>
        <div>
          <Footer />
        </div>
      </div>

    
    
    
  );
}
export default App;