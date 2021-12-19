import React, {useContext, useState} from "react";
import {AppBar, Box, Button, Drawer, Toolbar, Typography} from "@mui/material";
import MapScreen from "./Map"
import Context from './Context';
import {useHistory} from "react-router-dom";
import Header from './Header';


const MainScreen2 = () => {

    const user_id = localStorage.getItem("rs_share_user");
    const drawerWidth = "20%";
    const { setFromMap, setToMap } = useContext(Context);
    const { setRideFlag } = useContext(Context);
    const { riderName, setRiderName } = useContext(Context);


    React.useLayoutEffect(() => {
        fetch("https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1?user_id=" + user_id)
            .then(res => res.json())
            .then((result) => {
                    let res_ = JSON.parse(result);
                    setFromMap({lat: Number(res_[6]), lng: Number(res_[7])})
            })
            .then((error) => { return error; })
    }, []);

    React.useLayoutEffect(() => {
        fetch("https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1/current?user_id=" + user_id)
            .then(res => res.json())
            .then((result) => {
                let res1_ = JSON.parse(result);
                console.log('------');
                console.log(res1_);
                setToMap({lat: Number(res1_[5]), lng: Number(res1_[6])})

                if (res1_[7]==='A') {setRideFlag('End Ride'); setRiderName("Completing Trip");}
                if (res1_[7]==='B') {setRideFlag('Rider Picked Up?');setRiderName("Picking Up: " + res1_[4] + " | From: " + res1_[9]);}
                if (res1_[7]==='C') {setRideFlag('Rider Dropped?');setRiderName("Dropping: " + res1_[4] + " | At: " + res1_[9]);}

            })
            .then((error) => { return error; }
            )}, []);

    React.useLayoutEffect(() => {
        const interval = setInterval(() => {
            fetch("https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1?user_id=" + user_id)
                .then(res => res.json())
                .then((result) => {
                    let res_ = JSON.parse(result);
                    setFromMap({lat: Number(res_[6]), lng: Number(res_[7])})
                })
                .then((error) => { return error; })
        }, 8000000);
        return () => clearInterval(interval);
    }, []);


    /*React.useLayoutEffect(() => {
        const interval = setInterval(() => {
            fetch('https://www.googleapis.com/geolocation/v1/geolocate?key=' + API_KEY, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(res => res.json())
                .then((result) => {
                    fetch('https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1/driver/update', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            driver_id: user_id,
                            lat: result.location.lat,
                            lng: result.location.lng
                        })});

                    console.log(result);
                })
            /!*navigator.geolocation.getCurrentPosition(function(position) {
                fetch('https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1/driver/update', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        driver_id: user_id,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                })*!/
                //setCurrentMap({lat: position.coords.latitude, lng: position.coords.longitude});

        }, 6000);
        return () => clearInterval(interval);
    }, []);*/


    React.useLayoutEffect(() => {
        const interval = setInterval(() => {



            navigator.geolocation.getCurrentPosition(function(position) {
                fetch('https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1/driver/update',
                    {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            driver_id: user_id,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        })
                    }
                )
            });

        }, 6000);
        return () => clearInterval(interval);
    }, []);





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
                    { riderName }
                    {/*{<Button
                        variant="contained"
                        onClick={() => {
                        }}
                    >Submit</Button>}*/}
                </Box>
            </Box>
        </Drawer>

    );
};

const InnerMap = () => {
    const { fromMap, toMap, defaultMap } = useContext(Context);
        return (
            <Box component="main" sx={{flexGrow: 1}}>
                <MapScreen
                    to={{lat: toMap.lat, lng: toMap.lng}}
                    from={{lat: fromMap.lat, lng: fromMap.lng}}
                    default={{ lat: defaultMap.lat, lng: defaultMap.lng }}
                />

            </Box>
        );
};

const DriverActive = () => {
    const history = useHistory();
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

    const [rideFlag, setRideFlag] = useState("");
    const [riderName, setRiderName] = useState("");

    React.useEffect(() => {
        navigator.geolocation.getCurrentPosition(function(position) {
            setDefaultMap({lat: position.coords.latitude, lng: position.coords.longitude});
        });
    }, []);

    return (
        <Context.Provider value={{fromMap, setFromMap, toMap, setToMap, defaultMap, rideFlag, setRideFlag, riderName, setRiderName}}>
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
                <InnerMap/>
                <Box sx={{flexGrow: 1, zIndex:100000 }} style={{position: 'absolute', bottom:0, width: '100vw', height: '10%', 'background-color': 'gray', 'display':'flex', 'justify-content': 'center'}}>
                    <Button
                        style={{ padding: '0 5% 0 5%'}}
                        variant="contained"
                        onClick={() => {
                        }}>
                        <Typography variant="h6" noWrap component="div">
                            { rideFlag }
                        </Typography>
                    </Button>

                </Box>

            </Box>
        </Context.Provider>
    );
};



export default DriverActive;
