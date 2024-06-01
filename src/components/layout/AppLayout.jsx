import React, { useEffect } from 'react'
import Header from './Header'
import Title from "../shared/Title.jsx";
import { Drawer, Grid, Skeleton } from '@mui/material';
import Chatlist from '../specific/Chatlist.jsx';
import { sampleData } from '../constatnts/sampleData.js';
import { useParams } from 'react-router-dom';
import Profile from '../specific/Profile.jsx';
import { useMyChatsQuery } from '../../redux/api/api.js';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile } from '../../redux/slices/misc.js';
import toast from 'react-hot-toast';
import { useErrors } from '../../hooks/hook.jsx';


const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;
    const dispatch = useDispatch();

    const { isMobile } = useSelector(state=>state.misc);

    const { isLoading,data,isError,error,refetch } = useMyChatsQuery("");

    useErrors([{isError,error}]);

    const handleDeleteChat = (e,_id,groupChat) =>
    {
        e.preventDefault();
        console.log("Delete Chat",_id,groupChat);
    }

    const handleMobileClose = () => {
        dispatch(setIsMobile(false));
    }

    return (
        <>
            <Title title="Chat App"/>
            <Header/>
            {
                isLoading ? <Skeleton/> : (
                    <Drawer open={isMobile} onClose={handleMobileClose}>
                        <Chatlist w="70vw" chats={data?.transfomedChats || []} chatId={chatId} newMessagesAlert={[{chatId,count:4}]} onlineUsers={["1","2"]} handleDeleteChat={handleDeleteChat}/>
                    </Drawer>
                )
            }
            <Grid container height={"calc(100vh - 4rem)"} >
                <Grid item sm={4} md={3} sx={{display:{xs:"none",sm:"block"}}} height={"100%"}>{isLoading ? <Skeleton/> : <Chatlist chats={data?.transfomedChats || []} chatId={chatId} newMessagesAlert={[{chatId,count:4}]} onlineUsers={["1","2"]} handleDeleteChat={handleDeleteChat}/> }</Grid>
                <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
                    <WrappedComponent {...props}/> 
                </Grid>
                <Grid item md={4} lg={3} sx={{display:{xs:"none",md:"block"},padding:"2rem",bgcolor:"rgba(0,0,0,0.85)"}} height={"100%"}>
                    <Profile/>
                </Grid>
            </Grid>
        </>
    )
  }
}

export default AppLayout
