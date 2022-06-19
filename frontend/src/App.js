import './App.css';
import Header from './components/Header/Header'
import Menu from './components/Menu/Menu'
import Map from './components/Map/Map';


function App() {



  return (
    <div className="App">
      <Header />
      <div className='main-content'>
        <Menu />
        <Map />
      </div>
    </div>
  );
}

export default App;