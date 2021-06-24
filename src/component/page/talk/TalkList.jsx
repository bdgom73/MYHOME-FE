import io from "socket.io-client";
import immer from "immer";
import {  useEffect, useRef, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import Chat from "./Chat";
import Form from "./Form";
import moment from "moment";
import useMember from "../../../customState/useMember";

const initialMessagesState = {
    general : [],
    random : [],
    jokes : [],
    javascript : [],
    "123" : []
}
const rooms = [
    "general",
    "random",
    "jokes",
    "javascript",
];
export default function TalkList(){

    const member = useMember();
    const [username , setUsername] = useState("");
    const [connected, setConnected] = useState(false);
    const [currentChat, setCurrentChat] = useState({isChannel : false, chatName : "", receiverId:""});
    const [connectedRooms,setConnectedRooms]= useState(["general"]);
    const [allUsers, setAllUsers]=useState([]);
    const [messages, setMessages]=useState(initialMessagesState);
    const [message,setMessage] = useState("");
    const [currentRoomUsers, setCurrentRoomUsers] = useState([]);
    const [alertMessage,setAlertMessage] = useState("");
    const socketRef = useRef();
   

    const handleMessageChange = (e)=>{
        setMessage(e.target.value);
    }

    useEffect(()=>{ 
        if(member.data.nickname){
            setUsername(member.data.nickname);
            connect();
        }
    },[member.data.nickname])
    

    useEffect(()=>{
        setMessage("");
    },[messages]);
    
    const sendMessage = ()=>{
        const date =moment().format("YYYY-MM-DD HH:mm:ss");
        const payload = {
            content : message,
            to : currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
            sender : username,
            chatName : currentChat.chatName,
            isChannel : currentChat.isChannel,
            date
        };
        socketRef.current.emit("send message", payload);

        if(currentChat.chatName){
            const newMessages = immer(messages, draft=> {
                draft[currentChat.chatName].push({
                    sender : username,
                    content : message,
                    date
                })
            })
            setMessages(newMessages);
        }else{
            const newMessages = immer(messages, draft=> {
                draft[currentChat.chatName] = {
                    sender : username,
                    content : message,
                    date
                }
            });
            setMessages(newMessages);
        }
      
        
    }

    const roomJoinCallBack = (incomingMessages, room)=>{
        const newMessages = immer(messages, draft=>{
            draft[room] = incomingMessages;
        });

        setMessages(newMessages);
    }

    const joinRoom = (room)=>{
        const newConnectedRooms = immer(connectedRooms, draft=>{
            draft.push(room);
        });
        socketRef.current.emit("join room", room , member.data.nickname, (messages) => roomJoinCallBack(messages, room));
       
        setConnectedRooms(newConnectedRooms);
    }

    const toggleChat = (currentChat)=>{
        if(!messages[currentChat.chatName]){
            const newMessages = immer(messages, draft=>{
                draft[currentChat.chatName] = [];
            });
            setMessages(newMessages);        
        }
        socketRef.current.on("alert message",(msg)=>{
            setAlertMessage(msg);
        })
        setCurrentChat(currentChat);  
    }

    const connect = ()=>{       
        setConnected(true);
        socketRef.current = io.connect("/");
     
        // socketRef.current.emit("join room", "general", member.data.nickname , messages => roomJoinCallBack(messages, "general"));
        socketRef.current.on("new user", allUsers => {
            setAllUsers(allUsers);
        });
        socketRef.current.on("alert message",(msg)=>{
            setAlertMessage(msg);
        })
        socketRef.current.on("new message", ({content, sender, chatName, date})=>{
            setMessages(messages=>{
                const newMessages = immer(messages, draft=>{
                    if(draft[chatName]){
                        draft[chatName].push({content, sender, date});
                    } else{
                        draft[chatName] = [{content, sender, date}];
                    }
                })
                return newMessages;
            })
        })    

       
    }

    let body;
    if(connected){
        body = (
            <Chat
                message = {message}
                handleMessageChange={handleMessageChange}
                sendMessage={sendMessage}
                yourId={socketRef.current ? socketRef.current.id : ""}
                allUsers = {allUsers}
                joinRoom = {joinRoom}
                connectedRooms = {connectedRooms}
                currentChat = {currentChat}
                toggleChat={toggleChat}
                messages={messages[currentChat.chatName] || []}
                currentRoomUsers = {currentRoomUsers}
                alertMessage={alertMessage}
            />
        );
    }else{
        body = (
           <>
           <div className="error">로그인후 이용할 수 있는 시스템입니다.</div>
           </>
        )
    }

    const renderRooms = (room)=>{
        const currentChat = {
            chatName : room,
            isChannel : true,
            receiverId : "",
        }
        return(
            <div className="row" onClick={()=>{toggleChat(currentChat);joinRoom(room)}} key={room}>
                {room}
            </div>
        )
    }

    return(
        <>
        <div className="talk_list_wrap">
            <div className="talk_list_header">
               <img src="/image/talkLogo.png" alt="Talk Logo"/>
                <AiOutlineClose/>
            </div>
            <div className="talk_list_body" >
            {
                connected ? 
                <div className="channel">
                {                          
                    rooms.map(renderRooms)  
                }
                </div> :<></>
            } 
            {body}
            </div>
        </div>
        </>
    )
}