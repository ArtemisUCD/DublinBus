import './Favorites.css';
import { Box, List, ListItem, ListItemButton, ListItemText, Button} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { FaHeart } from "react-icons/fa";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useCallback, useEffect, useState, useRef } from "react";
import ReactLoading from "react-loading";
import FavouriteItem from './FavouriteItem'

const Favorites = ({getData,getRouteShape, getCenter, getZoom, getFavData, onUnlike, favouritesS, onUnLikeRoute, favoritesR}) => {

    const [realTimeData, setRealTimeData] = useState();
    const [showRealTime, setShowRealTime] = useState(false);
    const [showRoute, setShowRoute] = useState(false);
    const [isLoading,setIsLoading]= useState(false);
    const [expanded, setExpanded] = useState('Favourite Routes');
    const [routeList, setRouteList] = useState();
    const [routeShape, setRouteShape] = useState();

    const [favouriteRoutes,setFavouriteRoutes] = useState();
    const [favouriteStops,setFavouriteStops] = useState();

    const previousValues = useRef({ routeList, routeShape });

    const handleChange = useCallback((value)=> {
        setExpanded(value);
      },[]);
    
    const getRouteinfo = useCallback(async (item) => {
        setIsLoading(true)
        fetch("/buses/getStopsForRoute/"+item.route_id+"/")
        .then(response => response.json())
        .then(data => setRouteList(data))
        fetch("/buses/getShape/"+item.route_id+"/")
        .then(response => response.json())
        .then(data => setRouteShape(data))
        getCenter({lat: 53.306221, lng: -6.21914755});
        getZoom(11)
    },[getCenter,getZoom])

    useEffect(()=>{
            if (
                previousValues.current.routeShape !== routeShape &&
                previousValues.current.routeList !== routeList
              ) {
                getData(routeList)
                getFavData(null)
                getRouteShape(routeShape) 
                setIsLoading(false)
                setShowRoute(true)
                previousValues.current = { routeList, routeShape };
              }
        
    },[routeList,routeShape,getData,getFavData,getRouteShape])

    useEffect(()=>{
        if(realTimeData!==undefined){
        setIsLoading(false)
        setShowRealTime(true)
        }
    },[realTimeData])
        

    const toggleFavouriteRoute = useCallback((busRoute) =>{
        onUnLikeRoute(busRoute)
    },[onUnLikeRoute])

    const backfav = () => {
        setShowRoute(false);
    }

    const toggleFavourite = useCallback((busRoute) =>{
        onUnlike(busRoute)
    },[onUnlike])

    const backfav2 = () => {
        setShowRealTime(false);
    }

    const getRealTime = useCallback((item) => {
        setIsLoading(true)
        fetch("/buses/getUpdatesForStop/"+item.stop_id+"/")
        .then(response => response.json())
        .then(data => setRealTimeData(data))
        getFavData(item)
        getCenter({"lat": item.stop_lat, "lng": item.stop_lon})
        getZoom(14)
        getData(null)
    },[getCenter,getData,getFavData, getZoom])

useEffect(()=>{
    if(favoritesR && favoritesR.length>0 && showRoute===false){
        if(isLoading){
            setFavouriteRoutes(<Box sx={{display:"flex",justifyContent:"center"}}><p>Fetching Route Info</p><ReactLoading type="bubbles" color="#000000" height={100} width={50}/></Box>)
        }
        else(
    setFavouriteRoutes(<List>{favoritesR.map((item, index) => (
        <ListItem key={index} >
            <IconButton
                onClick={()=>toggleFavouriteRoute(item)}>
                <FaHeart className={"heart full"}/>
            </IconButton>
            <ListItemButton sx={{borderRadius:"10px"}} onClick={() => getRouteinfo(item)}>
            <ListItemText  primary={item.route_name} />
            <ArrowForwardIcon sx={{paddingLeft:"0.5rem"}}/>
            </ListItemButton>
        </ListItem>
    ))}
    </List>))
    }
    else if(favoritesR && favoritesR.length>0 && showRoute===true){
        setFavouriteRoutes(<Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",borderRadius:"10px;"}}>
        <Box sx={{height:"50%",display:"flex",marginTop:"1rem",flexDirection:"column",}}>
            <Box>
                <Button sx={{marginBottom:"1rem"}}onClick={backfav}variant="outlined" size="small" >Back to Favourite List</Button>
            </Box>
            <List
            sx={{
                width: '100%',
                maxWidth: 360,
                bgcolor: 'background.paper',
                position: 'relative',
                overflow: 'auto',
                maxHeight: 400,
                '& ul': { padding: 0 },
            }}>
            {routeList.map((item, index) => (
                <ListItem button
                key={index}>
                <ListItemText primary={item.stop_name} />
                </ListItem>
            ))}
            </List>
        </Box> 
</Box>)
    }
    else{
       setFavouriteRoutes(<Box sx={{display:"flex",justifyContent:"center"}}><strong>No favourite routes</strong></Box>)
    }
},[favoritesR, getRouteinfo,isLoading,routeList,showRoute,toggleFavouriteRoute])

    useEffect(()=>{
        if(favouritesS && favouritesS.length>0 && showRealTime===false){
            if(isLoading){
                setFavouriteStops(<Box sx={{display:"flex",justifyContent:"center"}}><p>Fetching Real Time</p><ReactLoading type="bubbles" color="#000000" height={100} width={50}/></Box>)
            }
            else{
                setFavouriteStops(<List>
                    {favouritesS.map((item, index) => (
                        <ListItem key={index} >
                            <IconButton
                                onClick={()=>toggleFavourite(item)}>
                                <FaHeart className={"heart full"}/>
                            </IconButton>
                            <ListItemButton sx={{borderRadius:"10px"}} onClick={() => getRealTime(item)}>
                            <ListItemText primary={item.stop_name} />
                            <ArrowForwardIcon sx={{paddingLeft:"0.5rem"}}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                    </List>)
            }

        }
        else if(favouritesS && favouritesS.length>0 && showRealTime===true){
            setFavouriteStops(<Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",borderRadius:"10px;"}}>
<Box sx={{height:"50%",display:"flex",marginTop:"1rem",flexDirection:"column",}}>
    <Box>
        <Button sx={{marginBottom:"1rem"}} onClick={backfav2} variant="outlined" size="small" >Back to Favourite List</Button>
    </Box>
    <TableContainer component={Paper}
                        sx={{maxHeight:400,}}>
                        <Table sx={{width: '100%',
                        maxWidth: 380,
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 300, }} aria-label="simple table" stickyHeader>
                            <TableHead>
                            <TableRow>
                                <TableCell>Bus Route</TableCell>
                                <TableCell align="left">Details</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {realTimeData.map((row, index) => (
                                <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell sx={{padding:"1rem 0.25rem 1rem 0.5rem"}} component="th" scope="row">
                                    {row.concat_name}
                                </TableCell>
                                <TableCell sx={{borderBottom:"1px solid rgba(224, 224, 224, 1)",padding:"1rem 0.25rem 1rem 0.5rem"}}align="left">Scheduled:<strong>{row.planned_arrival_time}</strong><br/>Actual:<strong>{row.estimated_arrival_delay_min}</strong></TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                </Box> 
                </Box>)
        }
        else{
            setFavouriteStops(<Box sx={{display:"flex",justifyContent:"center"}}><strong>No favourite stops</strong></Box>)
        }},[favouritesS,showRealTime,realTimeData, toggleFavourite, getRealTime,isLoading])

    return (
        <Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",marginLeft:"1rem",borderRadius:"10px;", maxheight:"300px"}}>
            <Box sx={{height:"50%",display:"flex",marginTop:"1rem",flexDirection:"column",}}>
                <FavouriteItem label={"Favourite Routes"} favouriteContent={favouriteRoutes} handleChange={handleChange} expanded={expanded}/>
                <FavouriteItem  label={"Favourite Stops"} favouriteContent={favouriteStops} handleChange={handleChange} expanded={expanded}/>
            </Box>
        </Box>
    )
}

export default Favorites;
