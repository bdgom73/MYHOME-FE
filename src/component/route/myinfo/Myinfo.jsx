import { ImKey } from 'react-icons/im';

import { RiGitRepositoryPrivateFill } from 'react-icons/ri';
import { CgPassword,CgProfile } from 'react-icons/cg';
import { HiStatusOnline } from 'react-icons/hi';
import { AiOutlineClear } from 'react-icons/ai';
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

    const [nickname,setNickname] = useState(data.nickname);
    const [address,setAddress] = useState(data.address);
    const [zipcode,setZipcode] = useState(data.zipcode);
    const [detail_address,setDetail_address] = useState(data.detail_address);
    const [avatar,setAavtar] = useState(data.avatar_url);
    const [currentAvatar,setCurrentAvatar] = useState(data.avatar_url);

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
    console.log(data)
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
        {/* <div className="myinfo_top">
            <img src="/logo.png" alt="mainLogo" onClick={()=>{history.push("/")}}/>
        </div> */}
        <div className="myinfo_body">
            <div className="side">
                <div className="myinfo_side">
                    <h2>계정관리</h2>
                    <ul>
                        <li onClick={()=>{setSelected("id"); window.location.href="#id"}}><ImKey color={selected==="id" ? "#bd2a2a" : ""}/>MY ID</li>
                        <li onClick={()=>{setSelected("avatar"); window.location.href="#avatar"}}><CgProfile color={selected==="avatar" ? "#bd2a2a" : ""}/>아바타 변경</li>
                        <li onClick={()=>{setSelected("info"); window.location.href="#info"}}><RiGitRepositoryPrivateFill color={selected==="info" ? "#bd2a2a" : ""}/>개인정보</li>
                        <li onClick={()=>{setSelected("change"); window.location.href="#change"}}><CgPassword color={selected==="change" ? "#bd2a2a" : ""}/>비밀번호변경</li>
                        <li onClick={()=>{setSelected("recode"); window.location.href="#recode"}}><HiStatusOnline color={selected==="recode" ? "#bd2a2a" : ""}/>계정로그인기록</li>
                        <li onClick={()=>{setSelected("out"); window.location.href="#out"}}><AiOutlineClear color={selected==="out" ? "#bd2a2a" : ""}/>회원탈퇴</li>
                    </ul>
                </div>
            </div>
            <div className="myinfo_main">
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
                        <ic>아바타의 크기는 <font color="#ca5656">2MB 이하의 이미지 파일</font>만 설정 가능합니다.</ic> 
                        <ic>아바타를 설정하지 않을 경우 기본 이미지가 적용됩니다.</ic> 
                        <ic>&nbsp;</ic> 
                        <ic>아바타 변경을 원하면 <font color="#ca5656">현재 이미지 아이콘을 클릭</font> 해주세요.</ic> 
                    </InfoDetailTitle>
                    <InfoDetailBody style={{position:"relative"}}>
                            <div className="img_wrap">
                                <span className="title">이미지</span>
                                <img src={avatar ? avatar : "/profile.png"} alt="profile"/>
                                <input type="file" onChange={(e)=>{
                                    if(e.target.files[0]){
                                        if(e.target.files[0].type.indexOf("image") === -1){
                                            alert("이미지 파일이 아닙니다.");
                                            return;
                                        }
                                        if(e.target.files[0].size >= 2097152){
                                            alert("이미지 크기가 2MB보다 큽니다.");
                                            return;
                                        }
                                       
                                        const avatarFile = e.target.files[0];
                                        const url = URL.createObjectURL(avatarFile);
                                        setAavtar(url);
                                    }
                                    
                                }}/>
                            </div>   
                            <ic style={{marginLeft:"10px"}}>
                            <button type="button" >변경</button>
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
                            <input type="text" className="onetext" defaultValue={data.name ? data.name : ""}/>
                            <label>닉네임</label>
                            <input type="text" className="onetext" value={nickname} onChange={(e)=>{onChangePrivateInfo(e,"nickname")}}/>
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
                                    <button type="button" style={{backgroundColor :"#eeeeee",color :"#222222"}}>변경</button> :
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
                        <input type="text" className="onetext" value="현재 회원님의 비밀번호"/>
                        <button type="button">수정하기</button>  
                        </ib>   
                    </InfoDetailBody>
                </InfoDetail>
                <InfoDetail id="recode">
                    <InfoDetailTitle>
                        <ich>계정로그인기록</ich> 
                        <ic>현재일로부터 <font color="#ca5656">30일 전</font>의 로그인기록입니다.</ic>  
                        <ic>
                            {moment().format("YYYY-MM-DD")} ~ {moment(new Date().setDate(new Date().getDate()-30)).format("YYYY-MM-DD")} 까지의 로그인 기록입니다.
                        </ic>  
                        <ic>&nbsp;</ic>     
                        <ic>최근 로그인 기록</ic>  
                        <ic>로그인시간 : {moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD HH:mm:ss")} |  </ic>  
                        <ic>IP : 192.168.0.1 |</ic>  
                        <ic>Protocol : IPv4 |</ic>    
                        <ic> 국가 : KR</ic>    
                    </InfoDetailTitle>
                    <InfoDetailBody>  
                        <ib style={{alignItems : "center"}}>
                            {
                                Array.from(Array(10), (_, i) => i + 1).map((d)=>{
                                    console.log(d)
                                    return (
                                        <p style={{fontSize:"12px"}}>
                                        로그인시간 : {moment(new Date().setDate(new Date().getDate()+d)).format("YYYY-MM-DD HH:mm:ss")} | 
                                        IP : 192.168.0.1 |
                                        Protocol : IPv4 |
                                        국가 : KR
                                        </p>  
                                    );
                                })
                            }
                         
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
                        <button type="button">회원탈퇴</button>  
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

