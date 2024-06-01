import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, InputAdornment, List, ListItem, ListItemText, Stack, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import UserItem from '../shared/UserItem';
import { sampleUsers } from '../constatnts/sampleData';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSearch } from '../../redux/slices/misc';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api.js';


function Search() {

  const { isSearch } = useSelector(state=>state.misc);
  const dispatch = useDispatch();
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest] = useSendFriendRequestMutation();

  const search = useInputValidation("");
  let isLoadingFriendRequest = false;
  const [users,setUsers] = useState([]);

  const searchCloseHandler = () => dispatch(setIsSearch(false));

  const addFriendHandler = async (id) =>{
    // console.log(id);
    // try
    // {
    //   const data = await sendFriendRequest({"userId":"abdgdvdgfgfddbfd"});
    //   console.log(data);
    // }
    // catch(error)
    // {
    //   console.log(error);
    // }
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
