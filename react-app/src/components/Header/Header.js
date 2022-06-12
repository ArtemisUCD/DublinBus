import './Header.css'
import logo from './img/db_logo.png';
import glc from './img/Geolocation.png';
import print from './img/Print.jpeg';
import login from './img/Login.jpeg';

const Header = () => {
    return (
      <header className="header">
      <img src={logo} className="logo" alt="logo" />
      <div className="Weather">
        <span>weather</span>
      </div>
      <img src={login} className="login" alt="login" />  
      <img src={print} className="print" alt="print" />
      <img src={glc} className="glc" alt="geolocation" />
      
    </header>
    )
}

export default Header;