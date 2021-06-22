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
    javascript : []
}

export default function TalkList(){

    const member = useMember();
    const [username , setUsername] = useState("");
    const [connected, setConnected] = useState(false);
    const [currentChat, setCurrentChat] = useState({isChannel : false, chatName : "general", receiverId:""});
    const [connectedRooms,setConnectedRooms]= useState(["general"]);
    const [allUsers, setAllUsers]=useState([]);
    const [messages, setMessages]=useState(initialMessagesState);
    const [message,setMessage] = useState("");
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

        const newMessages = immer(messages, draft=> {
            draft[currentChat.chatName].push({
                sender : username,
                content : message,
                date
            })
        })
        setMessages(newMessages);
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
        socketRef.current.emit("join room", room , messages => roomJoinCallBack(messages, room));
        setConnectedRooms(newConnectedRooms);
    }

    const toggleChat = (currentChat)=>{
        if(!messages[currentChat.chatName]){
            const newMessages = immer(messages, draft=>{
                draft[currentChat.chatName] = [];
            });
            setMessages(newMessages);
        }
        setCurrentChat(currentChat);  
    }


    const connect = ()=>{       
        setConnected(true);
        socketRef.current = io.connect("/");
        socketRef.current.emit("join server", member.data.nickname ? member.data.nickname : "");
        socketRef.current.emit("join room", "general", messages => roomJoinCallBack(messages, "general"));
        socketRef.current.on("new user", allUsers => {
            setAllUsers(allUsers);
        });
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
                messages={messages[currentChat.chatName]}
            />
        );
    }else{
        body = (
           <>
           <div className="error">로그인후 이용할 수 있는 시스템입니다.</div>
           </>
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
                {body}
            </div>
        </div>
        </>
    )
}