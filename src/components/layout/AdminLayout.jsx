import { Close as CloseIcon, ExitToApp as ExitToAppIcon, Menu as MenuIcon } from "@mui/icons-material";
import { Box, Drawer, Grid, IconButton, Stack, Typography, styled } from "@mui/material";
import React, { useState } from 'react';
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { adminTabs } from '../constatnts/route';
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin.thunk";

const Link = styled(LinkComponent)`
    text-decoration:none;
    border-radius:2rem;
    padding:1rem 2rem;
    color:black;
    &:hover {
        color:rgba(0,0,0,0.54);
    }
`

const Sidebar = ({w="100%"}) =>{
    const dispatch = useDispatch();
    const location = useLocation();

    const logoutHandler = () => {
        dispatch(adminLogout());
    };

    return (
        <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
            <Typography variant='h5' textTransform={"uppercase"}>
                Chat App
            </Typography>
            <Stack spacing={"1rem"}>
                {adminTabs.map((tab)=>(
                    <Link key={tab.path} to={tab.path} sx={location.pathname === tab.path && {
                        bgcolor:"black",color:"white",":hover":{color:"white"}
                    }}>
                        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                            {tab.icon}
                            <Typography fontSize={"1.2rem"}>{tab.name}</Typography>
                        </Stack>
                    </Link>
                ))}
                <Link onClick={logoutHandler}>
                    <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                        <ExitToAppIcon/>
                        <Typography fontSize={"1.2rem"}>Logout</Typography>
                    </Stack>
                </Link>
            </Stack>
        </Stack>
    )
}

const AdminLayout = ({children}) => {

    const {isAdmin} = useSelector(state=>state.auth);
    const [isMobile,setIsMobile] = useState(false);

    const handleMobile = () => {
        setIsMobile(!isMobile);
    };

    const handleClose = () => {
        setIsMobile(false);
    };

    if(!isAdmin) return <Navigate to={"/admin"}/>

    return (
        <Grid container minHeight={"100vh"}>
            <Box sx={{display:{xs:"block",md:"none"},position:"fixed",right:"1rem",top:"1rem"}}>
                <IconButton onClick={handleMobile}>
                    {
                        isMobile ? <CloseIcon/> : <MenuIcon/>
                    }
                </IconButton>
            </Box>
            <Grid item md={4} lg={3} sx={{display:{xs:"none",md:"block"}}}>
                <Sidebar/>
            </Grid>
            <Grid item xs={12} md={8} lg={9} sx={{bgcolor:"#f5f5f5"}}>
                {children}
            </Grid>
            <Drawer open={isMobile} onClose={handleClose}>
                <Sidebar w="50vw"/>
            </Drawer>
        </Grid>
    )
}

export default AdminLayout

//wrapped components wali trick

// const AdminLayout = () => (WrappedComponents) => {
//     return (props) => {
//         return (
//             <div>
//                 Admin Layout
//                 <WrappedComponents {...props} />
//             </div>
//         )
//     }
// }
