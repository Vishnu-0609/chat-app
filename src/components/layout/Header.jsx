import { AppBar, Backdrop, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import React, { Suspense, lazy, useState } from 'react'
import { orange } from '../constatnts/color.js';
import {Add, Group, Logout, Menu as MenuIcon,Search as SearchIcon,Notifications} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { server } from '../constatnts/config.js';
import { userNotExists } from '../../redux/slices/auth.js';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile, setIsNewGroup, setIsNotification, setIsSearch } from '../../redux/slices/misc.js';

const SearchDialog = lazy(()=>import("../specific/Search.jsx"));
const NotificationDialog = lazy(()=>import("../specific/Notification.jsx"));
const NewGroupDialog = lazy(()=>import("../specific/NewGroup.jsx"));

function Header() {

    const navigate = useNavigate();

    const { isNotification,isNewGroup,isSearch } = useSelector(state=>state.misc);

    const dispatch = useDispatch();

    const handleMobile = () =>
    {
        dispatch(setIsMobile(true))
    }

    const openSearchDialog = () =>
    {
        dispatch(setIsSearch(true))
    }

    const openNewGroup = () => {
        dispatch(setIsNewGroup(true))
    }

    const navigateToGroup = () =>{
        navigate("/groups");
    }

    const logoutHandler = async() =>{
        try 
        {
            const {data} = await axios.get(`${server}/api/v1/user/logout`,{
                withCredentials:true,
            })
            dispatch(userNotExists());
            toast.success("User Logout Successfully!");
        } 
        catch (error) 
        {
            toast.error(error?.response?.data?.message || "Something Went Wrong");
        }
    }

    const openNotification = () => {
        dispatch(setIsNotification(true))
    }

  return (
    <>
        <Box sx={{flexGrow:1}} height={"4rem"}>
            <AppBar position='static' sx={{bgcolor:orange}}>
                <Toolbar>
                    <Typography variant={"h6"} sx={{display:{xs:"none",sm:"block"}}}>
                        Whatsapp
                    </Typography>
                    <Box sx={{display:{xs:"block",sm:"none"}}}>
                        <IconButton color='inherit' onClick={handleMobile}>
                            <MenuIcon/>
                        </IconButton>
                    </Box>
                    <Box sx={{flexGrow:1}}/>
                    <Box>
                        <Tooltip title="Search">
                            <IconButton color='inherit' size="large" onClick={openSearchDialog}>
                                <SearchIcon/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="New Group">
                            <IconButton color='inherit' size="large" onClick={openNewGroup}>
                                <Add/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Manage Group">
                            <IconButton color='inherit' size="large" onClick={navigateToGroup}>
                                <Group/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Notifications">
                            <IconButton color='inherit' size="large" onClick={openNotification}>
                                <Notifications/>
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Logout">
                            <IconButton color='inherit' size="large" onClick={logoutHandler}>
                                <Logout/>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>

        {isSearch && (
            <Suspense fallback={<Backdrop open/>}>
                <SearchDialog/>
            </Suspense>
        )}

        {isNotification && (
            <Suspense fallback={<Backdrop open/>}>
                <NotificationDialog/>
            </Suspense>
        )}

        {isNewGroup && (
            <Suspense fallback={<Backdrop open/>}>
                <NewGroupDialog/>
            </Suspense>
        )}
    </>
  )
}

export default Header
