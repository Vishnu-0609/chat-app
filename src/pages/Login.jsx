import { useFileHandler } from "6pp";
import { CameraAlt } from "@mui/icons-material";
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { server } from '../components/constatnts/config.js';
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { userExists, userNotExists } from '../redux/slices/auth';

function Login() {

    const [isLogin,setIsLogin] = useState(true);
    const [isLoding,setIsLoding] = useState(false);

    const [name,setName] = useState("");
    const [Username,setUsername] = useState("");
    const [bio,setBio] = useState("");
    const [password,setPassword] = useState("");
    const dispatch = useDispatch();

    const avatar = useFileHandler("single");

    const getProfile = async() => {
        axios.get(`${server}/api/v1/user/profile`,{withCredentials:true}).then(({data})=>dispatch(userExists(data))).catch((error)=>dispatch(userNotExists()))
    }

    const handleSignUp = async (e) =>
    {
        e.preventDefault();
        setIsLoding(true);
        const toastId = toast.loading("Signing Up...");
        console.log(name,Username,bio,password,avatar);

        const formdata = new FormData();
        formdata.append("avatar",avatar.file);
        formdata.append("name",name);
        formdata.append("username",Username);
        formdata.append("bio",bio);
        formdata.append("password",password);

        try 
        {
            const {data} = await axios.post(`${server}/api/v1/user/register`,formdata,{
                withCredentials:true,
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            })
            console.log(data);
            // dispatch(userExists(true));
            getProfile();
            toast.success("User Registered Successfully!",{id:toastId});
        } 
        catch (error) 
        {
            toast.error(error?.response?.data?.message || "Something Went Wrong",{id:toastId});
        }
        finally
        {
            setIsLoding(false);
        }
    }

    const handleLogin = async (e) =>
    {
        e.preventDefault();
        setIsLoding(true);
        const toastId = toast.loading("Logging in...");
        try 
        {
            const {data} = await axios.post(`${server}/api/v1/user/login`,{username:Username,password},{
                withCredentials:true,
                headers:{
                    "Content-Type":"application/json"
                }
            })
            getProfile();
            // dispatch(userExists(true));
            toast.success("User Login Successfully!",{id:toastId});
        } 
        catch (error) 
        {
            toast.error(error?.response?.data?.message || "Something Went Wrong",{id:toastId});
        } 
        finally
        {
            setIsLoding(false);
        }
    }

  return (
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
            {isLogin ? 
                <>
                    <Typography variant='h5'>Login</Typography>
                    <form style={{
                        width:"100%",
                        marginTop:"1rem"
                    }} onSubmit={handleLogin}>
                        <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={Username} onChange={(e)=>setUsername(e.target.value)}/>
                        <TextField required fullWidth type='password' label="Password" margin='normal' variant='outlined' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <Button sx={{marginTop:"1rem"}} disabled={isLoding} variant='contained' fullWidth color='primary' type='submit'>Login</Button>
                        <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                        <Button variant='text' fullWidth disabled={isLoding} onClick={()=>setIsLogin(false)}>Sign Up Instead</Button>
                    </form>
                </>
                :
                <>
                    <Typography variant='h5'>Sign Up</Typography>
                    <form style={{
                        width:"100%",
                        marginTop:"1rem"
                    }} onSubmit={handleSignUp}>
                        <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                            <Avatar sx={{width:"10rem",height:"10rem",objectFit:"contain"}} src={avatar.preview}/>
                            <IconButton sx={{
                                position:"absolute",
                                bottom:"0",
                                right:"0",
                                color:"white", 
                                bgcolor:"rgba(0,0,0,1)",
                                ":hover":{
                                    bgcolor:"rgba(0,0,0,0.7)"
                                }
                                }}
                                component="label"
                            >
                                <>
                                    <CameraAlt/>
                                    <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}/>
                                </>
                            </IconButton>
                        </Stack>
                        {
                            avatar.error && (
                                <Typography m={"1rem auto"} width={"fit-content"} display={"block"} color={"error"} variant='caption'>
                                    {avatar.error}
                                </Typography>
                            )
                        }

                        <TextField required fullWidth label="Name" margin='normal' variant='outlined' value={name} onChange={(e)=>setName(e.target.value)}/>
                        <TextField required fullWidth label="Bio" margin='normal' variant='outlined' value={bio} onChange={(e)=>setBio(e.target.value)}/>
                        <TextField required fullWidth label="Username" margin='normal' variant='outlined' value={Username} onChange={(e)=>setUsername(e.target.value)}/>
                        <TextField required fullWidth type='password' label="Password" margin='normal' variant='outlined' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <Button sx={{marginTop:"1rem"}} variant='contained' disabled={isLoding} fullWidth color='primary' type='submit'>Sign Up</Button>
                        <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                        <Button variant='text' fullWidth disabled={isLoding} onClick={()=>setIsLogin(prev=>!prev)}>Login Instead</Button>
                    </form>
                </>
            }
        </Paper>
    </Container>
  )
}

export default Login
