import WeatherItem from './WeatherItem'
import './Weather.css'
import { useEffect, useState } from 'react';
import ReactLoading from "react-loading";
  


const Weather = () => {

    const [weatherData,setWeatherData] = useState();

    useEffect(() => {
        fetch("/api/forecast")
        .then(response => response.json())
        .then(data => setWeatherData(data))
          },[]);

    let weatherDetails;
    
    if(weatherData){
        weatherDetails= weatherData.map(day =>  <WeatherItem title={day.date} temperature = {day.temperature} icon ={day.weather_icon}/>)
    }
    else{
        weatherDetails=<div><p>Weather Loading</p><ReactLoading type="bubbles" color="#000000"
        height={100} width={50} /></div>
    }

    
    
    return (
        <div className='weather'>
            {weatherDetails}
        </div>
    )

}

export default Weather;