import { useEffect, useRef } from "react";

const rooms = [
    "general",
    "random",
    "jokes",
    "javascript"
];

export default function Chat(props){

    const scrollRef = useRef();

    const renderRooms = (room)=>{
        const currentChat = {
            chatName : room,
            isChannel : true,
            receiverId : "",
        }
        return(
            <div className="row" onClick={()=>{props.toggleChat(currentChat); props.joinRoom(room)}} key={room}>
                {room}
            </div>
        )
    }

    const renderMessages=(message, index)=>{
        return(
            <div key={index}>
                <h3>{message.sender}<small>{message.date}</small> </h3>
                <p>{message.content}</p>
            </div>
        );
    }

    let body;
    if(!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)){
        body = (
            <div className="message">
                {props.messages.map(renderMessages)}
            </div>
        )
    }else{
        <button onClick={()=>{
            props.joinRoom(props.currentChat.chatName);
        }}>Join</button>
    }

    const handleKeypress=(e)=>{
        if(e.key === "Enter"){
            props.sendMessage();
        }
    }

    const renderUser = (user)=>{
        if(user.id === props.yourId){
            return(
                <div className="row" key={user.id}>
                    You : {user.username}
                </div>
            )
        };
        const currentChat = {
            chatName : user.name,
            isChannel : false,
            receiverId : user.id,
        }
        return(
            <div className="row" key={user.id} onClick={()=>{props.toggleChat(currentChat)}}>
                {user.username}
            </div>
        )
    }

    const scrollToBottom = ()=>{
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    useEffect(()=>{
        scrollToBottom();
        return ()=>{
            scrollToBottom(); 
        }
    },[props.messages])

    return(
        <>
        <div className="channel">
            {rooms.map(renderRooms)}
        </div>
        <div className="user">
            {props.allUsers.map(renderUser)}
        </div>
        <div className="chat_panel">
            <div className="channelInfo">
                {props.currentChat.chatName}
            </div>
            <div className="chat_wrap" ref={(r)=> scrollRef.current = r}>
                {body}
            </div>
            <input type="text" 
                onChange = {props.handleMessageChange}
                value={props.message}
                onKeyPress={handleKeypress}
            />
            
        </div>
        </>
    )
}