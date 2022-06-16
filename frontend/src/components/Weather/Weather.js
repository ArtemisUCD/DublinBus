import WeatherItem from './WeatherItem'
import './Weather.css'
const Weather = () => {

    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

    let weatherDetails = days.map(day =>  <WeatherItem title={day}/>)
    
    return (
        <div className='weather'>
            {weatherDetails}
        </div>
    )

}

export default Weather;