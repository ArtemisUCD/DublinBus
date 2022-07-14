import { FaHeart, FaRegHeart } from "react-icons/fa";
import './BusRouteItem.css';
import { useState } from "react";

const BusRouteItem = (props) => {

    // state to check if this is a favourite route
    const [favouritedRoute,setFavouritedRoute] = useState(props.favourites.includes(props.route) ? true : false)

    let toggleFavourite = (busRoute) =>{
        if(!favouritedRoute){
            props.onLike(busRoute)
        }
        else{
            props.onUnlike(busRoute)
        }
        setFavouritedRoute(!favouritedRoute)
    }

    return(<div>
        {props.route.stop_name} {favouritedRoute ? <FaHeart className={"heart full"} onClick={()=>toggleFavourite(props.route)}/> : <FaRegHeart className={"heart empty"} onClick={()=>toggleFavourite(props.route)}/>}
    </div>)

}

export default BusRouteItem;