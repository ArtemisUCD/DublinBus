import './RoutePlanner.css'

const RoutePlanner = () => {
    return(
        <form className='route-form'>
            <div className='route-details'>
            <div className="route-textbox">
            <input type="text" id="origin" placeholder="Enter starting point"/>
            <br/>
            <input type="text" id="destination" placeholder="Enter destination"/>
            </div>
            <button>Change Direction</button>
            </div>
            <br/>
            <div className='depart-arrive-toggle'>
            <div>
            <input type="radio" id="depart" name="direction" defaultChecked/>
            <label htmlFor="depart">Depart</label>
            </div>
            <div>
            <input type="radio" id = "arrive" name = "direction"/>
            <label htmlFor ="arrive">Arrive</label>
            </div>
            </div>
            <br/>
            <label htmlFor="travel-date">Date:</label>
            <input type="date" id="travel-date" required/>
            <br/>
            <label htmlFor="travel-time">Time:</label>
            <input type="time" id="travel-time"  required/>
            <br/>
            <input type="submit" value="Search"/>
        </form>
    )
}

export default RoutePlanner;