import React from 'react';

import {useHistory} from 'react-router-dom';
import {Button} from "@mui/material";


function Header() {

  const history = useHistory();

  const logout = () => {
    const isLogout = window.confirm('Do you want to log out ?');
    if (isLogout) {
      history.push('logout')
    }
  }

  return (
      <Button style={{position: 'absolute', right: 20}}
              variant="contained"
              onClick={() => logout()}
      >Logout</Button>)
}

export default Header;
