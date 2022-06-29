import WeatherItem from './WeatherItem'
import './Weather.css'
import { useEffect, useState } from 'react';
import ReactLoading from "react-loading";
import {Box} from '@mui/material'


const Weather = () => {

    const [weatherData,setWeatherData] = useState();

    useEffect(() => {
        fetch("/api/forecast")
        .then(response => response.json())
        .then(data => setWeatherData(data))
          },[]);

    let weatherDetails;
    
    if(weatherData){
        weatherDetails= weatherData.map(day =>  <WeatherItem key ={day.date} title={day.date} temperature = {day.temperature} icon ={day.weather_icon}/>)
    }
    else{
        weatherDetails=<div><p>Weather Loading</p><ReactLoading type="bubbles" color="#000000"
        height={100} width={50} /></div>
    }

    
    
    return (
        <Box sx={{display:"flex",justifyContent:"space-between"}}>
            {weatherDetails}
        </Box>
    )

}

export default Weather;