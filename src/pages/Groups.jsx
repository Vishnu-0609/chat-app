import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from "@mui/icons-material";
import { Backdrop, Box, Button, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from "@mui/material";
import React, { Suspense, lazy, memo, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { sampleData, sampleUsers } from "../components/constatnts/sampleData";
import AvatarCard from "../components/shared/AvatarCard.jsx";
import { Link } from "../components/styles/StyledComponents";
import UserItem from "../components/shared/UserItem.jsx";
// import ConfirmDeleteDialog from "../components/dialogs/ConfirmDeleteDialog.jsx";

const ConfirmDeleteDialog = lazy(()=>import("../components/dialogs/ConfirmDeleteDialog.jsx"));
const AddMemberDialog = lazy(()=>import("../components/dialogs/AddMemberDialog.jsx"));

function Groups() {

  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group"); 
  const [isMobileMenuOpen,setIsMobileMenuOpen] = useState(false);
  const [isEdit,setIsEdit] = useState(false);
  const [groupName,setGroupName] = useState("");
  const [groupNameUpdatedValue,setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog,setConfirmDeleteDialog] = useState(false);

  //redux
  const isAddMember = false;

  const navigateBack = () => {
    navigate("/");
  }

  const handleMobile = () => {
    setIsMobileMenuOpen(prev=>!prev);
  };

  const updateGroupNameHandler = () => {
    setIsEdit(false);
  }

  useEffect(()=>{
    if(chatId)
    {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);  
    }

    return ()=>{
      setIsEdit(false);
      setGroupName("");
      setGroupNameUpdatedValue("");
    }
  },[chatId])

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const openconfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
    
  };

  const closeconfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    
  };

  const deleteHandler = () => {
    console.log("Delete Handler");
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

  const removeMemberHandler = (id) => {
    console.log(id);
  };

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


  return (
    <Grid container height={"100vh"}>
      <Grid item sm={4} sx={{display:{xs:"none",sm:"block"}}}>
        <GroupsList myGroups={sampleData} chatId={chatId}/>
      </Grid>
      <Grid item xs={12} sm={8} sx={{display:"flex",flexDirection:"column",alignItems:"center",position:"relative",padding:"1rem 3rem"}}>
        {IconBtns}
        {groupName && (<>
          {GroupName}
          <Typography margin={"2rem"} alignSelf={"flex-start"} variant="body1">Members</Typography>
          <Stack maxWidth={"45rem"} width={"100%"} boxSizing={"border-box"} padding={{sm:"1rem",xs:"0",md:"1rem 4rem"}} spacing={"2rem"} height={"50vh"} overflow={"auto"}>
            {/* Members */}
            {
              sampleUsers.length > 0 && sampleUsers.map((i)=>(
                <UserItem key={i._id} user={i} isAdded styling={{boxShadow:"0 0 0.5rem rgba(0,0,0,0.2)",padding:"1rem 2rem",borderRadius:"1rem"}} handler={removeMemberHandler}/>
              ))
            }
          </Stack>
          {ButtonGroup}
        </>)}
      </Grid>
      {
        isAddMember && <Suspense fallback={<Backdrop open/>}><AddMemberDialog/></Suspense>
      }

      {
        confirmDeleteDialog && <Suspense fallback={<Backdrop open/>}><ConfirmDeleteDialog content={"Are you sure you want to delete this group?"} open={confirmDeleteDialog} handleClose={closeconfirmDeleteHandler} deleteHandler={deleteHandler}/></Suspense>
      }
      <Drawer sx={{display:{xs:"block",sm:"none"}}}  open={isMobileMenuOpen} onClose={handleMobileClose}>
        <GroupsList myGroups={sampleData} chatId={chatId} w={"50vw"}/>
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
