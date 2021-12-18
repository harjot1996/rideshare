import React, {useEffect, useState} from "react";
import {AppBar, Box, Drawer, FormControl, Input, List, ListItemText, Toolbar, Typography, Button} from "@mui/material";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import MapScreen from "./Map"
import { useContext } from 'react';
import Context from './Context';
import {GoogleMap, withGoogleMap, withScriptjs} from "react-google-maps";
import {useHistory} from "react-router-dom";


const MainScreen2 = () => {

    const history = useHistory();


    const drawerWidth = "20%";

    const { setFromMap, setToMap } = useContext(Context);

    const [center, setCenter] = useState({
        lat: null,
        lng: null
    });


    const [from, setFrom] = useState("");
    const [fromCoords, setFromCoords] = useState({
        lat: null,
        lng: null
    });
    const [filteredRides, setFilteredRides] = useState([]);
    const [to, setTo] = useState("");
    const [seats, setSeats] = useState("");
    const [detour, setDetour] = useState("");
    const [toCoords, setToCoords] = useState({
        lat: null,
        lng: null
    });


    // TODO: To be fetched real time from AWS
    const riders = [
        { lat: 34.0257449, lng: -118.2832194 },
        { lat: 34.0259722, lng: -118.2841969 }
    ];

    useEffect(() => {
        /*navigator.geolocation.getCurrentPosition(function(position) {
          setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
        });*/
    })

    const handleSelectFrom = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setFrom(value);
        //from_ = latLng;
        setFromCoords(latLng);
    };

    const handleSelectTo = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);

        setTo(value);
        //to_ = latLng;
        setToCoords(latLng);
    };

    function postRide(from, to, seats, detour) {
        const user_id = localStorage.getItem("rs_share_user");
        fetch('https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                driver_id: user_id,
                from_lat: from.lat,
                from_lng: from.lng,
                to_lat: to.lat,
                to_lng: to.lng,
                miles: detour,
                seats: seats,
            })
        })
        history.push('drivera');
    }


    return (

        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: "border-box"
                }
            }}
        >
            <Toolbar />
            <Box sx={{ m: 2 }}>
                <Box sx={{ m: 2 }}>
                    {<Button
                        variant="contained"
                        onClick={() => {
                            if (fromCoords && toCoords && seats && detour) {
                                setFromMap(fromCoords);
                                setToMap(toCoords);
                                postRide(fromCoords, toCoords, seats, detour);
                            }
                        }}
                    >Submit</Button>}
                </Box>
            </Box>
        </Drawer>

    );
};

const Map = withScriptjs(
    withGoogleMap(props => (
        <GoogleMap
            defaultCenter={{lat: props.center.lat, lng: props.center.lng}}
            defaultZoom={props.defaultZoom}
        >
        </GoogleMap>
    ))
);

const InnerMap = () => {
    const { fromMap, toMap, defaultMap } = useContext(Context);
    if (fromMap && toMap) {
        return (
            <Box component="main" sx={{flexGrow: 1}}>
                <MapScreen
                    to={{lat: toMap.lat, lng: toMap.lng}}
                    from={{lat: fromMap.lat, lng: fromMap.lng}}
                    default={{ lat: defaultMap.lat, lng: defaultMap.lng }}
                />
            </Box>
        );
    } else {

        return (
            <Box component="main" sx={{flexGrow: 1}}>
                <Map center={{lat: defaultMap.lat, lng: defaultMap.lng}}/>
            </Box>
        )
    }
};

const Driver = () => {
    const [fromMap, setFromMap] = useState({
        lat: "",
        lng: ""
    });
    const [toMap, setToMap] = useState({
        lat: "",
        lng: ""
    });
    const [defaultMap, setDefaultMap] = useState({
        lat: 0.0,
        lng: 0.0
    });

    React.useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            setDefaultMap({lat: position.coords.latitude, lng: position.coords.longitude});
        });
    }, []);

    return (
        <Context.Provider value={{fromMap, setFromMap, toMap, setToMap, defaultMap}}>
            <Box sx={{ display: "flex" }}>
                <AppBar
                    position="fixed"
                    sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            RideShare
                        </Typography>
                    </Toolbar>
                </AppBar>
                <MainScreen2/>
                <InnerMap/>
            </Box>
        </Context.Provider>
    );
};



export default Driver;
