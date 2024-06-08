import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

const useErrors = (errors = []) => {
    const navigate = useNavigate();
    useEffect(()=>{
        errors.forEach(({isError,error,fallback,navigation=false,navigateUrl="/"})=>{
            if(isError)
            {
                if(fallback)
                {
                    fallback();
                }
                else
                {
                    toast.error(error?.data?.message || "Something went wrong");
                }

                if(navigation)
                    navigate(navigateUrl);
            }
        })
    },[errors])
}

const useAsyncMutation = (mutationHook) => {
    const [isLoading,setIsLoding] = useState(false);
    const [data,setData] = useState(null);
    const [mutate] = mutationHook();

    const executeMutation = async (toastMessage,...args) => {
        setIsLoding(true);
        const toastId = toast.loading(toastMessage || "Updating data...");
        try
        {
            const res = await mutate(...args);
            if(res?.data)
            {
                toast.success(res?.data?.message || "Friend Request Sent",{id:toastId});
                setData(res.data);
            }
            else
            {
                toast.error(res?.error?.data?.message || "Something went wrong",{id:toastId});
            }
        }
        catch(error)
        {
            toast.error("Something went wrong");
        }
        finally
        {
            setIsLoding(false);
        }
    }

    return [executeMutation,isLoading];
}

const useSocketEvents = (socket,handlers) => {
    useEffect(()=>{
        Object.entries(handlers).forEach(([event,handler])=>{
            socket.on(event,handler);
        })

        return ()=>{
            Object.entries(handlers).forEach(([event,handler])=>{
                socket.off(event,handler)
            })
        }
    },[socket,handlers])
}

export {useErrors,useAsyncMutation,useSocketEvents}