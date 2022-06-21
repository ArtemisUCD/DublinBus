import './BusRouteList.css'
import BusRouteItem from './BusRouteItem'

const BusRouteList = (props) => {

    const routeList = ["46A","145","39A","37","17"];

    let content = routeList.map(route => <BusRouteItem key = {Math.random()} route = {route} onLike={props.onLike} onUnlike={props.onUnlike} favourites = {props.favourites}/>);

    return(
        <div>
            {content}
        </div>
    )
}

export default BusRouteList;