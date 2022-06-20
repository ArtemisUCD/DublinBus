import './Favorites.css';
import BusRouteItem from './BusRouteItem';

const Favorites = (props) => {


    let favouriteContent = props.favourites.map(route => <BusRouteItem route={route} onLike={props.onLike} onUnlike={props.onUnlike} favourites ={props.favourites}/>);

    return (
        <div>
        {favouriteContent}
        </div>
    )
}

export default Favorites;