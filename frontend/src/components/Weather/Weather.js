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



const Weather = () => {

    const [weatherData,setWeatherData] = useState([]);

    useEffect(() => {
        fetch("/api/forecast")
        .then(response => response.json())
        .then(data => setWeatherData(data))
          },[]);

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

    const first = weatherData[0];
    console.log(weatherData);
    console.log(first);

    let weatherDetails;
    
    if(weatherData.length > 0){
        weatherDetails= weatherData.map(day =>  <WeatherItem key ={day.date} title={day.date} temperature = {day.temperature} icon ={day.weather_icon}/>)
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
    console.log(data);

    let currentdetail;
    if(data.length > 0 ){
        console.log(true)
        const first = data[0];
        console.log(first)
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
        console.log(false)
    }

    
    
    
    return (
        <Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",borderRadius:"10px;", maxheight:"300px"}}>
            <Box sx={{height:"50%",display:"flex",flexDirection:"column",}}>
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
                
                <h3>Daily forecast</h3>
                <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"flex-start", maxheight:"300px"}}>
                    {weatherDetails}
                </Box>
                
            </Box>
        </Box>
    )

}

export default Weather;