import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from "@mui/icons-material";
import { Backdrop, Box, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import React, { Suspense, lazy, memo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { sampleData, sampleUsers } from "../components/constatnts/sampleData";
import AvatarCard from "../components/shared/AvatarCard.jsx";
import { Link } from "../components/styles/StyledComponents";
import UserItem from "../components/shared/UserItem.jsx";
import { useAddMembersMutation, useChatDeatailsQuery , useDeleteGroupMutation, useMyGroupsQuery, useRemoveMemberMutation, useRenameGroupNameMutation } from "../redux/api/api.js";
import { useAsyncMutation, useErrors } from "../hooks/hook.jsx";
import Loader from "../components/layout/Loaders.jsx";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember, setIsDeleteMenu } from "../redux/slices/misc.js";

const ConfirmDeleteDialog = lazy(()=>import("../components/dialogs/ConfirmDeleteDialog.jsx"));
const AddMemberDialog = lazy(()=>import("../components/dialogs/AddMemberDialog.jsx"));

function Groups() {

  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group"); 
  const dispatch = useDispatch();
  const user = useSelector(state=>state?.auth?.user);
  const { isAddMember,isDeleteMenu:confirmDeleteDialog } = useSelector(state=>state.misc)

  const myGroups = useMyGroupsQuery();
  const groupDetails = useChatDeatailsQuery({chatId,populate:"true"},{skip:!chatId});

  useEffect(()=>{
    if(groupDetails?.data?.chat)
    {
      const {members} = groupDetails?.data?.chat;
      let isExists = members.map(({_id})=>{
        if(_id.toString()===user._id.toString())
          return true;
        else
          return false;
      }).includes(true)
      
      if(groupDetails.status && !isExists)
      {
        navigate("/groups");
        toast.error("You are not allowed to access this Group");
      }
    }
  },[groupDetails?.data])

  const {_id} = useSelector(state=>state?.auth?.user);

  const [renameGroupName] =  useAsyncMutation(useRenameGroupNameMutation);
  const [removeMember] = useAsyncMutation(useRemoveMemberMutation);
  const [deleteGroup] = useAsyncMutation(useDeleteGroupMutation);

  const [isMobileMenuOpen,setIsMobileMenuOpen] = useState(false);
  const [isEdit,setIsEdit] = useState(false);
  const [groupName,setGroupName] = useState("");
  const [groupNameUpdatedValue,setGroupNameUpdatedValue] = useState("");

  useEffect(()=>{
    setGroupName(groupDetails?.data?.chat?.name);
    setGroupNameUpdatedValue(groupDetails?.data?.chat?.name);

    return ()=>{
      setIsEdit(false);
      setGroupName("");
      setGroupNameUpdatedValue("");
    }
  },[groupDetails?.data])

  const errors = [
    {
      isError:myGroups.isError,
      error:myGroups.error,
    },
    {
      isError:groupDetails.isError,
      error:groupDetails.error,
    },
  ]

  useErrors(errors);

  const navigateBack = () => {
    navigate("/");
  }

  const handleMobile = () => {
    setIsMobileMenuOpen(prev=>!prev);
  };

  const updateGroupNameHandler = () => {
    renameGroupName("Updating Group Name...",{name:groupNameUpdatedValue,chatId})
  }

  const handleMobileClose = () => setIsMobileMenuOpen(false);


  // Group Deletion Functions

  const openconfirmDeleteHandler = () => {
    dispatch(setIsDeleteMenu(true));
  };

  const closeconfirmDeleteHandler = () => {
    dispatch(setIsDeleteMenu(false));
  };

  const deleteHandler = async () => {
    const data = await deleteGroup("deleting group...",chatId);
    navigate("/groups");
  };

  // Add Members function
  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const closeAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  // remove members function
  const removeMemberHandler = async (id) => {
    await removeMember("removing member...",{chatId,memberId:id});
    if(id.toString().trim() === _id.toString().trim())
      navigate("/groups");
  };

  const IconBtns = <>
    <Box sx={{display:{xs:"block",sm:"none"},position:"fixed",right:"1rem",top:"1rem"}}>
      <IconButton onClick={handleMobile}>
        <MenuIcon/>
      </IconButton>
    </Box>
    <Tooltip title="Back">
      <IconButton sx={{
        position:"absolute",
        top:"2rem",
        left:"2rem",
        bgcolor:"rgba(0,0,0,0.8)",
        color:"white",
        ":hover":{
          bgcolor:"rgba(0,0,0,0.7)"
        }
      }}
      onClick={navigateBack}
      >
        <KeyboardBackspaceIcon/>
      </IconButton>
    </Tooltip>
  </>;

  const ButtonGroup = <Stack direction={{sm:"row",xs:"column-reverse"}} spacing={"1rem"} p={{sm:"1rem",xs:"0",md:"1rem 4rem"}} paddingTop={{xs:"1rem"}}>
    <Button size="large" color="error" variant="outlined" startIcon={<DeleteIcon/>} onClick={openconfirmDeleteHandler}>DELETE GROUP</Button>
    <Button size="large" variant="contained" startIcon={<AddIcon/>} onClick={openAddMemberHandler}>ADD MEMBER</Button>
  </Stack>;

  const GroupName = <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={"1rem"} padding={"3rem"}>
      {isEdit
      ?
        (<>
          <TextField label="Group Name" value={groupNameUpdatedValue} onChange={(e)=>setGroupNameUpdatedValue(e.target.value)}/>
          <IconButton onClick={updateGroupNameHandler}><DoneIcon/></IconButton>
        </>)
      :
        (<>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton onClick={()=>setIsEdit(true)}><EditIcon/></IconButton>
        </>)
      }
  </Stack>;


  return myGroups.isLoading ? <Loader/> :(
    <Grid container height={"100vh"}>
      <Grid item sm={4} sx={{display:{xs:"none",sm:"block"}}}>
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId}/>
      </Grid>
      <Grid item xs={12} sm={8} sx={{display:"flex",flexDirection:"column",alignItems:"center",position:"relative",padding:"1rem 3rem"}}>
        {IconBtns}
        
        {groupName && chatId ? (<>
          {GroupName}
          <Typography margin={"2rem"} alignSelf={"flex-start"} variant="body1">Members</Typography>
          <Stack maxWidth={"45rem"} width={"100%"} boxSizing={"border-box"} padding={{sm:"1rem",xs:"0",md:"1rem 4rem"}} spacing={"2rem"} height={"50vh"} overflow={"auto"}>
            {
              groupDetails?.data?.chat?.members && groupDetails?.data?.chat?.members.length>0 && groupDetails?.data?.chat?.members.map((i,idx)=>(
                <UserItem key={idx} user={i} isAdded styling={{boxShadow:"0 0 0.5rem rgba(0,0,0,0.2)",padding:"1rem 2rem",borderRadius:"1rem"}} handler={removeMemberHandler}/>
              ))
            }
          </Stack>
          {ButtonGroup}
        </>) : <></>}
      </Grid>
      {
        isAddMember && <Suspense fallback={<Backdrop open/>}><AddMemberDialog open={isAddMember} chatId={chatId}/></Suspense>
      }

      {
        confirmDeleteDialog && <Suspense fallback={<Backdrop open/>}><ConfirmDeleteDialog content={"Are you sure you want to delete this group?"} open={confirmDeleteDialog} handleClose={closeconfirmDeleteHandler} deleteHandler={deleteHandler}/></Suspense>
      }
      <Drawer sx={{display:{xs:"block",sm:"none"}}}  open={isMobileMenuOpen} onClose={handleMobileClose}>
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} w={"50vw"}/>
      </Drawer>
    </Grid>
  )
};

const GroupsList = ({w="100%",myGroups=[],chatId}) => {
  return(
    <Stack bgcolor={"bisque"} height={"100vh"} sx={{overflowX:"hidden",overflowY:"auto"}}>
      { 
        myGroups.length > 0 ? (
          myGroups.map((group)=><GroupListItem group={group} chatId={chatId} key={group._id}/>)
        ) :
        <Typography textAlign={"center"} padding={"1rem"}>No Group</Typography>
      }
    </Stack>
  )
}

const GroupListItem = memo(({group,chatId}) => {
  const {name,avatar,_id} = group;

  return <Link to={`?group=${_id}`} onClick={(e)=>{if(chatId===_id) e.preventDefault()}}>
    <Stack direction={"row"} justifyContent={"space-between"} spacing={"1rem"} alignItems={"center"}>
      <AvatarCard avatar={avatar}/>
      <Typography sx={{flexGrow:1}} paddingLeft={"2rem"}>{name}</Typography>
    </Stack>
  </Link>
})

export default Groups
