import WeatherItem from './WeatherItem'
import './Weather.css'
import { useEffect, useState } from 'react';

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

    
    
    return (
        <div className='weather'>
            {weatherDetails}
        </div>
    )

}

export default Weather;