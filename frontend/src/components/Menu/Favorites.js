import './Favorites.css';
import BusRouteItem from './BusRouteItem';

const Favorites = (props) => {

    let favouriteContent = props.favourites.map((route) => {return <BusRouteItem key ={Math.random()}route={route} onLike={props.onLike} onUnlike={props.onUnlike} favourites ={props.favourites}/>});

    return (
        <div>
        {favouriteContent}
        </div>
    )
}

export default Favorites;