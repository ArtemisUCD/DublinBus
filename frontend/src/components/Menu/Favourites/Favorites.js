import './Favorites.css';
import { Box, List, ListItem, ListItemButton, ListItemText, Button} from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
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
import { useEffect, useState } from "react";

const Favorites = (props) => {

    const [stopinfo, setStopInfo] = useState([]);
    const [stopId, setStopId] = useState("8220DB000003");
    // const [showstoplist, setshowstoplist] = useState(true);
    const [showstopUpdate, setShowstopUpdata] = useState(false);
    const [routeId, setRouteId] = useState("60-X32-b12-1");
    // const [showroutelist, setshowroutelist] = useState(true);
    const [showrouteUpdate, setShowrouteUpdata] = useState(false);
    const [expanded, setExpanded] = useState('panel1');

    let favouriteRoutes;
    let favouriteStops;
    
    const getStopinfo = (item) => {
        setStopInfo(item)
        setStopId(item.stop_id)
        props.getFavData(item)
        props.getCenter({"lat": item.stop_lat, "lng": item.stop_lon})
        props.getZoom(16)
        props.getData(null)
        props.getRouteShape([])
        // setshowstoplist(false)
        setShowstopUpdata(true)
    }

    const getRouteinfo = (item) => {
        setRouteId(item.route_id)
        props.getData(routeList)
        props.getFavData(null)
        props.getRouteShape(routeshape) 
        props.getCenter({lat: 53.306221, lng: -6.21914755});
        props.getZoom(11)
        // setshowroutelist(false)
        setShowrouteUpdata(true)
    }

    const [stopupdate, setStopupdate] = useState([]);

      useEffect(() => {
          fetch("/buses/getUpdatesForStop/"+stopId+"/")
          .then(response => response.json())
          .then(data => setStopupdate(data))
        },[stopId]);
    
    const [routeList, setRouteList] = useState([]);
        
    useEffect(() => {
        fetch("/buses/getStopsForRoute/"+routeId+"/")
        .then(response => response.json())
        .then(data => setRouteList(data))
      },[routeId]);

    const [routeshape, setRouteShape] = useState([]);

    useEffect(() => {
        fetch("/buses/getShape/"+routeId+"/")
        .then(response => response.json())
        .then(data => setRouteShape(data))
      },[routeId]);

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
      };

    const toggleFavourite = (busRoute) =>{
        props.onUnlike(busRoute)
    }

    const toggleFavouriteRoute = (busRoute) =>{
        props.onUnLikeRoute(busRoute)
    }

    const backfav = () => {
        setShowstopUpdata(false);
        // setshowstoplist(true);
        setShowrouteUpdata(false);
        // setshowroutelist(true);
    }


    if(props.favoritesR && props.favoritesR.length>0 && showrouteUpdate===false){
    favouriteRoutes = <List>{props.favoritesR.map((item, index) => (
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
    </List>
    }
    else if(props.favoritesR && props.favoritesR.length>0 && showrouteUpdate===true){
        favouriteRoutes = <Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",borderRadius:"10px;"}}>
        <Box sx={{height:"50%",display:"flex",marginTop:"1rem",flexDirection:"column",}}>
            <Box>
                <Button onClick={backfav}variant="outlined" size="small" >Back to Favorite List</Button>
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
</Box>
    }
    else{
        favouriteRoutes = <Box sx={{display:"flex",justifyContent:"center"}}><strong>No favourite routes</strong></Box>
    }

    if(props.favouritesS && props.favouritesS.length>0 && showstopUpdate===false){
        favouriteStops = <List>
        {props.favouritesS && props.favouritesS.map((item, index) => (
            <ListItem key={index} >
                <IconButton
                    onClick={()=>toggleFavourite(item)}>
                    <FaHeart className={"heart full"}/>
                </IconButton>
                <ListItemButton sx={{borderRadius:"10px"}} onClick={() => getStopinfo(item)}>
                <ListItemText primary={item.stop_name} />
                <ArrowForwardIcon sx={{paddingLeft:"0.5rem"}}/>
                </ListItemButton>
            </ListItem>
        ))}
        </List>
        }
        else if(props.favouritesS && props.favouritesS.length>0 && showstopUpdate===true){
            favouriteStops = <Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",borderRadius:"10px;"}}>
            <Box sx={{height:"50%",display:"flex",marginTop:"1rem",flexDirection:"column",}}>
                <Box>
                    <Button onClick={backfav}variant="outlined" size="small" >Back to Favorite List</Button>
                </Box>
            </Box> 
    </Box>
        }
        else{
            favouriteStops = <Box sx={{display:"flex",justifyContent:"center"}}><strong>No favourite stops</strong></Box>
        }


    return (
        <Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",marginLeft:"1rem",borderRadius:"10px;", maxheight:"300px"}}>
            <Box sx={{height:"50%",display:"flex",marginTop:"1rem",flexDirection:"column",}}>
                
                <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"flex-start", maxheight:"300px",width:"100%"}}>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} sx={{width:"100%"}}>
                        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
                            <Typography>Favourite Routes</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {favouriteRoutes}
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <Box sx={{display:"flex",justifyContent:"flex-start"}}>
                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} sx={{width:"100%"}}>
                        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon />}>
                            <Typography>Favourite Stops</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        {favouriteStops}
                        {showstopUpdate && (
                            <Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",borderRadius:"10px;"}}>
                                <Box sx={{height:"50%",display:"flex",marginTop:"1rem",flexDirection:"column",}}>
                                    {/* <Box>
                                        <Button onClick={backfav}variant="outlined" size="small" >Back to Favorite List</Button>
                                    </Box> */}
                                    <Box sx={{display:"flex", justifyContent:"flex-start", width:"100%"}}>
                        
                                        <TableContainer component={Paper}
                                            sx={{maxHeight:400,}}>
                                            <Table sx={{width: '100%',
                                            maxWidth: 340,
                                            position: 'relative',
                                            overflow: 'auto',
                                            maxHeight: 300, }} aria-label="simple table">
                                                <TableHead>
                                                <TableRow>
                                                    <TableCell>Bus Route</TableCell>
                                                    <TableCell align="right">Plan</TableCell>
                                                    <TableCell align="right">Estimate</TableCell>
                                                    <TableCell align="right">Delay</TableCell>
                                                </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                {stopupdate.map((row, index) => (
                                                    <TableRow
                                                    key={index}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                    <TableCell component="th" scope="row">
                                                        {row.concat_name}
                                                    </TableCell>
                                                    <TableCell align="right">{row.planned_arrival_time}</TableCell>
                                                    <TableCell align="right">{row.estimated_arrival_time}</TableCell>
                                                    <TableCell align="right">{row.estimated_arrival_delay_min}</TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                            </TableContainer>
                                    </Box> 
                                </Box>
                            </Box>
                            
                        )}
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </Box>
    )
}

export default Favorites;
