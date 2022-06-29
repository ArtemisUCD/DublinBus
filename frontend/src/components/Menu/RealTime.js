import './RealTime.css'
import { useEffect, useState } from 'react';
import { IconButton } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

const RealTime = () => {

    const [stopData, setstopData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [enteredValue, setEnteredValue] = useState("");

    useEffect(() => {
        fetch("/api/stop_")
        .then(response => response.json())
        .then(data => setstopData(data))
      },[]);
    
    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setEnteredValue(searchWord);

        const newFilter = stopData.filter((value) => {
            return value.stop_name.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === "") {
            setFilteredData([]);
        } else {
            setFilteredData(newFilter); 
        }
        
    };

    const clearInput = () => {
        setFilteredData([]);
        setEnteredValue("");
    }

    return(
        <div className = "container">
            <input 
            type="text" 
            className="search" 
            placeholder="Enter Stop Number"
            value={enteredValue}
            onChange={handleFilter}
            ></input>
            <div className='searchIcon'>
                <IconButton >
                    {filteredData.length ===0 ? ( <SearchIcon /> )
                     : (<CloseIcon 
                        id="clearBtn"
                        onClick={clearInput}/>)}
                </IconButton>
            </div>
            
            
            <br/>
            <br/>
            {filteredData.map((val,key) => {
                return (
                    <div className='stopdataresult' key={key}>
                        <p>{val.stop_name}</p>
                    </div>
                );
            })}
        </div>
    )
}

export default RealTime;