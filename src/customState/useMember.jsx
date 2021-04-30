import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';

async function useMember(){
    const [logined, setLogined] = useState(false);
    const [user,setUser]=useState({});
    const [cookie,setCookie,removeCookie] = useCookies();
  
    useEffect(()=>{
        authorization();
        return;
    },[logined])

    function authorization(){
        if(cookie.SESSION_UID){
            axios.post(`/member/authorization?sessionUID=${cookie.SESSION_UID}`)
                .then(res=>{
                    setUser(res.data || {msg : "로그인중이 아닙니다."});
                })
                .catch(e=>{
                    console.log(e.response)
                })     
        }
    }

    return {
        logined,
        data : user,
        SESSION_UID : cookie.SESSION_UID,
        setCookie,
        removeCookie
    }
}