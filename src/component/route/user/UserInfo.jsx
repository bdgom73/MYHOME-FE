import { FaChalkboardTeacher } from 'react-icons/fa';
import { GoInfo } from 'react-icons/go';
import { CgProfile } from 'react-icons/cg';
import { RiUserFollowFill } from 'react-icons/ri';
import { MdPhoto } from 'react-icons/md';
import { FaVideo,FaChalkboard,FaComments } from 'react-icons/fa';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import InfoDetail from '../myinfo/InfoDetail';
import InfoDetailTitle from '../myinfo/InfoDetailTitle';
import InfoDetailBody from '../myinfo/InfoDetailBody';

import moment from 'moment';
import useMember from '../../../customState/useMember';
import Mainheader from '../../part/Main_header';
import Mainside from '../../part/Main_side';
import DaumPostcode from 'react-daum-postcode';
import useModal from "../../../customState/useModal";
import Modal from '../../modal/modal';
import useTitle from '../../../customState/useTitle';
export default function UserInfo(props){

    const title = useTitle("MYDOMUS | User");
    const history = useHistory();

    const {logined,SESSION_UID,data} = useMember();
    const [selected,setSelected] = useState("id");
    
    const [avatar,setAavtar] = useState(data.avatar_url);

    useEffect(()=>{   
        title.refTitle.innerText=`MYDOMUS | ${data.email}`
        setAavtar(data.avatar_url);
    },[data])

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

    return(
        <>
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
                        <div className="myinfo_side">
                            <h2>유저정보</h2>
                            <h3><RiUserFollowFill/>테스트별명</h3>
                            <ul>                    
                                <li onClick={()=>{setSelected("avatar"); window.location.href="#avatar"}}><CgProfile color={selected==="avatar" ? "#bd2a2a" : ""}/>
                                    아바타
                                </li>  
                                <li onClick={()=>{setSelected("info"); window.location.href="#info"}}><GoInfo color={selected==="info" ? "#bd2a2a" : ""}/>
                                    정보
                                </li>
                                <li onClick={()=>{setSelected("wiw"); window.location.href="#wiw"}}><FaChalkboardTeacher color={selected==="wiw" ? "#bd2a2a" : ""}/>
                                    내가 쓴 글
                                </li>
                                <li onClick={()=>{setSelected("wic"); window.location.href="#wic"}}><FaComments color={selected==="wic" ? "#bd2a2a" : ""}/>
                                    내가 쓴 댓글
                                </li>    
                            </ul>
                        </div>
                    </div>
                    <div className="myinfo_main">  
                        <InfoDetail id="avatar">
                            <InfoDetailTitle style={{backgroundColor:"#BD4162"}}>
                                <ich>소개글</ich>  
                                <ic>해당 유저의 <font color="#fff">소개글</font> 입니다.</ic>                  
                            </InfoDetailTitle>
                            <InfoDetailBody style={{backgroundColor:"#F09AB1"}}>
                                안녕하세요 테스트별명 입니다.💘
                            </InfoDetailBody>
                        </InfoDetail>      
                        <InfoDetail id="avatar">
                            <InfoDetailTitle>
                                <ich>아바타</ich>  
                                <ic>현재 해당유저가 <font color="#ca5656">사용중인</font> 아바타입니다.</ic>
                                <ic>
                                    자세히 보기를 원한다면 해당 사진을 <font color="#ca5656">클릭</font> 하면 됩니다.    
                                </ic>      
                            </InfoDetailTitle>
                            <InfoDetailBody style={{position:"relative"}}>
                                <div className="img_wrap">
                                    <img src={avatar ? avatar : "/profile.png"} alt="profile"/>                          
                                </div>               
                            </InfoDetailBody>
                        </InfoDetail>
                        <InfoDetail id="info">
                            <InfoDetailTitle>
                                <ich>정보</ich>  
                                <ic>해당 유저의 정보입니다.</ic>
                                <ic>
                                    자세한 내용은 <font color="#ca5656">표기 되지않</font>습니다.
                                </ic>      
                            </InfoDetailTitle>
                            <InfoDetailBody style={{position:"relative"}}>
                                <ib style={{justifyContent:"center",alignItems:"center"}}>
                                    <label>이름</label>
                                    <input type="text" className="onetext" readOnly defaultValue={"김*중"}/>  
                                    <label>닉네임</label>
                                    <input type="text" className="onetext" readOnly defaultValue={"별명"}/> 
                                    <label>이메일</label>
                                    <input type="text" className="onetext" readOnly defaultValue={"bdg****@naver.com"}/>   
                                </ib>               
                            </InfoDetailBody>
                        </InfoDetail>   
                        <InfoDetail id="wiw">
                            <InfoDetailTitle>
                                <ich>테스트별명님이 쓴 글</ich>  
                                <ic>해당 유저가 <font color="#ca5656">작성한</font> 글입니다.</ic>
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
                                        <span className="all" title="전체게시판">ALL</span>                                   
                                        <MdPhoto color="#fff" size="20" title="사진게시판"/>
                                        <FaChalkboard color="#fff" size="20" title="자유게시판"/>
                                        <FaVideo color="#fff" size="20" title="영상게시판"/>
                                    </div>
                                    <table className="table">
                                        <colgroup>
                                            <col width="10%"/>
                                            <col width="60%"/>
                                            <col width="30%"/>
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>NO</th>
                                                <th>제목</th>
                                                <th>작성일</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{color : "#eeeeff"}}>
                                            <tr>
                                                <td>53</td>
                                                <td><MdPhoto color="#fff" size="15"/>테스트입니다.</td>
                                                <td>2021-01-10 18:30</td>
                                            </tr>
                                            <tr>
                                                <td>85</td>
                                                <td><FaChalkboard color="#fff" size="15"/>테스트입니다.</td>
                                                <td>2021-03-24 14:30</td>
                                            </tr>
                                            <tr>
                                                <td>112</td>
                                                <td><FaVideo color="#fff" size="15"/>테스트입니다.</td>
                                                <td>2021-06-10 23:32</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </ib>              
                            </InfoDetailBody>
                        </InfoDetail>  
                        <InfoDetail id="wic">
                            <InfoDetailTitle>
                                <ich>테스트별명님이 쓴 댓글</ich>  
                                <ic>해당 유저가 <font color="#ca5656">작성한</font> 댓글입니다.</ic>
                                <ic>&nbsp;</ic>    
                                <ic>
                                    <font color="#ca5656">최근 순</font>으로 <font color="#ca5656">10개</font> 단위로 보여집니다.  
                                </ic>                     
                            </InfoDetailTitle>
                            <InfoDetailBody style={{position:"relative"}}>
                                <ib>
                                    <table className="table">
                                        <colgroup>
                                            <col width="10%"/>
                                            <col width="60%"/>
                                            <col width="30%"/>
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th>B_NO</th>
                                                <th>내용</th>
                                                <th>작성일</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{color : "#eeeeff"}}>
                                            <tr>
                                                <td>53</td>
                                                <td>ㅋㅋㅋ 너무웃김.</td>
                                                <td>2021-01-10 18:30</td>
                                            </tr>
                                            <tr>
                                                <td>85</td>
                                                <td>와 진짜 대박이네</td>
                                                <td>2021-03-24 14:30</td>
                                            </tr>
                                            <tr>
                                                <td>112</td>
                                                <td>와 이건가..</td>
                                                <td>2021-06-10 23:32</td>
                                            </tr>
                                        </tbody>
                                    </table>
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

