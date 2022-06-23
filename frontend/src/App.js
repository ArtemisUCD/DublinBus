// import './App.css';
// import Header from './components/Header/Header'
// import Menu from './components/Menu/Menu'
// import Map from './components/Map/Map'
// import { Wrapper } from "@googlemaps/react-wrapper";

// const render = Status => {
//   return <h1>{Status}</h1>
// }

// function App() {

//   return (
//     <div className="App">
//       {/* <Header />
//       <div className='main-content'>
//         <Menu />
//       <Wrapper apiKey={"AIzaSyDYT7qeps8IqMpcUpBKG49UehWOG2J_qEA"} render={render}>
//         <Map />
//       </Wrapper>
//       </div> */}
//       <N
//     </div>
//   );
// }

// export default App;

import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import { useJsApiLoader, GoogleMap, Marker, Autocomplete} from '@react-google-maps/api' 
import { SkeletonText } from '@chakra-ui/react'
import { useState } from 'react'
import './App.css'

const center = {lat:53.35,lng:-6.25}

function App() {

  const [map,setMap] = useState(/**@type google.maps.Map*/null);



  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDYT7qeps8IqMpcUpBKG49UehWOG2J_qEA",
    libraries:['places']
  })

  if(!isLoaded){
    return <SkeletonText/>
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      bgColor='blue.200'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
      <GoogleMap center={center} zoom={11} mapContainerStyle={{width:"100%", height:"100%"}} options={{zoomControl:false,
      streetViewControl:false,
      mapTypeControl:false,
      fullscreenControl: false,}}
      onLoad={(map)=>setMap(map)}>
        <Marker position={center}/>

      </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={4}>
          <Autocomplete zIndex='modal' className='testing'>
          <Input type='text' placeholder='Origin' />
          </Autocomplete>

          <Autocomplete>
          <Input type='text' placeholder='Destination' />
          </Autocomplete>
          <ButtonGroup>
            <Button colorScheme='green' type='submit'>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={() => alert(123)}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: </Text>
          <Text>Duration: </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center) }
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
