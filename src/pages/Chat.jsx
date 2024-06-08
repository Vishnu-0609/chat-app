import React, { useCallback, useEffect, useRef, useState } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Skeleton, Stack } from '@mui/material';
import { grayColor, orange } from '../components/constatnts/color';
import { AttachFile, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../components/dialogs/FileMenu';
import { sampleMessage } from '../components/constatnts/sampleData';
import MessageComponent from '../components/shared/MessageComponent';
import { getSocket } from '../Socket.jsx';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, START_TYPING, STOP_TYPING } from '../components/constatnts/events.js';
import { useChatDeatailsQuery, useGetMessagesQuery } from '../redux/api/api.js';
import { useDispatch, useSelector } from 'react-redux';
import { useErrors, useSocketEvents } from '../hooks/hook.jsx';
import { useInfiniteScrollTop } from "6pp";
import { setIsFileMenu } from '../redux/slices/misc.js';
import { removeNewMessagesAlert } from '../redux/slices/chat.js';
import { TypingLoader } from '../components/layout/Loaders.jsx';
import { useNavigate } from 'react-router-dom';

function Chat({chatId}) {

  let allMessages = [];
  const containedRef = useRef(null);
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {user} = useSelector(state=>state?.auth);

  const [page,setPage] = useState(1);
  const [messages,setMessages] = useState([]);

  const [IamTyping,setIamTyping] = useState(false);
  const [userTyping,setUserTyping] = useState(false);
  const typingTimeOut = useRef(null);

  const [message,setMessage] = useState("");    // input field variable
  const [fileMenuAnchor,setFileMenuAnchor] = useState(null);

  const bottomRef = useRef(null);

  // rtk query
  const chatDetails = useChatDeatailsQuery({chatId,skip:!chatId});

  // get all messages from database of specified chatID and use rtk query
  const oldMessageChunk = useGetMessagesQuery({chatId,page});

  // use 6pp infinite scrolling
  // in this cache data remain present so when reload data i want to empty
  const {data:oldMessages,setData:setOldMessages} = useInfiniteScrollTop(containedRef,oldMessageChunk?.data?.totalPages,page,setPage,oldMessageChunk?.data?.messages);

  // get all members of specified chat
  const members = chatDetails?.data?.chat?.members;

  useEffect(()=>{
    socket.emit(CHAT_JOINED,{userId:user._id,members})
    dispatch(removeNewMessagesAlert(chatId));
    return ()=>{
      setOldMessages([]);
      setPage(1);
      setMessages([]);
      setMessage("");
      socket.emit(CHAT_LEAVED,{userId:user._id,members})
    }
  },[chatId])

  useEffect(()=>{
    if(bottomRef.current)
      bottomRef.current.scrollIntoView({behavior:"smooth"});
  },[messages,userTyping]);

  const errors = [{isError:chatDetails.isError,error:chatDetails.error,navigation:true},{isError:oldMessageChunk.isError,error:oldMessageChunk.error}];

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if(!message.trim())
      return;
    
    // Emiting Message to the server
    socket.emit(NEW_MESSAGE,{chatId,members,message});
    setMessage([]);
  }

  const newMessageHandler = useCallback((data)=>{
    // console.log(data);
    if(data.chatId !== chatId) return;
    setMessages(prev=>[...prev,data?.message]);
  },[chatId])

  const startTypingListener = useCallback((data)=>{
    if(data.chatId !== chatId) return;
    setUserTyping(true);
  },[chatId])

  const stopTypingListener = useCallback((data)=>{
    if(data.chatId !== chatId) return;
    setUserTyping(false);
  },[chatId])

  const alertListener = useCallback((data)=>{
    if(data.chatId.toString()!==chatId) return;
    const messageForAlert = {
      content:data?.message,
      sender:{
          _id:"avvsgdsgss",
          name:"Admin"
      },
      chat:chatId,
      createdAt:new Date().toISOString(),
    };
    setMessages(prev=>[...prev,messageForAlert]);
  },[chatId]);

  const onChangeHandler = (e) => {
    setMessage(e.target.value);

    if(!IamTyping)
    {
      socket.emit(START_TYPING,{members,chatId});
      setIamTyping(true);
    }

    if(typingTimeOut.current) clearTimeout(typingTimeOut.current);

    typingTimeOut.current = setTimeout(()=>{
      socket.emit(STOP_TYPING,{members,chatId});
      setIamTyping(false);
    },[2000])
  }

  const eventHandlers = {[NEW_MESSAGE]:newMessageHandler,[START_TYPING]:startTypingListener,[STOP_TYPING]:stopTypingListener,[ALERT]:alertListener};

  useSocketEvents(socket,eventHandlers);

  useErrors(errors);

  allMessages = [...oldMessages,...messages];

  return chatDetails.isLoading ? <Skeleton/> : (
    <>
      <Stack ref={containedRef} boxSizing={"border-box"} padding={"1rem"} spacing={"1rem"} bgcolor={grayColor} height={"90%"} sx={{overflowX:"hiden",overflowY:"auto"}}>
        {
          allMessages && allMessages.length > 0 && allMessages.map((i)=>(
            <MessageComponent key={i._id} message={i} user={user}/>
          ))
        }
          {userTyping && <TypingLoader/>}
        <div ref={bottomRef}/>
      </Stack>
      <form style={{height:"10%"}} onSubmit={submitHandler}>
        <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}>
          <IconButton sx={{position:"absolute",left:"1.5rem",rotate:"30deg"}} onClick={handleFileOpen}>
            <AttachFile/>
          </IconButton>
          <InputBox placeholder='Type Messages Here...' value={message} onChange={(e)=>onChangeHandler(e)}/>
          <IconButton type='submit' sx={{rotate:"-30deg",backgroundColor:orange,color:"white",marginLeft:"0.5rem","&:hover":{bgcolor:"error.dark"}}}>
            <SendIcon/>
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchor={fileMenuAnchor} chatId={chatId}/>
    </>
  )
}

export default AppLayout()(Chat);
