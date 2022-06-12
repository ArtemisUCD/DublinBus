import './Map.css'
import { useState, useRef, useEffect } from "react";



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

  return <div className='map'></div>
  
}

export default Map;

