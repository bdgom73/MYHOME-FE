import { useRef, useState } from "react";
import useMember from "../../../customState/useMember";
import io from "socket.io-client";
import immer from "immer";
const initialMessagesState = {
    general : [],
}

export default function ChatPage(props){
    const {params}= props.match;

    const member = useMember();
    const [username , setUsername] = useState("");
    const [connected, setConnected] = useState(false);
    const [currentChat, setCurrentChat] = useState({isChannel : false, chatName : "", receiverId:""});
    const [connectedRooms,setConnectedRooms]= useState(["general"]);
    const [allUsers, setAllUsers]=useState([]);
    const [messages, setMessages]=useState(initialMessagesState);
    const [message,setMessage] = useState("");
    const [currentRoomUsers, setCurrentRoomUsers] = useState([]);
    const socketRef = useRef();

    const roomJoinCallBack = (incomingMessages, room)=>{
        const newMessages = immer(messages, draft=>{
            draft[room] = incomingMessages;
        });

        setMessages(newMessages);
    }

    const connect = ()=>{     
        const payload = {
            roomid : params.id,
            roomname : params.room,
            username : member.data.nickname,
        }  
        setConnected(true);
        socketRef.current = io.connect("/room");
        socketRef.current.emit("join room", payload, messages => roomJoinCallBack(messages, params.room));
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
    return(
        <>

        </>
    )
}