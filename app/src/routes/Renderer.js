/*global google*/
import React, { useState, useEffect } from "react";
import { DirectionsRenderer } from "react-google-maps";

const Renderer = props => {
    const [directions, setDirections] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const { places, travelMode } = props;
        const waypoints = places.map(p => ({
            location: { lat: p.lat, lng: p.lng },
            stopover: true
        }));


        const origin = waypoints.shift().location;
        const destination = waypoints.pop().location;

        const directionsService = new google.maps.DirectionsService();
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: travelMode,
                waypoints: waypoints
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) setDirections(result);
                else setError(result);
            }
        );
    });

    if (error) return <h1>{error}</h1>;
    return directions && <DirectionsRenderer directions={directions} />;
};

export default Renderer;
