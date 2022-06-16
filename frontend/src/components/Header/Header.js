import './Header.css'
import Weather from '../Weather/Weather'
import logo from './img/db_logo.png';
import glc from './img/Geolocation.png';
import print from './img/Print.jpeg';
import login from './img/Login.jpeg';

const Header = () => {
    return (
      <header className="header">
      <div><img src={logo} className="logo" alt="logo" /></div>
        <Weather />
      <div className='header-icons'><img src={login} className="login" alt="login" />
      <img src={print} className="print" alt="print" />
      <img src={glc} className="glc" alt="geolocation" /></div>
    </header>
    )
}

export default Header;