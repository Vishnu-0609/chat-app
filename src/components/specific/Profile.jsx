import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react';
import { Face as FaceIcon,AlternateEmail as UserNameIcon,CalendarMonth as CalenderIcon } from '@mui/icons-material';
import moment from "moment";

function Profile() {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
        <Avatar sx={{width:200,height:200,objectFit:"contain",marginBottom:"1rem",border:"5px solid"}}/>
        <ProfileCard heading={"Bio"} text={"I am Full Stack Developer"}/>
        <ProfileCard heading={"Username"} text={"mandlesara_06"} Icon={<UserNameIcon/>}/>
        <ProfileCard heading={"Name"} text={"Vishnu Mandlesara"} Icon={<FaceIcon/>}/>
        <ProfileCard heading={"Joined"} text={moment('2024-05-12T08:07:22.974Z').fromNow()} Icon={<CalenderIcon/>}/>
    </Stack>
  )
}

const ProfileCard = ({text,Icon,heading}) => 
<Stack direction={"row"} alignItems={"center"} spacing={"1rem"} color={"white"} textAlign={"center"}>
    {Icon && Icon}
    <Stack>
        <Typography variant='body1'>{text}</Typography>
        <Typography color="gray" variant='caption'>{heading}</Typography>
    </Stack>
</Stack>

export default Profile
