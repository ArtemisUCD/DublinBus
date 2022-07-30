import './Menu.css'
import RoutePlanner from "./RoutePlanner/RoutePlanner";
import { useCallback, useEffect, useState } from "react";
import { Box, Tab} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';
import DirectionsIcon from '@mui/icons-material/Directions';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import BusRouteList from './BusRouteList';
import RealTime from './RealTime/RealTime';
import Favorites from './Favourites/Favorites';
import RouteItem from './RoutePlanner/RouteItem';
import Weather from '../Weather/Weather';


const Menu = ( {getData,directions,getRouteShape,getFavData,origin,getAddress,destination,calcRoute,map,clearDetails,swap,toggleDrawer,changeDirectionsRender,getCenter, getZoom,weather} ) => {
  let journeyDetails;

  const [value, setValue] = useState('1');

  const [favouriteStops, setFavouriteStops] = useState(JSON.parse(localStorage.getItem('favouriteStops')) ?? []);
  const [favouriteRoutes, setFavouriteRoutes] = useState(JSON.parse(localStorage.getItem('favouriteRoutes')) ?? []);

  const [startTime, setStartTime] = useState();
  const [routeList,setRouteList] = useState();

  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];


  const handleChange = (event, newValue) => {
    setValue(newValue);
    getData(null);
    getRouteShape([]);
    getFavData(null);
    getCenter({lat: 53.306221, lng: -6.21914755});
    getZoom(11)
  };

  const cumulativeSum = (sum => value => sum += value);

  // if(props.weather && startTime){
  //   console.log("weather data",props.weather)
  // //   console.log("datetime",typeof weekday[startTime.getDay()])
  // //   console.log("weather summary",props.weather.filter(el=>el.date===weekday[startTime.getDay()])[0].weather_icon)
  // }
  

    useEffect(()=>{
      let timings;
      let stepTimes;
      let routeTimings;
      const newRoutes=["H3","6"]

      const getModelValues = async (routeIndex,stepIndex,step)=>{
        let weatherSummary = weather.filter(el=>el.date===weekday[startTime.getDay()])[0].weather_icon.slice(0,-1)
        let theanswer = await fetch("/buses/getEstimateTime/"+(Math.round((startTime.getTime()/1000)))+`/${step.transit.line.short_name}/${step.transit.headsign}/${step.transit.num_stops}/${weatherSummary}`)
    
        let response = await theanswer.json()
        timings[routeIndex][stepIndex]=response
        console.log(`model output for ${step.transit.line.short_name} loc ${routeIndex}${stepIndex}`,response)
      }

      const timesUpdated = async ()=>{
        let modeltimings = directions.routes.map(route => route.legs[0].steps)
        for(const [routeIndex, route] of modeltimings.entries()){
          for(const [stepIndex, step]  of route.entries()){
            if(step.travel_mode==="TRANSIT"){
            if(!newRoutes.includes(step.transit.line.short_name)){
            await getModelValues(routeIndex,stepIndex,step)
            }
            else{
              console.log(`${step.transit.line.short_name} does not have a model`)
            }
            }
          }
        }
      }

    if(directions!==null){
          // get duration each step of the journey takes
    timings = journeyDetails.map(route => route.map(step => parseInt(step.duration.split(" ")[0])))
    setRouteList(journeyDetails.map((routeObj,routeIndex)=> <RouteItem key={`route_${routeIndex}`} routeObj={routeObj} routeIndex={routeIndex} routeTimings={routeTimings} stepTimings={timings}  changeDirectionsRender={changeDirectionsRender}/>));

    timesUpdated().then(()=>{
      console.log("updated times",timings);
      stepTimes = timings.map(route => route.map(cumulativeSum(0)));
      // get datetime objects for timings and add starttime as first element
      routeTimings = stepTimes.map(route => [new Date(startTime.getTime())].concat(route.map(duration => new Date(startTime.getTime() + duration * 60000))))
      setRouteList(journeyDetails.map((routeObj,routeIndex)=> <RouteItem key={`route_${routeIndex}`} routeObj={routeObj} routeIndex={routeIndex} routeTimings={routeTimings} stepTimings={timings} changeDirectionsRender={changeDirectionsRender}/>));
    })

      }
      else{
        console.log("no directions yet")
      }
      // eslint-disable-next-line 
  },[directions,startTime,journeyDetails])
  

    // update favourites in local storage when the state updates
    useEffect(() => {
    localStorage.setItem('favouriteStops', JSON.stringify(favouriteStops));
    }, [favouriteStops]);


    useEffect(() => {
      localStorage.setItem('favouriteRoutes', JSON.stringify(favouriteRoutes));
      }, [favouriteRoutes]);
  

    const addFavouriteRoute = useCallback((newRoute) =>{
      if(favouriteRoutes.filter(route => route.route_name === newRoute.route_name).length===0){
      setFavouriteRoutes((prevFavouriteRoutes) =>{
        return [...prevFavouriteRoutes,newRoute]
      })
      }
    },[favouriteRoutes])
  // function to remove bus route from list of favourites
    const removeFavouriteRoute = useCallback((routenum) =>{
      setFavouriteRoutes((prevFavouriteRoutes) =>{
        return prevFavouriteRoutes.filter(route => route.route_name!== routenum.route_name)
      })},[])

    const addFavourite = useCallback((newStop) =>{
        if(favouriteStops.filter(stop => stop.stop_id === newStop.stop_id).length===0){
        setFavouriteStops((prevFavouriteStops) =>{
          return [...prevFavouriteStops,newStop]
        })
        }
      },[favouriteStops])
      
    // function to remove bus route from list of favourites
      const removeFavourite = useCallback((stopnum) =>{
        console.log("favourites in function",favouriteStops)
        setFavouriteStops((prevFavouriteStops) =>{
          return prevFavouriteStops.filter(stop => stop.stop_id!== stopnum.stop_id)
        })},[favouriteStops])

  const getStartTime = (value) =>{
    setStartTime(value)
  }

  if(directions)
{ 

  journeyDetails = directions.routes.map(route => route.legs[0].steps.map((step)=>
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
        <Tab icon={<WbSunnyIcon />} label="Weather" value="5" />
      </Tabs>
    </Box>
    <TabPanel sx={{padding:"0.5rem"}} value="1" >
      <RoutePlanner directions={directions} origin={origin} getAddress ={getAddress}destination={destination} calcRoute={calcRoute} clearDetails={clearDetails} swap={swap} getStartTime = {getStartTime} toggleDrawer={toggleDrawer} />
  </TabPanel>
    <TabPanel value="2"><BusRouteList getData={getData} getRouteShape={getRouteShape} onLikeRoute={addFavouriteRoute} onUnlikeRoute={removeFavouriteRoute} favouritesR={favouriteRoutes} /></TabPanel>
    <TabPanel value="3"><RealTime getData={getData} getCenter={getCenter} getZoom={getZoom} onLike={addFavourite} onUnlike={removeFavourite} favouritesS= {favouriteStops}/></TabPanel>
    <TabPanel value="4"><Favorites getData={getData} getRouteShape={getRouteShape} getCenter={getCenter} getZoom={getZoom} getFavData={getFavData} onLike={addFavourite} onUnlike={removeFavourite} favouritesS= {favouriteStops} onLikeRoute={addFavouriteRoute} onUnLikeRoute={removeFavouriteRoute} favoritesR = {favouriteRoutes} /></TabPanel>
    <TabPanel value="5"><Weather /></TabPanel>
  </TabContext>
</Box>
<Box sx={{zIndex:"1", backgroundColor:"white",borderRadius:"10px",overflowY:"auto"}}>
{journeyDetails && value==="1" ? routeList:null}
</Box>
</Box>
    )
}

export default Menu;