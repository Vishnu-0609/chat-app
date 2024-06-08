import { useInputValidation } from '6pp';
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { sampleUsers } from '../constatnts/sampleData';
import UserItem from '../shared/UserItem';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNewGroup } from '../../redux/slices/misc';
import { useAvailableFriendsQuery, useCreateGroupMutation } from '../../redux/api/api';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import toast from 'react-hot-toast';
import { ALERT } from '../constatnts/events';

function NewGroup() {

  const { isNewGroup } = useSelector(state=>state.misc);
  const dispatch = useDispatch();

  const {isError,data,isLoading,error} = useAvailableFriendsQuery();
  const [createGroup] = useCreateGroupMutation();
  const [createGroupLoding,setCreateGroupLoading] = useState(false);

  useErrors([{isError,error}]);

  const groupName = useInputValidation("");
  // const [members,setMembers] = useState(sampleUsers);
  const [selectedmembers,setSelectedMembers] = useState([]);

  const selectMemeberHandler = (_id) => {
    setSelectedMembers(prev=>prev.includes(_id)? prev.filter((currentId)=>currentId!==_id) :[...prev,_id]);
  };

  const submitHandler = async () => {
    setCreateGroupLoading(true);
    let toastId = toast.loading("Creating new group...")
    if(!groupName.value) return toast.error("Group name is required")

    if(selectedmembers.length < 2) return toast.error("Please Select Atleast 3 Members");

    await createGroup({
      name:groupName.value,
      members:selectedmembers
    });
    toast.success("Group Created Successfully!",{id:toastId})
    setCreateGroupLoading(false);
    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{xs:"1rem",sm:"3rem"}} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>
          <TextField label="Group Name" value={groupName.value} onChange={groupName.changeHandler}/>
          <Typography variant='body1' justifyContent={"space-between"}>Members</Typography>
          <Stack>
            { isLoading ? <Skeleton/> :
              <>
                {
                  data?.friends && data?.friends.length > 0 && data?.friends.map((i)=>(
                    <UserItem user={i} key={i._id} handler={selectMemeberHandler} isAdded={selectedmembers.includes(i._id)}/>
                  ))
                }
              </>
            }
          </Stack>
          <Stack direction={"row"} justifyContent={"space-evenly"}>
            <Button size="large" variant='outlined' color='error' onClick={closeHandler}>Cancel</Button>
            <Button size="large" variant='contained' onClick={submitHandler} disabled={createGroupLoding}>Create</Button>
          </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup
