import './Menu.css'
import RoutePlanner from "./RoutePlanner";
import { useEffect, useState } from "react";
import { Box, Tab} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';
import DirectionsIcon from '@mui/icons-material/Directions';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BusRouteList from './BusRouteList';
import RealTime from './RealTime';
import Favorites from './Favorites';
import RouteItem from './RouteItem';


const Menu = (props) => {
  let journeyDetails;
  let routeList;

  const [value, setValue] = useState('1');

  const [favouriteStops, setFavouriteStops] = useState(JSON.parse(localStorage.getItem('favouriteStops')) ?? []);
  const [favouriteRoutes, setFavouriteRoutes] = useState(JSON.parse(localStorage.getItem('favouriteRoutes')) ?? []);

  const [startTime, setStartTime] = useState();


  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.getData(null);
    props.getRouteShape([]);
    props.getFavData(null);
  };



    // update favourites in local storage when the state updates
    useEffect(() => {
    localStorage.setItem('favouriteStops', JSON.stringify(favouriteStops));
    }, [favouriteStops]);

    console.log(favouriteStops)

    useEffect(() => {
      localStorage.setItem('favouriteRoutes', JSON.stringify(favouriteRoutes));
      }, [favouriteRoutes]);
  
      console.log(favouriteRoutes)

    const addFavouriteRoute = (newRoute) =>{
      if(!favouriteRoutes.includes(newRoute)){
      setFavouriteRoutes((prevFavouriteRoutes) =>{
        return [...prevFavouriteRoutes,newRoute]
      })
      }
    }
    
  // function to remove bus route from list of favourites
    const removeFavouriteRoute = (routenum) =>{
      setFavouriteRoutes((prevFavouriteRoutes) =>{
        return prevFavouriteRoutes.filter(route => route!== routenum)
      })}

    const addFavourite = (newStop) =>{
        if(!favouriteStops.includes(newStop)){
        setFavouriteStops((prevFavouriteStops) =>{
          return [...prevFavouriteStops,newStop]
        })
        }
      }
      
    // function to remove bus route from list of favourites
      const removeFavourite = (stopnum) =>{
        setFavouriteStops((prevFavouriteStops) =>{
          return prevFavouriteStops.filter(stop => stop!== stopnum)
        })}

  const getStartTime = (value) =>{
    setStartTime(value)
  }

  if(props.directions)
{console.log("directions here",props.directions)
  journeyDetails = props.directions.routes.map(route => route.legs[0].steps.map((step)=>
  {if(step.travel_mode==="TRANSIT")
  {return {
      distance:step.distance.text,
      duration:step.duration.text,
      mode:step.travel_mode,
      busNumber:step.transit.line.short_name,
      headsign:step.transit.headsign,
      stopCount:step.transit.num_stops,
      departure:step.transit.departure_stop.name,
      arrival:step.transit.arrival_stop.name}}
  else{
  return {
      distance:step.distance.text,
      duration:step.duration.text,
      mode:step.travel_mode}
      }}))

    // get duration each step of the journey takes
    let timings = journeyDetails.map(route => route.map(step => parseInt(step.duration.split(" ")[0])))
    // function to cumulateively sum the elements for each route
    const cumulativeSum = (sum => value => sum += value);
    let stepTimes = timings.map(route => route.map(cumulativeSum(0)))
    // get datetime objects for timings and add starttime as first element
    let routeTimings = stepTimes.map(route => [new Date(startTime.getTime())].concat(route.map(duration => new Date(startTime.getTime() + duration * 60000))));

  routeList =journeyDetails.map((routeObj,routeIndex)=> <RouteItem key={Math.random()} routeObj={routeObj} routeIndex={routeIndex} routeTimings={routeTimings}/>)
}


return(
  <Box className="main-menu" sx={{display:"flex", flexDirection:"column",backgroundColor:"white"}}>
  <Box sx={{ zIndex:"1", typography: 'body1', backgroundColor:"white"}}>
  <TabContext value={value}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} variant="scrollable" onChange={handleChange} aria-label="lab API tabs example">
        <Tab icon={<DirectionsIcon />} label="Directions" value="1" />
        <Tab icon={<DirectionsBusIcon />} label="Bus Routes" value="2" />
        <Tab icon={<AccessTimeIcon />} label="Real Time Info" value="3" />
        <Tab icon={<FavoriteBorderIcon />} label="Favorite" value="4" />
      </Tabs>
    </Box>
    <TabPanel sx={{padding:"0.5rem"}} value="1" >
      <RoutePlanner directions={props.directions} origin={props.origin} originError={props.originError} getAddress ={props.getAddress}destination={props.destination} destinationError={props.destinationError} calcRoute={props.calcRoute} clearDetails={props.clearDetails} swap={props.swap} getStartTime = {getStartTime} toggleDrawer={props.toggleDrawer}/>
  </TabPanel>
    <TabPanel value="2"><BusRouteList getData={props.getData} getRouteShape={props.getRouteShape} onLikeRoute={addFavouriteRoute} onUnlikeRoute={removeFavouriteRoute} favouritesR={favouriteRoutes} /></TabPanel>
    <TabPanel value="3"><RealTime getData={props.getData} onLike={addFavourite} onUnlike={removeFavourite} favouritesS= {favouriteStops}/></TabPanel>
    <TabPanel value="4"><Favorites getData={props.getData} getRouteShape={props.getRouteShape} getFavData={props.getFavData} onLike={addFavourite} onUnlike={removeFavourite} favouritesS= {favouriteStops} onLikeRoute={addFavouriteRoute} onUnLikeRoute={removeFavouriteRoute} favoritesR = {favouriteRoutes} /></TabPanel>
  </TabContext>
</Box>
<Box sx={{zIndex:"1", backgroundColor:"white",borderRadius:"10px",overflowY:"auto"}}>
{journeyDetails && value==="1" ? routeList:null}
</Box>
</Box>
    )
}

export default Menu;
