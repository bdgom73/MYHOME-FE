import { useEffect, useRef, useState } from "react";
import useMember from "../../../customState/useMember";
import io from "socket.io-client";
import immer from "immer";
import moment from "moment";
import { FaUser } from 'react-icons/fa';
import { useHistory } from "react-router-dom";
import axios from "axios";

const initialMessagesState = {
    general : [],
}
let currentUser = "";
export default function ChatPage(props){
    const {params : {room}}= props.match;

    const history = useHistory();
    const [conn,setConn] = useState(false);
    const {data,SESSION_UID} = useMember();
    const [messages, setMessages]=useState([]);
    const [message,setMessage] = useState("");
    const [users,setUsers] = useState([]);
    const [roomInfo, setRoomInfo] = useState({});
    const socketRef = useRef();
    const chatRef = useRef();

    useEffect(()=>{
        joinRoomCheck();
    },[])

    const sendMessage = ()=>{
        const date =moment().format("YYYY-MM-DD HH:mm:ss");
        const payload = {
            content : message,
            to : room,
            sender : data.nickname,
            chatName : room,
            isChannel : true,
            user : data,
            date
        };
        
        socketRef.current.emit("send message", payload);

        if(room){         
            setMessages([...messages, {
                sender : data.nickname,
                content : message,
                date,
                user : data
            }]);
        }    
    }
    const roomJoinCallBack = (incomingMessages,roomUsers)=>{     
        setMessages([...incomingMessages]);
        setUsers(roomUsers);
    }

    const connect = ()=>{
        setConn(true);
        socketRef.current = io.connect("/");

        socketRef.current.emit("join room", room , data, (messages,roomUsers) => roomJoinCallBack(messages,roomUsers));
        
        socketRef.current.on("alert message", msg=>{     
            setMessages(messages=>{
                const newAlertMessage = immer(messages, draft =>{
                    draft.push({message : msg});
                })
                return newAlertMessage;
            })
        });

        socketRef.current.on("new message", ({content, sender, date,user})=>{
            setMessages(messages=>{
                const newMessages = immer(messages, draft=>{         
                    draft.push({content, sender, date, user});     
                })
                return newMessages;
            })
        }) ;
        socketRef.current.on("new user", (user)=>{
            setUsers([...user]);
        })   
    }

    useEffect(()=>{
        setMessage("");
    },[messages]);

 
    useEffect(()=>{
        if(data.nickname){
            currentUser = data;
            connect();     
        }  
    },[data])

    useEffect(()=>{
        window.addEventListener("beforeunload",()=>{
            socketRef.current.emit("exit room", room, currentUser);            
        })   
    })
    useEffect(()=>{   
        if(!SESSION_UID){
            history.push("/login");
        }   
       return()=>{
            if(SESSION_UID){
                socketRef.current.emit("exit room", room, currentUser);      
            }     
       } 
    },[]);

  
    const joinRoomCheck = ()=>{
        axios.get("/room/join/"+room,{headers:{"Authorization" : SESSION_UID}})
            .then(res=>{
                if(res.status === 200){
                    const result = res.data;
                    if(!result.result){
                        history.push("/test");
                    }else{
                        setRoomInfo(result.room);
                    }
                }
            }).catch(e=> { history.push("/test");})
    }

    const handleKeypress=(e)=>{
        if(e.key === "Enter"){
            sendMessage();
        }
    }
    const handleMessageChange = (e)=>{
        setMessage(e.target.value);
    }

    let body;
    if(conn){
        body = (
            messages.map((m)=>{      
                const me = m.sender === data.nickname ? "chat_me" : "chat_message";
                if(m["message"]){
                    return(
                        <div className="success">{m.message}</div>
                    )
                }
                return(         
                    <div key={m.date+m.content}>                        
                    <div className={me} >              
                        {
                        m.sender === data.nickname ?
                        <></> : m.user["avatar_url"] ?
                        <img className="chat_avatar" src={m.user.avatar_url} alt="아바타"/>   :
                        <img className="chat_avatar" src={  "/profile.png"  } alt="아바타"/>
                        }      
                        {
                            m.sender === data.nickname ?
                            <span className="chat_date">{moment(m.date).format("a HH:mm")}</span> :<></>
                        }    
                        <div className="chat_message_body" >
                            {
                            m.sender === data.nickname ?
                            <></> : <>
                            <span className="your_chat_sender">{m.sender}</span> </>
                            }  
                            <p className="chat_content">{m.content}</p>       
                        </div>
                        {
                            m.sender !== data.nickname ?
                            <span className="chat_date">{moment(m.date).format("a HH:mm")}</span> :<></>
                        }
                        
                    </div>
                    </div>
                )
                
               
            })
        );
    }
    const scrollToBottom = ()=>{     
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
    useEffect(()=>{
        scrollToBottom();     
    },[messages])
    return(
        <div className="char_room_wrap">
            <div className="talk_list_header">
                <img src="/image/talkLogo.png" alt="Talk Logo"/>
                <div className="btn_wrap">
                    <button type="button" className="btn delete">신청현황</button>
                </div>
            </div>
            <div className="chat_wrap" >
                <ul className="chat_users">
                <li className="chat_text_me"><FaUser/>{data.nickname} <small>(me)</small></li>
                {
                    users.map(m=>{
                        const me = m.nickname === data.nickname ? "chat_text_me" : "";
                        if(m.nickname !== data.nickname){
                            return(
                                <li key={m.id} className={me}><FaUser/>{m.nickname}</li>
                            )
                        }else{
                            return <></>
                        }
                    
                    })
                }
                
                </ul>
                <div className="chat_message_wrap" ref={v=> chatRef.current = v}>
                    {body}
                </div>  
            </div>
            <input type="text" 
                placeholder="채팅을 입력해주세요"
                className="chat_input"
                onChange = {handleMessageChange}
                value={message}
                onKeyPress={handleKeypress}/>
        </div>
    )
}