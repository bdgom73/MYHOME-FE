import "../../../css/modal/form/calendar_memo.scss";
import { MdTitle } from 'react-icons/md';
import { ImFileText2 } from 'react-icons/im';
import { FcCalendar } from 'react-icons/fc';

export default function CalendarView(props) {

    const {data} = props;
    console.log(data);
    return(
        <>
        <div className="calendar_memo_wrap">
           <form>
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
                    <button type="submit">수정</button>
                    <button type="button" className="delete">삭제</button>
                </div>
           </form>
        </div>
        </>
    );
}