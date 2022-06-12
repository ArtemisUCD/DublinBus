import './WeatherItem.css'
import partly_sunny from './img/partly_sunny.png';

const WeatherItem = (props) =>{
    return (
        <div className='weather-item'>
            <p>{props.title}</p>
            <img src={partly_sunny} className="weather-icon" alt="weather-icon" />
            <p>Temperature</p>
        </div>

    )
}

export default WeatherItem;