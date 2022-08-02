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
import TwitterIcon from '@mui/icons-material/Twitter';
import BusRouteList from './BusRouteList';
import RealTime from './RealTime/RealTime';
import Favorites from './Favourites/Favorites';
import Weather from '../Weather/Weather';
import Twitter from './Twitter';


const Menu = ( {getData,directions,getRouteShape,getFavData,origin,getAddress,destination,calcRoute,map,clearDetails,swap,toggleDrawer,changeDirectionsRender,getCenter, getZoom,weather} ) => {

  const [value, setValue] = useState('1');
  const [favouriteStops, setFavouriteStops] = useState(JSON.parse(localStorage.getItem('favouriteStops')) ?? []);
  const [favouriteRoutes, setFavouriteRoutes] = useState(JSON.parse(localStorage.getItem('favouriteRoutes')) ?? []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    getData(null);
    getRouteShape([]);
    getFavData(null);
    getCenter({lat: 53.348665, lng: -6.21914755});
    getZoom(11)
  };

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

return(
  <Box className="main-menu" sx={{display:"flex", flexDirection:"column",backgroundColor:"white"}}>
  <Box sx={{ zIndex:"1", typography: 'body1', backgroundColor:"white",overflowY:"auto"}}>
  <TabContext value={value}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} variant="scrollable" onChange={handleChange} aria-label="lab API tabs example">
        <Tab icon={<DirectionsIcon />} label="Directions" value="1" />
        <Tab icon={<DirectionsBusIcon />} label="Bus Routes" value="2" />
        <Tab icon={<AccessTimeIcon />} label="Real Time Info" value="3" />
        <Tab icon={<FavoriteBorderIcon />} label="Favorite" value="4" />
        <Tab icon={<WbSunnyIcon />} label="Weather" value="5" />
        <Tab icon={<TwitterIcon />} label="Twitter" value="6" />
      </Tabs>
    </Box>
    <TabPanel sx={{padding:"0.5rem"}} value="1" >
      <RoutePlanner directions={directions} origin={origin} getAddress ={getAddress}destination={destination} calcRoute={calcRoute} clearDetails={clearDetails} swap={swap} toggleDrawer={toggleDrawer} weather={weather} changeDirectionsRender={changeDirectionsRender} />
  </TabPanel>
    <TabPanel value="2"><BusRouteList getData={getData} getRouteShape={getRouteShape} onLikeRoute={addFavouriteRoute} onUnlikeRoute={removeFavouriteRoute} favouritesR={favouriteRoutes} /></TabPanel>
    <TabPanel value="3"><RealTime getData={getData} getCenter={getCenter} getZoom={getZoom} onLike={addFavourite} onUnlike={removeFavourite} favouritesS= {favouriteStops}/></TabPanel>
    <TabPanel value="4"><Favorites getData={getData} getRouteShape={getRouteShape} getCenter={getCenter} getZoom={getZoom} getFavData={getFavData} onLike={addFavourite} onUnlike={removeFavourite} favouritesS= {favouriteStops} onLikeRoute={addFavouriteRoute} onUnLikeRoute={removeFavouriteRoute} favoritesR = {favouriteRoutes} /></TabPanel>
    <TabPanel  value="5"><Weather /></TabPanel>
    <TabPanel value="6"><Twitter /></TabPanel>
  </TabContext>
</Box>
</Box>
    )
}

export default Menu;