import React from "react";
import { useGeolocated } from "react-geolocated";

const Location = () => {
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    return !isGeolocationAvailable ? (
        <div>Your browser does not support Geolocation</div>
    ) : !isGeolocationEnabled ? (
        <div>Geolocation is not enabled</div>
    ) : coords ? (
        // coords. latitude/longitude/altitude/heading/speed
        <span>{coords.latitude}</span>
    ) : (
        <div>Getting the location data&hellip; </div>
    );
};

export default Location;