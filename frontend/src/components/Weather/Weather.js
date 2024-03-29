import WeatherItem from './WeatherItem'
import './Weather.css'
import { useEffect, useState } from 'react';
import ReactLoading from "react-loading";
import {Box} from '@mui/material';
import './WeatherItem.css'
import clear_sky from './img/01d.png';
import few_clouds from './img/02d.png';
import scattered_clouds from './img/03d.png';
import broken_clouds from './img/04d.png';
import shower_rain from './img/09d.png';
import rain from './img/10d.png';
import thunderstorm from './img/11d.png';
import snow from './img/13d.png';
import mist from './img/50d.png';
import HourlyForecast from './HourlyForecast';



const Weather = ({weatherData}) => {

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
    
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const dateToday = new Date();
    let currentDay = weekday[dateToday.getDay()]
    let weatherToday = weatherData.filter(weather=> weather.date===currentDay)
    const first = weatherToday[0];

    let weatherDetails;
    
    if(weatherData.length > 0){
        weatherDetails= weatherData.map(day =>  <WeatherItem sx ={{padding:"1rem"}} key ={day.date} title={day.date} temperature = {day.temperature} icon ={day.weather_icon}/>)
    }
    else{
        weatherDetails=<div><p>Weather Loading</p><ReactLoading type="bubbles" color="#000000"
        height={100} width={50} /></div>
    }

    const [ data, setData ] = useState([]);
    useEffect(() => {
        fetch("/api/hourlyforecast")
        .then((response) => response.json())
        .then(data => setData(data))
    },[])

    let currentdetail;
    if(data.length > 0 ){
        const first = data[0];
        currentdetail = <div>
                            <div>
                                Uvi: <span>{first.uvi}</span>
                            </div>
                            <div>
                                Humidity: <span>{first.humidity}</span>
                            </div>
                            <div>
                                Wind: <span>{first.wind}</span>
                            </div>
                        </div>
    }else{
        currentdetail =<div>
                            <div>
                                Uvi: <span>Loading...</span>
                            </div>
                            <div>
                                Humidity: <span>Loading...</span>
                            </div>
                            <div>
                                Wind: <span>Loading...</span>
                            </div>
                        </div>
    }

    
    
    
    return (
            <Box sx={{display:"flex",flexDirection:"column",overflowY:"auto" ,zIndex:"1"}}>
            <div className="Current-weather">
                <img src={icons[first?.weather_icon]} className="current-icon" alt="weather-icon"/>
                <div className="Current-temperature">
                    <span id="Temperature"> {Math.round(first?.temperature)} </span>
                    <div className="Units">
                        <span className="Celsius" id="Celsius-link">
                            °C
                        </span>
                    </div>
                    <div className="Current-precipitation-humidity-wind">
                        {currentdetail}
                    </div>
                    
                </div>
            </div>
            <HourlyForecast data={data} />
                <h3 id="weather-title">Daily forecast</h3>
                <Box sx={{display:"flex",paddingBottom:"2rem",justifyContent:"flex-start",overflowX:"auto"}}>
                    {weatherDetails}
                </Box>
            </Box>
    )

}

export default Weather;