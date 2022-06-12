import './App.css';
import Header from './components/Header/Header'
import Map from './components/Map/Map'
import { Wrapper } from "@googlemaps/react-wrapper";

const render = Status => {
  return <h1>{Status}</h1>
}

function App() {
  return (
    <div className="App">
      <Header />
      <Wrapper apiKey={"Google-API"} render={render}>
        <Map />
      </Wrapper>
    </div>
  );
}

export default App;
