import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box} from '@mui/material'
import Menu from './components/Menu/Menu'
import './App.css'
import { useJsApiLoader} from '@react-google-maps/api'
import { useState, useRef, createContext, useContext } from 'react';
import NewMap from './components/Map/NewMap';
import Geocode from "react-geocode";


const googleLibraries = ["places"];

function App() {

  const [map] = useState(/**@type google.maps.Map*/null);
  const [drawerOpen,setDrawerOpen]= useState(false);
  const [directions,setDirections] = useState(null);
  const originRef = useRef()
  const destinationRef = useRef()
  const [markerinfo, setMarkerinfo] = useState([]);
  const [routeId, setRouteId] = useState("")

    const getData = (stopinfo) => {
      setMarkerinfo(stopinfo);
      console.log(stopinfo)
    }
    console.log(markerinfo)

    const getRouteId = (routeId) => {
      setRouteId(routeId);
      console.log(routeId)
    }
    console.log(routeId)

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

  const theme = createTheme({
    palette: {
      primary: {
        main: "#1363DF"
      }
    }
  });

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  }

  const calcRoute = async (value) => {
    if(originRef.current.value === '' || destinationRef.current.value === ''){
      return ;
  }
  console.log("departure time being used:",value)

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
console.log("breakdown", results.routes)


  }

  const clearDetails = () => {
    setDirections(null)
    originRef.current.value = ''
    destinationRef.current.value = ''
  }

  const swapInputFields = () => {
    const temp = originRef.current.value;
    originRef.current.value = destinationRef.current.value;
    destinationRef.current.value = temp; 
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="testing" sx={{display:"flex",backgroundColor:"white"}}>
      {/* <Header toggleDrawer={toggleDrawer}/> */}

          <Menu origin={originRef} directions ={directions} getAddress ={getAddress}destination={destinationRef} calcRoute={calcRoute} map={{map}} clearDetails={clearDetails} swap={swapInputFields} toggleDrawer={toggleDrawer}/>

    <Box className="main-map" sx={{ display:'flex'}}>
      <NewMap directions={directions}/>

</Box>
</Box>
</ThemeProvider>
  )
}
export default App;
