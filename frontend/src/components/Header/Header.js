import './Header.css'
import '../Weather/WeatherItem.css';
import logo from './img/Dublin_Bus_WHITE.png';
import clear_sky from '../Weather/img/01d.png';
import few_clouds from '../Weather/img/02d.png';
import scattered_clouds from '../Weather/img/03d.png';
import broken_clouds from '../Weather/img/04d.png';
import shower_rain from '../Weather/img/09d.png';
import rain from '../Weather/img/10d.png';
import thunderstorm from '../Weather/img/11d.png';
import snow from '../Weather/img/13d.png';
import mist from '../Weather/img/50d.png';
import {AppBar, Toolbar, Box} from '@mui/material'
import { useEffect, useState } from 'react';

const Header = (props) => {

  const [todayweather, setTodayWeather] = useState([]);

  useEffect(() => {
    fetch("/api/forecast")
    .then(response => response.json())
    .then(data => setTodayWeather(data))
  },[]);

  const first = todayweather[0];
  console.log(todayweather);
  console.log(first);

  const icons = {
    "01d":clear_sky,
    "02d":few_clouds,
    "03d":scattered_clouds,
    "04d":broken_clouds,
    "09d":shower_rain,
    "10d":rain,
    "11d":thunderstorm,
    "13d":snow,
    "50d":mist  
}

    return (
    <AppBar id="header" role="heading" sx={{display:"flex",alignItems:"center",flexDirection:"row",position:"sticky",backgroundColor:"#070861"}}>
    <Toolbar sx={{justifyContent:"space-between",alignItems:"center",minHeight:"10px",maxwidth:"70%"}}>
      <Box sx={{display:"flex",alignItems:"center"}}>
      <img src={logo} className="logo" alt="logo"/>
      </Box>
      <Box sx={{width:"50%"}}>
      
      </Box>
    </Toolbar>
    <Box sx={{ flexGrow: 1, width:"50%"}}>
      <Box sx={{float:"right"}}>
        <img src={icons[first?.weather_icon]} className="todayweather-icon" alt="weather-icon"/>
      </Box>
      <Box sx={{float:"right" }}>
        <p>{Math.round(first?.temperature)}°C</p>
      </Box>
    </Box>
      
    </AppBar>
    )
}

export default Header;