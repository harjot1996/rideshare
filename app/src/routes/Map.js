import React from "react";
import {Box} from "@mui/material";

import {GoogleMap, withGoogleMap, withScriptjs} from "react-google-maps";
import Renderer from "./Renderer";

const API_KEY = "AIzaSyDciBUuGsYD6gmUrEkV-24bhXvzAXiZz0g";



const MapScreen = (input) => {

    const Map = withScriptjs(
        withGoogleMap(props => (
            <GoogleMap
                defaultCenter={props.defaultCenter}
                defaultZoom={props.defaultZoom}
            >
                {<Renderer
                    places={props.places}
                    travelMode={window.google.maps.TravelMode.DRIVING}
                />}
            </GoogleMap>
        ))
    );


    return (
        <Box sx={{ display: "flex" }}>
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Map
                    googleMapURL={
                        "https://maps.googleapis.com/maps/api/js?key=" +
                        API_KEY +
                        "&v=3.exp&libraries=geometry,drawing,places&sensor=true"
                    }
                    places={[input.from, input.to]}
                    loadingElement={<div style={{ height: `100%` }} />}
                    containerElement={<div style={{ height: "80vh" }} />}
                    mapElement={<div style={{ height: "100vh" }} />}
                    defaultCenter={{ lat: input.default.lat, lng: input.default.lng }}
                    defaultZoom={12}
                />
            </Box>
        </Box>
    );
};

export default MapScreen;
