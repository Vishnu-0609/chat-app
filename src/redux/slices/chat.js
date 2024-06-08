import { createSlice } from "@reduxjs/toolkit";
import { getOrSaveMessagesAlertInLocalStorage, getorSaveNotificationsCount } from "../../lib/features";
import { NEW_MESSAGE_ALERT, NEW_REQUEST } from "../../components/constatnts/events";

const initialState = {
    notificationCount:getorSaveNotificationsCount({key:NEW_REQUEST,get:true}) ||null,
    newMessagesAlert:getOrSaveMessagesAlertInLocalStorage({key:NEW_MESSAGE_ALERT,get:true}) || [{
        chatId:"",
        count:0
    }]
};

const chatSlice = createSlice({
    name:"chat",
    initialState,
    reducers:{
        incrementNotificationCount:(state) => {
            state.notificationCount += 1;
        },
        resetNoficationCount:(state) => {
            state.notificationCount = 0;
        },
        setNewMessagesAlert:(state,action)=>{
            const index = state.newMessagesAlert.findIndex(item=>item.chatId === action.payload.chatId);
            if(index !== -1)
                state.newMessagesAlert[index].count += 1;
            else
                state.newMessagesAlert.push({
                    chatId:action.payload.chatId,
                    count:1,
                });
        },
        removeNewMessagesAlert:(state,action)=>{
            state.newMessagesAlert = state.newMessagesAlert.filter((item)=>item.chatId !== action.payload)
        }
    }
})

export const {
    incrementNotificationCount,
    resetNoficationCount,
    setNewMessagesAlert,
    removeNewMessagesAlert
} = chatSlice.actions;
export default chatSlice.reducer