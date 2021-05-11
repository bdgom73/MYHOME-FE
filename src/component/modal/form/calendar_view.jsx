import "../../../css/modal/form/calendar_memo.scss";
import { MdTitle } from 'react-icons/md';
import { ImFileText2 } from 'react-icons/im';
import { FcCalendar } from 'react-icons/fc';
import axios from "axios";
import useMember from "../../../customState/useMember";
import { MdUpdate } from 'react-icons/md';
import { RiDeleteBin2Fill } from 'react-icons/ri';
export default function CalendarView(props) {

    const {data} = props;
    const member = useMember();

    function onSubmitHandler(e){
        const {target} = e;
        e.preventDefault();
       
        const fd = new FormData();
        fd.append("cid",data.id);
        fd.append("date",target[0].value);
        fd.append("title",target[1].value);
        fd.append("content",target[2].value);
        
        axios.put("/calendar/update?type=none",fd,{headers:{"Authorization" : member.SESSION_UID}})
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
                    <input type="text" name="date" defaultValue={data.date} readOnly/>
                </label>
                <label htmlFor="date">
                    <MdTitle/>
                    <input type="text" name="title" placeholder="제목을 입력해주세요" defaultValue={data.title}/>
                </label>     
                <label htmlFor="text">
                    <ImFileText2/>
                    <textarea name="text" maxLength="200" rows="8" placeholder="내용을 입력해주세요">{data.content}</textarea>
                </label> 
                <div className="controller">
                    <button type="submit"><MdUpdate size="20" color="#ffffff"/>수정</button>
                    <button type="button" className="btn delete"><RiDeleteBin2Fill size="20"/>삭제</button>
                </div>
           </form>
        </div>
        </>
    );
}