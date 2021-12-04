import React from 'react'

import { useHistory } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  title: {
    textAlign: 'center',
  },
}))

const Landing: React.FunctionComponent = () => {
  const classes = useStyles()

  const history = useHistory()

  const signIn = () => {
    history.push('/signin')
  }

  return (
    <Grid container>
      <Grid className={classes.root} container direction="column" justify="center" alignItems="center">
        <Box m={2}>
          <img src={'./logomain.png'} width={224} height={224} alt="logo" />
        </Box>
        <Box m={2}>
            <Grid container direction="row" justify="center" alignItems="center">
              <Typography className={classes.title} variant="h3">
                Ride Share
              </Typography>
            </Grid>
        </Box>
        <Box m={2}>
          <Button onClick={signIn} variant="contained" color="primary">
            SIGN IN
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Landing
