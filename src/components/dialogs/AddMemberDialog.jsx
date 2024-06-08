import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAsyncMutation, useErrors } from '../../hooks/hook.jsx';
import { useAddMembersMutation, useAvailableFriendsQuery } from '../../redux/api/api.js';
import { setIsAddMember } from '../../redux/slices/misc.js';
import UserItem from "../shared/UserItem.jsx";

function AddMemberDialog({chatId,open}) {

    const {isError,data,isLoading,error} = useAvailableFriendsQuery();
    const [addMembers,isLoadingAddMember] = useAsyncMutation(useAddMembersMutation);
    const dispatch = useDispatch();

    const [members,setMembers] = useState([]);
    const [selectedmembers,setSelectedMembers] = useState([]);

    useEffect(()=>{
        setMembers(data?.friends);
    },[data])

    const selectMemeberHandler = (_id) => {
        setSelectedMembers(prev=>prev.includes(_id)? prev.filter((currentId)=>currentId!==_id) :[...prev,_id]);
    };

    const closeHandler = () => {
        dispatch(setIsAddMember(false));
        setMembers([]);
        setSelectedMembers([]);
    };

    const addMemberSubmitHandler = () => {
        closeHandler();
        addMembers("Adding Members...",{chatId,members:selectedmembers})
    };

    const errors = [
        {
            isError:isError,
            error:error
        },
        {
            isError:addMembers.isError,
            error:addMembers.error
        }
    ];

    useErrors(errors);

  return (
    <Dialog open={open} onClose={closeHandler}>
        <Stack p={"1rem"} width={"20rem"} spacing={"1rem"}>
            <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
            <Stack spacing={"1rem"}>
                {isLoading ? <Skeleton/> : members && members.length > 0 ? members.map(i=>(
                    <UserItem user={i} key={i._id} handler={()=>selectMemeberHandler(i._id)} isAdded={selectedmembers.includes(i._id)}/>
                ))
                :
                    <Typography textAlign={"center"}>No Friends</Typography>
                }
            </Stack>
            <Stack direction={"row"} alignItems={"center"} justifyContent={"space-evenly"}>
                <Button onClick={closeHandler} color='error'>Cancel</Button>
                <Button onClick={addMemberSubmitHandler} variant='contained' disabled={isLoadingAddMember}>Submit</Button>
            </Stack>
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog
