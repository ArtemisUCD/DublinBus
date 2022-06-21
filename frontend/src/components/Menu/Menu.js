import MenuItem from "./MenuItem";
import './Menu.css'
import { useState, useEffect } from "react";

const Menu = () => {

    const menuItems = ["Plan Route","Real Time Information","Bus Route","Favourites"];
    const [favouriteRoutes, setFavouriteRoutes] = useState(JSON.parse(localStorage.getItem('favouriteRoutes')) ?? []);

    // update favourites in local storage when the state updates
    useEffect(() => {
    localStorage.setItem('favouriteRoutes', JSON.stringify(favouriteRoutes));
    }, [favouriteRoutes]);

    // function to add bus route as a favourite
    const addFavourite = (newRoute) =>{
        if(!favouriteRoutes.includes(newRoute)){
        setFavouriteRoutes((prevFavouriteRoutes) =>{
          return [...prevFavouriteRoutes,newRoute]
        })
        }
      }
      
    // function to remove bus route from list of favourites
      const removeFavourite = (busRoute) =>{
        setFavouriteRoutes((prevFavouriteRoutes) =>{
          return prevFavouriteRoutes.filter(route => route!== busRoute)
        })}
      
      let menuContent = menuItems.map(item => <MenuItem onLike={addFavourite} onUnlike={removeFavourite} favourites= {favouriteRoutes} title = {item}/>)
      console.log("Initial local",favouriteRoutes)
    return (
        <div className="main-menu">
            {menuContent}
        </div>
    )
}

export default Menu;