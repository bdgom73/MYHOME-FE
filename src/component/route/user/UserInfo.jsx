import { FaChalkboardTeacher } from 'react-icons/fa';
import { GoInfo } from 'react-icons/go';
import { CgProfile } from 'react-icons/cg';
import { IoIosArrowDown,IoIosArrowUp } from 'react-icons/io';
import { RiUserFollowFill } from 'react-icons/ri';
import { MdPhoto } from 'react-icons/md';
import { FaVideo,FaChalkboard,FaComments } from 'react-icons/fa';
import { useHistory } from 'react-router';
import { useEffect, useState } from 'react';
import InfoDetail from '../myinfo/InfoDetail';
import InfoDetailTitle from '../myinfo/InfoDetailTitle';
import InfoDetailBody from '../myinfo/InfoDetailBody';
import useMember from '../../../customState/useMember';
import Mainheader from '../../part/Main_header';
import Mainside from '../../part/Main_side';
import useTitle from '../../../customState/useTitle';
import axios from 'axios';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import BoardTable from "../../part/write/BoardTable";
import { maskingText } from '../../../js/common';
import useModal from '../../../customState/useModal';
import Modal from '../../modal/modal';
export default function UserInfo(props){

    const title = useTitle("MYDOMUS | User");
    const {modal,setModal,close} = useModal();
    const history = useHistory();
    const { params : {nickname}} = props.match;
    const [selected,setSelected] = useState("id");
    
    const [avatar,setAavtar] = useState("");

    // 내가 쓴 댓글 , 게시글 
    const [comments, setComments] = useState([]);
    const [commentsCount,setCommentsCount] = useState(0);
    const [cloading,setCLoading] = useState(false);
    const [board,setBoard] = useState([]);
    const [boardCount,setBoardCount] = useState(0);
    const [bloading,setBLoading] = useState(false);

    const [category,setCategory] = useState("all");
    
    // 유저정보
    const [user,setUser] = useState({});

    const [subMenu, setSubMenu] = useState(false); 

    // 모바일 화면
    const [mini,setMini] = useState(document.body.clientWidth); 
    const [subList,setSubList] = useState(false);

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
    function getMemberCommentsData(page){
        setComments([]);
        setCLoading(true)
        const fd = new FormData();
        fd.append("nickname",nickname);
        axios.post(`/comments/nickname/get?page=${page}&size=10`,fd)
        .then(res=>{
            const result = res.data;
            setComments(result.content || []);
            setCommentsCount(result.totalElements || 0);
            if(res.status === 200) setCLoading(false);
        }).catch(e=> setCLoading(false))
    }
    function getMemberBoardData(page){
        setBoard([]);
        setBLoading(true)
        const fd = new FormData();
        fd.append("nickname",nickname);
        axios.post(`/bbs/nickname/member/get?page=${page}&size=10`,fd)
        .then(res=>{
            const result = res.data;
            setBoard(result.content || []);
            setBoardCount(result.totalElements || 0);
            if(res.status === 200) setBLoading(false);
        }).catch(e=> {console.log(e.response); setBLoading(false);});
    }
    function getMemberData(){
        axios.get(`/member/${nickname}`)
        .then(res=>{
            const result = res.data;   
            setUser(result || {});
            setAavtar(result.avatar_url)
            title.refTitle.innerText=`MYDOMUS | ${result.nickname}`

        }).catch(e=> {
            alert("존재하지 않는 회원입니다. 이전페이지로 이동합니다.");
            history.goBack(-1);
        });
    }
    useEffect(()=>{
        getMemberCommentsData(0);
        getMemberBoardData(0);
        getMemberData();
    },[])

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

    function modalActive(){
        switch(modal){
            case 1 :
                return (
                    <Modal title="자세히보기" close={close}>
                        <img src={avatar} alt="사용자 이미지 자세히보기" className="preview_image"/>
                    </Modal>
                )
            default : 
                return ""
        }
    }
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
                        <div className="myinfo_side">
                            <h2>정보
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
                            <h3><RiUserFollowFill/>{nickname}</h3>
                            {
                                mini < 810 && subList ?
                                <ul className="sub_list">                    
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
                                </ul> : 
                                <></>
                            }
                            {
                                mini >= 810 ?
                                <ul className="info_list">                    
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
                                </ul> : 
                                <></>
                            }
                           
                        </div>
                    </div>
                    <div className="myinfo_main">  
                        <InfoDetail id="intro">
                            <InfoDetailTitle style={{backgroundColor:"#BD4162"}}>
                                <ich>소개글</ich>  
                                <ic>해당 유저의 <font color="#fff">소개글</font> 입니다.</ic>                  
                            </InfoDetailTitle>
                            <InfoDetailBody style={{backgroundColor:"#F09AB1"}}>
                            <p style={{ whiteSpace: "pre",overflow: "hidden", maxWidth: "440px"}}>{user.self_introduction ? user.self_introduction : `안녕하세요 ${user.nickname} 입니다.`}</p>
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
                                    <img src={avatar ? avatar : "/profile.png"} alt="profile" onClick={()=>{setModal(1)}}/>                          
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
                                    <input type="text" className="onetext" readOnly defaultValue={user.name ? maskingText(user.name) : ""}/>  
                                    <label>닉네임</label>
                                    <input type="text" className="onetext" readOnly defaultValue={user.nickname ? user.nickname : ""}/> 
                                    <label>이메일</label>
                                    <input type="text" className="onetext" readOnly defaultValue={user.email ? maskingText(user.email,"email") : ""}/>   
                                </ib>               
                            </InfoDetailBody>
                        </InfoDetail>   
                        <InfoDetail id="wiw">
                            <InfoDetailTitle>
                                <ich>{nickname}님이 쓴 글</ich>  
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
                                <ich>{nickname}님이 쓴 댓글</ich>  
                                <ic>해당 유저가 <font color="#ca5656">작성한</font> 댓글입니다.</ic>
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
                    </div>      
                </div>   
            </div>     
        </div>
        
        </>
    );
}

