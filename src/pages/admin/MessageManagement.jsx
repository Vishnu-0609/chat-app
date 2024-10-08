import { Avatar, Skeleton, Stack } from '@mui/material';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import RenderAttachment from "../../components/shared/RenderAttachment.jsx";
import Table from '../../components/shared/Table';
import { useErrors } from '../../hooks/hook.jsx';
import { fileFormat, tranformImage } from '../../lib/features.js';
import { useGetAllMessagesQuery } from '../../redux/api/api.js';

const columns = [
  {
    field:"id",
    headerName:"ID",
    headerClassName:"table-header",
    width:200
  },
  {
    field:"attachments",
    headerName:"Attachments",
    headerClassName:"table-header",
    width:200,
    renderCell:(params)=>{
      const {attachments} = params.row;
      return attachments?.length > 0 ? attachments.map((i)=>{
        const url = i.url;
        const file = fileFormat(url);
        return <a href={url} download target='_blank' style={{color:"black",overflow:"hidden",display:"flex",paddingTop:"1.5rem"}}>{RenderAttachment(file,url)}</a>
      }) :"No Attachments";
    }
  },
  {
    field:"content",
    headerName:"Content",
    headerClassName:"table-header",
    width:400
  },
  {
    field:"sender",
    headerName:"Sent By",
    headerClassName:"table-header",
    width:200,
    renderCell:(params)=>(
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar}/>
        <span>{params.row.sender.name}</span>
      </Stack>
    )
  },
  {
    field:"chat",
    headerName:"Chat",
    headerClassName:"table-header",
    width:220
  },
  {
    field:"groupChat",
    headerName:"Group Chat",
    headerClassName:"table-header",
    width:100
  },
  {
    field:"createdAt",
    headerName:"Time",
    headerClassName:"table-header",
    width:250
  },
];

function MessageManagement() {

  const {isLoading,isError,error,data} = useGetAllMessagesQuery();
  const [rows,setRows] = useState([]);

  useEffect(()=>{
    setRows(data?.transformedMessagesData.map((i)=>({
      ...i,
      id:i._id,
      sender:{
        name:i.sender.name,
        avatar:tranformImage(i.sender.avatar,50)
      },
      createdAt:moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
    })));
  },[data])

  useErrors([{isError:isError,error:error}]);

  return (
    <AdminLayout>
      {
        isLoading ? <Skeleton height={"100vh"}/> : <>{
          rows && rows.length > 0 && <Table heading={"All Messages"} columns={columns} rows={rows} rowHeight={200}/>
        }</>
      }
    </AdminLayout>
  )
}

export default MessageManagement
