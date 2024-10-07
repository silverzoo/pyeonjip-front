import logo from './logo.svg';
import './App.css';
import AppRouter from "./Components/router/Router";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          편안하게 집을 편집하다 : 가구 쇼핑몰 편집
        </p>
      </header>

        <AppRouter />
    </div>
  );
}
export default App;