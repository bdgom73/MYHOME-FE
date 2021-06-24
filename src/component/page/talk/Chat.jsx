import moment from "moment";
import { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import useMember from "../../../customState/useMember";



export default function Chat(props){

    const member = useMember();
    const history = useHistory();
    const scrollRef = useRef();
    const renderMessages=(message, index)=>{
        if(member.data.nickname === message.sender){
            return(
                <div key={index} className="my_chat_message">
                     <span className="chat_date">
                        {moment(message.date).format("a HH:mm ")}
                    </span>       
                    <div className="chat_message_body ">
                        <span className="chat_sender" onClick={()=> history.push(`/user=${member.data.nickname}`)}>
                            {message.sender}
                        </span>
                        <p className="chat_content">{message.content}</p>  
                    </div>              
                      
                </div>
            );
        }else{
            return(
                <div key={index} className="chat_message">
                    <div className="chat_message_body">
                        <span className="chat_sender">{message.sender}</span>
                        <p className="chat_content">{message.content}</p>  
                    </div>              
                    <span className="chat_date">
                        {moment(message.date).format("a HH:mm ")}
                    </span>          
                </div>
            );
        }
      
    }


  
    useEffect(()=>{
        const alertMsg = document.getElementById("chat_alert_message");
        if(alertMsg){
            const p = document.createElement("p");
            p.className = "success";
            p.innerText = props.alertMessage;
            alertMsg.append(p);
        }
      
    },[props.alertMessage])

    let body;
    if(!props.currentChat.isChannel || props.connectedRooms.includes(props.currentChat.chatName)){
        body = (
            <div className="message" id="chat_alert_message">
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
            chatName : user.username,
            isChannel : false,
            receiverId : user.id,
        }
        return(
            <div className="row" key={user.id} 
            onClick={()=>{props.toggleChat(currentChat); props.joinRoom(user.username)}}>
                {user.username}
            </div>
        )
    }

    const scrollToBottom = ()=>{
        if(props.currentChat.chatName){
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      
    }
    useEffect(()=>{
        scrollToBottom();     
    },[props.messages])
    
    return(
        <>
        <div className="user">
            {props.allUsers.filter(u => u.room === props.currentChat.chatName).map(renderUser)}
        </div>    
        {
             props.currentChat.chatName ? 
             <div className="chat_panel">
            <div className="user">
            {props.currentRoomUsers.map(renderUser)}
            </div> 
             <div className="channelInfo">
                 {props.currentChat.chatName}
             </div>
             <div className="chat_wrap" ref={(r)=> scrollRef.current = r}>
                {body}
             </div>
            
             <input type="text" 
             placeholder="채팅을 입력해주세요"
             className="chat_input"
             onChange = {props.handleMessageChange}
             value={props.message}
             onKeyPress={handleKeypress}/>
               
         </div> :<></>  
        }
        </>
    )
}