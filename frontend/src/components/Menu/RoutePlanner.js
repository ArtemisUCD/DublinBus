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
import FormControl from '@mui/material/FormControl';


const RoutePlanner = (props) => {

    const [value,setValue] = useState(new Date())
    const [originError,setOriginError] = useState(false);
    const [destinationError,setDestinationError] = useState(false);

    const calcRoute = () => {
        if(props.origin.current.value === '' || props.destination.current.value === ''){
            console.log("origin destination missing")
            if(props.origin.current.value === ''&& props.destination.current.valu=== ''){
                setOriginError(true)
                setDestinationError(true)
            }
            else if(props.origin.current.value === ''){
                setOriginError(true)
            }
            else{
                setDestinationError(true)
            }}
        else{
        props.calcRoute(value)
        props.getStartTime(value)
        }
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

    const validCheck = (event) =>{
        if(event.target.value!==""){
            if(event.target.id==="destination"){
            setDestinationError(false);
            }
            else if(event.target.id==="origin"){
                setOriginError(false);
            }
            else{
                return;
            }
        }
    }


    const mapBounds = {componentRestrictions:{country:["ie"]}}


    return(


        <Box sx={{ padding:"0",display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",margin:"0 1rem",
borderRadius:"10px;"}}>
        <FormControl>
        <Box sx={{display:"flex",
        flexDirection:"column",}}>
        <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"flex-start"}}>
        <Autocomplete options={mapBounds}>
        <TextField  id="origin" error={originError} onChange={validCheck} size="small"style={{minWidth:100,maxWidth:400,width:"90%"}} label="Origin" variant="outlined"  inputRef={props.origin} />
        </Autocomplete>
        <IconButton size="small" onClick={getAddress} sx={{border: "2px solid gray", borderRadius: 1}}>
        <MyLocationIcon/>
        </IconButton>
        </Box>
        <Box sx={{display:"flex",justifyContent:"flex-start"}}>
        <Autocomplete options={mapBounds}>
        <TextField id="destination"error={destinationError} onChange={validCheck} size="small" sx={{ minWidth:100,maxWidth:400, width:"90%"}} label="Destination" variant="outlined" inputRef={props.destination}/>
        </Autocomplete>
        <IconButton size ="small" onClick={swapInputFields} sx={{border: "2px solid gray", borderRadius: 1}}>
        <SwapHorizIcon/>
        </IconButton>
        </Box>
        <Box sx={{padding:"1rem 0"}}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDateTimePicker
            
            label="For desktop"
            value={value}
            onChange={(newValue) => {
                setValue(newValue)
            }}
            renderInput={(params) => <TextField size="small" {...params} />}
            />
        </LocalizationProvider>
        </Box>
        <Box>
        <Button onClick={calcRoute}variant="outlined" size="small" >Calculate Route</Button>
        <IconButton onClick={clearDetails}>
        <HighlightOffOutlinedIcon/>
        </IconButton>
        </Box>        
        </Box>
        </FormControl>
</Box>

    )
}


export default RoutePlanner;
