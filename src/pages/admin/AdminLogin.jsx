import React, { useState } from 'react';
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import {CameraAlt} from "@mui/icons-material";
import { VisuallyHiddenInput } from '../../components/styles/StyledComponents';
import {useFileHandler} from "6pp";
import { Navigate } from 'react-router-dom';

function AdminLogin() {

  const [password,setPassword] = useState("");
  const IsAdmin = true;

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Submit");
  };

  if(IsAdmin) return <Navigate to="/admin/dashboard"/>;

  return (
    <div>
      <Container component={"main"} maxWidth="sm" sx={{height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <Paper
            elevation={3}
            sx={{
                padding:4,
                display:"flex",
                flexDirection:"column",
                alignItems:"center"
            }}
        >
          <Typography variant='h5'>Admin Login</Typography>
          <form style={{
              width:"100%",
              marginTop:"1rem"
          }} onSubmit={submitHandler}>
              <TextField required fullWidth type='password' label="Secret Key" margin='normal' variant='outlined' value={password} onChange={(e)=>setPassword(e.target.value)}/>
              <Button sx={{marginTop:"1rem"}} variant='contained' fullWidth color='primary' type='submit'>Login</Button>
          </form>
        </Paper>
      </Container>
    </div>
  )
}

export default AdminLogin
