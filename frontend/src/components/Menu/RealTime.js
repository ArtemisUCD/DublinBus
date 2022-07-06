
import { useEffect, useState } from 'react';

import { IconButton, Box, TextField, Button, List, ListItem, ListItemText} from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete';

import SearchIcon from '@mui/icons-material/Search';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const RealTime = () => {
    
    const [stopData, setstopData] =useState([]);
    const [showinfo, setShowinfo] = useState(false);
    const [stopupdate, setStopupdate] = useState([]);
    // const [showsearch, setShowsearch] = useState(true);
    const [value, setValue] = useState("");
    const [stopId, setStopId] = useState("8220DB000039");
    
    useEffect(() => {
        fetch("/api/stop_")
        .then(response => response.json())
        .then(data => setstopData(data))
      },[]);

      useEffect(() => {
        fetch("/buses/getUpdatesForStop/"+stopId+"/")
        .then(response => response.json())
        .then(data => setStopupdate(data))
      },[]);



    const searchresult = ()=>{
        if (value !== ""){
            setShowinfo(true);
            console.log(stopId)
            console.log(stopupdate)
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
                        getOptionLabel={(stopData) => 
                            `${stopData.stop_name}`
                        }
                        options={stopData}
                        sx={{width:200}}
                        isOptionEqualToValue={(option, value) =>
                            option.stop_name === value.stop_name
                        }
                        onChange={(e,value) => {setValue(value.stop_name); setStopId(value.stop_id)}}
                        noOptionsText={"Stop name/number"}
                        renderOption={(props, stopData) => (
                            <Box component="li" {...props} key={stopData.stop_name}>
                                {stopData.stop_name}
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
                        
                        <Box sx={{display:"flex", justifyContent:"flex-start", width:"100%"}}>
                   
                    <TableContainer component={Paper}>
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
                            {stopupdate.map((row) => (
                                <TableRow
                                key={row.concat_name}
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
                <Box>
                
                </Box>
                </Box>
    )
}
export default RealTime;
