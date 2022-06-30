import './BusRouteList.css'
import BusRouteItem from './BusRouteItem'
import { useState } from 'react';
import { IconButton, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
const BusRouteList = (props) => {
    const routeList = [
        { "route_name": "46A"},
        { "route_name": "145"},
        { "route_name": "39A"},
        { "route_name": "37"},
        { "route_name": "17"}];
    const [filterList, setFilterList] = useState([]);
    const [enterRoute, setEnterRoute] = useState("");
    const [showinfo, setShowinfo] = useState(false);
    const [showsearch, setShowsearch] = useState(true);
    
    let routefav
    if (enterRoute != ""){
        routefav = <BusRouteItem key = {Math.random()} route = {enterRoute} onLike={props.onLike} onUnlike={props.onUnlike} favourites = {props.favourites}/>;
    }
    
    const handleFilter = (event) => {
        const searchWord = event.target.value;
        setEnterRoute(searchWord);
        const newFilter = routeList.filter((value) => {
            return value.route_name.toLowerCase().includes(searchWord.toLowerCase());
        });
        if (searchWord === "") {
            setFilterList([]);
        }else {
            setFilterList(newFilter); 
        }
        
    };
    const onSearch = (searchTerm) => {
        setEnterRoute(searchTerm);
        setFilterList([]);
    }
    const clearInput = () => {
        setFilterList([]);
        setEnterRoute("");
    }
    const onkeydown = () => {
        if (window.event.keyCode ===13){
            searchresult();
        }
    }
    const searchresult = ()=>{
        if (enterRoute){
            setShowinfo(true);
            setShowsearch(false);
        }else{
            setShowinfo(false);
        }
        
    }
    const backtoroute =() => {
        setShowinfo(false);
        setShowsearch(true);
        setEnterRoute("");
    }
    return(
        <div className='routeContainer'>
            {showsearch &&(
                <div>
                    <input
                    type="text"
                    className="searchbar"
                    placeholder="Enter Bus Route Name"
                    value={enterRoute}
                    onChange={handleFilter}
                    onKeyDown={onkeydown}
                    ></input>
                    <div className='searchIcon'>
                    <IconButton >
                        {filterList.length ===0 ? ( <SearchIcon onClick={()=>searchresult()}/> )
                        : (<CloseIcon 
                            id="clearBtn"
                            onClick={clearInput}/>)}
                    </IconButton>
                    </div>
                </div>
            )}
            
            {filterList.map((val,key) => {
                return (
                    <div className='routeresult' key={key} onClick={()=>onSearch(val.route_name)}>
                        {val.route_name}
                    </div>
                    
                );
            })}
            {showinfo && (
                <div>
                    <Button onClick={backtoroute}variant="outlined" size="small" >Back to Search</Button>
                    {routefav}
                </div>
            )}
        </div>
    )
}
export default BusRouteList;