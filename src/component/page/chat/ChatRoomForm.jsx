import axios from "axios";
import { useRef, useState } from "react";
import { useCookies } from "react-cookie";
import useMember from "../../../customState/useMember";

export default function ChatRoomForm(props){

     /* FORM DATA */
    // chat type
    const [radioValue , setRadioValue] = useState("");
    // password when type is public
    const [roomPassword, setRoomPassword] = useState("");
    // room title
    const [roomTitle,setRoomTitle] = useState("");

    const {SESSION_UID} = useMember();

    const titleRef = useRef();

    const submitHandler = ()=>{
        const fd = new FormData();
        if(!roomTitle){
            const title_msg = document.getElementById("chat_room_make_title_msg");
            title_msg.innerText = "제목을 입력 해주세요.";
            titleRef.current.style.borderBottom = "2px solid #c41f1f";
            return;
        }
        if(!radioValue){
            const type_msg = document.getElementById("chat_room_make_type_msg");
            type_msg.innerText="타입을 설정해주세요";
            type_msg.className = "msg";
            return;
        }
        fd.append("title",roomTitle);
        fd.append("type",radioValue);
        if(radioValue === "public"){
            if(roomPassword){
                fd.append("password",roomPassword);
            }
        }
        axios.post(`/myApi/room/make/room/`,fd,{headers:{"Authorization" : SESSION_UID}})
            .then(res=>{
                props.close();
            }).catch(e=> alert("방만들기 실패"));
    }
    return(
        <div className="write_wrap ">
        <form style={{margin : "0"}}>
            <div className="label_wrap">
                <label>방제목</label>
                <input className="input" type="text" ref={r=>titleRef.current=r} placeholder="방 제목을 입력해주세요." value={roomTitle} onChange={(e)=>{
                    setRoomTitle(e.target.value);
                    const title_msg = document.getElementById("chat_room_make_title_msg");
                    title_msg.innerText = "";
                    titleRef.current.style.borderBottom = "1px solid #bbb";
                }}/>
                <div id="chat_room_make_title_msg" className="error"></div>
            </div>
            <div className="label_wrap">
                <label>방타입</label>
                <div id="chat_room_make_type_msg"></div>
                <div className="radio_wrap" >
                    <p className="radio_value">
                        <input type="radio" name="type" value="public" id="public" checked={radioValue === "public"} onChange={(e)=> {
                            setRadioValue(e.target.value);
                            const type_msg = document.getElementById("chat_room_make_type_msg");
                            type_msg.innerText="";
                            type_msg.className = "";
                        }}/>
                        <label htmlFor="public" className={radioValue === "public" ? "checked" : ""}>오픈채팅</label>
                        {
                            radioValue === "public" ? 
                            <div className="explanation">
                                아무나 입장 가능한 방입니다. <br/>
                                비밀번호 적용이 가능합니다.
                            </div> : <></>
                        }
                    </p>
                    <p className="radio_value">
                        <input type="radio" name="type" value="private" id="private" checked={radioValue === "private"}  onChange={(e)=> {
                            setRadioValue(e.target.value);
                            const type_msg = document.getElementById("chat_room_make_type_msg");
                            type_msg.innerText="";
                            type_msg.className = "";
                        }}/>
                        <label htmlFor="private" className={radioValue === "private" ? "checked" : ""}>그룹채팅</label>
                        {
                            radioValue === "private" ? 
                            <div className="explanation">
                                가입 신청을 통해 입장가능합니다.
                            </div> : <></>
                        }
                    </p>
                </div>  
            </div>    
            {
                radioValue === "public" ? 
                <div className="label_wrap" style={{marginTop : radioValue ? "50px" : ""}}>
                    <label>비밀번호</label>
                    <input className="input" type="password" placeholder="방 비밀번호를 입력해주세요." value={roomPassword} onChange={(e)=>{setRoomPassword(e.target.value)}}/>
                    <div className="success">비밀번호를 공백으로 두면 비밀번호는 따로 설정되지않습니다.</div>
                </div> :<></>  
            }          
        </form>
        <div className="btn_wrap">
            <button type="button" className="btn" onClick={submitHandler}>방만들기</button>
        </div>  
    </div>
    )
}