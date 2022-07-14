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

const Menu = (props) => {

  const [value, setValue] = useState('1');
  const [favouriteStops, setFavouriteStops] = useState(JSON.parse(localStorage.getItem('favouriteStops')) ?? []);
  const [favouriteRoutes, setFavouriteRoutes] = useState(JSON.parse(localStorage.getItem('favouriteRoutes')) ?? []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

return(
  <Box className="main-menu" sx={{ zIndex:"1", position:"absolute", typography: 'body1', backgroundColor:"white"}}>
  <TabContext value={value}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} variant="scrollable" onChange={handleChange} aria-label="lab API tabs example">
        <Tab icon={<DirectionsIcon />} label="Directions" value="1" />
        <Tab icon={<DirectionsBusIcon />} label="Bus Routes" value="2" />
        <Tab icon={<AccessTimeIcon />} label="Real Time Info" value="3" />
        <Tab icon={<FavoriteBorderIcon />} label="Favorite" value="4" />
      </Tabs>
    </Box>
    <TabPanel value="1" ><RoutePlanner origin={props.origin} getAddress ={props.getAddress}destination={props.destination} calcRoute={props.calcRoute} clearDetails={props.clearDetails} swap={props.swap} toggleDrawer={props.toggleDrawer}/>
  </TabPanel>
    <TabPanel value="2"><BusRouteList getData={props.getData} getRouteShape={props.getRouteShape} onLikeRoute={addFavouriteRoute} onUnlikeRoute={removeFavouriteRoute} favouritesR={favouriteRoutes} /></TabPanel>
    <TabPanel value="3"><RealTime getData={props.getData} onLike={addFavourite} onUnlike={removeFavourite} favouritesS= {favouriteStops}/></TabPanel>
    <TabPanel value="4"><Favorites getData={props.getData} getRouteShape={props.getRouteShape} getFavData={props.getFavData} onLike={addFavourite} onUnlike={removeFavourite} favouritesS= {favouriteStops} onLikeRoute={addFavouriteRoute} onUnLikeRoute={removeFavouriteRoute} favoritesR = {favouriteRoutes} /></TabPanel>
  </TabContext>
</Box>
    )
}

export default Menu;