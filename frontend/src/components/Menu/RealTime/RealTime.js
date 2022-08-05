
import { useEffect, useState } from 'react';
import "./RealTime.css";
import {  Box, TextField} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ReactLoading from "react-loading";


const RealTime = ({favouritesS,onLike,onUnlike,getData,getCenter,getZoom}) => {

    const [stopList, setStopList] =useState([]);
    const [showinfo, setShowinfo] = useState(false);
    const [realTimeData, setRealTimeData] = useState();
    const [stopSelected, setStopSelected] = useState([]);
    const [fetchingData,setFetchingData] = useState(false)
    const [showfavicon, setshowfavicon] = useState(false);
    // const [zoom, setZoom] = useState(11)

    const [realTimeDetails, setRealTimeDetails] = useState();
    
    useEffect(() => {
        fetch("/api/stop_")
        .then(response => response.json())
        .then(data => setStopList(data))
      },[]);

      useEffect(() => {
        if(stopSelected.length===1){
        // show favourite button beside the newly selected stop
        setshowfavicon(true);
        getData(stopSelected);
        // after stop is selected fetch the relevant real time information
        fetch("/buses/getUpdatesForStop/"+stopSelected[0].stop_id+"/")
        .then(response => response.json())
        .then(data => setRealTimeData(data))
        }
      },[stopSelected,getData]);

      useEffect(()=>{
        if(realTimeData!==undefined){
        setFetchingData(false)
        setShowinfo(true);
      }
    },[realTimeData])


    const toggleFavourite = (busStop) =>{
        if(!favouritesS.some((v => v.stop_id === busStop.stop_id))){
            onLike(busStop)
        }
        else{
            onUnlike(busStop)
        } 
    }

    const fetchRealTime = (value)=>{
        if(value!==null){
        setFetchingData(true);
        setStopSelected([{"stop_name": value.stop_name,
                    "stop_id": value.stop_id,
                    "stop_lat": value.stop_lat,
                    "stop_lon": value.stop_lon}])
        getCenter({"lat": value.stop_lat, "lng": value.stop_lon});
        getZoom(13);
        }
        else{
            setShowinfo(false);
            setshowfavicon(false);
        }
    }


    useEffect(()=>{
        if(fetchingData){
            setRealTimeDetails(<Box sx={{display:"flex",justifyContent:"center"}}><p>Fetching Real Time</p><ReactLoading type="bubbles" color="#000000" height={100} width={50}/></Box>)

        }
        else if(showinfo && !fetchingData){
            setRealTimeDetails(        <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"flex-start"}}>
            <Box sx={{display:"flex", justifyContent:"flex-start", width:"100%"}}>
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
            setRealTimeDetails(null)
        }

    },[realTimeData,showinfo,fetchingData])





    return(
        <Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",marginLeft:"1rem", maxheight:"300px",
        borderRadius:"10px;"}}>
                <Box sx={{height:"50%",display:"flex",marginTop:"1rem",
                flexDirection:"column",}}>
                
                <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"center",alignItems:"center"}}>
                    
                    <Autocomplete
                        id="combo-box-demo"
                        getOptionLabel={(stopList) => 
                            `${stopList.stop_name}`
                        }
                        options={stopList}
                        sx={{width:250}}
                        isOptionEqualToValue={(option, value) =>
                            option.stop_name === value.stop_name
                        }
                        onChange={(e,value) => {
                                fetchRealTime(value);
                            }}
                            
                        noOptionsText={<Box sx={{display:"flex",alignItems:"center"}}>Bus Stops loading<ReactLoading type="bubbles" color="#000000" height={50} width={50}/></Box>}
                        renderOption={(props, stopList) => (
                            <Box component="li" {...props} key={stopList.stop_name}>
                                {stopList.stop_name}
                            </Box>
                        )}
                        renderInput={(params)=><TextField {...params} label="Stop name/number" />}
                    />
 
                    {showfavicon && (
                        <div>
                         {favouritesS.some((v => v.stop_id === stopSelected[0].stop_id)) ? <FaHeart className={"heart full"} onClick={()=>toggleFavourite(stopSelected[0])}/> : <FaRegHeart className={"heart empty"} onClick={()=>toggleFavourite(stopSelected[0])}/>}
                        </div>
                    )}
                </Box>
                {realTimeDetails}
                </Box>
                </Box>
    )
}

export default RealTime;
