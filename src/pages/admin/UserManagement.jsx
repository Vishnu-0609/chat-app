import { Avatar, Skeleton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Loaders from '../../components/layout/Loaders.jsx';
import Table from '../../components/shared/Table';
import { useErrors } from '../../hooks/hook.jsx';
import { tranformImage } from '../../lib/features.js';
import { useGetAllUsersQuery } from '../../redux/api/api.js';

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
    renderCell:(params)=><Avatar alt={params.row.name} src={params.row.avatar}/>
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

  const {isLoading,isError,error,data} = useGetAllUsersQuery();
  const [rows,setRows] = useState([]);

  console.log(data);

  useEffect(()=>{
    if(data)
    {
      setRows(data?.tranformedUserData.map(i=>({...i,id:i._id,avatar:tranformImage(i.avatar,50)}))); 
    }
  },[data])

  useErrors([{isError:isError,error:error}]);

  return isLoading ? <Loaders/> : (
    <AdminLayout>
      {
        isLoading ? <Skeleton height={"100vh"}/> : <>{
          rows && rows.length > 0 && <Table heading={"All User"} columns={columns} rows={rows}/>
        }</>
      }
    </AdminLayout>
  )
}

export default UserManagement
