import './Header.css'
import Weather from '../Weather/Weather'
import logo from './img/db_logo.png';
import {AppBar, Toolbar, IconButton, Box} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';

const Header = (props) => {

  const toggleDrawer = () =>{
    props.toggleDrawer()
  }
    return (
    <AppBar sx={{display:"flex",minHeight:100,alignItems:"center",flexDirection:"row"}}>
    <Toolbar sx={{justifyContent:"space-between",alignItems:"center",height:100}}>
      <Box sx={{display:"flex",alignItems:"center"}}>
      <IconButton onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <img src={logo} className="logo" alt="logo"/>
      </Box>
      <Box sx={{height:"100%",width:"70%"}}>
      <Weather/>
      </Box>
    </Toolbar>
  
    </AppBar>
    )
}

export default Header;