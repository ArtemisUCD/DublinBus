import './Map.css'
import { Wrapper, Status } from "@googlemaps/react-wrapper";

const render = (status) => {
    switch (status) {
        case Status.LOADING:
            return <Spinner />;
        case Status.FAILURE:
            return <ErrorComponet />;
        case Status.SUCCESS:
            return <MyMapComponent />;
    }
};

const MyApp = () => <Wrapper apiKey={"AIzaSyDYT7qeps8IqMpcUpBKG49UehWOG2J_qEA"} render={render} />;