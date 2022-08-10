import './BusRouteList.css'
import { useEffect, useState, useRef } from 'react';
import { Box, TextField, List, ListItem, ListItemText} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import ReactLoading from "react-loading";

const BusRouteList = ({ getData, getRouteShape, favouritesR,onLikeRoute,onUnlikeRoute }) => {

    const [routeList, setRouteList] =useState([]);
    const [busroute, setBusroute] = useState([]);
    const [routeSelected, setRouteSelected] = useState();
    const [routeShape, setRouteShape] = useState([]);
    const [fetchingData,setFetchingData] = useState(false)

    const previousValues = useRef({ busroute, routeShape });
    
    useEffect(() => {
        fetch("/buses/getBusRouteList")
        .then(response => response.json())
        .then(data => setRouteList(data))
    },[]);


    useEffect(() => {
        if(routeSelected!==undefined){
            setFetchingData(true)
            fetch("/buses/getStopsForRoute/"+routeSelected.route_id+"/")
            .then(response => response.json())
            .then(data => setBusroute(data))
            fetch("/buses/getShape/"+routeSelected.route_id+"/")
            .then(response => response.json())
            .then(data => setRouteShape(data))
        }
      },[routeSelected]);

      useEffect(()=>{
      if (
        previousValues.current.routeShape !== routeShape &&
        previousValues.current.busroute !== busroute
      ) {
        getData(busroute);
        getRouteShape(routeShape);
        setFetchingData(false)
        previousValues.current = { busroute, routeShape };
      } 
    },[busroute, favouritesR, routeSelected, routeShape,getData,getRouteShape])
    
    let toggleFavouriteRoute = (busroute) =>{
        if(!favouritesR.some((v => v.route_id === busroute.route_id))){
            onLikeRoute(busroute)
        }
        else{
            onUnlikeRoute(busroute)
        }
    }

    return(
        <Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",marginLeft:"1rem", maxheight:"300px",
        borderRadius:"10px;"}}>
                <Box sx={{height:"50%",display:"flex",marginTop:"1rem",
                flexDirection:"column",}}>
                
                <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"center",alignItems:"center"}}>
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
                        onChange={(e,value) => {
                        if(value!==null){
                            setRouteSelected({"route_name": value.concat_name, "route_id": value.route_id})
                        }
                        else{
                            setRouteSelected(undefined)
                        }
                        }}
                        noOptionsText={<Box sx={{display:"flex",alignItems:"center"}}>Bus Routes loading<ReactLoading type="bubbles" color="#000000" height={50} width={50}/></Box>}
                        renderOption={(props, routeList) => (
                            <Box component="li" {...props} key={routeList.concat_name}>
                                {routeList.concat_name}
                            </Box>
                        )}
                        renderInput={(params)=><TextField {...params} label="Route name/number" />}
                    />
                    {routeSelected?  <div>
                         {favouritesR.some((v => v.route_id === routeSelected.route_id)) ? <FaHeart className={"heart full"} onClick={()=>toggleFavouriteRoute(routeSelected)}/> : <FaRegHeart className={"heart empty"} onClick={()=>toggleFavouriteRoute(routeSelected)}/>}
                        </div>:null}
                </Box>
                {routeSelected?fetchingData?<Box sx={{display:"flex",justifyContent:"center"}}><p>Fetching Route Info</p><ReactLoading type="bubbles" color="#000000" height={100} width={50}/></Box>:
                    <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"flex-start"}}>
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
                    </Box>:null}
                </Box>
                <Box>
                </Box>
                </Box>
    )
}
export default BusRouteList;
