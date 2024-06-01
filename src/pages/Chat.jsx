import React, { useRef } from 'react'
import AppLayout from '../components/layout/AppLayout'
import { IconButton, Stack } from '@mui/material';
import { grayColor, orange } from '../components/constatnts/color';
import { AttachFile, Send as SendIcon } from '@mui/icons-material';
import { InputBox } from '../components/styles/StyledComponents';
import FileMenu from '../components/dialogs/FileMenu';
import { sampleMessage } from '../components/constatnts/sampleData';
import MessageComponent from '../components/shared/MessageComponent';

const user = {
    _id:"abcde",
    name:"Vishnu Mandlesara"
}

function Chat() {

  const containedRef = useRef(null);

  return (
    <>
      <Stack ref={containedRef} boxSizing={"border-box"} padding={"1rem"} spacing={"1rem"} bgcolor={grayColor} height={"90%"} sx={{overflowX:"hiden",overflowY:"auto"}}>
        {/* Messages Render */}
        {
          sampleMessage.map((i)=>(
            <MessageComponent key={i._id} message={i} user={user}/>
          ))
        }
      </Stack>
      <form style={{height:"10%"}}>
        <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}>
          <IconButton sx={{position:"absolute",left:"1.5rem",rotate:"30deg"}}>
            <AttachFile/>
          </IconButton>
          <InputBox placeholder='Type Messages Here...'/>
          <IconButton type='submit' sx={{rotate:"-30deg",backgroundColor:orange,color:"white",marginLeft:"0.5rem","&:hover":{bgcolor:"error.dark"}}}>
            <SendIcon/>
          </IconButton>
        </Stack>
      </form>
      <FileMenu/>
    </>
  )
}

export default AppLayout()(Chat);
