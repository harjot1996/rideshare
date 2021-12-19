import React, {useState} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";


const useStyles = makeStyles({
    root: {
        height: '100vh',
    },
    hover: {
        '&:hover': { cursor: 'pointer' },
    },
})

function Home() {

    const classes = useStyles();
    const history = useHistory();

    let is_active_driver = 'N';
    let is_active_rider = 'N';

    let user_id = localStorage.getItem("rs_share_user");



    const [activeDriver, setActiveDriver] = useState("Loading");
    const [activeRider, setActiveRider] = useState("Loading");

    React.useEffect(() => {
        user_id = localStorage.getItem("rs_share_user");
        fetch("https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1?user_id=" + user_id)
            .then(res => res.json())
            .then((result) => {
                    console.log(result);
                    if (result !== 'null') {
                        setActiveDriver("Y");
                    } else {setActiveDriver("N")}},
                (error) => { return error; }
            )

        fetch("https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1?user_id=" + user_id)
            .then(res => res.json())
            .then((result) => {
                    if (result !== 'null') {
                        setActiveRider("N"); //TO DO FIX THIS
                    } else {setActiveRider("N")}},
                (error) => { return error; }
            )
    }, []);



    function activateDriver() {
        console.log("activating");
        history.push('driver');
    }


    if (activeDriver === 'Loading' || activeRider === 'Loading') {
        return (
            <div>Loading</div>
        );
    } else if (activeDriver === 'Y') {
        history.push('drivera');
        return (

            <div>Driver</div>
        );
    } else if (activeRider === 'Y') {
        return (

            <div>Rider</div>
        );
    } else {
        return (

                <Grid className={classes.root} container direction="row" justify="center" alignItems="center">
                    <Grid xs={11} sm={6} lg={4} container direction="row" justify="center" alignItems="center" item>
                        <Paper style={{ width: '100%', padding: 32 }}>
                            <Grid container direction="column" justify="center" alignItems="center">
                                {/* Title */}
                                <Box m={2}>
                                    <Typography variant="h3">Sign in</Typography>
                                </Box>

                                {/* Sign In Form */}
                                <Box width="80%" m={1}>
                                    {/* <Email emailIsValid={emailIsValid} setEmail={setEmail} /> */}
                                    <Grid container direction="row" justify="center">
                                        <Box m={1}>
                                            <Button style={{width: '200px'}} color="secondary" variant="contained" onClick={activateDriver}>
                                                Start Ride
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Box>
                                <Box width="80%" m={1}>
                                    {/* <Email emailIsValid={emailIsValid} setEmail={setEmail} /> */}
                                    <Grid container direction="row" justify="center">
                                        <Box m={1}>
                                            <Button style={{width: '200px'}} color="primary" variant="contained" >
                                                Join Ride
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>

        )
    }

}

export default Home;
