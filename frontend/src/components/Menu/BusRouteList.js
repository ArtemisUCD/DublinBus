import './BusRouteList.css'
// import BusRouteItem from './BusRouteItem'
import { useEffect, useState } from 'react';
import { IconButton, Box, TextField, List, ListItem, ListItemText} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';
import { FaHeart, FaRegHeart } from "react-icons/fa";


const BusRouteList = (props) => {
    
    const [routeList, setRouteList] =useState([]);
    const [showinfo, setShowinfo] = useState(false);
    // const [showsearch, setShowsearch] = useState(true);
    const [value, setValue] = useState("");
    const [routeId, setRouteId] = useState("60-41-b12-1");
    const [busroute, setBusroute] = useState([]);
    const [favouriteinfo, setFavouriteinfo] = useState();
    const [showfavicon, setshowfavicon] = useState(false);
    const [favouritedRoutes,setFavouritedRoutes] = useState(false);
    const [routeshape, setRouteShape] = useState([]);

    const getData = () => {
        props.getData(busroute);
    }

    const getRouteShape =() =>{
        props.getRouteShape(routeshape);
    }
    
    useEffect(() => {
        fetch("/buses/getBusRouteList")
        .then(response => response.json())
        .then(data => setRouteList(data))
    },[]);

    useEffect(() => {
        fetch("/buses/getStopsForRoute/"+routeId+"/")
        .then(response => response.json())
        .then(data => setBusroute(data))
      },[routeId]);

      useEffect(() => {
        fetch("/buses/getShape/"+routeId+"/")
        .then(response => response.json())
        .then(data => setRouteShape(data))
      },[routeId]);
    


    const searchresult = ()=>{
        if (value !== ""){
            setShowinfo(true);
            getData(busroute);
            getRouteShape(routeshape);
            setshowfavicon(true);
            setFavouritedRoutes(props.favouritesR.some((v => v.route_id === favouriteinfo.route_id)))
            console.log(routeId)
            console.log(busroute)
        }else{
            setShowinfo(false);
        }   
    }

    let toggleFavouriteRoute = (busroute) =>{
        if(!favouritedRoutes){
            props.onLikeRoute(busroute)
        }
        else{
            props.onUnlikeRoute(busroute)
        }
        setFavouritedRoutes(!favouritedRoutes)
    }

    // const backtoroute =() => {
    //     setShowinfo(false);
    // }
    return(
        <Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",marginLeft:"1rem", maxheight:"300px",
        borderRadius:"10px;"}}>
                <Box sx={{height:"50%",display:"flex",marginTop:"1rem",
                flexDirection:"column",}}>
                
                <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"flex-start"}}>
                    <Autocomplete
                        id="combo-box-demo"
                        getOptionLabel={(routeList) => 
                            `${routeList.concat_name}`
                        }
                        options={routeList}
                        sx={{width:250}}
                        isOptionEqualToValue={(option, value) =>
                            option.concat_name === value.concat_name
                        }
                        onChange={(e,value) => {setValue(value.concat_name); setRouteId(value.route_id); setFavouriteinfo({"route_name": value.concat_name, "route_id": value.route_id})}}
                        noOptionsText={"No result"}
                        renderOption={(props, routeList) => (
                            <Box component="li" {...props} key={routeList.concat_name}>
                                {routeList.concat_name}
                            </Box>
                        )}
                        renderInput={(params)=><TextField {...params} label="Route name/number" />}
                    />
                    <IconButton size ="small" onClick={searchresult} sx={{border: "1px solid gray", borderRadius: 1, marginLeft: 2}}>
                        <SearchIcon />
                    </IconButton>
                    {showfavicon && (
                        <div>
                         {favouritedRoutes ? <FaHeart className={"heart full"} onClick={()=>toggleFavouriteRoute(favouriteinfo)}/> : <FaRegHeart className={"heart empty"} onClick={()=>toggleFavouriteRoute(favouriteinfo)}/>}
                        </div>
                    )}
                    
                </Box>
                        
                
                {showinfo && (
                    <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"flex-start"}}>
                        {/* <Button onClick={backtoroute}variant="outlined" size="small" >Back to Search</Button> */}
                        {/* <Box>
                            {value}
                        </Box> */}
                        <Box sx={{display:"flex", justifyContent:"flex-start", width:"100%"}}>
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
                        {busroute.map((item, index) => (
                            <ListItem button
                            key={index}
                        >
                            <ListItemText primary={item.stop_name} 
                             />
                        </ListItem>
                        
                        ))}
                            
                    </List>
                </Box> 
                    </Box>
                )}
                </Box>
                <Box>
                
                </Box>
                </Box>
    )
}
export default BusRouteList;
