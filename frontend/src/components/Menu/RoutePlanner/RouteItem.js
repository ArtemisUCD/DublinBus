import Accordion from '@mui/material/Accordion';
import RouteSummary from './RouteSummary';
import RouteDetails from './RouteDetails'
import { Box} from "@mui/material";
import { useState } from 'react';
import ReactLoading from "react-loading";

const RouteItem = (props)=> {

    const [showDetails,setShowDetails] = useState(false)

    const toggleJourneyDetails = ()=>{
        setShowDetails(!showDetails)
        props.changeDirectionsRender(props.routeIndex)
    }

    let routeDetails;
    
    if(props.routeTimings===undefined|| props.stepTimings===undefined){
        routeDetails=<Box sx={{display:"flex",justifyContent:"center"}}><p>Modelling Journey</p><ReactLoading type="bubbles" color="#000000" height={100} width={50}/ ></Box>
    }
    else{routeDetails = <RouteDetails key ={Math.random} routeObj={props.routeObj} routeIndex={props.routeIndex} routeTimings={props.routeTimings} stepTimings={props.stepTimings}/>}

    return(
    <Accordion>
    <RouteSummary onClick={toggleJourneyDetails} key ={Math.random} routeObj={props.routeObj}/>
    {showDetails ? routeDetails : null}
    </Accordion>
    )
}

export default RouteItem;