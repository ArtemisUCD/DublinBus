import logo from './db_logo.png';
import glc from './Geolocation.png';
import print from './Print.jpeg';
import login from './Login.jpeg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="Weather">
          <span>weather</span>
        </div>
        <img src={login} className="App-login" alt="login" />  
        <img src={print} className="App-print" alt="print" />
        <img src={glc} className="App-glc" alt="geolocation" />
        
      </header>
    </div>
  );
}

export default App;
