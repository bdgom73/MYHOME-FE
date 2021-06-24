import { useEffect, useRef, useState } from "react";
import useMember from "../../../customState/useMember";
import io from "socket.io-client";
import immer from "immer";
import moment from "moment";
import { FaUser } from 'react-icons/fa';
import { useHistory } from "react-router-dom";

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
    const socketRef = useRef();
    const chatRef = useRef();
    const sendMessage = ()=>{
        const date =moment().format("YYYY-MM-DD HH:mm:ss");
        const payload = {
            content : message,
            to : room,
            sender : data.nickname,
            chatName : room,
            isChannel : true,
            date
        };
        
        socketRef.current.emit("send message", payload);

        if(room){         
            setMessages([...messages, {
                sender : data.nickname,
                content : message,
                date
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
                    draft.push({message : msg, sender : "ㅇㅇ"});
                })
                return newAlertMessage;
            })
        });

        socketRef.current.on("new message", ({content, sender, date})=>{
            setMessages(messages=>{
                const newMessages = immer(messages, draft=>{         
                    draft.push({content, sender, date});     
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
    },[])
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
                    <div className={me} key={m.date+m.content}>
                        {
                            m.sender === data.nickname ?
                            <span className="chat_date">{moment(m.date).format("a HH:mm")}</span> :<></>
                        }
                        <div className="chat_message_body" >
                        {
                            m.sender === data.nickname ?
                            <></> : <span className="chat_sender">{m.sender}</span> 
                        }
                            
                            <p className="chat_content">{m.content}</p>       
                        </div>
                        {
                            m.sender !== data.nickname ?
                            <span className="chat_date">{moment(m.date).format("a HH:mm")}</span> :<></>
                        }
                        
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
        <>
        <div className="talk_list_header">
               <img src="/image/talkLogo.png" alt="Talk Logo"/>
        </div>
        <div className="chat_wrap" >

            <ul className="chat_users">
            {
                users.map(m=>{
                    const me = m.nickname === data.nickname ? "chat_text_me" : "";
                    return(
                        <li key={m.id} className={me}><FaUser/>{m.nickname}</li>
                    )
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
        </>
    )
}