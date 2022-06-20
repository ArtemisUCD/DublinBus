import './Map.css'
import {GoogleMap, useJsApiLoader,Marker, MarkerClusterer, InfoWindow} from '@react-google-maps/api';
import { useEffect, useState } from 'react';
// import AddMarker from './AddMarker';

const Map = () => {

  const [stopData, setstopData] = useState();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapRef] = useState(null);
  const [center, setCenter] = useState({lat: 53.306221, lng: -6.21914755});
  const [infoOpen, setInfoOpen] = useState(false);
  const [markerMap, setMarkerMap] = useState({});

  useEffect(() => {
    fetch("/api/stop_")
    .then(response => response.json())
    .then(data => setstopData(data))
  },[]);

  
  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: ""
  })

  if(! isLoaded){
    return <div>Not Loaded</div>
  }

  const options = {
    imagePath:
    "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    styles: []}

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


  return (
    <div className='map'>
      
        <GoogleMap
          center={center}
          onCenterChanged={() => onCenterChanged(mapRef)}
          zoom={13}
          mapContainerStyle={{width: '1000px', height:'800px'}}>
          
          <MarkerClusterer options={options}>
            {(clusterer) =>
              stopData && stopData.map((place) => (
                <Marker 
                  key={place.stop_id}
                  position={{ lat: Number(place.stop_lat), lng: Number(place.stop_lon) }}
                  clusterer={clusterer}
                  onLoad={marker => markerLoadHandler(marker, place)}
                  onClick={event => markerClickHandler(event, place)} />   
            ))}
          </MarkerClusterer>

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
      
        </GoogleMap>
      
      
    </div>
  )
  
}

export default Map;