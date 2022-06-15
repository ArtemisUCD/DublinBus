import './Map.css'
import { useState, useRef, useEffect } from "react";
import MarkerClusterer from "@googlemaps/markerclustererplus";

const locations = [
    { lat: 53.306221160468205, lng: -6.219147554043488},

];

const Map = () => {
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}))
    }
    if (map) {
      map.setOptions({ zoom: 13, center: { lat: 53.307165, lng: -6.201473 }});
    }
  }, [ref, map]);

  const markers = locations.map((location, i) => {
    return new window.google.maps.Marker({
        position: location,

    });
  });

  new MarkerClusterer(map, markers, {});


  return <div className="map" ref={ref}/>
  
}

export default Map;

