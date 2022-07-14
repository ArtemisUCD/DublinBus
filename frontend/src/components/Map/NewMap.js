import { GoogleMap, Marker, DirectionsRenderer, InfoWindow,Polyline} from '@react-google-maps/api'
import './Map.css'
import { useState, useEffect } from 'react';

const NewMap = (props) =>{

    const [mapRef] = useState(null);
    const [center, setCenter] = useState({lat: 53.306221, lng: -6.21914755});

    
    

    // routeshape.map((place) => (
    //     setPathList({'lat': place.shape_pt_lat, 'lng': place.shape_pt_lon})
    // ))


    

    const [activeMarker, setActiveMarker] = useState(null);

    const handleActiveMarker = (marker) => {
      if (marker === activeMarker) {
        return;
      }
      setActiveMarker(marker);
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
        paths: props.routeshape,
        geodesic: true,
        zIndex: 2
      };

    return(
        <GoogleMap id="map" center={center} zoom={11}  options={{zoomControl:false,
            streetViewControl:false,
            mapTypeControl:false,
            fullscreenControl: false,}}
            onCenterChanged={()=>onCenterChanged(mapRef)
            }
            onClick={() => setActiveMarker(null)}
            // onLoad={(map)=>setMap(map)}>
            >
            {props.markerdetail && props.markerdetail.map((place,index) =>(
                <Marker
                key={index}
                position={{ lat: Number(place.stop_lat), lng: Number(place.stop_lon) }}
                onClick={() => handleActiveMarker(place.stop_id)} >
                  {activeMarker === place.stop_id ? (
                    <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                      <div><h3>{place.stop_name}</h3></div>
                    </InfoWindow>
                  ) : null}
                </Marker>
            ))}
            {/* {props.favmarker && props.favmarker.map((place, index) => (
              <Marker key={index}
                      position={{ lat: Number(place.stop_lat), lng: Number(place.stop_lon) }}>

              </Marker>
            ))} */}
            {props.favmarker && <Marker key={Math.random()}
                                        position={{ lat: Number(props.favmarker.stop_lat), lng: Number(props.favmarker.stop_lon)}}>
                                </Marker>}

            {props.directions && <DirectionsRenderer directions={props.directions}/>}
            <Polyline
            path={props.routeshape}
            options={pathOptions}
              />
            </GoogleMap>
    )
}

export default NewMap;