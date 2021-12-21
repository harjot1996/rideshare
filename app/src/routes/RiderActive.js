import React, {useContext, useState} from "react";
import {AppBar, Box, Button, Toolbar, Typography} from "@mui/material";
import MapScreen from "./Map"
import Context from './Context';
import {useHistory} from "react-router-dom";
import Header from './Header';


const InnerMap = () => {
    const { from, to, base } = useContext(Context);
    return (
        <Box component="main" sx={{flexGrow: 1}}>
            <MapScreen
                to={{lat: parseFloat(to.lat), lng: parseFloat(to.lng)}}
                from={{lat: parseFloat(from.lat), lng: parseFloat(from.lng) }}
                default={{ lat: base.lat, lng: base.lng }}
            />

        </Box>
    );
};

const StateSeparator = () => {
    const user_id = localStorage.getItem("rs_share_user");
    const history = useHistory();

    const {from, setFrom} = useContext(Context);
    const {to, setTo} = useContext(Context);
    const {base, setBase} = useContext(Context);

    const [rideStatus, setRideStatus] = useState("");
    const [footerText, setFooterText] = useState("");
    const [riderTuple, setRiderTuple] = useState(null);
    const [driverTuple, setDriverTuple] = useState(null);

    const [rideFlag, setRideFlag] = useState("");
    const [riderName, setRiderName] = useState("");



    React.useLayoutEffect(() => {
        rideFetcher();
    }, []);

    React.useLayoutEffect(() => {
        const interval = setInterval(() => {
            rideFetcher();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    React.useLayoutEffect(() => {
        console.log(riderTuple);
        console.log(rideStatus);
        const interval = setInterval(() => {
            if (rideStatus === 'requested') {
                setBase({ lat: parseInt(riderTuple[0]), lng: parseInt(riderTuple[1]) });
                setFrom({ lat: "", lng: "" });
                setTo({ lat: "", lng: "" });
            }
            else if (rideStatus === 'assigned') {
                setFrom({ lat: riderTuple[15], lng: riderTuple[16] });
                setTo({ lat: riderTuple[0], lng: riderTuple[1] });
            }
            else if (rideStatus === 'active') {
                setFrom({ lat: riderTuple[15], lng: riderTuple[16] });
                setTo({ lat: riderTuple[2], lng: riderTuple[3] });
            }
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    React.useLayoutEffect(() => {
        if (rideStatus === 'requested') {
            setBase({ lat: parseFloat(riderTuple[0]), lng: parseFloat(riderTuple[1]) });
            setFrom({ lat: "", lng: "" });
            setTo({ lat: "", lng: "" });
            setFooterText("Looking for a driver");
        }
        else if (rideStatus === 'assigned') {
            setBase({ lat: parseFloat(riderTuple[15]), lng: parseFloat(riderTuple[16]) });
            setFrom({ lat: riderTuple[15], lng: riderTuple[16] });
            setTo({ lat: riderTuple[0], lng: riderTuple[1] });
            setFooterText(riderTuple[10] + " is arriving");
        }
        else if (rideStatus === 'active') {
            setBase({ lat: parseFloat(riderTuple[15]), lng: parseFloat(riderTuple[16]) });
            setFrom({ lat: riderTuple[15], lng: riderTuple[16] });
            setTo({ lat: riderTuple[2], lng: riderTuple[3] });
            setFooterText("Ride in Progress");
        }
    }, [rideStatus]);


    async function matchAccept(status, id, driver_id, driver_ride_id, rider_id, rider_ride_id) {
        await fetch('https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1/pickup/accept',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pickup_id: id,
                    driver_id: driver_id,
                    driver_ride_id: driver_ride_id,
                    rider_id: rider_id,
                    rider_ride_id: rider_ride_id,
                    status: status
                })
            }
        )
        window.location.reload();
        //history.push('drivera');
    }

    function rideFetcher() {
        fetch("https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1/rides/fetch?user_id=" + user_id)
            .then(res => res.json())
            .then((result) => {
                let res_ = JSON.parse(result);
                setRiderTuple(res_);
                if (!res_ || res_==='null') {
                    setRideStatus('redirecting');
                    history.push('rider');
                } else {
                    setRideStatus(res_[4]);
                }
            })
            .then((error) => { return error; })
    }

    function driverFetcher() {
        fetch("https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1/rides/active/status?user_id=" + user_id)
            .then(res => res.json())
            .then((result) => {
                let res_ = JSON.parse(result);
                setDriverTuple(res_);
            })
            .then((error) => { return error; })
    }

    return (

        <Box sx={{flexGrow: 1, zIndex:100000, position: 'absolute', bottom:0, width: '100vw', height: '10%', backgroundColor: '#1976d2', display:'flex', justifyContent: 'center' }}>
            {<Button
                sx={{ width: '100%' }}
                variant="contained"
            >
                <Typography variant="h7" noWrap component="div">
                    { footerText }
                </Typography>
            </Button>}
        </Box>
    );
};



const RiderActive = () => {
    const [from, setFrom] = useState({
        lat: "",
        lng: ""
    });
    const [to, setTo] = useState({
        lat: "",
        lng: ""
    });
    const [base, setBase] = useState({
        lat: 0,
        lng: 0
    });

    return (
        <Context.Provider value={{from, setFrom, to, setTo, base, setBase }}>
            <Box sx={{ display: "flex" }}>
                <AppBar
                    position="fixed"

                    sx={{ zIndex: theme => theme.zIndex.drawer + 1, height: '60px'}}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            RideShare
                        </Typography>
                        <Header></Header>
                    </Toolbar>
                </AppBar>
                <div sx={{zIndex:10000, position: 'absolute', top: '60px', width: '100%', height: '8%', backgroundColor:'white',
                    display: 'flex', justifyContent:'center', alignItems: 'center', borderBottom: '2px solid rgb(94, 149, 94)'}}>

                    <div sx={{textAlign: 'center', verticalAlign: 'middle'}}>{ } </div>
                    {/*{<Button
                        variant="contained"
                        onClick={() => {
                        }}
                    >Submit</Button>}*/}

                </div>
                <InnerMap/>
                <StateSeparator/>

            </Box>
        </Context.Provider>
    );
};





export default RiderActive;
