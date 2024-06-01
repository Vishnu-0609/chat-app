import React, { memo } from 'react'
import { Link } from '../styles/StyledComponents.jsx';
import { Box, Stack, Typography } from '@mui/material';
import AvatarCard from './AvatarCard.jsx';

function ChatItem({avatar=[],name,_id,groupChat=false,sameSender,isOnline,newMessageAlert,index=0,handleDeleteChat}) {
  return (
    <Link to={`/chat/${_id}`} sx={{padding:0}} onContextMenu={(e)=>handleDeleteChat(e,_id,groupChat)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1rem",backgroundColor:sameSender?"black":"unset",color:sameSender?"white":"unset",gap:"1rem",position:"relative"}}>
            <AvatarCard avatar={avatar}/>
            <Stack sx={{flexGrow:1}}>
                <Typography paddingLeft={"2rem"}>{name}</Typography>
                {
                    newMessageAlert && (
                        <Typography paddingLeft={"2rem"}>{newMessageAlert.count} New Message</Typography>
                    )
                }
            </Stack>
            {
                isOnline && <Box sx={{
                    width:"10px",
                    height:"10px",
                    borderRadius:"50%",
                    backgroundColor:"green",
                    position:"absolute",
                    top:"50%",
                    right:"1rem",
                    transform:"translateY(-50%)"
                }}/>
            }
        </div>
    </Link>
  )
}

export default memo(ChatItem);
