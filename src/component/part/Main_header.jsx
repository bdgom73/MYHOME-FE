import { useState,useEffect, useRef } from 'react';
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
    const searchRef = useRef(0);

    const onFocusHandler = (e)=>{
        searchRef.current = e.target
    }
    
    return(
        <>
       
        <header>
            <div className="header_s1">
                <div className="sub_menu">
                    <BsList size={30} onClick={props.subMenuHandler}/>
                </div>
                <div className="logo">
                    <img src="/image/logo.png" alt="LOGO" onClick={()=>{history.push("/")}}/>
                </div>
            </div>
            <div className="search">
                <input type="text" name="search" onFocus={onFocusHandler}/>
                <input type="button" value="검색" onClick={()=>{console.log(searchRef.current.value)}}/>
            </div>
            <div className="user_info">
            {
                logined ? (
                    <>
                    <div className="alert"><BsFillBellFill size={25} color="#fff"/></div>
                    <div className="user_profile" >
                        <div className="user_profile_main" onClick={onClickProfileHandler}><img src={data.avatar_url ? data.avatar_url : "/profile.png"} alt={data.name+"의 아바타"}/></div>
                        {
                            profileAct ? (
                                <div className="user_profile_detail"> 
                                <userinfo>
                                    <uc>
                                        <uh>이름</uh>
                                        <ub title={data.name}>{data.name}</ub>
                                    </uc>
                                    <uc>
                                        <uh>별명</uh>
                                        <ub title={data.nickname}>{data.nickname}</ub>
                                    </uc>
                                    <uc>
                                        <uh>이메일</uh>
                                        <ub title={data.email}>{data.email}</ub>
                                    </uc>
                                </userinfo>
                                <div style={{display:"flex",justifyContent:"space-between"}}>
                                <span className="btn ">내정보</span>
                                <span className="btn logout" onClick={()=>{removeCookie("SESSION_UID",{path:"/"}); window.location.reload()}}>Logout</span> 
                                </div>
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