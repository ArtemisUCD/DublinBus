import './MenuItem.css';
import BusRoute from './BusRoute';
import RealTime from './RealTime';
import RoutePlanner from './RoutePlanner';
import Favorites from './Favorites'
import { useState } from 'react';

const MenuItem = (props) => {

    const [showContent,setShowContent] = useState(false)

    const toggleContent = () => {
        setShowContent(!showContent);
    }

    let dropdownContent = props.title;
    if(props.title==="Plan Route"){
    dropdownContent = <RoutePlanner />;
    }
    else if(props.title==="Real Time Information"){
        dropdownContent = <RealTime/>
    }
    else if(props.title==="Bus Route"){
        dropdownContent = <BusRoute/>
    }
    else {
        dropdownContent = <Favorites />
    }

    return (
        <div>
        <button onClick={toggleContent}className={showContent ? "accordion-button collapsed" : "accordion-button"}>
            {props.title}
        </button>
        <div>
            {showContent ? dropdownContent : null}
        </div>
        </div>
    )
}

export default MenuItem;