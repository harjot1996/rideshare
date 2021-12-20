import React, {useContext, useState} from "react";
import {AppBar, Box, Button, Drawer, FormControl, Input, List, ListItemText, Toolbar, Typography} from "@mui/material";
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-places-autocomplete";
import MapScreen from "./Map"
import Context from './Context';
import {useHistory} from "react-router-dom";
import Header from "./Header";


const MainScreen2 = () => {

    const history = useHistory();
    const drawerWidth = "100%";
    const { setFromMap, setToMap } = useContext(Context);
    const [from, setFrom] = useState("");
    const [fromCoords, setFromCoords] = useState({
        lat: null,
        lng: null
    });
    const [to, setTo] = useState("");
    const [toCoords, setToCoords] = useState({
        lat: null,
        lng: null
    });

    const handleSelectFrom = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);
        setFrom(value);
        setFromCoords(latLng);
    };

    const handleSelectTo = async value => {
        const results = await geocodeByAddress(value);
        const latLng = await getLatLng(results[0]);

        setTo(value);
        setToCoords(latLng);
    };

    async function postRide(from_, to_, seats, detour) {
        const user_id = localStorage.getItem("rs_share_user");
        await fetch('https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                driver_id: user_id,
                from_lat: from_.lat,
                from_lng: from_.lng,
                to_lat: to_.lat,
                to_lng: to_.lng,
                miles: detour,
                seats: seats,
                src: from,
                dst: to,
            })
        })
        history.push('ridera');
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
                    <FormControl fullWidth>
                        <PlacesAutocomplete
                            value={from}
                            onChange={setFrom}
                            onSelect={handleSelectFrom}
                        >
                            {({
                                  getInputProps,
                                  suggestions,
                                  getSuggestionItemProps,
                                  loading
                              }) => (
                                <Box>
                                    <Input
                                        autoFocus={true}
                                        sx={{ width: "100%" }}
                                        {...getInputProps({ placeholder: "From" })}
                                    />
                                    <List dense={true}>
                                        {loading ? <Box>...loading</Box> : null}
                                        {suggestions.map(suggestion => {
                                            return (
                                                <ListItemText
                                                    {...getSuggestionItemProps(suggestion)}
                                                    sx={{ cursor: "pointer" }}
                                                >
                                                    {suggestion.description}
                                                </ListItemText>
                                            );
                                        })}
                                    </List>
                                </Box>
                            )}
                        </PlacesAutocomplete>
                    </FormControl>
                </Box>
                <Box sx={{ m: 2 }}>
                    <FormControl fullWidth>
                        <PlacesAutocomplete
                            value={to}
                            onChange={setTo}
                            onSelect={handleSelectTo}
                        >
                            {({
                                  getInputProps,
                                  suggestions,
                                  getSuggestionItemProps,
                                  loading
                              }) => (
                                <Box>
                                    <Input
                                        sx={{ width: "100%" }}
                                        {...getInputProps({ placeholder: "To" })}
                                    />
                                    <List dense={true}>
                                        {loading ? <Box>...loading</Box> : null}
                                        {suggestions.map(suggestion => {
                                            return (
                                                <ListItemText
                                                    {...getSuggestionItemProps(suggestion)}
                                                    sx={{
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    {suggestion.description}
                                                </ListItemText>
                                            );
                                        })}
                                    </List>
                                </Box>
                            )}
                        </PlacesAutocomplete>
                    </FormControl>
                </Box>
                <Box sx={{ m: 2 }}>
                    {<Button
                        variant="contained"
                        onClick={() => {
                            if (fromCoords && toCoords) {
                                setFromMap(fromCoords);
                                setToMap(toCoords);
                                postRide(fromCoords, toCoords);
                            }
                        }}
                    >Submit</Button>}
                </Box>
            </Box>
        </Drawer>

    );
};


const Rider = () => {
    const [fromMap, setFromMap] = useState({
        lat: "",
        lng: ""
    });
    const [toMap, setToMap] = useState({
        lat: "",
        lng: ""
    });

    return (
        <Context.Provider value={{fromMap, setFromMap, toMap, setToMap}}>
            <Box sx={{ display: "flex" }}>
                <AppBar
                    position="fixed"
                    sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            RideShare
                        </Typography>
                        <Header></Header>

                    </Toolbar>
                </AppBar>
                <MainScreen2/>
            </Box>
        </Context.Provider>
    );
};



export default Rider;
