import { GoogleMap, Marker, DirectionsRenderer} from '@react-google-maps/api'
import './Map.css'

const NewMap = (props) =>{

    const center = {lat:53.35,lng:-6.25};

    return(
        <GoogleMap id="map" center={center} zoom={11}  options={{zoomControl:false,
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