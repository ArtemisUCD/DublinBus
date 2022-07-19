import { Box} from '@mui/material'
import Menu from './components/Menu/Menu'
import Header from './components/Header/Header'
import './App.css'
import { useJsApiLoader} from '@react-google-maps/api'
import { useState, useRef, useEffect } from 'react';
import NewMap from './components/Map/NewMap';
import Geocode from "react-geocode";


const googleLibraries = ["places"];
let datetime;

function App() {

  const [map,setMap] = useState( /** @type google.maps.GoogleMap */ (null))
  const [drawerOpen,setDrawerOpen]= useState(false);
  const [directions,setDirections] = useState(null);
  const originRef = useRef()
  const destinationRef = useRef()
  const [markerinfo, setMarkerinfo] = useState([]);
  const [routeshape, setRouteShape] = useState([]);
  const [favData, setFavData] = useState([])

  // const getModelTimes= ()=>{
      
  //   let modelTimes = directions.routes.map(route => route.legs[0].steps.filter(step=>step.travel_mode==="TRANSIT").map(busLeg=>{
  //   fetch("/buses/getEstimateTime/"+(datetime)+`/${busLeg.transit.line.short_name}/${busLeg.transit.headsign}/${busLeg.transit.num_stops}`)
  //   .then(response => response.json())
  //   .then(data => console.log(`model output ${JSON.stringify(busLeg.transit.line.short_name)}`,data))
  //   .catch(error=>console.log("Error",error))
  //     }))

  //    console.log("model times",modelTimes)
  //   }

  // useEffect(()=>{
  //   if(directions!==null){
  //     getModelTimes();
  //     }
  //     else{
  //       console.log("no directions yet")
  //     }
  // },[directions])
  

    const getData = (stopinfo) => {
      setMarkerinfo(stopinfo);
    }

    const getRouteShape = (routeshape) => {
      setRouteShape(routeshape);
    }

    const getFavData = (favData) =>{
      setFavData(favData);
    }

  Geocode.setApiKey("AIzaSyDYT7qeps8IqMpcUpBKG49UehWOG2J_qEA");

  const showPosition = (position) => {
  const geolocation = ({lat:position.coords.latitude,
  lng:position.coords.longitude});
  

  // Get address from latitude & longitude.
  Geocode.fromLatLng(geolocation.lat, geolocation.lng).then(
  (response) => {
    const address = response.results[0].formatted_address;
    console.log(address);
    originRef.current.value=address;
  },
  (error) => {
    console.error(error);
  }
  );
  }

const getAddress = () =>{

    if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation not enabled")
    }
}

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDYT7qeps8IqMpcUpBKG49UehWOG2J_qEA",
    libraries:googleLibraries
    
  })

  if(!isLoaded){
    return 'Loading'
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }

  const calcRoute = async (value) => {
    if(originRef.current.value === '' || destinationRef.current.value === ''){
      return ;
  }
  datetime=Math.round((value.getTime()/1000))
  const directionsService = new window.google.maps.DirectionsService();
  let results = await directionsService.route({
    origin: originRef.current.value,
    destination: destinationRef.current.value,
    travelMode: window.google.maps.TravelMode.TRANSIT,
    provideRouteAlternatives:true,
    transitOptions:{
      departureTime: value,
      modes: ['BUS']
    }
    }
)
// remove any non Dublin Bus operators from viable route
const notDublinBus = (el)=>el.transit.line.agencies[0].name!=="Dublin Bus";
let filteredRoutes = results.routes.filter(route => !route.legs[0].steps.filter(step=>step.travel_mode==="TRANSIT").some(notDublinBus));
results.routes = filteredRoutes;
setDirections(results)
  }

  const clearDetails = () => {
    setDirections(null)
    originRef.current.value = ''
    destinationRef.current.value = ''
    map.panTo()

  }

  const swapInputFields = () => {
    const temp = originRef.current.value;
    originRef.current.value = destinationRef.current.value;
    destinationRef.current.value = temp; 
  }

  return (
      <Box sx={{display:"flex",flexDirection:"column"}}>
      <Header toggleDrawer={toggleDrawer}/>
      <Box className="main-content" sx={{display:"flex",backgroundColor:"white"}}>
          <Menu getData={getData} directions={directions} getRouteShape={getRouteShape} getFavData={getFavData} origin={originRef} getAddress ={getAddress}destination={destinationRef} calcRoute={calcRoute} map={{map}} clearDetails={clearDetails} swap={swapInputFields} toggleDrawer={toggleDrawer} />

      <NewMap favmarker={favData} directions={directions} markerdetail={markerinfo} routeshape={routeshape} />

</Box>
</Box>
  )
}
export default App;
