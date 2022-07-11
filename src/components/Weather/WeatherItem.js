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

const WeatherItem = (props) =>{

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
        <div className='weather-item'>
            <p>{props.title}</p>
            <img src={icons[props.icon]} className="weather-icon" alt="weather-icon" />
            <p>{Math.round(props.temperature)}°C</p>
        </div>

    )
}

export default WeatherItem;