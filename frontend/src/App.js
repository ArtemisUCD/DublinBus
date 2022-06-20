import './App.css';
import Header from './components/Header/Header'
import Menu from './components/Menu/Menu'
import Map from './components/Map/Map'
import { Wrapper } from "@googlemaps/react-wrapper";

const render = Status => {
  return <h1>{Status}</h1>
}

function App() {

  return (
    <div className="App">
      <Header />
      <div className='main-content'>
        <Menu />
      <Wrapper apiKey={"API_KEY"} render={render}>
        <Map />
      </Wrapper>
      </div>
    </div>
  );
}

export default App;
