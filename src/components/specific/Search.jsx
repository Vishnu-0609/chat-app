import { useInputValidation } from '6pp';
import { Search as SearchIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncMutation } from '../../hooks/hook.jsx';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api.js';
import { setIsSearch } from '../../redux/slices/misc';
import UserItem from '../shared/UserItem';

function Search() {

  const { isSearch } = useSelector(state=>state.misc);
  const dispatch = useDispatch();
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest,isLoadingFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);

  const search = useInputValidation("");
  const [users,setUsers] = useState([]);

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  const addFriendHandler = async (id) =>{
    const data = await sendFriendRequest("sending friend request...",id);
  }

  useEffect(()=>{
    const timeOut = setTimeout(async()=>{
      const {data} = await searchUser(search.value);
      setUsers(data?.users);
    },[200])

    return ()=>{
      clearTimeout(timeOut)
    };
  },[search.value])

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField label="" value={search.value} onChange={search.changeHandler} variant='outlined' size='small' InputProps={{startAdornment:(<InputAdornment position='start'><SearchIcon/></InputAdornment>)}}/>
        <List>
          {users.map((user)=>(
            <UserItem user={user} key={user._id} handler={addFriendHandler} handlerIsLoading={isLoadingFriendRequest}/>
          ))}
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search
