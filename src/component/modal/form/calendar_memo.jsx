import { useEffect } from "react";
import "../../../css/modal/form/calendar_memo.scss";
import { MdTitle } from 'react-icons/md';
import { ImFileText2 } from 'react-icons/im';
import { FcCalendar } from 'react-icons/fc';
import { BiBookmarkPlus } from 'react-icons/bi';
import axios from "axios";
import useMember from "../../../customState/useMember";

export default function CalendarMemo(props) {

    const member = useMember();

    function onSubmitHandler(e){
        const {target} = e;
        e.preventDefault();
       
        const fd = new FormData();
        fd.append("date",target[0].value);
        fd.append("title",target[1].value);
        fd.append("content",target[2].value);
        
        axios.post("/calendar/add",fd,{headers:{"Authorization" : member.SESSION_UID}})
            .then(res=>{
                props.close();
            }).catch(e=>{
                console.log(e.response);
            })
    }
    
    return(
        <>
        <div className="calendar_memo_wrap">
           <form onSubmit={onSubmitHandler}>
                <label htmlFor="date">
                    <FcCalendar/>
                    <input type="text" name="date" defaultValue={props.date} readOnly/>
                </label>
                <label htmlFor="date">
                    <MdTitle/>
                    <input type="text" name="title" placeholder="제목을 입력해주세요"/>
                </label>     
                <label htmlFor="text">
                    <ImFileText2/>
                    <textarea name="text" maxLength="200" rows="8" placeholder="내용을 입력해주세요" ></textarea>
                </label> 
                <div className="controller">
                    <button type="submit"><BiBookmarkPlus size="20"/>추가</button>
                </div>
           </form>
        </div>
        </>
    );
}