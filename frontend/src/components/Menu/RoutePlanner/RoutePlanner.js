import { IconButton, Box, TextField, Button} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import {Autocomplete} from '@react-google-maps/api'
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState, useEffect } from 'react'
import './RoutePlanner.css'
import FormControl from '@mui/material/FormControl';
import RouteItem from './RouteItem';
import addDays from 'date-fns/addDays';


const RoutePlanner = ({origin,destination, 
    swap, weather, directions,changeDirectionsRender,calcRoute,clearDetails}) => {

    let journeyDetails;
    const [value,setValue] = useState(new Date())
    const [originError,setOriginError] = useState(false);
    const [destinationError,setDestinationError] = useState(false);
    const [routeList,setRouteList] = useState()
    const [startTime, setStartTime] = useState();
    const maxDate = addDays(new Date(),6)
    const mapBounds = {componentRestrictions:{country:["ie"]}}

    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const calcRoutes = () => {
        if(origin.current.value === '' || destination.current.value === ''){
            if(origin.current.value === ''&& destination.current.value=== ''){
                setOriginError(true)
                setDestinationError(true)
            }
            else if(origin.current === ''){
                setOriginError(true)
            }
            else{
                setDestinationError(true)
            }}
        else{
        calcRoute(value)
        getStartTime(value)
        }
        }

    const cumulativeSum = (sum => value => sum += value);
    
    const clearDetail = () => {
        clearDetails();
    }


    const swapInputFields = () => {
        swap();
    }

    const getStartTime = (value) =>{
        setStartTime(value)
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

    useEffect(()=>{
        let timings;
        let stepTimes;
        let routeTimings;
        const modelledRoutes= ['68', '45A', '25A', '14', '77A', '39', '16', '40D', '27B', '142', '83', '130', '15', '46A', '33', '7', '39A', '1', '41', '67X', '59', '9', '40', '239', '84', '53', '185', '151', '13', '15B', '65B', '29A', '61', '140', '123', '79A', '38A', '31', '69', '44', '42', '67', '184', '238', '145', '17A', '32', '27A', '17', '122', '54A', '66', '150', '56A', '37', '27', '15A', '65', '47', '76', '79', '83A', '63', '33B', '4', '120', '41C', '70', '84A', '220', '84X', '38', '102', '270', '33X', '75', '26', '66A', '31A', '49', '111', '18', '11', '114', '76A', '44B', '7A', '43', '25', '104', '33A', '31B', '66X', '39X', '41B', '25B', '25D', '40B', '66B', '38B', '7B', '41X', '40E']
  
        const getModelValues = async (routeIndex,stepIndex,step)=>{
          let weatherSummary = weather.filter(el=>el.date===weekday[startTime.getDay()])[0].weather_icon.slice(0,-1)
          let theanswer = await fetch("/buses/getEstimateTime/"+(Math.round((startTime.getTime()/1000)))+`/${step.transit.line.short_name}/${step.transit.headsign}/${step.transit.num_stops}/${weatherSummary}`)
          let response = await theanswer.json()
          timings[routeIndex][stepIndex]=response

        }
  
        const timesUpdated = async ()=>{
          let modeltimings = directions.routes.map(route => route.legs[0].steps)
          for(const [routeIndex, route] of modeltimings.entries()){
            for(const [stepIndex, step] of route.entries()){
              if(step.travel_mode==="TRANSIT"){
              if(modelledRoutes.includes(step.transit.line.short_name)){
              await getModelValues(routeIndex,stepIndex,step)
              }
              }
            }
          }
        }
  
      if(directions!==null){
            // get duration each step of the journey takes
      timings = journeyDetails.map(route => route.map(step => parseInt(step.duration.split(" ")[0])))
      setRouteList(journeyDetails.map((routeObj,routeIndex)=> <RouteItem key={`route_${routeIndex}`} routeObj={routeObj} routeIndex={routeIndex} routeTimings={routeTimings} stepTimings={timings}  changeDirectionsRender={changeDirectionsRender}/>));
  
      timesUpdated().then(()=>{
        stepTimes = timings.map(route => route.map(cumulativeSum(0)));
        // get datetime objects for timings and add starttime as first element
        routeTimings = stepTimes.map(route => [new Date(startTime.getTime())].concat(route.map(duration => new Date(startTime.getTime() + duration * 60000))))
        setRouteList(journeyDetails.map((routeObj,routeIndex)=> <RouteItem key={`route_${routeIndex}`} routeObj={routeObj} routeIndex={routeIndex} routeTimings={routeTimings} stepTimings={timings} changeDirectionsRender={changeDirectionsRender}/>));
      })
  
        }
        // eslint-disable-next-line 
    },[directions,startTime,journeyDetails])


    if(directions)
{ 
  journeyDetails = directions.routes.map(route => route.legs[0].steps.map((step)=>
  {if(step.travel_mode==="TRANSIT")
  {return {
      distance:step.distance.text,
      duration:step.duration.text,
      mode:step.travel_mode,
      busNumber:step.transit.line.short_name,
      headsign:step.transit.headsign,
      stopCount:step.transit.num_stops,
      departure:step.transit.departure_stop.name,
      arrival:step.transit.arrival_stop.name}}
  else{
  return {
      distance:step.distance.text,
      duration:step.duration.text,
      mode:step.travel_mode}
      }}))

}

    return(
        <Box sx={{ padding:"0",display:'flex', flexDirection:"column",zIndex:"1",backgroundColor:"white",margin:"1rem 1rem 0 1rem",
borderRadius:"10px"}}>
        <FormControl>
        <Box sx={{display:"flex",
        flexDirection:"column",alignItems:"flex-start",margin:"auto"}}>
        <Box sx={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
        <Box sx={{display:"flex",flexDirection:"column"}}>
        <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"flex-start"}}>
        <Autocomplete options={mapBounds}>
        <TextField  id="origin" error={originError} onChange={validCheck} size="small" label="Origin" variant="outlined"  inputRef={origin} />
        </Autocomplete>
        </Box>
        <Box sx={{display:"flex",justifyContent:"flex-start"}}>
        <Autocomplete options={mapBounds}>
        <TextField id="destination"error={destinationError} onChange={validCheck} size="small"  label="Destination" variant="outlined" inputRef={destination}/>
        </Autocomplete>
        </Box>
        </Box>
        <Box sx={{marginLeft:"1rem"}}>
        <IconButton size ="small" onClick={swapInputFields} sx={{border: "2px solid gray", borderRadius: 1,color:"black"}}>
        <SwapVertIcon/>
        </IconButton>
        </Box>
        </Box>
        <Box sx={{padding:"1rem 0"}}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDateTimePicker
            disablePast
            label="Departure Time"
            value={value}
            maxDate={maxDate}
            onChange={(newValue) => {
                setValue(newValue)
            }}
            renderInput={(params) => <TextField size="small" {...params} />}
            />
        </LocalizationProvider>
        </Box>
        <Box sx={{display:"flex",justifyContent:"space-around",width:"100%"}}>
        <Button onClick={calcRoutes}variant="contained" size="small" >Calculate Route</Button>
        <Button onClick={clearDetail}variant="contained" size="small" color="error" >Clear</Button>
        </Box>        
        </Box>
        </FormControl>
        <Box sx={{zIndex:"1", backgroundColor:"white",borderRadius:"10px",marginTop:"1rem"}}>
        {journeyDetails ? routeList:null}
        </Box>
</Box>
    )
}

export default RoutePlanner;
