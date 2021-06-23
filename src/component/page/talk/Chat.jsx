import { useEffect, useRef } from "react";



export default function Chat(props){

    const scrollRef = useRef();



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
        if(props.currentChat.chatName)
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    useEffect(()=>{
        scrollToBottom();
        return ()=>{
            scrollToBottom(); 
            
        }
    },[props.messages])
    console.log(props.currentRoomUsers)
    return(
        <>
        <div className="user">
            {props.allUsers.map(renderUser)}
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
             onChange = {props.handleMessageChange}
             value={props.message}
             onKeyPress={handleKeypress}/>
               
         </div> :<></>  
        }
        </>
    )
}