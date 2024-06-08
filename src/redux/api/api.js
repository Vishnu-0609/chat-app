import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { server } from "../../components/constatnts/config.js";

const api = createApi({
    reducerPath:"api",
    baseQuery:fetchBaseQuery({baseUrl:`${server}/api/v1/`}),
    tagTypes:["chat","User","ChatDetails","Groups","Friends"],
    endpoints:builder=>({
        myChats:builder.query({
            query:()=>({
                url:"chat/myChats",credentials:"include"
            }),
            providesTags:["chat"]
        }),
        searchUser:builder.query({
            query:(name)=>({
                url:`user/search?name=${name}`,credentials:"include"
            }),
            providesTags:["User"]
        }),
        sendFriendRequest:builder.mutation({
            query:(id)=>({
                url:`user/sendrequest`,
                method:"PUT",
                credentials:"include",
                body:{userId:id}
            }),
            invalidatesTags:["User"]
        }),
        getNotifications:builder.query({
            query:()=>({
                url:"user/notifications",credentials:"include"
            }),
            keepUnusedDataFor:0,
        }),
        acceptFriendRequest:builder.mutation({
            query:(data)=>({
                url:`user/acceptrequest`,
                method:"PUT",
                credentials:"include",
                body:data
            }),
            invalidatesTags:["chat","Friends"]
        }),
        chatDeatails:builder.query({
            query:({chatId,populate=false})=>{
                let url = `chat/${chatId}`;

                if(populate) url+= "?populate=true";

                return {
                    url:url,credentials:"include"
                }
            },
            providesTags:["ChatDetails"]
        }),
        getMessages:builder.query({
            query:({chatId,page=1})=>{

                const url = `chat/message/${chatId}?page=${page}`

                return {
                    url:url,
                    credentials:"include",
                }
            },
            keepUnusedDataFor:0
        }),
        sendAttachments:builder.mutation({
            query:(data)=>({
                url:"chat/message",
                method:"POST",
                credentials:"include",
                body:data
            }),
            keepUnusedDataFor:0,
        }),
        myGroups:builder.query({
            query:()=>({
                url:"chat/myGroups",
                credentials:"include",
            }),
            providesTags:["Groups"]
        }),
        availableFriends:builder.query({
            query:(chatId)=>{
                let url = "user/friends";
                if(chatId) url+=`?chatId=${chatId}`;
                return {
                    url:url,
                    credentials:"include",
                }
            },
            providesTags:["Friends"]
        }),
        createGroup:builder.mutation({
            query:({name,members})=>{
                return {
                url:`chat/newGroupChat`,
                method:"POST",
                credentials:"include",
                body:{name,members}
                }
            },
            invalidatesTags:["chat","User","Groups"]
        }),
        renameGroupName:builder.mutation({
            query:({name,chatId})=>{
                return {
                url:`chat/${chatId}`,
                method:"PUT",
                credentials:"include",
                body:{name}
                }
            },
            invalidatesTags:["Groups","ChatDetails"]
        }),
        removeMember:builder.mutation({
            query:({chatId,memberId})=>{
                return {
                    url:"chat/removemembers",
                    method:"DELETE",
                    credentials:"include",
                    body:{chatId,memberId}
                }
            },
            invalidatesTags:["Groups","ChatDetails"]
        }),
        deleteGroup:builder.mutation({
            query:(chatId)=>{
                return {
                    url:`chat/${chatId}`,
                    method:"DELETE",
                    credentials:"include",
                }
            },
            invalidatesTags:["Groups"]
        }),
        addMembers:builder.mutation({
            query:({chatId,members})=>{
                return {
                    url:"chat/addmembers",
                    method:"PUT",
                    credentials:"include",
                    body:{chatId,members}
                }
            },
            invalidatesTags:["ChatDetails"]
        }),
        leaveGroup:builder.mutation({
            query:(chatId)=>{
                return {
                    url:`chat/leave/${chatId}`,
                    method:"DELETE",
                    credentials:"include",
                }
            },
            invalidatesTags:["chat","Friends"],
        }),
        getAdminStats:builder.query({
            query:()=>({
                url:"admin/stats",
                credentials:"include"
            }),
            keepUnusedDataFor:0,
        }),
        getAllUsers:builder.query({
            query:()=>({
                url:"admin/users",
                credentials:"include"
            }),
            keepUnusedDataFor:0,
        }),
        getAllChats:builder.query({
            query:()=>({
                url:"admin/chats",
                credentials:"include"
            }),
            keepUnusedDataFor:0,
        }),
        getAllMessages:builder.query({
            query:()=>({
                url:"admin/messages",
                credentials:"include"
            }),
            keepUnusedDataFor:0,
        }),
    })
});

export default api;
export const { 
    useMyChatsQuery,
    useLazySearchUserQuery,
    useSendFriendRequestMutation,
    useGetNotificationsQuery,
    useAcceptFriendRequestMutation,
    useChatDeatailsQuery,
    useGetMessagesQuery,
    useSendAttachmentsMutation,
    useMyGroupsQuery,
    useAvailableFriendsQuery,
    useCreateGroupMutation,
    useRenameGroupNameMutation,
    useRemoveMemberMutation,
    useDeleteGroupMutation,
    useAddMembersMutation,
    useLeaveGroupMutation,
    useGetAdminStatsQuery,
    useGetAllChatsQuery,
    useGetAllMessagesQuery,
    useGetAllUsersQuery,
} = api;