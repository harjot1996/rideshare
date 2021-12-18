import React, {useState, useContext, useEffect} from 'react'

import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import { useValidPassword, useValidUsername } from '../../hooks/useAuthHooks'
import { Password, Username } from '../../components/authComponents'

import { AuthContext } from '../../contexts/authContext'

const useStyles = makeStyles({
  root: {
    height: '100vh',
  },
  hover: {
    '&:hover': { cursor: 'pointer' },
  },
})

const Logout: React.FunctionComponent<{}> = () => {


  const history = useHistory()

  const authContext = useContext(AuthContext)



  useEffect(() => {
    async function fetchMyAPI() {
      await authContext.signOut()
      history.push('landing')
    }

    fetchMyAPI()
  }, [])
/*
  useEffect(() => {
    await authContext.signOut()
    history.push('landing')
  })*/


  return (<div></div>);
}

export default Logout
