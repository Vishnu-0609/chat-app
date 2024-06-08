import { Drawer, Grid, Skeleton } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSocket } from '../../Socket.jsx';
import { useErrors, useSocketEvents } from '../../hooks/hook.jsx';
import { getOrSaveMessagesAlertInLocalStorage } from '../../lib/features.js';
import { useMyChatsQuery } from '../../redux/api/api.js';
import { incrementNotificationCount, setNewMessagesAlert } from '../../redux/slices/chat.js';
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/slices/misc.js';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USERS, REFETCH_CHATS } from '../constatnts/events.js';
import DeleteChatMenu from '../dialogs/DeleteChatMenu.jsx';
import Title from "../shared/Title.jsx";
import Chatlist from '../specific/Chatlist.jsx';
import Profile from '../specific/Profile.jsx';
import Header from './Header';

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const socket = getSocket();
    const params = useParams();
    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [onlineUsers,setOnlineUsers] = useState([]);

    const { isMobile } = useSelector(state=>state.misc);
    const { user } = useSelector(state=>state.auth);
    const { newMessagesAlert } = useSelector(state=>state.chat);

    const { isLoading,data,isError,error,refetch } = useMyChatsQuery("");

    const newMessageAlertHandler = useCallback((data)=>{
        if(data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
    },[chatId])

    useEffect(()=>{
        getOrSaveMessagesAlertInLocalStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert});
    },[newMessagesAlert])

    const newRequest = useCallback(()=>{
        dispatch(incrementNotificationCount())
    },[dispatch])

    const OnlineUsersListener = useCallback((data)=>{
        setOnlineUsers(data);
    },[])

    const refetchHandler = useCallback(()=>{
        refetch();
        navigate("/");
    },[dispatch])

    const eventHandlers = {[NEW_MESSAGE_ALERT]:newMessageAlertHandler,[NEW_REQUEST]:newRequest,[REFETCH_CHATS]:refetchHandler,[ONLINE_USERS]:OnlineUsersListener};

    useSocketEvents(socket,eventHandlers);

    useErrors([{isError,error}]);

    const handleDeleteChat = (e,chatId,groupChat) =>
    {
        dispatch(setIsDeleteMenu(true));
        dispatch(setSelectedDeleteChat({chatId,groupChat}));
        deleteMenuAnchor.current = e.currentTarget;
        e.preventDefault();
    }

    const handleMobileClose = () => {
        dispatch(setIsMobile(false));
    }

    return (
        <>
            <Title title="Chat App"/>
            <Header/>
            <DeleteChatMenu dispatch={dispatch} deleteOptionAnchor={deleteMenuAnchor}/>
            {
                isLoading ? <Skeleton/> : (
                    <Drawer open={isMobile} onClose={handleMobileClose}>
                        <Chatlist w="70vw" chats={data?.transfomedChats || []} chatId={chatId} newMessagesAlert={newMessagesAlert} onlineUsers={onlineUsers} handleDeleteChat={handleDeleteChat}/>
                    </Drawer>
                )
            }
            <Grid container height={"calc(100vh - 4rem)"} >
                <Grid item sm={4} md={3} sx={{display:{xs:"none",sm:"block"}}} height={"100%"}>{isLoading ? <Skeleton/> : <Chatlist chats={data?.transfomedChats || []} chatId={chatId} newMessagesAlert={newMessagesAlert} onlineUsers={onlineUsers} handleDeleteChat={handleDeleteChat}/> }</Grid>
                <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
                    <WrappedComponent {...props} chatId={chatId}/> 
                </Grid>
                <Grid item md={4} lg={3} sx={{display:{xs:"none",md:"block"},padding:"2rem",bgcolor:"rgba(0,0,0,0.85)"}} height={"100%"}>
                    {
                        user && <Profile user={user}/>
                    }
                </Grid>
            </Grid>
        </>
    )
  }
}

export default AppLayout
