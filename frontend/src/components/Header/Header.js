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
import ReactLoading from "react-loading";

const Header = ({weatherData}) => {

  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  let weatherDetails;

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


  if(weatherData!==undefined){
// match the weather based on the current day
const dateToday = new Date();
let currentDay = weekday[dateToday.getDay()]
let weatherToday = weatherData.filter(weather=> weather.date===currentDay)
    weatherDetails = <Box sx={{ flexGrow: 1, width:"50%"}}>
    <Box sx={{float:"right"}}>
      <img src={icons[weatherToday[0].weather_icon]} className="todayweather-icon" alt="weather-icon"/>
    </Box>
    <Box sx={{float:"right" }}>
      <p>{Math.round(weatherToday[0].temperature)}°C</p>
    </Box>
  </Box>

  }
  else{
    weatherDetails= <Box sx={{display:"flex",alignItems:"center"}}>
    <span>Weather Loading</span><ReactLoading type="bubbles" color="#FFFFFF" height={40} width={50}/>
  </Box>
  }

    return (
    <AppBar id="header" role="heading" sx={{display:"flex",flexDirection:"row",position:"sticky",backgroundColor:"#070861"}}>
    <Toolbar sx={{display:"flex",justifyContent:"space-between",alignItems:"center",minHeight:"10px",width:"90vw"}}>
      <img src={logo} className="logo" alt="logo"/>
      {weatherDetails}
    </Toolbar>
    </AppBar>
    )
}

export default Header;