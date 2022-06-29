import { GoogleMap, Marker, DirectionsRenderer} from '@react-google-maps/api'

const NewMap = (props) =>{

    const center = {lat:53.35,lng:-6.25};

    return(
        <GoogleMap center={center} zoom={11} mapContainerStyle={{width:"100%", height:"100%"}} options={{zoomControl:false,
            streetViewControl:false,
            mapTypeControl:false,
            fullscreenControl: false,}}
            // onLoad={(map)=>setMap(map)}>
            >
            <Marker position={center}/>
            {props.directions && <DirectionsRenderer directions={props.directions}/>}
            </GoogleMap>
    )
}

export default NewMap;