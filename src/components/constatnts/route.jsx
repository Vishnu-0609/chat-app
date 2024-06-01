import { Dashboard as DashboardIcon, Group, ManageAccounts, Message } from "@mui/icons-material";

export const adminTabs = [
    {
        name:"Dashboard",
        path:"/admin/dashboard",
        icon:<DashboardIcon/>
    },
    {
        name:"Users",
        path:"/admin/users",
        icon:<ManageAccounts/>
    },
    {
        name:"Chats",
        path:"/admin/chats",
        icon:<Group/>
    },
    {
        name:"Messages",
        path:"/admin/messages",
        icon:<Message/>
    },
]