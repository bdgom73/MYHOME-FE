import { ImKey } from 'react-icons/im';
import "../../../css/myinfo/myinfo.scss";
import { RiGitRepositoryPrivateFill } from 'react-icons/ri';
import { CgPassword,CgProfile } from 'react-icons/cg';
import { HiStatusOnline } from 'react-icons/hi';
import { AiOutlineClear } from 'react-icons/ai';
import { IoIosArrowDown,IoIosArrowUp } from 'react-icons/io';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import InfoDetail from './InfoDetail';
import InfoDetailTitle from './InfoDetailTitle';
import InfoDetailBody from './InfoDetailBody';
import moment from 'moment';
import useMember from '../../../customState/useMember';
import Mainheader from '../../part/Main_header';
import Mainside from '../../part/Main_side';
import DaumPostcode from 'react-daum-postcode';
import useModal from "../../../customState/useModal";
import Modal from '../../modal/modal';
import useTitle from '../../../customState/useTitle';
import {FaComments,FaChalkboardTeacher, FaChalkboard, FaVideo } from 'react-icons/fa';
import { MdPhoto } from 'react-icons/md';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import BoardTable from '../../part/write/BoardTable';
export default function Myinfo(props){

    useTitle("MYDOMUS | ME")
    const history = useHistory();

    const {setModal, close , modal} = useModal();

    const {logined,SESSION_UID,data} = useMember();
    const [selected,setSelected] = useState("id");
    
    const privateInit = {
        ID : "MyDOMUS 고유 ID",
        hide : true
    }
    const [privateID, setPrivateID] = useState(privateInit);

    const [privateInfoIsUpdate, setPrivateInfoIsUpdate ]= useState(false);

    const [nickname,setNickname] = useState("");
    const [address,setAddress] = useState(data.address);
    const [zipcode,setZipcode] = useState(data.zipcode);
    const [detail_address,setDetail_address] = useState(data.detail_address);
    const [avatar,setAavtar] = useState(data.avatar_url);
    const [currentAvatar,setCurrentAvatar] = useState(data.avatar_url);
    const [isduplicateNickname,setIsDuplicateNickname] = useState(false);

    // 내가 쓴 댓글 , 게시글 
    const [comments, setComments] = useState([]);
    const [commentsCount,setCommentsCount] = useState(0);
    const [cpage,setCpage] = useState(0);
    const [ctotal,setCtotal] = useState(0);
    const [board,setBoard] = useState([]);
    const [boardCount,setBoardCount] = useState(0);
    const [bpage,setBpage] = useState(0);
    const [btotal,setBtotal] = useState(0);
    const [cloading,setCLoading] = useState(false);
    const [bloading,setBLoading] = useState(false);

    // 자기소개글 
    const [isIntroduceUpdate, setIsIntroduceUpdate] = useState(false);

    // 로그인 로그
    const [log,setLog] = useState([]);

    // 카테고리
    const [category,setCategory] = useState("all");

    // 모바일 화면
    const [mini,setMini] = useState(document.body.clientWidth); 
    const [subList,setSubList] = useState(false);

    function onComplete(data){
        setZipcode(data.zonecode);
        setAddress(data.address);
        close();
    }

    const modalActive = ()=>{
        if(modal === 1){
            return (
                <Modal title="주소검색" close={close} >
                    <DaumPostcode onComplete={onComplete}/>
                </Modal>)
        }else if(modal === 2){
            return (
                <Modal title="비밀번호변경" close={close} >
                     <p className="info">
                        <ul>
                            <li>비밀번호는 <font color="#fa5656">영문,숫자,특수문자(필1)로</font> 이루어진 <font color="#fa5656">10자리 이상</font>으로 설정가능합니다.</li>
                            <li><font color="#fa5656">연속된</font> 숫자,문자등 사용 자제하기</li>
                            <li>본인과 관련된 <font color="#fa5656">(생일, 이름 이니셜 등)</font> 사용자제하기</li>
                        </ul>
                        <div className="label_wrap" style={{borderTop:"1px solid #eee", padding:"10px"}}>
                            <label style={{fontSize : "18px"}}>변경할 Password</label>
                            <input type="password" className="basic" placeholder="변경할 비밀번호를 입력해주세요" id="myinfo_changed_password"/>
                           
                        </div>    
                    </p> 
                    <div id="myinfo_change_pw_msg"></div>
                    <div className="btn_wrap">
                        <button type="button" className="btn" onClick={()=>{
                            const msg = document.getElementById("myinfo_change_pw_msg");
                            const current_password = document.getElementById("myinfo_password");
                            const changed_password = document.getElementById("myinfo_changed_password");
                            if(changed_password.value === ""){
                                    changed_password.focus();
                                    msg.innerText="변경할 비밀번호를 입력해주세요.";
                                    msg.classList.add("error");
                                    msg.classList.remove("success");
                                    return;
                            }
                            let passwordRegExp = /^[a-zA-Z0-9\d~!@#$%^&*]{10,}$/;  
                            if(changed_password.value.match(passwordRegExp) === null){
                                msg.innerText = "비밀번호 길이는 10자리이상 영문자,숫자, 특수문자(필1) 로 설정해주세요.";
                                msg.classList.add("error");
                                msg.classList.remove("success");
                                changed_password.focus();
                                return;
                            }
                            const fd = new FormData();
                            fd.append("current_password",current_password.value);
                            fd.append("password",changed_password.value);
                            axios.post("/myApi/member/change/password",fd,{headers:{"Authorization":SESSION_UID}})
                                .then(res=>{
                                    alert("비밀번호 변경이 완료되었습니다.")
                                    current_password.value="";
                                    close();
                                }).catch(e=>console.log(e.response))
                        }}>변경하기</button>
                    </div>
                </Modal>)
        }
    }

    useEffect(()=>{
        setNickname(data.nickname);
        setAddress(data.address);
        setZipcode(data.zipcode);
        setDetail_address(data.detail_address);
        setAavtar(data.avatar_url);
        setCurrentAvatar(data.avatar_url);
    },[data])

    const onChangePrivateInfo = (e, type)=>{
        if(privateInfoIsUpdate){
            switch(type){
                case "nickname" :
                    setNickname(e.target.value);
                    break;
                case "address" :
                    setAddress(e.target.value);
                    break;
                case "zipcode" :
                    setZipcode(e.target.value);
                    break;
                case "detail_address" : 
                    setDetail_address(e.target.value);
                    break;
                default :
                    new Error(type+" is undefined type");
                    break;
            }
        }
    }

    useEffect(()=>{
        if(!logined && !SESSION_UID){    
            history.push("/login");
        }  
    })
    
    const [subMenu, setSubMenu] = useState(false); 
     // 서브메뉴 ON/OFF
     const subMenuHandler = ()=>{
        setSubMenu(!subMenu);   
        const body = document.body;
        if(subMenu){
            body.style.overflowY="hidden";
            body.style.backgroundColor="rgba(0,0,0,0.55)";
        }else{
            body.style.overflowY="auto";
            body.style.backgroundColor="#fff";
        } 
    }

    useEffect(()=>{
        if(data.nickname){   
            getMemberBoardData(0);
            getMemberCommentsData(0);
            getLoginLogData();
        }
    },[data]);

    function getMemberBoardData(page){
        setBoard([]);
        const fd = new FormData();
        fd.append("nickname",data.nickname);
        axios.post(`/myApi/bbs/nickname/member/get?page=${page}&size=10`,fd)
        .then(res=>{
            const result = res.data;
            setBoard(result.content || []);
            setBoardCount(result.totalElements || 0);
            setBpage(0);
            setBtotal(result.totalPages);
        }).catch(e=> console.log(e.response));
    }
    function getMemberCommentsData(page){
        setComments([]);
        const fd = new FormData();
        fd.append("nickname",data.nickname);
        axios.post(`/myApi/comments/nickname/get?page=${page}&size=10`,fd)
        .then(res=>{
            const result = res.data;
            console.log(result);
            setComments(result.content || []);
            setCommentsCount(result.totalElements || 0);
            setCpage(0);
            setCtotal(result.totalPages);
        })
    }
    function getLoginLogData(){       
        axios.get("/log/login/top=30",{"headers":{"Authorization" : SESSION_UID}})
            .then(res=>{
                setLog(res.data);
            }).catch(e=>console.log(e.response.data))
    }

    function duplicateNickname(){
        axios.get(`/myApi/member/duplicate/nickname=${nickname}`)
        .then(res=>{}).catch(e=>{})
    }
    function onUpdateHandler(){
        const fd = new FormData();
        fd.append("nickname",nickname);
        fd.append("address",address);
        fd.append("zipcode",zipcode);
        fd.append("detail_address",detail_address);
        axios.put(`/myApi/member/update`,fd,{"headers" : {"Authorization" : SESSION_UID}})
        .then(res=> {
            if(res.status === 200) {
                setPrivateInfoIsUpdate(false);
            }
        }).catch(e=>{alert(e.response.data.message ? e.response.data.message : "정보 변경에 실패했습니다."); 
            setNickname(data.nickname);
            setAddress(data.address);
            setZipcode(data.zipcode);
            setDetail_address(data.detail_address);     
        })
    }

    function resizeEventHandler(){
        const width = document.body.clientWidth;
        setMini(width);
        if(width >= 810) setSubList(false);
    }

    useEffect(()=>{
        window.addEventListener("resize",resizeEventHandler);
        return ()=>{
            window.removeEventListener("resize",resizeEventHandler);
        }
    })

    return(
        <>
        {modalActive()}    
        <Mainheader subMenuHandler={subMenuHandler} style={{backgroundColor : "#222222"}} />
        <div className="content_wrap">
            {
                subMenu ? (
                    <div className="side_menu" >
                        <Mainside subMenuHandler={subMenuHandler}  style={{backgroundColor : "#222222"}} />
                        <div className="side_sh" onClick={subMenuHandler}></div>
                    </div>
                ) : (<></>)
            } 
              
       
        <div className="myinfo_wrap" style={{backgroundImage:"url('/image/my.png')"}}>    
        <div className="myinfo_body">
            <div className="side">
                <div className="myinfo_side" >
                    <h2>
                        계정관리
                        {
                            mini < 810 && subList ? 
                            <IoIosArrowUp onClick={()=>{
                                setSubList(!subList);
                            }}/> : mini < 810 && !subList ?
                            <IoIosArrowDown onClick={()=>{
                                setSubList(!subList);
                            }}/> :<></>
                        }
                       
                    </h2>
                    {
                        mini < 810 && subList ?
                        <ul className="sub_list">
                            <li onClick={()=>{setSelected("id"); window.location.href="#id"}}><ImKey color={selected==="id" ? "#bd2a2a" : ""}/>MY ID</li>
                            <li onClick={()=>{setSelected("avatar"); window.location.href="#avatar"}}><CgProfile color={selected==="avatar" ? "#bd2a2a" : ""}/>아바타 변경</li>
                            <li onClick={()=>{setSelected("info"); window.location.href="#info"}}><RiGitRepositoryPrivateFill color={selected==="info" ? "#bd2a2a" : ""}/>개인정보</li>
                            <li onClick={()=>{setSelected("change"); window.location.href="#change"}}><CgPassword color={selected==="change" ? "#bd2a2a" : ""}/>비밀번호변경</li>
                            <li onClick={()=>{setSelected("recode"); window.location.href="#recode"}}><HiStatusOnline color={selected==="recode" ? "#bd2a2a" : ""}/>계정로그인기록</li>             
                            <li onClick={()=>{setSelected("wiw"); window.location.href="#wiw"}}><FaChalkboardTeacher color={selected==="wiw" ? "#bd2a2a" : ""}/> 내가 쓴 글 </li>
                            <li onClick={()=>{setSelected("wic"); window.location.href="#wic"}}><FaComments color={selected==="wic" ? "#bd2a2a" : ""}/> 내가 쓴 댓글</li>  
                            <li onClick={()=>{setSelected("out"); window.location.href="#out"}}><AiOutlineClear color={selected==="out" ? "#bd2a2a" : ""}/>회원탈퇴</li>
                        </ul> : 
                        <></>
                    }
                    {
                        mini >= 810 ?
                        <ul className="info_list">
                            <li onClick={()=>{setSelected("id"); window.location.href="#id"}}><ImKey color={selected==="id" ? "#bd2a2a" : ""}/>MY ID</li>
                            <li onClick={()=>{setSelected("avatar"); window.location.href="#avatar"}}><CgProfile color={selected==="avatar" ? "#bd2a2a" : ""}/>아바타 변경</li>
                            <li onClick={()=>{setSelected("info"); window.location.href="#info"}}><RiGitRepositoryPrivateFill color={selected==="info" ? "#bd2a2a" : ""}/>개인정보</li>
                            <li onClick={()=>{setSelected("change"); window.location.href="#change"}}><CgPassword color={selected==="change" ? "#bd2a2a" : ""}/>비밀번호변경</li>
                            <li onClick={()=>{setSelected("recode"); window.location.href="#recode"}}><HiStatusOnline color={selected==="recode" ? "#bd2a2a" : ""}/>계정로그인기록</li>             
                            <li onClick={()=>{setSelected("wiw"); window.location.href="#wiw"}}><FaChalkboardTeacher color={selected==="wiw" ? "#bd2a2a" : ""}/> 내가 쓴 글 </li>
                            <li onClick={()=>{setSelected("wic"); window.location.href="#wic"}}><FaComments color={selected==="wic" ? "#bd2a2a" : ""}/> 내가 쓴 댓글</li>  
                            <li onClick={()=>{setSelected("out"); window.location.href="#out"}}><AiOutlineClear color={selected==="out" ? "#bd2a2a" : ""}/>회원탈퇴</li>
                        </ul> : 
                        <></>
                    }
                    
                </div>
            </div>
            <div className="myinfo_main">
                <InfoDetail id="intro">
                    <InfoDetailTitle style={{backgroundColor:"#BD4162"}}>
                        <ich>소개글</ich>  
                        <ic>본인의 <font color="#fff568">소개글</font> 입니다.</ic> 
                        <ic><font color="#fff568">50자 내</font>의 짧은 글만 작성할 수 있습니다.</ic> 
                        <ic>줄바꿈은 카운트 되지않습니다.</ic>   
                        <ic>공백은 카운트 됩니다.</ic>                 
                    </InfoDetailTitle>
                    <InfoDetailBody style={{backgroundColor:"#F09AB1", flexDirection:"column"}}>
                        {
                            isIntroduceUpdate ? 
                            <div className="textarea_wrap">
                                <textarea maxLength="50" rows="2" id="myinfo_intro_textarea" onChange={(e)=>{
                                    const len = document.getElementById("myinfo_intro_textarea_len");
                                    len.innerText = `${e.target.value.length}/50`;
                                }}>
                                    {data.self_introduction}    
                                </textarea> 
                                <div id="myinfo_intro_textarea_len" className="write_len">{data.self_introduction ? data.self_introduction.length : 0}/50</div> 
                                <div className="btn_wrap">
                                    <button type="button" className="btn delete" onClick={()=>{
                                        const text = document.getElementById("myinfo_intro_textarea");
                                        const fd = new FormData();
                                        fd.append("introduce",text.value);
                                        axios.post("/myApi/member/change/introduce",fd,{headers:{"Authorization":SESSION_UID}})
                                            .then(res=>{
                                                window.location.reload();       
                                            }).catch(e=>{
                                                alert("변경에 실패했습니다.");
                                                setIsIntroduceUpdate(false);
                                            })
                                    }}> 수정</button>  
                                    <button type="button" className="btn delete" onClick={()=> setIsIntroduceUpdate(false)}>취소</button>  
                                </div>  
                            </div>
                            :
                            <div className="introduce_myself"      
                            onDoubleClick={()=> setIsIntroduceUpdate(true)}
                            onTouchEnd={()=> setIsIntroduceUpdate(true)}  
                            >
                                <p style={{ whiteSpace: "pre",overflow: "hidden", maxWidth: "440px"}}>{data.self_introduction ? data.self_introduction : `안녕하세요 ${data.nickname} 입니다.`}</p>
                            </div> 
                        }
                                
                    </InfoDetailBody>
                    </InfoDetail>
                <InfoDetail id="id">
                <InfoDetailTitle>
                    <ich>MyDOMUS 고유 ID</ich> 
                    <ic>회원이 가지고있는 <font color="#ca5656">고유의 아이디</font>입니다.</ic> 
                    <ic>고유 아이디 노출시 <font color="#ca5656">위험</font>할 수 있습니다.</ic> 
                </InfoDetailTitle>
                <InfoDetailBody>
                    <ib style={{justifyContent : "center", alignItems : "center"}}>
                        <input type="text" value={privateID.ID} readOnly className="onetext full" 
                        onFocus={()=>{
                            setPrivateID({
                                hide : false,
                                ID : SESSION_UID
                            })}} 
                        onBlur={()=>{
                            setPrivateID(privateInit);
                        }}/>
                        <font color="#ca5656">클릭 시 고유 ID가 표시됩니다.</font>
                    </ib>
                    
                </InfoDetailBody>
                </InfoDetail>
                <InfoDetail id="avatar">
                    <InfoDetailTitle>
                        <ich>아바타 변경</ich> 
                        <ic>아바타의 크기는 <font color="#ca5656">10MB 이하의 이미지 파일</font>만 설정 가능합니다.</ic> 
                        <ic>아바타를 설정하지 않을 경우 기본 이미지가 적용됩니다.</ic> 
                        <ic>&nbsp;</ic> 
                        <ic>아바타 변경을 원하면 <font color="#ca5656">현재 이미지 아이콘을 클릭</font> 해주세요.</ic> 
                    </InfoDetailTitle>
                    <InfoDetailBody style={{position:"relative"}}>
                            <div className="img_wrap">
                                <span className="title">이미지</span>
                                <img src={avatar ? avatar : "/profile.png"} alt="profile"/>
                                <input type="file" id="myinfo_avater_file" onChange={(e)=>{
                                    if(e.target.files[0]){
                                        if(e.target.files[0].type.indexOf("image") === -1){
                                            alert("이미지 파일이 아닙니다.");
                                            return;
                                        }
                                        if(e.target.files[0].size >= 10000000){
                                            alert("이미지 크기가 10MB보다 큽니다.");
                                            return;
                                        }
                                       
                                        const avatarFile = e.target.files[0];
                                        const url = URL.createObjectURL(avatarFile);
                                        setAavtar(url);
                                    }
                                    
                                }}/>
                            </div>   
                            <ic style={{marginLeft:"10px"}}>
                            <button type="button" onClick={()=>{
                                const avatar = document.getElementById("myinfo_avater_file");
                                const fd = new FormData();
                                fd.append("avatar", avatar.files[0])
                                axios.post("/myApi/member/change/avatar",fd,{headers:{"Authorization": SESSION_UID}})
                                    .then(res=>{
                                        alert("이미지가 변경되었습니다.");
                                    }).catch(e=>alert("이미지 변경에 실패했습니다."))
                            }}>변경</button>
                            <button type="button" style={{backgroundColor : "#eee", color : "#000"}} onClick={()=> setAavtar(currentAvatar)}>기존이미지로</button>
                            </ic> 
                            
                           
                    </InfoDetailBody>
                </InfoDetail>
                <InfoDetail id="info">
                    <InfoDetailTitle>
                        <ich>개인정보</ich> 
                        <ic>회원의 아이디 및 주소 <font color="#ca5656">정보</font>입니다.</ic> 
                        <ic>회원의 개인정보는 이메일, 이름, 닉네임 ,주소만 제공됩니다.</ic> 
                    </InfoDetailTitle>
                    <InfoDetailBody>
                        <ib>
                            <label>이메일</label>
                            <input type="text" className="onetext" defaultValue={data.email ? data.email : ""} readOnly/>
                            <label>이름</label>
                            <input type="text" className="onetext" defaultValue={data.name ? data.name : ""} readOnly/>
                            <label>닉네임</label>
                            <input type="text" className="onetext" value={nickname} onChange={(e)=>{onChangePrivateInfo(e,"nickname");setIsDuplicateNickname(false)}}/>
                            <label>우편번호</label>          
                            <input type="text" className="onetext" value={zipcode} onClick={()=>{if(privateInfoIsUpdate)setModal(1);}}/>
                            <label className="full">주소</label>
                            <input type="text" className="onetext full" value={address} onClick={()=>{if(privateInfoIsUpdate)setModal(1);}}/>
                            <label className="full">상세주소</label>
                            <input type="text" className="onetext full" value={detail_address} onChange={(e)=>{onChangePrivateInfo(e,"detail_address")}}/>
                            <ib style={{flexDirection : "row"}}>
                                <button type="button" style={privateInfoIsUpdate ? {backgroundColor : "#08ac19" } :{backgroundColor: "#dd3b3b"  }} onClick={()=>{setPrivateInfoIsUpdate(!privateInfoIsUpdate)}}>{privateInfoIsUpdate ? "수정중" : "수정하기"}</button>
                                {
                                    privateInfoIsUpdate ? 
                                    <button type="button" style={{backgroundColor :"#eeeeee",color :"#222222"}} onClick={onUpdateHandler}>변경</button> :
                                    <></>
                                }
                               
                            </ib>
                        </ib> 
                              
                    </InfoDetailBody>
                </InfoDetail>
                <InfoDetail id="change">
                    <InfoDetailTitle>
                        <ich>비밀번호변경</ich> 
                        <ic>회원의 비밀번호를 변경합니다</ic> 
                        <ic>비밀번호는 <font color="#ca5656">90일 내외</font> </ic> 
                        <ic><font color="#ca5656">자주 변경</font>하는 것이 올바릅니다.</ic> 
                        <ic>&nbsp;</ic>
                        <ic><font color="#ca5656">안전한 비밀번호</font>를 위해</ic> 
                        <ic>1. <font color="#ca5656">10자리 이상</font>의 비밀번호 길이</ic> 
                        <ic>2. <font color="#ca5656">연속된</font> 숫자, 문자등 사용 자제하기</ic>
                        <ic>3. 본인의 생일 등 <font color="#ca5656">유추하기 쉬운 단어</font> 비밀번호 포함 자제</ic>
                       
                    </InfoDetailTitle>
                    <InfoDetailBody>  
                        <ib style={{alignItems : "center"}}>
                        <input type="password" className="onetext" placeholder="현재 회원님의 비밀번호" 
                        id="myinfo_password" onChange={()=>{
                            const mpm = document.getElementById("myinfo_password_message");
                            mpm.innerText="";
                        }}/>
                        <div id="myinfo_password_message"></div>
                        <button type="button" onClick={()=>{
                            const current_password = document.getElementById("myinfo_password");
                            const mpm = document.getElementById("myinfo_password_message");
                            if(current_password.value===""){
                                mpm.innerText="비밀번호를 입력해주세요";
                                mpm.classList.add("error");
                                mpm.classList.remove("success");
                                return;
                            }
                            const fd = new FormData();                           
                            fd.append("password",current_password.value);      
                            axios.post("/myApi/member/equality/password/check",fd,{headers:{"Authorization":SESSION_UID}})
                                .then(res=>{
                                    const data = res.data;
                                    if(data.result){
                                        setModal(2);
                                    }else{
                                        mpm.innerText="비밀번호가 틀립니다.";
                                        mpm.classList.add("error");
                                        mpm.classList.remove("success");
                                    }
                                }).catch(e=>console.log(e.response));
                        }}>수정하기</button>  
                        </ib>   
                    </InfoDetailBody>
                </InfoDetail>
                <InfoDetail id="recode">
                    <InfoDetailTitle>
                        <ich>계정로그인기록</ich> 
                        <ic>최근 <font color="#ca5656">30개의</font>의 로그인기록입니다.</ic>           
                        <ic>&nbsp;</ic>     
                        <ic>최근 로그인 기록</ic>  
                        <ic>로그인시간 : {moment(log[0] ? log[0].loginDate : "").format("YYYY-MM-DD HH:mm:ss")} |  </ic>  
                        <ic>IP : {log[0] ? log[0].ip : ""} |</ic>  
                        <ic>Protocol : {log[0] ? log[0].ipv : ""} |</ic>    
                        <ic> 국가 : {log[0] ? log[0].countryCode : ""}</ic>    
                    </InfoDetailTitle>
                    <InfoDetailBody>  
                        <ib className="log_wrap">
                            <table className="table">
                               <tbody>
                                {
                                    log.map((d,i)=>{
                                        return (
                                        <tr key={d.id+d.loginDate}>
                                            <td style={{color : "#eeeeee"}}>{i+1}</td>
                                            <td>
                                                <p className="log" style={{fontSize:"12px"}} >
                                                <font color="#b1a2c3">로그인시간</font> : {moment(d.loginDate).format("YYYY-MM-DD HH:mm:ss")} |
                                                <font color="#b1a2c3"> 국가</font> : {d.countryCode} <br/>
                                                <font color="#b1a2c3"> Protocol</font> : {d.ipv} |
                                                <font color="#b1a2c3"> IP</font> : {d.ip} 
                                                </p> 
                                            </td>
                                        </tr>
                                        );
                                    })
                                }
                                </tbody>
                            </table>
                        </ib>   
                    </InfoDetailBody>
                </InfoDetail>
                <InfoDetail id="wiw">
                    <InfoDetailTitle>
                        <ich>내가 쓴 글</ich>  
                        <ic>내가 <font color="#ca5656">작성한</font> 글입니다.</ic>
                        <ic>
                            게시판 구분 없이 <font color="#ca5656">최근 순</font>으로 <font color="#ca5656">10개</font> 단위로 보여집니다.  
                        </ic> 
                        <ic>&nbsp;</ic>
                        <ic>
                            게시판 카테고리에 따라 다음과 같이 표기됩니다.    
                        </ic>
                        <ic style={{alignItems:"center",display:"flex"}}>
                            1. 사진 게시판 &nbsp; <MdPhoto color="#fff" size="20"/>
                        </ic> 
                        <ic style={{alignItems:"center",display:"flex"}}>
                            2. 자유 게시판 &nbsp; <FaChalkboard color="#fff" size="20"/>
                        </ic>  
                        <ic style={{alignItems:"center",display:"flex"}}>
                            3. 영상 게시판 &nbsp; <FaVideo color="#fff" size="20"/>
                        </ic>       
                    </InfoDetailTitle>
                    <InfoDetailBody style={{position:"relative"}}>
                        <ib>
                            <div className="select_board">  
                                <span className="all" style={{color : category === "all" ? "#32922f" : "#fff"}} title="전체게시판" onClick={()=> setCategory("all")}>ALL</span>                                   
                                <MdPhoto color={category === "PHOTO" ? "#32922f" : "#fff"} size="20" title="사진게시판" onClick={()=> setCategory("PHOTO")}/>
                                <FaChalkboard color={category === "FREE" ? "#32922f" : "#fff"} size="20" title="자유게시판" onClick={()=> setCategory("FREE")}/>
                                <FaVideo color={category === "VIDEO" ? "#32922f" : "#fff"} size="20" title="영상게시판" onClick={()=> setCategory("VIDEO")}/>
                            </div>
                            <BoardTable
                                data={category === "all" ? board : board.filter(v=> v.categoryList === category)}
                                columnData={["구분","제목","작성일"]}
                                dateColumn="created"
                                columnDataKey={["categoryList","title","created"]}
                                loading={bloading}
                                link
                                style={{color : "#fff"}}
                            />
                             <ReactPaginate 
                                count 
                                pageCount={category === "all" ? Math.ceil(boardCount / 10) : Math.ceil((board.filter(v=> v.categoryList === category).length)/10)}
                                pageRangeDisplayed={2}
                                marginPagesDisplayed={0}
                                breakLabel={""}
                                previousLabel={"이전"}
                                nextLabel={"다음"}
                                onPageChange={({selected})=>{  
                                    getMemberBoardData(selected);
                                }}
                                containerClassName={"pagination-ul"}
                                activeClassName={"currentPage"}
                                previousClassName={"pageLabel-btn"}
                                nextClassName={"pageLabel-btn"}
                            />
                        </ib>              
                    </InfoDetailBody>
                </InfoDetail>  
                <InfoDetail id="wic">
                    <InfoDetailTitle>
                        <ich>내가 쓴 댓글</ich>  
                        <ic>내가 <font color="#ca5656">작성한</font> 댓글입니다.</ic>
                        <ic>&nbsp;</ic>    
                        <ic>
                            <font color="#ca5656">최근 순</font>으로 <font color="#ca5656">10개</font> 단위로 보여집니다.  
                        </ic>                     
                    </InfoDetailTitle>
                    <InfoDetailBody style={{position:"relative"}}>
                        <ib>
                            <BoardTable
                                data={comments}
                                id={"board_id"}
                                columnData={["No","내용","작성일"]}
                                dateColumn="created"
                                columnDataKey={["board_id","description","created"]}
                                loading={cloading}
                                link
                                htmlToText="description"
                                style={{color : "#fff"}}
                                colgroup={"10% 55% 35%"}
                            />
                            <ReactPaginate 
                                pageCount={Math.ceil(commentsCount / 10)}
                                pageRangeDisplayed={2}
                                marginPagesDisplayed={0}
                                breakLabel={""}
                                previousLabel={"이전"}
                                nextLabel={"다음"}
                                onPageChange={({selected})=>{        
                                    getMemberCommentsData(selected);
                                }}
                                containerClassName={"pagination-ul"}
                                activeClassName={"currentPage"}
                                previousClassName={"pageLabel-btn"}
                                nextClassName={"pageLabel-btn"}
                            />
                        </ib>              
                    </InfoDetailBody>
                </InfoDetail>    
                <InfoDetail id="out">
                    <InfoDetailTitle>
                        <ich>회원탈퇴</ich> 
                        <ic>회원을 <font color="#ca5656">탈퇴</font>합니다.</ic> 
                        <ic>탈퇴 절차가 끝나면 계정 복구는 <font color="#ca5656">불가능</font> 합니다.</ic> 
                    </InfoDetailTitle>
                    <InfoDetailBody>  
                        <ib style={{alignItems : "center"}}>
                        <button type="button" >회원탈퇴</button>  
                        </ib>   
                    </InfoDetailBody>
                </InfoDetail>
            </div>
        </div>   
        </div>
        </div>
        </>
    );
}

