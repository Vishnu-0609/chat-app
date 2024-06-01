import moment from "moment";

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
    return url;
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

export {fileFormat,tranformImage,getLast7Days}