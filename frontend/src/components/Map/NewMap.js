
import { GoogleMap, Marker, DirectionsRenderer, Polyline,InfoWindow} from '@react-google-maps/api'

import './Map.css'
import { useState} from 'react';

const NewMap = (props) =>{

    const [mapRef] = useState(null);

    const mapStyles = [
      {
          "featureType": "landscape.man_made",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#f7f1df"
              }
          ]
      },
      {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#d0e3b4"
              }
          ]
      },
      {
          "featureType": "landscape.natural.terrain",
          "elementType": "geometry",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi.business",
          "elementType": "all",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "poi.medical",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#fbd3da"
              }
          ]
      },
      {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#bde6ab"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
              {
                  "visibility": "off"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#ffe15f"
              }
          ]
      },
      {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
              {
                  "color": "#efd151"
              }
          ]
      },
      {
          "featureType": "road.arterial",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#ffffff"
              }
          ]
      },
      {
          "featureType": "road.local",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "black"
              }
          ]
      },
      {
          "featureType": "transit.station.airport",
          "elementType": "geometry.fill",
          "stylers": [
              {
                  "color": "#cfb2db"
              }
          ]
      },
      {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
              {
                  "color": "#a2daf2"
              }
          ]
      }
  ]
    
    const [activeMarker, setActiveMarker] = useState(null);

    const handleActiveMarker = (marker) => {
      if (marker === activeMarker) {
        return;
      }
      setActiveMarker(marker);
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
        <GoogleMap id="map" center={props.center} zoom={props.zoom}  options={{zoomControl:false,
            streetViewControl:false,
            mapTypeControl:false,
            fullscreenControl: false,
          styles:mapStyles}}

            onClick={() => setActiveMarker(null)}
            // onLoad={(map)=>setMap(map)}>
            >

            {props.markerdetail && props.markerdetail.map((place,index) =>(
                <Marker
                key={index}
                position={{ lat: Number(place.stop_lat), lng: Number(place.stop_lon) }}
                icon={{
                    url:
                    "https://img.icons8.com/office/40/000000/bus.png",
                    scaledSize: { width: 35, height: 35 }
                  }}
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
                                        position={{ lat: Number(props.favmarker.stop_lat), lng: Number(props.favmarker.stop_lon)}}
                                        icon={{
                                            url:
                                            "https://img.icons8.com/office/40/000000/bus.png",
                                            scaledSize: { width: 35, height: 35 }
                                          }}>
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