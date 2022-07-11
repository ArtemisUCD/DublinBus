import { IconButton, Box, TextField, Button} from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {Autocomplete} from '@react-google-maps/api'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react'
import './RoutePlanner.css'



const RoutePlanner = (props) => {

    const [value,setValue] = useState({date:new Date('2014-08-18T21:11:54')})

    const calcRoute = (value) => {
        console.log("in route planner",typeof value )
        console.log("testing",typeof new Date())
        props.calcRoute(value)
    }

    const clearDetails = () => {
        props.clearDetails();
    }

    const getAddress = ()=>{
        props.getAddress();
    }

    const swapInputFields = () => {
        props.swap();
    }


    const mapBounds = {componentRestrictions:{country:["ie"]}}


    return(

        <Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",marginLeft:"1rem",
borderRadius:"10px;"}}>
        <Box sx={{display:"flex",marginTop:"1rem",
        flexDirection:"column",}}>
        <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"flex-start"}}>
        <Autocomplete options={mapBounds}>
        <TextField size="small"style={{minWidth:100,maxWidth:400,width:"90%"}}id="outlined-basic" label="Origin" variant="outlined"  inputRef={props.origin} />
        </Autocomplete>
        <IconButton size="small" onClick={getAddress} sx={{border: "2px solid gray", borderRadius: 1}}>
        <MyLocationIcon/>
        </IconButton>
        </Box>
        <Box sx={{display:"flex",justifyContent:"flex-start"}}>
        <Autocomplete options={mapBounds}>
        <TextField size="small" sx={{ minWidth:100,maxWidth:400, width:"90%"}}id="outlined-basic" label="Destination" variant="outlined" inputRef={props.destination}/>
        </Autocomplete>
        <IconButton size ="small" onClick={swapInputFields} sx={{border: "2px solid gray", borderRadius: 1}}>
        <SwapHorizIcon/>
        </IconButton>
        </Box>
        <Box sx={{padding:"1rem 0"}}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDateTimePicker
            label="For desktop"
            value={value.date}
            onChange={(newValue) => {
                setValue({date:newValue});
            }}
            renderInput={(params) => <TextField {...params} />}
            />
        </LocalizationProvider>
        </Box>
        <Box>
        <Button onClick={calcRoute}variant="outlined" size="small" >Calculate Route</Button>
        <IconButton onClick={clearDetails}>
        <HighlightOffOutlinedIcon/>
        </IconButton>
        
        </Box>
        {/* <IconButton>
        <ListIcon/>
        </IconButton> */}

        
        </Box>
</Box>
    )
}


export default RoutePlanner;
