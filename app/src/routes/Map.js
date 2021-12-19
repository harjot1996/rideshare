import React from "react";
import {Box} from "@mui/material";

import {GoogleMap, withGoogleMap, withScriptjs} from "react-google-maps";
import Renderer from "./Renderer";

const API_KEY = "AIzaSyAzp0_aceOfsvY8N7SXC20N2sCK2w114Go";
//const API_KEY = "AIzaSyDciBUuGsYD6gmUrEkV-24bhXvzAXiZz0g"; //megha's
//const API_KEY = "AIzaSyCFOxZdr5r5zsdVPG7XD2o_CAwwy2DvPqo"; //megha's 2





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
                    defaultZoom={9}
                />
            </Box>
        </Box>
    );
};

export default MapScreen;
