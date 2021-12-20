import React, {useContext, useState} from "react";
import {AppBar, Box, Button, Drawer, Toolbar, Typography, Menu} from "@mui/material";
import MapScreen from "./Map"
import Context from './Context';
import {useHistory} from "react-router-dom";
import Header from './Header';


const MainScreen2 = () => {

    const user_id = localStorage.getItem("rs_share_user");
    const history = useHistory();
    const { setFromMap, setToMap } = useContext(Context);
    const { setRideFlag } = useContext(Context);
    const { riderName, setRiderName } = useContext(Context);

    const [pickup, setPickup] = useState(null);
    const [pickupDOM, setPickupDOM] = useState(null);


    React.useLayoutEffect(() => {
        fetch("https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1?user_id=" + user_id)
            .then(res => res.json())
            .then((result) => {
                console.log('hjahdsauihduihd')

                    let res_ = JSON.parse(result);
                console.log(res_);
                    if (!res_ || res_==='null') {
                        let x=1;//history.push('driver');
                    } else {setFromMap({lat: Number(res_[6]), lng: Number(res_[7])});}

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
                if (res1_ && res1_!=='null' ) {
                    setToMap({lat: Number(res1_[5]), lng: Number(res1_[6])})

                    if (res1_[7] === 'A') {
                        setRideFlag('End Ride');
                        setRiderName("Completing Trip");
                    }
                    if (res1_[7] === 'B') {
                        setRideFlag('Rider Picked Up?');
                        setRiderName("Picking Up: " + res1_[4] + " | From: " + res1_[9]);
                    }
                    if (res1_[7] === 'C') {
                        setRideFlag('Rider Dropped?');
                        setRiderName("Dropping: " + res1_[4] + " | At: " + res1_[9]);
                    }
                }

            })
            .then((error) => { return error; }
            )}, []);

    React.useLayoutEffect(() => {
        const interval = setInterval(() => {
            /*fetch("https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1?user_id=" + user_id)
                .then(res => res.json())
                .then((result) => {
                    let res_ = JSON.parse(result);
                    if (!res_ || res_==='null') {
                        let x=1;//history.push('driver');
                    } else {setFromMap({lat: Number(res_[6]), lng: Number(res_[7])});}
                })
                .then((error) => { return error; })*/
            window.location.reload();
        }, 10000);
        return () => clearInterval(interval);
    }, []);


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

    React.useLayoutEffect(() => {
        console.log('aya andarr')
        console.log(pickup);
        if (!pickup) {
            setPickupDOM(<></>);
        } else {
            setPickupDOM(

                <Box sx={{ m: 2 }} style={{position:'fixed', width: '70%', height: '25%', left:'15%', top:'37.5%',
                    margin:'0px', 'background-color': 'white'}}>
                    <Box sx={{ m: 2 }} style={{position:'fixed', width: '35%', height: '7.5%', left:'15%', top:'55%',
                        margin:'0px', 'background-color': 'rgb(197 103 103)', 'display':'flex', 'flex-grow':1}}>
                        <Button
                            variant="contained"
                            style={{'background-color':'rgb(197 103 103)', width:'100vw'}}
                            onClick={() => {
                                matchAccept('rejected', pickup[0], pickup[1], pickup[2], pickup[3], pickup[4])
                                console.log('rejected')
                            }}
                        >
                            <Typography variant="h7" noWrap component="div">
                                Reject
                            </Typography>
                        </Button>
                    </Box>
                    <Box sx={{ m: 2 }}
                         style={{position:'fixed', width: '35%', height: '7.5%', right:'15%', top:'55%',
                        margin:'0px', 'background-color': '#5e955e', 'display':'flex', 'flex-grow':1}}>
                        <Button
                            variant="contained"
                            style={{'background-color':'#5e955e', width:'100vw'}}
                            onClick={() => {
                                matchAccept('accepted', pickup[0], pickup[1], pickup[2], pickup[3], pickup[4])
                                console.log('acceptedd')
                            }}
                        >
                            <Typography variant="h7" noWrap component="div">
                                Accept
                            </Typography>
                        </Button>
                    </Box>
                    <Typography variant="h7" component="div" style={{'text-align': 'center', 'vertical-align': 'middle'}}>
                        <br/>Pickup Point: {pickup[7]} <br/> Drop Point: {pickup[8]}
                    </Typography>

                </Box>

            );
        }

    }, [pickup]);

    React.useLayoutEffect(() => {
        const interval = setInterval(() => {
            fetch("https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1/pickup?user_id=" + user_id)
                .then(res => res.json())
                .then((result) => {
                    let res = JSON.parse(result);
                    setPickup(res);
                })
                .then((error) => { return error; })
        }, 2000);
        return () => clearInterval(interval);
    }, []);


    return (


            <div style={{zIndex:10000, position: 'absolute', top: '60px', width: '100%', height: '8%', 'background-color':'white', 'display': 'flex', 'justify-content':'center', 'align-items': 'center', 'border-bottom': '2px solid rgb(94, 149, 94)'}}>

                <div style={{'text-align': 'center', 'vertical-align': 'middle'}}>{ riderName } </div>
                    {/*{<Button
                        variant="contained"
                        onClick={() => {
                        }}
                    >Submit</Button>}*/}

                {pickupDOM}
            </div>


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

const RiderActive = () => {
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

    async function deleteTop() {
        const user_id = localStorage.getItem("rs_share_user");
        const flag = rideFlag;
        await fetch('https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1/routes/delete/top', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                driver_id: user_id,
            })
        })
        if (flag === 'End Ride') {
            history.push('home');
        } else {
            window.location.reload();
            //history.push('drivera');
        }
    }

    return (
        <Context.Provider value={{fromMap, setFromMap, toMap, setToMap, defaultMap, rideFlag, setRideFlag, riderName, setRiderName}}>
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
                <MainScreen2/>
                <InnerMap/>
                <Box sx={{flexGrow: 1, zIndex:100000 }} style={{position: 'absolute', bottom:0, width: '100vw', height: '10%', 'background-color': 'gray', 'display':'flex', 'justify-content': 'center'}}>
                    <Button
                        style={{ padding: '0 5% 0 5%'}}
                        variant="contained"
                        onClick={() => {
                            deleteTop()
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



export default RiderActive;
