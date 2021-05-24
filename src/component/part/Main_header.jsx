import { useState,useEffect } from 'react';
import { BsList,BsFillBellFill } from 'react-icons/bs';
import { useHistory } from 'react-router';
import "../../css/part/Main_header.scss";
import useMember from '../../customState/useMember';
import { Link } from 'react-router-dom';

export default function Main_header(props){

    const [profileAct, setProfileAct] = useState(false);

    const onClickProfileHandler = ()=>{
        setProfileAct(!profileAct);
    }
    const history = useHistory();
    
    const {data,logined,removeCookie} = useMember();

    return(
        <>
       
        <header>
            <div className="header_s1">
                <div className="sub_menu">
                    <BsList size={30} color="#32435F" onClick={props.subMenuHandler}/>
                </div>
                <div className="logo">
                    <img src="/image/logo.png" alt="LOGO" onClick={()=>{history.push("/")}}/>
                </div>
            </div>
            <div className="user_info">
            {
                logined ? (
                    <>
                    <div className="alert"><BsFillBellFill size={25} color="#32435F"/></div>
                    <div className="user_profile" >
                        <div className="user_profile_main" onClick={onClickProfileHandler}><img src={data.avatar_url ? data.avatar_url : "/profile.png"} alt={data.name+"의 아바타"}/></div>
                        {
                            profileAct ? (
                                <div className="user_profile_detail"> 
                                <span className="btn" onClick={()=>{removeCookie("SESSION_UID",{path:"/"}); window.location.reload()}}>Log-out</span>
                                </div>
                            ) : <></>
                        }
                    </div>
                    
                    </>
                ) : (
                    <>
                    <ul>
                        <li><Link to="/login" title="로그인하기">Login</Link>  </li>
                        <li><Link to="/register" title="가입하기">Register</Link> </li>
                    </ul>
                    </>
                )
            }
     
            </div>      
        </header>
        </>
    );
    
   
}