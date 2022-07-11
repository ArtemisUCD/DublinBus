import './Menu.css'
import RoutePlanner from "./RoutePlanner";
import { useState } from "react";
import { Box, Tab} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';
import DirectionsIcon from '@mui/icons-material/Directions';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusRouteList from './BusRouteList';
import RealTime from './RealTime';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';


const Menu = (props) => {

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setJourneyFurtherDetails(false);
  };

  const [journeyFurtherDetails, setJourneyFurtherDetails] = useState(false)

  const testing = () => {
      console.log("props",props.directions)
      console.log("steps in journey",journeyDetails)
      setJourneyFurtherDetails(!journeyFurtherDetails)
  }

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

  journeySummary =journeyDetails.map(route=> {return <Box role="button" tabIndex="0" onClick={testing} sx={{display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid black",borderRadius:"10px",
  boxShadow:"2px 2px 2px 2px #F9F9F9", "&:hover": {
      cursor:"pointer",
    }}}>{route.map((stepObj) =>{return<Box sx={{display:"flex",alignItems:"center",padding:"0.2rem"}}>{stepObj.mode==="WALKING"?<DirectionsWalkIcon/>:<DirectionsBusIcon/>} {stepObj.busNumber?<Box sx={{backgroundColor:"yellow",marginRight:"0.5rem",borderRadius:"5px",padding:"0.2rem"}}>{stepObj.busNumber}</Box>:null}</Box>}).reduce((prev, curr) => [prev, ' > ', curr])}</Box>})
}

return(
  <Box className="main-menu" sx={{display:"flex", flexDirection:"column",backgroundColor:"black"}}>
  <Box sx={{ zIndex:"1", typography: 'body1', backgroundColor:"white"}}>
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


<Box sx={{zIndex:"1", backgroundColor:"white",margin:"1rem",padding:"2rem",borderRadius:"10px"}}>
{journeyDetails ? journeySummary:null}


{journeyFurtherDetails ? <Box sx={{display:"flex",padding:"2rem",alignItems:"center",justifyContent:"center",border:"1px solid black",borderRadius:"10px",
    boxShadow:"2px 2px 2px 2px #F9F9F9",margin:"2rem", "&:hover":{
        cursor:"pointer",
      }}}><span>Destination: {journeyDetails[1].headsign} No. stops: {journeyDetails[1].stopCount}</span></Box>:null}

</Box>
</Box>
    )
}

export default Menu;