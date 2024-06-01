import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import React,{ useState } from 'react'
import { sampleUsers } from '../constatnts/sampleData';
import UserItem from "../shared/UserItem.jsx";

function AddMemberDialog({addMember,isLoadingAddMember,chatId}) {

    const [members,setMembers] = useState(sampleUsers);
    const [selectedmembers,setSelectedMembers] = useState([]);

    const selectMemeberHandler = (_id) => {
        setSelectedMembers(prev=>prev.includes(_id)? prev.filter((currentId)=>currentId!==_id) :[...prev,_id]);
    };

    const closeHandler = () => {
        setMembers([]);
        setSelectedMembers([]);
    };

    const addMemberSubmitHandler = () => {
        closeHandler();
    };

  return (
    <Dialog open onClose={closeHandler}>
        <Stack p={"1rem"} width={"20rem"} spacing={"1rem"}>
            <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
            <Stack spacing={"1rem"}>
                {members.length > 0 ? members.map(i=>(
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
