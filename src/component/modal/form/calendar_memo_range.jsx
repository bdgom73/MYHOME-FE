import { useEffect, useState } from "react";
import "../../../css/modal/form/calendar_memo.scss";
import { MdTitle } from 'react-icons/md';
import { ImFileText2 } from 'react-icons/im';
import { FcCalendar } from 'react-icons/fc';
import { BiBookmarkPlus } from 'react-icons/bi';
import axios from "axios";
import useMember from "../../../customState/useMember";

export default function CalendarMemoRange(props) {

    const {startDate, endDate} =props;
    const member = useMember();

    function onSubmitHandler(e){
        const {target} = e;
        e.preventDefault();
       
        const fd = new FormData();
        const value = target[0].value;
        const str = value.replace(" ", "");
        const date = str.split("~");
        const start = date[0].trim();
        const end = date[1].trim();
        fd.append("start_date",start);
        fd.append("end_date",end);
        fd.append("title",target[1].value);
        fd.append("content",target[2].value);
        
        axios.post("/calendar/add",fd,{headers:{"Authorization" : member.SESSION_UID}})
            .then(res=>{
                console.log(res);
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
                    <input type="text" name="date" defaultValue={
                        new Date(startDate) > new Date(endDate) ? endDate +" ~ "+startDate :startDate+" ~ "+endDate
                    } readOnly/>
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