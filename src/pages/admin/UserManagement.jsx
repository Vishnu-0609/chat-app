import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { Avatar, Stack } from '@mui/material';
import { dashboardData } from '../../components/constatnts/sampleData';
import { tranformImage } from '../../lib/features.js';
import AvatarCard from "../../components/shared/AvatarCard.jsx";

const columns = [
  {
    field:"id",
    headerName:"ID",
    headerClassName:"table-header",
    width:200
  },
  {
    field:"avatar",
    headerName:"Avatar",
    headerClassName:"table-header",
    width:150,
    renderCell:(params)=><AvatarCard avatar={params.row.avatar}/>
  },
  {
    field:"name",
    headerName:"Name",
    headerClassName:"table-header",
    width:200
  },
  {
    field:"username",
    headerName:"Username",
    headerClassName:"table-header",
    width:200
  },
  {
    field:"friends",
    headerName:"Friends",
    headerClassName:"table-header",
    width:150
  },
  {
    field:"groups",
    headerName:"Groups",
    headerClassName:"table-header",
    width:200
  },
];

function UserManagement() {

  const [rows,setRows] = useState([]);

  useEffect(()=>{
    setRows(dashboardData.users.map(i=>({...i,id:i._id,avatar:tranformImage(i.avatar,50)})));
  },[])

  return (
    <AdminLayout>
        <Table heading={"All User"} columns={columns} rows={rows}/>
    </AdminLayout>
  )
}

export default UserManagement
