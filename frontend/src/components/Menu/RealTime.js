// import './RealTime.css'
// import { useEffect, useState } from 'react';
// import { IconButton } from '@mui/material'
// import SearchIcon from '@mui/icons-material/Search';
// import CloseIcon from '@mui/icons-material/Close';

// const RealTime = () => {

//     const [stopData, setstopData] = useState([]);
//     const [filteredData, setFilteredData] = useState([]);
//     const [enteredValue, setEnteredValue] = useState("");

//     useEffect(() => {
//         fetch("/api/stop_")
//         .then(response => response.json())
//         .then(data => setstopData(data))
//       },[]);
    
//     const handleFilter = (event) => {
//         const searchWord = event.target.value;
//         setEnteredValue(searchWord);

//         const newFilter = stopData.filter((value) => {
//             return value.stop_name.toLowerCase().includes(searchWord.toLowerCase());
//         });
//         if (searchWord === "") {
//             setFilteredData([]);
//         } else {
//             setFilteredData(newFilter); 
//         }
        
//     };

//     const clearInput = () => {
//         setFilteredData([]);
//         setEnteredValue("");
//     }

//     return(
//         <div className = "container">
//             <input 
//             type="text" 
//             className="search" 
//             placeholder="Enter Stop Number"
//             value={enteredValue}
//             onChange={handleFilter}
//             ></input>
//             <div className='searchIcon'>
//                 <IconButton >
//                     {filteredData.length ===0 ? ( <SearchIcon /> )
//                      : (<CloseIcon 
//                         id="clearBtn"
//                         onClick={clearInput}/>)}
//                 </IconButton>
//             </div>
            
            
//             <br/>
//             <br/>
//             {filteredData.map((val,key) => {
//                 return (
//                     <div className='stopdataresult' key={key}>
//                         <p>{val.stop_name}</p>
//                     </div>
//                 );
//             })}

import React, { Component } from 'react';

class RealTime extends Component {
    state = {
      todos: []
    };

    handleChange(event) {
        // this.setState({value: event.target.value});
        console.log({value: event.target.value});
      }
  
    async componentDidMount() {
      try {
        const res = await fetch('/api/shape');
        const todos = await res.json();
        this.setState({
          todos
        });
      } catch (e) {
        console.log(e);
      }
    }
    render() {
      return (
        <div>
            <form onSubmit={this.handleSubmit}>
            <label>
          bus stop:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
          <table class="table table-bordered table-hover table-striped">
            <thead>
              <tr class="bg-gray text-white">
              {/* 'id',  'timestamp' ,   'trip_id', 'route_id', 'start_time' , 'start_date', 'schedule_relationship' , 
            'is_deleted' ,  'stop_sequence' , 'stop_id' , 'arrival_delay' , 'arrival_time' , 'departure_delay' ,'departure_time' */}
                <th>shape_id</th>
                <th>shape_pt_lat</th>
                <th>shape_pt_lon</th>
                <th>shape_pt_sequence</th>
                <th>shape_dist_traveled</th>
              </tr>
            </thead>
            <tbody>
              {this.state.todos.map(item => (
                <tr>
                  <td scope="row">{item.shape_id}</td>,
                  <td scope="row">{item.shape_pt_lat}</td>,
                  <td>{item.shape_pt_lon}</td>
                  <td>{item.shape_pt_sequence}</td>
                  <td>{item.shape_dist_traveled}</td>

                </tr>
              ))}
            </tbody>
          </table> 
        </div>
      );
    }
}
export default RealTime;