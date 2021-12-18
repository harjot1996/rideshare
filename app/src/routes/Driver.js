import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        height: '100vh',
    },
    hover: {
        '&:hover': { cursor: 'pointer' },
    },
})

function Driver() {

    const classes = useStyles();

    let is_active_driver = 'N';
    let is_active_rider = 'N';

    const user_id = localStorage.getItem("rs_share_user");

    const [activeDriver, setActiveDriver] = useState("Y");
    const [activeRider, setActiveRider] = useState("Loading");

    return (<div>Driver</div>);




}

export default Driver;
