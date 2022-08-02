import { Box } from "@mui/material";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

const FavouriteItem = ({favouriteContent,label, handleChange, expanded}) => {

    const expandSection = () =>{
        console.log("clicked")
        handleChange(label)
    }

    return(
        <Box sx={{display:"flex",paddingBottom:"1rem",justifyContent:"flex-start", maxheight:"300px",width:"100%"}}>
        <Accordion expanded={expanded===label} onChange={()=>expandSection(label)} sx={{width:"100%"}}>
            <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
                <Typography>{label}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {favouriteContent}
            </AccordionDetails>
        </Accordion>
    </Box>
    )
}

export default FavouriteItem;