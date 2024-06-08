import { Avatar, Button, Dialog, DialogTitle, ListItem, Skeleton, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { sampleNotification } from '../constatnts/sampleData';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNotification } from '../../redux/slices/misc';
import { useErrors } from "../../hooks/hook.jsx";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from '../../redux/api/api.js';
import { tranformImage } from "../../lib/features.js";
import axios from "axios";
import { server } from '../constatnts/config.js';
import toast from 'react-hot-toast';

function Notification() {

  const { isNotification } = useSelector(state=>state.misc);
  const dispatch = useDispatch();

  const {isLoading,data,error,isError} = useGetNotificationsQuery();
  const [accepRequest] = useAcceptFriendRequestMutation();

  const friendRequestHandler = async ({_id,accept}) =>
  {
    closeHandler();
    try 
    {
      const res = await accepRequest({requestId:_id,accept});
      if(res?.data?.success)
      {
        console.log("User Socket HERE");
        toast.success(res?.data?.message);
      }
      else
      {
        toast.error(res?.data?.error || "Something went wrong");
      }
    } 
    catch (error) 
    {
      toast.error("Something went wrong");
      console.log(error);
    }
  }

  useErrors([{error,isError}]);

  const closeHandler = () => dispatch(setIsNotification(false));

  

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{xs:"1rem",sm:"2rem"}} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {
          isLoading ? <Skeleton/> :
          <>
            {
              data?.allRequest.length > 0 
                ? 
                  data?.allRequest.map((i)=>(
                    <NotificationItem sender={i.sender} _id={i._id} handler={friendRequestHandler} key={i._id}/>
                  ))
                : 
                  <Typography textAlign={"center"}>No Notifications</Typography> 
            }
          </>
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
            <Avatar src={tranformImage(avatar)}/>
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
