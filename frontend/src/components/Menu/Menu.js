import './Menu.css'
import RoutePlanner from "./RoutePlanner";
import { useState } from "react";
import { Box, Tab} from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';
import DirectionsIcon from '@mui/icons-material/Directions';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Menu = (props) => {

  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

return(
  <Box className="main-menu" sx={{ zIndex:"1", position:"absolute", typography: 'body1', backgroundColor:"white"}}>
  <TabContext value={value}>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} variant="scrollable" onChange={handleChange} aria-label="lab API tabs example">
        <Tab icon={<DirectionsIcon />} label="Directions" value="1" />
        <Tab icon={<DirectionsBusIcon />} label="Bus Routes" value="2" />
        <Tab icon={<AccessTimeIcon />} label="Real Time Info" value="3" />
      </Tabs>
    </Box>
    <TabPanel value="1" ><RoutePlanner origin={props.origin} getAddress ={props.getAddress}destination={props.destination} calcRoute={props.calcRoute} clearDetails={props.clearDetails} swap={props.swap} toggleDrawer={props.toggleDrawer}/>
  </TabPanel>
    <TabPanel value="2">Plot Bus Routes</TabPanel>
    <TabPanel value="3">Real Time Information</TabPanel>
  </TabContext>
</Box>
    )
}

export default Menu;