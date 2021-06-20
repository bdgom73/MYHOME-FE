import { useState, useRef, useEffect } from 'react';
import { BsList,BsFillBellFill } from 'react-icons/bs';
import { useHistory } from 'react-router';

import useMember from '../../customState/useMember';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export default function Main_header(props){

    const [profileAct, setProfileAct] = useState(false);

    const onClickProfileHandler = ()=>{
        setProfileAct(!profileAct);
    }
    const history = useHistory();
    const {data,logined,removeCookie} = useMember();
    const searchRef = useRef(0);
    const [searchWord,setSearchWord] =useState([]);
    const [cookies,setCookies] = useCookies();
    const [wordFiled,setWordFiled] = useState(false);

    const onFocusHandler = (e)=>{
        searchRef.current = e.target
        setWordFiled(!wordFiled);
    }
    const onBlurHandler = ()=>{
        setWordFiled(false);
    }
    const getSearchWord = ()=>{
        if(cookies._hist){
            if(cookies._hist.indexOf("^j") !== -1){
                let word = cookies._hist.split("^j");
                setSearchWord([...word]);
            }else{
                setSearchWord([cookies._hist]);
            }
        }
    }

    useEffect(()=>{
        getSearchWord()
    },[cookies._hist])

    const saveSearchTerms = ()=>{
        let value = searchRef.current.value;
        if(cookies._hist){
            setCookies("_hist", value+"^j"+cookies._hist,{path : "/"});
        }else{
            setCookies("_hist", value ,{path : "/"});
        }
        setWordFiled(false);
        history.push(`/search?search=${searchRef.current.value}`);
    }

    return(
        <> 
        <header style={props.style}>
            <div className="header_s1">
                <div className="sub_menu">
                    <BsList size={30} onClick={props.subMenuHandler}/>
                </div>
                <div className="logo" style={{position:"relative"}} onClick={()=>{history.push("/")}} >
                    <img src="/logo.png" alt="LOGO" style={{width:"30px",position:"absolute",bottom:"0px",left:"0px"}}/>
                    <img src="/image/logo.png" alt="LOGO" style={{width:"100px",marginLeft:"15px",marginBottom:"-10px"}}/>
                </div>
            </div>
            {
                history.location.pathname !== "/" ? (
                    <div className="search" >
                        <input type="text" ref={(s)=>{searchRef.current = s}} name="search" onClick={onFocusHandler}  autocomplete="off"/>
                        <div className="search_word_list" style={{display : wordFiled ? "block" : "none"}}>
                        {
                            wordFiled ? 
                            searchWord.map((s,i)=>{
                                return (
                                    <span key={s+i} className="word" onClick={()=>{searchRef.current.value = s; onBlurHandler()}}>
                                        {s}
                                    </span>
                                )
                            }) : <></>
                        }
                        <div className="word_sub_menu">
                            <span onClick={()=>{
                                setCookies("_hist", "" ,{path : "/"});
                                setWordFiled(false);
                                setSearchWord([]);
                            }}>검색어 삭제</span>
                        </div>
                        </div>
                        <input type="button" value="검색" onClick={saveSearchTerms}/>
                    </div>
                ) :<></>
            }        
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
                                <span className="btn" onClick={()=> history.push("/myinfo")}>내정보</span>
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