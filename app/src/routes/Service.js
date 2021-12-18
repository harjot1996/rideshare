import React from "react";


export async function getDrivesByDriverId(driver_id) {
    fetch("https://ct4ocfq9d7.execute-api.us-east-1.amazonaws.com/staging_1?user_id=" + driver_id)
        .then(res => res.json())
        .then((result) => {
            console.log(result);
            return result; },
            (error) => { return error; }
        )
}
