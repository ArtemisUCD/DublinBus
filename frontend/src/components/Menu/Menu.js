import './Menu.css'
import RoutePlanner from "./RoutePlanner";
import { useState } from "react";
import { Box, Tab} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';
import DirectionsIcon from '@mui/icons-material/Directions';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Accordion from '@mui/material/Accordion';
import BusRouteList from './BusRouteList';
import RealTime from './RealTime';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';


const Menu = (props) => {

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  let journeyDetails;
  let journeySummary;

  if(props.directions)
{

  journeyDetails = props.directions.routes.map(route => route.legs[0].steps.map((step)=>
  {if(step.travel_mode==="TRANSIT")
  {return {distance:step.distance.text,
      duration:step.duration.text,
      mode:step.travel_mode,
  busNumber:step.transit.line.short_name,
  headsign:step.transit.headsign,
  stopCount:step.transit.num_stops,
  departure:step.transit.departure_stop.name,
  arrival:step.transit.arrival_stop.name}}
      else{
          return {distance:step.distance.text,
              duration:step.duration.text,
              mode:step.travel_mode}
      }}))


  journeySummary =journeyDetails.map((route,routeIndex)=> {return <Accordion ><AccordionSummary  
    aria-controls="panel1a-content"
    sx={{width:"100%",display:"flex",paddingLeft:"2rem"}}
    >{route.map((stepObj) =>{return <Box sx={{display:"flex"}}> {stepObj.mode==="WALKING"?<DirectionsWalkIcon/>:<DirectionsBusIcon/>} {stepObj.busNumber?<Box sx={{backgroundColor:"yellow",marginRight:"0.5rem",borderRadius:"5px",padding:"0.2rem"}}>{stepObj.busNumber}</Box>:null}</Box>}).reduce((prev, curr) => [prev, ' > ', curr])}</AccordionSummary>
    <AccordionDetails sx={{backgroundColor:"aqua"}}>
    {journeyDetails[routeIndex].map(step =>{if(step.mode==="WALKING")
    { return <p><DirectionsWalkIcon/>{step.distance} {step.duration} {step.mode}</p>}
    else{
      return <p><DirectionsBusIcon/>{step.distance} **MODEL VALUE** {step.mode} No. stops:{step.stopCount} {step.departure} {step.arrival}</p>
    }}
    )}
    </AccordionDetails>
    </Accordion>})

    console.log("journey details",journeyDetails)


}

return(
  <Box className="main-menu" sx={{display:"flex", flexDirection:"column",backgroundColor:"black"}}>
  <Box sx={{ zIndex:"1", typography: 'body1', backgroundColor:"pink"}}>
  <TabContext value={value}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} variant="scrollable" onChange={handleChange} aria-label="lab API tabs example">
        <Tab icon={<DirectionsIcon />} label="Directions" value="1" />
        <Tab icon={<DirectionsBusIcon />} label="Bus Routes" value="2" />
        <Tab icon={<AccessTimeIcon />} label="Real Time Info" value="3" />
      </Tabs>
    </Box>
    <TabPanel value="1" ><RoutePlanner directions = {props.directions} origin={props.origin} getAddress ={props.getAddress}destination={props.destination} calcRoute={props.calcRoute} clearDetails={props.clearDetails} swap={props.swap} toggleDrawer={props.toggleDrawer}/>
  </TabPanel>
    <TabPanel value="2"><BusRouteList /></TabPanel>
    <TabPanel value="3"><RealTime /></TabPanel>
  </TabContext>
</Box>


<Box sx={{zIndex:"1", backgroundColor:"green",margin:"1rem",borderRadius:"10px",overflowY:"auto"}}>
{journeyDetails && value==="1" ? journeySummary:null}


</Box>
</Box>
    )
}

export default Menu;