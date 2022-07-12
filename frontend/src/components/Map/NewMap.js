import { GoogleMap, Marker, DirectionsRenderer, Polyline} from '@react-google-maps/api'
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
                {/* <Polyline options={{strokeColor:'blue',strokeOpacity: 1,
  strokeWeight: 5}} path={[{ lat:53.35,lng:-6.25 }, {lat:54.35,lng:-6.25}]}/> */}
            {props.directions && <DirectionsRenderer directions={props.directions}/>}
            </GoogleMap>
    )
}

export default NewMap;