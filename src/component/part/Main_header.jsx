import { useState,useEffect } from 'react';
import { BsList,BsFillBellFill } from 'react-icons/bs';
import { AiOutlineLogin } from 'react-icons/ai';
import { useHistory } from 'react-router';
import "../../css/part/Main_header.scss";
import useMember from '../../customState/useMember';
import { Link } from 'react-router-dom';

export default function Main_header(props){

    const history = useHistory();
    
    const {data,logined} = useMember();

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
                    <div className="user_profile">{data.avatar_url ? <img src={data.avatar_url} alt={data.name+"의 아바타"}/> : data.name}</div>
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