import React, { Component } from 'react';

class RealTime extends Component {
    state = {
      todos: []
    };
  
    async componentDidMount() {
      try {
        const res = await fetch('/api/busesUpdates');
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
          <table class="table table-bordered table-hover table-striped">
            <thead>
              <tr class="bg-gray text-white">
              {/* 'id',  'timestamp' ,   'trip_id', 'route_id', 'start_time' , 'start_date', 'schedule_relationship' , 
            'is_deleted' ,  'stop_sequence' , 'stop_id' , 'arrival_delay' , 'arrival_time' , 'departure_delay' ,'departure_time' */}
                <th>trip_id</th>
                <th>route_id</th>
                <th>start_time</th>
                <th>schedule_relationship</th>
                <th>is_deleted</th>
              </tr>
            </thead>
            <tbody>
              {this.state.todos.map(item => (
                <tr>
                  <td scope="row">{item.id}</td>,
                  <td scope="row">{item.timestamp}</td>,
                  <td>{item.trip_id}</td>
                  <td>{item.route_id}</td>
                  <td>{item.start_time}</td>
                  <td>{item.schedule_relationship}</td>
                  <td>{item.is_deleted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
export default RealTime;