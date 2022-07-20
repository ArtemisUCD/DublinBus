import { Box} from "@mui/material";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccordionDetails from '@mui/material/AccordionDetails';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';

const RouteDetails = (props)=> {
  return(
    <AccordionDetails key={Math.random()} sx={{backgroundColor:"white"}}>
    {props.routeObj.map((step,index) =>{if(step.mode==="WALKING")
    { return <Box key={Math.random()} sx={{display:"flex",alignItems:"center", borderBottom:"1px solid black",padding:"1rem 0"}}>
        <Box >{props.routeTimings[props.routeIndex][index].getHours()}:{props.routeTimings[props.routeIndex][index].getMinutes()<10?'0'+ props.routeTimings[props.routeIndex][index].getMinutes():props.routeTimings[props.routeIndex][index].getMinutes()}<DirectionsWalkIcon sx={{marginLeft:"1rem"}}/>
        </Box>
        <Box sx={{flexDirection:"column",marginLeft:"1rem"}}>
        <p style={{margin:"0"}}>Walk</p>
        <p style={{margin:"0"}}>About {step.duration}, {step.distance}</p>
        </Box>
      </Box>}
    else{
      return <Box key={Math.random()} sx={{display:"flex",alignItems:"center",borderBottom:"1px solid black",paddingBottom:"1rem"}}>
        <Box >
        MODEL<DirectionsBusIcon/>
        </Box>
        <Box sx={{flexDirection:"column",marginLeft:"1rem"}}>
        <p>{step.departure}</p>
        <Box sx={{display:"flex",alignItems:"center"}}>
          <Box sx={{backgroundColor:"#FBCB0A",marginRight:"0.5rem",borderRadius:"5px",padding:"0.2rem"}}>{step.busNumber}</Box>
           {step.headsign}
          </Box>
        <p >**MODEL VALUE** {step.stopCount} stops</p>
        <p > {step.arrival}</p>
        </Box>
        </Box>
    }}
    )}
    </AccordionDetails>
  )
}

export default RouteDetails;