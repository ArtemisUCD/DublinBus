import { IconButton, Box, TextField, Button} from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ListIcon from '@mui/icons-material/List';
import {Autocomplete} from '@react-google-maps/api'
import './RoutePlanner.css'


const RoutePlanner = (props) => {

    const calcRoute = () => {
        props.calcRoute()
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

    let journeyDetails;

    if(props.directions)
{
    journeyDetails = props.directions.routes[0].legs[0].steps.map((step)=>{if(step.travel_mode==="TRANSIT"){return {distance:step.distance.text,
        duration:step.duration.text,
        mode:step.travel_mode,
    busNumber:step.transit.line.short_name}}
        else{
            return {distance:step.distance.text,
                duration:step.duration.text,
                mode:step.travel_mode}
        }})
    journeyDetails =journeyDetails.map((stepObj) =>{return <Box>{stepObj.distance} {stepObj.duration} {stepObj.mode} {stepObj.busNumber?stepObj.busNumber:null}</Box>})
}

    return(

        <Box sx={{ display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",marginLeft:"1rem",
borderRadius:"10px;"}}>
        <Box sx={{height:"50%",display:"flex",marginTop:"1rem",
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
        <Box>
        <Button onClick={calcRoute}variant="outlined" size="small" >Calculate Route</Button>
        <IconButton onClick={clearDetails}>
        <HighlightOffOutlinedIcon/>
        </IconButton>
        
        </Box>
        {/* <IconButton>
        <ListIcon/>
        </IconButton> */}
        {journeyDetails ? <Box>{journeyDetails}</Box>:null}
        
        </Box>
</Box>

   
    )
}


export default RoutePlanner;
