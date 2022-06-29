import './MenuItem.css';
import BusRouteList from './BusRouteList';
import RealTime from './RealTime';
import RoutePlanner from './RoutePlanner';
import Favorites from './Favorites'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import { useState } from 'react';

const MenuItem = (props) => {

    const [showContent,setShowContent] = useState(false)

    const toggleContent = () => {
        setShowContent(!showContent);
    }

    let dropdownContent;
    if(props.title==="Plan Route"){
    dropdownContent = <RoutePlanner />;
    }
    else if(props.title==="Real Time Information"){
        dropdownContent = <RealTime/>
    }
    else if(props.title==="Bus Route"){
        dropdownContent = <BusRouteList onLike={props.onLike} onUnlike={props.onUnlike} favourites = {props.favourites}/>
    }
    else {
        dropdownContent = <Favorites onLike={props.onLike} onUnlike={props.onUnlike} favourites = {props.favourites} />
    }

    return (
        <Accordion>
            <AccordionSummary onClick={toggleContent} 
            expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header">
            {props.title}
        </AccordionSummary>
        <AccordionDetails>
            {showContent ? dropdownContent : null}
            </AccordionDetails>
        </Accordion>
    )
}

export default MenuItem;