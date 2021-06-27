import io from "socket.io-client";
import immer from "immer";
import {  useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Chat from "./Chat";
import Form from "./Form";
import moment from "moment";
import useMember from "../../../customState/useMember";
import useModal from "../../../customState/useModal";
import Modal from "../../modal/modal";
import ChatRoomForm from "../chat/ChatRoomForm";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { BiUser,BiCrown } from 'react-icons/bi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { BsList } from "react-icons/bs";
import Side from "../../part/Main_side";

const alertMessageInit = {
    type : "basic",
    message : ""
}
export default function TalkList(){

    const history = useHistory();
    const {SESSION_UID,data} = useMember();
    const {modal, setModal, close} = useModal();
    const [roomList, setRoomList] = useState([]);
    const [roomUser,setRoomuser] = useState({});
    const [currentRoom, setCurrentRoom] = useState({});
    const [alertMessage, setAlertMessage] = useState(alertMessageInit);
    const [searchType,setSearchType]=useState("title");
    const [searchValue,setSearchValue]=useState("");
    const socketRef = useRef();

    const modalActive = ()=>{
        if(modal === 1){
            return (
            <Modal title="방만들기" close={close}>
               <ChatRoomForm close={close}/>
            </Modal>
            );
        }else if(modal === 2){
            return(
            <Modal title="방 비밀번호 입력" close={close}>   
                <form onSubmit={(e)=>{
                    e.preventDefault();
                    if(e.target[0].value === currentRoom.password){
                        joinRoom(currentRoom);
                    }else{
                        const messages = {
                            type : "error",
                            message : "비밀번호가 틀렸습니다."
                        }
                        setAlertMessage(messages);
                        setModal(3);
                    }
                }}>   
                    <input type="password" className="basic"/>
                    <div className="btn_wrap" style={{justifyContent:"center"}}>
                        <button type="submit" className="btn">입력</button>
                    </div>
                </form>   
            </Modal> 
            );
        }else if(modal === 3){
            return(
                <Modal title="알림" close={close}>
                    {
                        alertMessage.type === "error" ?
                        <div className="error">{alertMessage.message}</div> :
                        alertMessage.type === "success" ?
                        <div className="success">{alertMessage.message}</div> :
                        alertMessage.message
                    }     
                </Modal>
            )
        }
    }

    const connect = ()=>{;
        socketRef.current = io.connect("/room");
        
        socketRef.current.emit("join server");

        socketRef.current.on("user data", (users)=>{
            setRoomuser(users);
        })
    }

    const joinRoom = (room)=>{
        if(SESSION_UID){   
            if(roomUser[room.id]){
                const findUser = roomUser[room.id].find(v=> v.id === data.id);
                console.log(roomUser);
                if(findUser){
                    setAlertMessage({
                        type : "error",
                        message : "해당 채팅방에 이미 접속중입니다."
                    });
                    setModal(3);
                    return;
                }
            }
            axios.get("/myApi/room/join/"+room.id,{headers:{"Authorization" : SESSION_UID}})
            .then(res=>{
                if(res.status === 200){
                    const result = res.data;
                    if(!result.result){
                        setAlertMessage({
                            type : "error",
                            message : "접속권한이 없습니다"
                        });
                        setModal(3);
                    }else{
                        history.push(`/chat/room=${room.id}`) ;
                    }
                }
            }).catch(e=> {
                setAlertMessage({
                    type : "error",
                    message : "접속권한이 없습니다"
                });
                setModal(3);
            })
        }else{
            setAlertMessage({
                type : "error",
                message : "로그인 후 사용가능합니다."
            });
            setModal(3);
        }
      
    }

    const renderRooms = (room)=>{
        if(room.type === "PUBLIC" && room.password){
            return(    
            <li className="room" key={room.id}>
                <span>
                    <RiLockPasswordLine size="18"/>
                </span>
                <span className="room_type">
                    {
                    room.type === "PUBLIC" ?
                    "오픈채팅" : "그룹채팅"
                    }
                    <span className="date">{moment(room.created).format("YYYY년 MM월 DD일")}</span>
                </span>
                <div className="room_top" >
                    <span  className="room_title" onClick={()=>{
                            setModal(2);
                            setCurrentRoom(room);
                        }}>{room.title}</span>  
                    <span className="room_user-count">
                        <BiUser/>
                        {roomUser[room.id] ? roomUser[room.id].length : 0}명
                    </span>
                    <span className="room_leader">
                        <BiCrown size="20"/>
                        {room.nickname}
                    </span>
                    
                </div>     
            </li>        
            )
        }
       
        return(    
            <li className="room" key={room.id}>
                 <span className="room_type">
                    {
                    room.type === "PUBLIC" ?
                    "오픈채팅" : "그룹채팅"
                    }
                    <span  className="date">{moment(room.created).format("YYYY년 MM월 DD일")}</span>
                    {
                        room.type === "PRIVATE" ? 
                        <button type="button" className="basic_btn" style={{float:"right"}}>가입신청</button>   :<></>
                    }
                </span>   
                <div className="room_top" >
                    <span  className="room_title" onClick={()=>{joinRoom(room)}}>{room.title}</span>  
                    <span className="room_user-count">
                        <BiUser size="20"/>
                        {roomUser[room.id] ? roomUser[room.id].length : 0}명
                    </span>
                    <span className="room_leader">
                        <BiCrown size="20"/>
                        {room.nickname}
                    </span>   
                </div>           
            </li>
        )
    }

    const getRooms = ()=>{
        connect();
        axios.get("/myApi/room/random/read")
        .then(res=>{
            if(res.status === 200){
                setRoomList(res.data);     
            }
        }).catch(e=>console.log(e.response))
    }

    useEffect(()=>{
        getRooms();  
        return ()=>{
            socketRef.current.disconnect();        
        }
    },[]);
    
    const searchRoomHandler = (type, value)=>{
        if(type === "term"){
            axios.get(`/myApi/room/search?condition=${searchType}&term=${value}`)
            .then(res=>{
                setRoomList(res.data);
            }).catch(e=> console.log(e.response));
        }else if(type === "condition"){
            axios.get(`/myApi/room/search?condition=${value}&term=${searchValue}`)
            .then(res=>{
                setRoomList(res.data);
            }).catch(e=> console.log(e.response));
        }else{
            axios.get(`/myApi/room/search?condition=${searchType}&term=${searchValue}`)
            .then(res=>{
                setRoomList(res.data);
            }).catch(e=> console.log(e.response));
        }
       
    }
    return(
        <>
        {modalActive()}  
        <div className="talk_list_wrap">  
            <div className="talk_list_body" >
                <ul className="channel">
                {
                    !roomList.length ? <li className="room">채널이 없습니다.</li> :
                    roomList.map(renderRooms)
                }
                </ul>
            </div>
            <div className="talk_list_search">
                <div className="search_wrap">
                    <select name="type" onChange={(e)=> {
                        setSearchType(e.target.value);
                        searchRoomHandler("condition", e.target.value);
                    }}>                      
                        <option value="title" selected>제목</option>
                        <option value="nickname">닉네임</option>
                    </select>
                    <input type="text" className="search" onChange={(e)=> {
                        setSearchValue(e.target.value);
                        if(e.target.value === ""){
                            getRooms();
                        }
                        if(searchValue.length >= 2){
                            searchRoomHandler("term", e.target.value);
                        }
                    }}/>
                    <button type="button" onClick={searchRoomHandler}>검색</button>
                </div>      
            </div>
            <div className="btn_wrap">
                <button className="btn" type="button" onClick={()=> setModal(1)}>방만들기</button>
            </div>
        </div>
        </>
    )
}