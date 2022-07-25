import { FaHeart } from "react-icons/fa";

const FavouriteItem = (props) => {

    return(
        <div>
        <span>{props.route}<FaHeart/></span>
        </div>
    )
}

export default FavouriteItem;