import Accordion from '@mui/material/Accordion';
import RouteSummary from './RouteSummary';
import RouteDetails from './RouteDetails'

const RouteItem = (props)=> {


    return(
    <Accordion>
    <RouteSummary key ={Math.random} routeObj={props.routeObj}/>
    <RouteDetails key ={Math.random} routeObj={props.routeObj} routeIndex={props.routeIndex} routeTimings={props.routeTimings}/>
    </Accordion>
    )
}

export default RouteItem;