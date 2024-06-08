import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/slices/misc';
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDeleteGroupMutation, useLeaveGroupMutation } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hook';

function DeleteChatMenu({dispatch,deleteOptionAnchor}) {

    const navigate = useNavigate();
    const { isDeleteMenu,selectedDeleteChat } = useSelector(state=>state.misc);

    const [deleteChat,_,deleteChatData] = useAsyncMutation(useDeleteGroupMutation);
    const [leaveGroup,__,leaveGroupData] = useAsyncMutation(useLeaveGroupMutation);

    const isGroup = selectedDeleteChat.groupChat;

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false));
        deleteOptionAnchor.current = null;
    }

    const leaveGroupHandler = () => {
        closeHandler();
        leaveGroup("Leaving Group...",selectedDeleteChat.chatId);
        navigate("/");
    };

    const deleteChatHandler = () => {
        closeHandler();
        deleteChat("Deleting Chat...",selectedDeleteChat.chatId);
        navigate("/");
    };

    useEffect(()=>{
        if(deleteChatData || leaveGroupData) navigate("/")
    },[deleteChatData,leaveGroup])

    const errors = [{isError:deleteChat.isError,error:deleteChat.error},{isError:leaveGroup.isError,error:leaveGroup.error}];

    useErrors(errors);

  return (
    <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteOptionAnchor.current} anchorOrigin={{vertical:"bottom",horizontal:"right"}} transformOrigin={{vertical:"center",horizontal:"center"}}>
        <Stack sx={{width:"10rem",padding:"0.5rem",cursor:"pointer"}} direction={"row"} alignItems={"center"} spacing={"0.5rem"} onClick={isGroup?leaveGroupHandler:deleteChatHandler}>
            {
                isGroup?(<><ExitToAppIcon/><Typography>Leave Group</Typography></>):(<><DeleteIcon/><Typography>Delete Chat</Typography></>)
            }
        </Stack>
    </Menu>
  )
}

export default DeleteChatMenu
