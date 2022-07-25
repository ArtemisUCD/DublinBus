import './Header.css'
import Weather from '../Weather/Weather'
import logo from './img/Dublin_Bus_WHITE.png';
import background from './img/background.jpeg'
import {AppBar, Toolbar, IconButton, Box} from '@mui/material'

const Header = (props) => {

  const toggleDrawer = () =>{
    props.toggleDrawer()
  }
    return (
    <AppBar id="header" sx={{display:"flex",alignItems:"center",flexDirection:"row",position:"sticky",backgroundColor:"#070861"}}>
    <Toolbar sx={{justifyContent:"space-between",alignItems:"center",minHeight:"10px"}}>
      <Box sx={{display:"flex",alignItems:"center"}}>
      <img src={logo} className="logo" alt="logo"/>
      </Box>
      <Box sx={{width:"70%"}}>
      {/* <Weather/> */}
      </Box>
    </Toolbar>
  
    </AppBar>
    )
}

export default Header;