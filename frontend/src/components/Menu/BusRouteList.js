import './BusRouteList.css'
// import BusRouteItem from './BusRouteItem'
import { useEffect, useState } from 'react';
import { IconButton, Box, TextField, Button, List, ListItem, ListItemText} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete';
import SearchIcon from '@mui/icons-material/Search';


const RealTime = () => {
    
    const [routeList, setRouteList] =useState([]);
    const [showinfo, setShowinfo] = useState(false);
    // const [showsearch, setShowsearch] = useState(true);
    const [value, setValue] = useState("");
    const [routeId, setRouteId] = useState("");
    const [busroute, setBusroute] = useState([]);
    
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

    // let routefav
    // if (enterRoute != ""){
    //     routefav = <BusRouteItem key = {Math.random()} route = {enterRoute} onLike={props.onLike} onUnlike={props.onUnlike} favourites = {props.favourites}/>;
    // }

    const searchresult = ()=>{
        if (value !== ""){
            setShowinfo(true);
        }else{
            setShowinfo(false);
        }   
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
                        sx={{width:200}}
                        isOptionEqualToValue={(option, value) =>
                            option.concat_name === value.concat_name
                        }
                        onChange={(e,value) => {setValue(value.concat_name); setRouteId(value.route_id)}}
                        noOptionsText={"Stop name/number"}
                        renderOption={(props, routeList) => (
                            <Box component="li" {...props} key={routeList.route_id}>
                                {routeList.concat_name}
                            </Box>
                        )}
                        renderInput={(params)=><TextField {...params} label="Stop name/number" />}
                    />
                    <IconButton size ="small" onClick={searchresult} sx={{border: "2px solid gray", borderRadius: 1}}>
                        <SearchIcon />
                    </IconButton>
                    
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
                            maxHeight: 300,
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
export default RealTime;
