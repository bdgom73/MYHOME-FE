import { useEffect, useState } from "react";
import moment,{Moment as MomentTypes} from 'moment';
import { AiOutlineArrowLeft,AiOutlineArrowRight } from 'react-icons/ai';
import { MdDateRange } from 'react-icons/md';
import "../../css/part/Calendar.scss";
import CalendarMemo from "../modal/form/calendar_memo";
import Modal from "../modal/modal";
import CalendarView from "../modal/form/calendar_view";


export default function Calendar(props){

    // 저장된 현재 년도
    const [year,setYear]=useState(new Date().getFullYear());
    // 저장된 현재 월
    const [month,setMonth]=useState(new Date().getMonth()+1);
    // 저장된 현재 일
    const [day,setDay]=useState(new Date().getDate());
    // 날짜 변경 모달 활성여부
    const [dateChange,setDateChange] = useState(false);
    // 값입력 모달창 활성여부
    const [eventModal,setEventModal] = useState(0);
    // 이벤트 모달 종류 결정
    const [emValue, setEmValue] = useState(1)
    // 테스트 값 주입
    const [a,setA] = useState([
        {
            date : "2021-04-01",
            memo : "test",
            title : "테스트 입니다."
        },
        {
            date : "2021-04-02",
            memo : "test2",
            title : "테스트 입니다.",
        },
        {
            date : "2021-04-03",
            memo : "test2",
            title : "테스트 입니다.",
        }
    ]);

    // 이벤트 모달 종류에 따른 이벤트 변경
    const ModalContext = ()=>{
        if(eventModal === 1){
            return <Modal title="Event" close={onCloseHandler}><CalendarMemo date={emValue}/></Modal>   
        }else if(eventModal === 2){
            return <Modal title="Event" close={onCloseHandler}><CalendarView date={emValue}/></Modal>  
        }
    }

    // 이벤트 모달창 종료
    const onCloseHandler = ()=>{
        setEventModal(0);
        const body = document.body;
        body.style.overflow ="auto";
    }

    // 이벤트 모달창 활성화 
    const onEventMemoHandler = (date,view)=>{  
        if(props.readonly){
            return;
        }
        setEmValue(date);
        setEventModal(view);
    }

    // 캘린더 생성
    function generate() {
        const today = moment(year+"-"+month+"-"+day);
        const startWeek = today.clone().startOf('month').week();
        const endWeek = today.clone().endOf('month').week() === 1 ? 53 : today.clone().endOf('month').week();
        let calendar = [];
        for (let week = startWeek; week <= endWeek; week++) {
          calendar.push(
            <tr key={week+"week"}>
              {
                Array(7).fill(0).map((n, i) => {
                  let current = moment(year+"-"+month).clone().week(week).startOf('week').add(n + i, 'day');
                  let isSelected = moment().format('YYYYMMDD') === current.format('YYYYMMDD') ? 'selected' : '';
                  let isGrayed = current.format('MM') === today.format('MM') ? '' : 'grayed';  
                  return (
                        
                        <td key={i+Math.random().toString(36).substr(2, 9)}  className={isSelected}>
                            <div className="date_day">
                                <span className={`date  ${isGrayed}`} onClick={()=>{ 
                                    for(let i = 0; i < a.length ; i++){
                                        if(a[i].date !== current.format("YYYY-MM-DD")){    
                                            onEventMemoHandler(current.format('YYYY-MM-DD'),1);      
                                        }
                                        if(a[i].date === current.format("YYYY-MM-DD")){
                                            setEventModal(0);    
                                            break;
                                        }
                                        
                                    }
                                }}>{current.format('D')}</span>
                            </div>
                            {
                                props.view ?
                                <div className="date_content">
                                    {  
                                        a.map((m,j) => {   
                                            if(m.date === current.format("YYYY-MM-DD")){
                                                return <div className="status" key={j+Math.random().toString(36).substr(2, 9)} title={m.title} onClick={()=>{ onEventMemoHandler(current.format('YYYY-MM-DD'),2);}}>{m.title}</div>;
                                            }  
                                            return "";
                                        })
                                    }
                                </div>
                                : <></>
                            }
                        </td>              
                       
                    );
                })
              }
            </tr>
          )
        }
        return calendar;
    }

    // 다음달 이동
    const nextMonth = ()=>{
        if(month >= 12){
            setMonth(1);
            setYear(year+1);
        }else{
            setMonth(month+1);
        }
    }
    // 이전달 이동
    const preMonth = ()=>{
        if(month <= 1){
            setMonth(12);
            setYear(year-1);
        }else{
            setMonth(month-1);
        }
    }

    // 날짜변경
    const changeDate = (e)=>{
        e.preventDefault();
        setYear(Number(e.target[0].value));
        setMonth(Number(e.target[1].value));
        setDateChange(false);
    }
    return(
        <>
        <div className="calendar_wrap" style={{width:props.width}}>
        {ModalContext()}
            <div className="calendar_top">
                <button type="button"><AiOutlineArrowLeft size="30" onClick={preMonth}/></button>
                <span className="current_date">
                    {`${year} / ${month<10 ? "0"+month : month} 일정표`}
                    <MdDateRange size="25" onClick={()=>{setDateChange(!dateChange)}}/>
                    {
                        dateChange ? (
                            <div className="date_selector">
                                <form onSubmit={changeDate}>
                                    <select defaultValue={year}>
                                        {
                                            Array(30).fill().map((m,i)=>{   
                                                return(
                                                    <option key={i+Math.random().toString(36).substr(2, 9)} value={2010+i}>{2010 + i}</option>
                                                );
                                            })
                                        }
                                    </select>
                                    <select defaultValue={month}>
                                        {
                                            Array(12).fill().map((m,i)=>{
                                                return(
                                                    <option key={i+1+Math.random().toString(36).substr(2, 9)}  value={i+1}>{i+1}</option>
                                                );
                                            })
                                        }
                                    </select>
                                    <input type="submit" value="변경"/>
                                </form>
                            </div>
                        ) : <></>
                    }
                    
                </span>
                <button type="button"><AiOutlineArrowRight size="30" onClick={nextMonth}/></button>
            </div>
            <table className="calendar_table">
                <colgroup>
                    <col width="13%"></col>
                    <col width="13%"></col>
                    <col width="13%"></col>
                    <col width="13%"></col>
                    <col width="13%"></col>
                    <col width="13%"></col>
                    <col width="13%"></col>
                </colgroup>
                <thead>
                    <tr>
                        <th>일</th>
                        <th>월</th>
                        <th>화</th>
                        <th>수</th>
                        <th>목</th>
                        <th>금</th>
                        <th>토</th>
                    </tr>
                </thead>
                <tbody>
                    {generate()}
                </tbody>
            </table>
        </div>
       
        </>
    );
}