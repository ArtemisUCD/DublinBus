import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IconButton, Box, Drawer} from '@mui/material'
import Header from './components/Header/Header'
import RoutePlanner from './components/Menu/RoutePlanner';
import Menu from './components/Menu/Menu'
import CloseIcon from '@mui/icons-material/Close';
import './App.css'
import { useJsApiLoader} from '@react-google-maps/api'
import { useState, useRef } from 'react';
import NewMap from './components/Map/NewMap';
import Geocode from "react-geocode";

const googleLibraries = ["places"];

function App() {

  const [map] = useState(/**@type google.maps.Map*/null);
  const [drawerOpen,setDrawerOpen]= useState(false);
  const [directions,setDirections] = useState(null);
  const originRef = useRef()
  const destinationRef = useRef()


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

  const calcRoute = async () => {
    if(originRef.current.value === '' || destinationRef.current.value === ''){
      return ;
  }

  const directionsService = new window.google.maps.DirectionsService();
  const results = await directionsService.route({
    origin: originRef.current.value,
    destination: destinationRef.current.value,
    travelMode: window.google.maps.TravelMode.TRANSIT,
    transitOptions:{
      modes: ['BUS']
    }
    }
)
setDirections(results)
console.log("direction steps",results.routes[0].legs[0].steps)
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
      <Header toggleDrawer={toggleDrawer}/>
      <Drawer open={drawerOpen} PaperProps={{sx:{
        backgroundColor: "#000000"
       }}}>
        <IconButton color="primary" onClick={toggleDrawer}>
          <CloseIcon/>
          </IconButton>
          <Menu/>
          </Drawer>
    <Box sx={{ display: 'flex',width:"100vw",height:"100vh",
  flexDirection:'column',
  alignItems:'center'}}>
      <RoutePlanner origin={originRef} getAddress ={getAddress}destination={destinationRef} calcRoute={calcRoute} map={{map}} clearDetails={clearDetails} swap={swapInputFields}/>
      <NewMap directions={directions}/>
</Box>
</ThemeProvider>
  )
}
export default App;
