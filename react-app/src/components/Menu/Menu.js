import MenuItem from "./MenuItem";
import './Menu.css'

const Menu = () => {

    const menuItems = ["Plan Route","Real Time Information","Bus Route","Favourites"];

    let menuContent = menuItems.map(item => <MenuItem title = {item}/>)

    return (
        <div className="main-menu">
            {menuContent}
        </div>
    )
}

export default Menu;