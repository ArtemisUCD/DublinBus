
import { useEffect, useState } from 'react';
import "./RealTime.css";
import { IconButton, Box, TextField} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const RealTime = (props) => {

    const [stopData, setstopData] =useState([]);
    const [showinfo, setShowinfo] = useState(false);
    const [stopupdate, setStopupdate] = useState([]);
    // const [showsearch, setShowsearch] = useState(true);
    const [value, setValue] = useState("");
    const [stopId, setStopId] = useState("8220DB000003");
    const [stopinfo, setStopInfo] = useState([]);
    const [favouriteinfo, setFavoriteinfo] = useState();
    const [showfavicon, setshowfavicon] = useState(false);
    const [favouritedStops,setFavouritedStops] = useState(false);
    
    useEffect(() => {
        fetch("/api/stop_")
        .then(response => response.json())
        .then(data => setstopData(data))
      },[]);

      useEffect(() => {
        fetch("/buses/getUpdatesForStop/"+stopId+"/")
        .then(response => response.json())
        .then(data => setStopupdate(data))
      },[stopId]);

    const searchresult = ()=>{
        if (value !== ""){
            setShowinfo(true);
            props.getData(stopinfo);
            setshowfavicon(true);
            console.log(favouriteinfo)
            setFavouritedStops(props.favouritesS.some((v => v.stop_id === favouriteinfo.stop_id)))
            console.log(favouritedStops)
            console.log(stopId);
            console.log(stopinfo)
        }else{
            setShowinfo(false);
        }   
    }

    const toggleFavourite = (busStop) =>{
        if(!favouritedStops){
            props.onLike(busStop)
        }
        else{
            props.onUnlike(busStop)
        }
        setFavouritedStops(!favouritedStops)
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
                        getOptionLabel={(stopData) => 
                            `${stopData.stop_name}`
                        }
                        options={stopData}
                        sx={{width:250}}
                        isOptionEqualToValue={(option, value) =>
                            option.stop_name === value.stop_name
                        }
                        onChange={(e,value) => {
                            setValue(value.stop_name); 
                            setStopId(value.stop_id); 
                            setStopInfo([{"stop_name": value.stop_name,
                                        "stop_id": value.stop_id,
                                        "stop_lat": value.stop_lat,
                                        "stop_lon": value.stop_lon}])
                            setFavoriteinfo({"stop_name": value.stop_name,
                                        "stop_id": value.stop_id,
                                        "stop_lat": value.stop_lat,
                                        "stop_lon": value.stop_lon})
                            }}
                            
                        noOptionsText={"No result"}
                        renderOption={(props, stopData) => (
                            <Box component="li" {...props} key={stopData.stop_name}>
                                {stopData.stop_name}
                            </Box>
                        )}
                        renderInput={(params)=><TextField {...params} label="Stop name/number" />}
                    />
                    <IconButton size ="small" onClick={searchresult} sx={{border: "1px solid gray", borderRadius: 1, marginLeft: 2}}>
                        <SearchIcon />
                    </IconButton>
                    {showfavicon && (
                        <div>
                         {favouritedStops ? <FaHeart className={"heart full"} onClick={()=>toggleFavourite(favouriteinfo)}/> : <FaRegHeart className={"heart empty"} onClick={()=>toggleFavourite(favouriteinfo)}/>}
                        </div>
                    )}
                    
                    
                </Box>
                        
                
                {showinfo && (
                    
                    <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"flex-start"}}>
                        {/* <Button onClick={backtoroute}variant="outlined" size="small" >Back to Search</Button> */}
                        <Box sx={{display:"flex", justifyContent:"flex-start", width:"100%"}}>
                   
                    <TableContainer component={Paper}
                        sx={{maxHeight:400,}}>
                        <Table sx={{width: '100%',
                        maxWidth: 360,
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 300, }} aria-label="simple table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Bus Route</TableCell>
                                <TableCell align="right">Due</TableCell>
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
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                </Box> 
                    </Box>
                )}
                </Box>
    
                </Box>
    )
}

export default RealTime;
