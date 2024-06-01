import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { sampleNotification } from '../constatnts/sampleData';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotification } from '../../redux/slices/misc';

function Notification() {

  const { isNotification } = useSelector(state=>state.misc);
  const dispatch = useDispatch();

  const friendRequestHandler = ({_id,accept}) =>
  {
    
  }

  const closeHandler = () => dispatch(setIsNotification(false))

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{xs:"1rem",sm:"2rem"}} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {
          sampleNotification.length > 0 ? 
              sampleNotification.map((i)=>(
                <NotificationItem sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id}/>
              ))
           : 
              <Typography textAlign={"center"}>No Notifications</Typography>
        }
      </Stack>
    </Dialog>
  )
};

const NotificationItem = memo(({sender,_id,handler}) =>
{
  const {name,avatar} = sender;
  return (
    <ListItem>
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
            <Avatar/>
            <Typography variant='body1' sx={{flexGrow:1,display:"-webkit-box",WebkitLineClamp:1,WebkitBoxOrient:"vertical",overflow:"hidden",textOverflow:"elipsis",width:"100%"}}>{`${name} sent you a friend request.`}</Typography>
            <Stack direction={{xs:"column",sm:"row"}}>
              <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
              <Button color='error' onClick={()=>handler({_id,accept:false})}>Reject</Button>
            </Stack>
        </Stack>
    </ListItem>
  )
})

export default Notification
