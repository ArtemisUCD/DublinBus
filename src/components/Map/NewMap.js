import { GoogleMap, Marker, DirectionsRenderer, InfoWindow,Polyline} from '@react-google-maps/api'
import './Map.css'
import { useState, useEffect } from 'react';

const NewMap = (props) =>{

    const [markerMap, setMarkerMap] = useState({});
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [mapRef] = useState(null);
    const [infoOpen, setInfoOpen] = useState(false);
    const [center, setCenter] = useState({lat: 53.306221, lng: -6.21914755});
    const [routeshape, setRouteShape] = useState([]);

    useEffect(() => {
        fetch("/buses/getShape/"+props.routeId+"/")
        .then(response => response.json())
        .then(data => setRouteShape(data))
      },[props.routeId]);


    // routeshape.map((place) => (
    //     setPathList({'lat': place.shape_pt_lat, 'lng': place.shape_pt_lon})
    // ))


    const markerLoadHandler = (marker, place) => {
        return setMarkerMap(prevState => {
          return { ...prevState, [place.stop_id]: marker };
        });
    };
    
    const markerClickHandler = (event, place) => {
        
        setSelectedPlace(place);
    
        if (!infoOpen) {
          setInfoOpen(true);
        }else{
          setInfoOpen(false);
        }
        
        
    
    };
    
    const onCenterChanged = mapRef => {
        if (mapRef && mapRef.getCenter()) {
          const ccenter = mapRef.getCenter().toJSON();
          if (ccenter.lat !== center.lat && ccenter.lng !== center.lng) {
            setCenter(mapRef.getCenter().toJSON());
          }
        }
    };

    const pathOptions = {
        strokeColor: '#FF0000',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.5,
        clickable: false,
        draggable: false,
        editable: false,
        visible: true,
        radius: 30000,
        paths: routeshape,
        geodesic: true,
        zIndex: 2
      };

    return(
        <GoogleMap id="map" center={center} zoom={11}  options={{zoomControl:false,
            streetViewControl:false,
            mapTypeControl:false,
            fullscreenControl: false,}}
            onCenterChanged={()=>onCenterChanged(mapRef)}
            // onLoad={(map)=>setMap(map)}>
            >
            {props.markerdetail && props.markerdetail.map((place,index) =>(
                <Marker
                key={index}
                position={{ lat: Number(place.stop_lat), lng: Number(place.stop_lon) }}
                onLoad={marker => markerLoadHandler(marker, place)}
                onClick={event => markerClickHandler(event, place)} />
            ))}
            {infoOpen && selectedPlace && (
            <InfoWindow
              anchor={markerMap[selectedPlace.stop_id]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div>
                <h3>{selectedPlace.stop_name}</h3>
              </div>
            </InfoWindow>
          )}
            {props.directions && <DirectionsRenderer directions={props.directions}/>}
            <Polyline
			path={routeshape}
			options={pathOptions}
		    />
            </GoogleMap>
    )
}

export default NewMap;