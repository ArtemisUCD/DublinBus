import AccordionSummary from '@mui/material/AccordionSummary';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import { Box } from "@mui/material";

const RouteSummary = (props) => {

    return(
        <AccordionSummary onClick = {props.onClick} key={Math.random()}
        aria-controls="panel1a-content"
        sx={{width:"100%",display:"flex",paddingLeft:"2rem"}}
        >{props.routeObj.map((stepObj) =>{
            return <Box key={Math.random()} sx={{display:"flex"}}>
            {stepObj.mode==="WALKING"?<DirectionsWalkIcon/>:<DirectionsBusIcon/>} {stepObj.busNumber?
            <Box sx={{backgroundColor:"#FBCB0A",marginRight:"0.5rem",borderRadius:"5px",padding:"0.2rem"}}>
                {stepObj.busNumber}
                </Box>:null}
            </Box>}).reduce((prev, curr) => [prev, ' > ', curr])}
        </AccordionSummary>
    )
}

export default RouteSummary;