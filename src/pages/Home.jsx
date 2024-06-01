import React from 'react'
import AppLayout from '../components/layout/AppLayout.jsx';
import { Box, Typography } from '@mui/material';
import { grayColor } from '../components/constatnts/color.js';

function Home() {
  return (
    <Box bgcolor={grayColor} height={"100%"}>
      <Typography p={"2rem"} variant='h5' textAlign={"center"}>
        Select a Friend to Chat
      </Typography>
    </Box>
  )
}

export default AppLayout()(Home);
