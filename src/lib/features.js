import moment from "moment";
import { json } from "react-router-dom";

const fileFormat = (url="") => {
    const fileExtension = url.split(".").pop();

    if(fileExtension === "mp4" || fileExtension==="webm" || fileExtension==="ogg") 
        return "video";

    if(fileExtension === "mp3" || fileExtension==="wav") 
        return "audio";

    if(fileExtension === "png" || fileExtension==="jpg" || fileExtension==="jpeg" || fileExtension==="gif") 
        return "image";

    return "file";
};

const tranformImage = (url="",width=100) => {
    const newUrl = url.replace("upload/",`upload/dpr_auto/w_${width}/`);
    return newUrl;
}

const getLast7Days = () => {
    const currentDate = moment();
    const last7Days = [];
    for(let i=0;i<7;i++)
    {
        last7Days.unshift(currentDate.format("dddd"));
        currentDate.subtract(1,"days")
    }
    return last7Days;
};

const getOrSaveMessagesAlertInLocalStorage = ({key,value,get}) => {
    if(get)
    {
        if(localStorage.getItem(key))
        {
            return JSON.parse(localStorage.getItem(key));
        }
        else
        {
            return null;
        }
    }
    else
    {
        localStorage.setItem(key,JSON.stringify(value))
    }
}

const getorSaveNotificationsCount = ({key,value,get}) => {
    if(get)
    {
        if(localStorage.getItem(key))
        {
            return localStorage.getItem(key)
        }
        else
        {
            return null;
        }
    }
    else
    {
        localStorage.setItem(key,value)
    }
}

export {fileFormat,tranformImage,getLast7Days,
    getOrSaveMessagesAlertInLocalStorage,
    getorSaveNotificationsCount
}