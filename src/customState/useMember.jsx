import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';

function useMember(){
    const [logined, setLogined] = useState(false);
    const [user,setUser]=useState({});
    const [cookie,setCookie,removeCookie] = useCookies();
    const [message,setMessage] = useState("");

    useEffect(()=>{
        if(cookie.SESSION_UID){
            axios.get(`/member/authorization`,{
                headers : {
                    "Authorization" :`${cookie.SESSION_UID}`
                }
            })
            .then(res=>{
                setUser(res.data || {});
                setLogined(true);   
                setMessage(res.data.name+"님 어서오세요");        
            }).catch(e=>{
                setMessage(e.response.data.message);
                setLogined(false);
                setUser({})
            })                
        }else{
            setUser({})
            setLogined(false);
            setMessage("로그인중이 아닙니다.");
        }

        return false;
    },[])

 

    return {
        logined,
        data : user,
        SESSION_UID : cookie.SESSION_UID,
        cookie,
        setCookie,
        removeCookie,
        message
    }
}

export default useMember;
