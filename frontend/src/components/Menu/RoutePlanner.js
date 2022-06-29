import { IconButton, Box, TextField, Button} from '@mui/material'
import MyLocationIcon from '@mui/icons-material/MyLocation';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
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


    return(
        <Box sx={{ display:'flex', flexDirection:"column", height:"15%",minWidth:400,width:"70%", maxWidth:800,position:"absolute",zIndex:"1",backgroundColor:"white",marginTop:"120px",
        borderRadius:"10px;"}}>
                <Box sx={{height:"50%",width:"100%",display:"flex",marginTop:"1rem",justifyContent:"space-evenly",alignItems:"center"}}>
                <Box sx={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Autocomplete >
                <TextField size="small"style={{minWidth:100,maxWidth:400,width:"90%"}}id="outlined-basic" label="Origin" variant="outlined"  inputRef={props.origin} />
                </Autocomplete>
                <IconButton size="small" onClick={getAddress} sx={{border: "2px solid gray", borderRadius: 1}}>
                <MyLocationIcon/>
                </IconButton>
                </Box>
                <Box sx={{display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Autocomplete >
                <TextField size="small" sx={{ minWidth:100,maxWidth:400, width:"90%"}}id="outlined-basic" label="Destination" variant="outlined" inputRef={props.destination}/>
                </Autocomplete>
                <IconButton size ="small" onClick={swapInputFields} sx={{border: "2px solid gray", borderRadius: 1}}>
                <SwapHorizIcon/>
                </IconButton>
                </Box>
                <Button onClick={calcRoute}variant="outlined" size="small" >Calculate Route</Button>
                <IconButton onClick={clearDetails}>
                <HighlightOffOutlinedIcon/>
                </IconButton>
                </Box>
        </Box>
    )
}

export default RoutePlanner;