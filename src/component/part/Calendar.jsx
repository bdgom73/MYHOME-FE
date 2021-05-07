import { useEffect, useRef, useState } from "react";
import moment,{Moment as MomentTypes} from 'moment';
import { AiOutlineArrowLeft,AiOutlineArrowRight } from 'react-icons/ai';
import { MdDateRange } from 'react-icons/md';
import "../../css/part/Calendar.scss";
import CalendarMemo from "../modal/form/calendar_memo";
import Modal from "../modal/modal";
import CalendarView from "../modal/form/calendar_view";
import { dateRange } from "../../js/date";
import CalendarMemoRange from "../modal/form/calendar_memo_range";
import CalendarViewRange from "../modal/form/calendar_view_range";


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
    const [emValue, setEmValue] = useState(1);

    // 범위 일정 색 띠
    const colorEvent= ["#133d74","#ff3399","#41a500","#e60088","#00512c","0000ff"];
    //  값 주입
    const [rangeEvent,setRangeEvent] = useState([
        {
            startDate : "2021-05-10",
            endDate : "2021-05-12",
            memo : "",
            title : "dsdsdsdsdsdsds",
        }, 
        {
            startDate : "2021-05-28",
            endDate : "2021-05-30",
            memo : "",
            title : "dsdsdsdsdsdsds",
        }, 
         {
            startDate : "2021-05-01",
            endDate : "2021-05-05",
            memo : "",
            title : "dsdsdsdsdsdsds",
        }, 
        {
            startDate : "2021-05-05",
            endDate : "2021-05-10",
            memo : "",
            title : "dsdsdsdsdsdsds",
        }, 
        {
            startDate : "2021-05-06",
            endDate : "2021-05-13",
            memo : "",
            title : "dsdsdsdsdsdsds",
        }, 
        {
            startDate : "2021-05-09",
            endDate : "2021-05-18",
            memo : "test2",
            title : "테스트 입니다.",
        },
  
    ]);

    const [singleEvent,setSingleEvent]=useState([
        {
            date : "2021-05-10",
            memo : "",
            title : "zzz",
        }, 
    ])
    // 시작날짜
    const [startDate,setStartDate] = useState();

    // 종료날짜
    const [endDate,setEndDate] = useState();

    const [range,setRange] = useState(false);

    const [multSelect, setMultSelect] = useState(false);

    // 이벤트 모달 종류에 따른 이벤트 변경
    const ModalContext = ()=>{
        if(eventModal === 1){
            return <Modal title="Event" close={onCloseHandler}><CalendarMemo date={emValue}/></Modal>   
        }else if(eventModal === 2){
            return <Modal title="Event" close={onCloseHandler}><CalendarView date={emValue}/></Modal>  
        }else if(eventModal === 3){
            return <Modal title="Event" close={onCloseHandler}><CalendarMemoRange startDate={startDate} endDate={endDate}/></Modal>  
        }else if(eventModal === 4){
            return <Modal title="Event" close={onCloseHandler}><CalendarViewRange startDate={emValue.startDate} endDate={emValue.endDate}/></Modal> 
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

    /** 달력 범위 선택 */
    // 마우스 다운시 시작일 저장
    const onMouseDownHandler = (e)=>{
        if(multSelect){
            setRange(true);
            if(e.target.parentNode.className == "date_td "){
                setStartDate(e.target.parentNode.dataset.date);
            }
        }
        
    }

    // 마우스가 해당일에 들어가실 시 종료일 변경
    const onMouseEnterHandler = (e)=>{
        if(multSelect){
            if(range){
                setEndDate(e.target.dataset.date);
            }    
        }
    }

    // 마우스 업 시 시작, 종료일 선택
    const onMouseUpHandler = (e)=>{
        if(multSelect){
            setStartDate(startDate);
            setEndDate(e.target.parentNode.dataset.date ? e.target.parentNode.dataset.date : endDate);
            setEventModal(3);
            setRange(false);
        }
    }
    useEffect(()=>{    
        if(multSelect){
            const date_td = document.getElementsByClassName("date_td");
            const ra = dateRange(startDate,endDate);       
            for(let i = 0 ; i < date_td.length ; i++){
                for(let j=0 ; j < ra.length ; j++){
                    if(date_td[i].dataset.date === ra[j]){
                        date_td[i].style.backgroundColor = "#0000ff";            
                    }
                }
            }  
        }
    },[range,startDate,endDate])
    /** // 달력 범위 선택 */
  
    // 캘린더 생성
    function generate() {
        const today = moment(year+"-"+month+"-"+day);
        const startWeek = today.clone().startOf('month').week();
        const endWeek = today.clone().endOf('month').week() === 1 ? 53 : today.clone().endOf('month').week();
        let calendar = [];
        for (let week = startWeek; week <= endWeek; week++) {
           
          calendar.push(    
            <tr key={week+"week"} data-week={week} id="week">
              {
                Array(7).fill(0).map((n, i) => {
                    let current = moment(year+"-"+month).clone().week(week).startOf('week').add(n + i, 'day');
                    let isSelected = moment().format('YYYYMMDD') === current.format('YYYYMMDD') ? 'selected' : '';
                    let isGrayed = current.format('MM') === today.format('MM') ? '' : 'grayed';            
                    return (         
                        <td key={i+Math.random().toString(36).substr(2, 9)} data-date={current.format("YYYY-MM-DD")}
                            className={"date_td "+isSelected} onMouseDown={onMouseDownHandler}  onMouseEnter={onMouseEnterHandler} onMouseUp={onMouseUpHandler}              
                            >
                            <div className="date_day">
                                <span className={`date  ${isGrayed}`} onClick={()=>{ 
                                    for(let i = 0; i < singleEvent.length ; i++){
                                        if(singleEvent[i].date !== current.format("YYYY-MM-DD")){    
                                            onEventMemoHandler(current.format('YYYY-MM-DD'),1);      
                                        }
                                        if(singleEvent[i].date === current.format("YYYY-MM-DD")){
                                            setEventModal(0);    
                                            break;
                                        }
                                        
                                    }
                                }}>{current.format('D')}</span>
                            </div>
                            {
                                props.view ?
                                <div className="date_content" >  
                                    {
                                        rangeEvent.map((m,j)=>{     
                                            const dr = dateRange(m.startDate, m.endDate);   
                                            const color = colorEvent[j % 6];
                                            let width = "100%";
                                            let i = 0 ; 
                                            while(i < dr.length){     
                                                // 일정이 한 주 이내일때.
                                                if(moment(dr[0]).week() === moment(dr[dr.length-1]).week()){    
                                                    if(dr[0] === current.format("YYYY-MM-DD")){ 
                                                        width = moment(dr[dr.length-1]).weekday() - moment(dr[0]).weekday();
                                                        width = ((width + 1 ) * 100) + "%";  
                                                         
                                                        return (
                                                        <div 
                                                            className={ "range_status" } 
                                                            key={j+Math.random().toString(36).substr(2, 9)} 
                                                            title={m.title} 
                                                            style={{width: width,backgroundColor:color}}
                                                            onClick={()=>{onEventMemoHandler({startDate :dr[0] , endDate : dr[dr.length-1]},4);}}>
                                                            <span>{dr[0] === current.format("YYYY-MM-DD") ? m.title : ""}  </span>       
                                                        </div>);
                                                    }
                                                }  

                                                // 일정이 한주 이상이면 시작일부터 그 주 전부 표시
                                                if(dr[0] === current.format("YYYY-MM-DD")){            
                                                    width = 5 - moment(dr[0]).weekday();
                                                    width = ((width + 2 ) * 100) + "%";   
                                                    return (
                                                        <div 
                                                            className={ "range_status" } 
                                                            key={j+Math.random().toString(36).substr(2, 9)} 
                                                            title={m.title} 
                                                            style={{width: width,backgroundColor:color}}
                                                            onClick={()=>{onEventMemoHandler({startDate :dr[0] , endDate : dr[dr.length-1]},4);}}>
                                                            <span>{dr[0] === current.format("YYYY-MM-DD") ? m.title : ""}  </span>         
                                                        </div>
                                                        );
                                                }   

                                                // 일정이 3주 이상일 경우.
                                                if(moment(dr[dr.length-1]).week() !== moment(dr[i]).week() && moment(dr[0]).week() !== moment(dr[i]).week()){                     
                                                    if(moment(dr[i]).weekday() === 0 && dr[i] ===current.format("YYYY-MM-DD") ){    
                                                        width = 700+"%";       
                                                        return (
                                                            <div 
                                                                className={ "range_status" } 
                                                                key={j+Math.random().toString(36).substr(2, 9)} 
                                                                title={m.title} 
                                                                style={{width: width,backgroundColor:color}}
                                                                onClick={()=>{onEventMemoHandler({startDate :dr[0] , endDate : dr[dr.length-1]},4);}}>
                                                                <span>{dr[i] === current.format("YYYY-MM-DD") ? m.title : ""}  </span>          
                                                            </div>); 
                                                    }   
                                                }
                                                // 일정이 3주 이상일 경우 중간 주 전부 표시
                                                if(moment(dr[i]).weekday() === 0 && dr[i] === current.format("YYYY-MM-DD") ){
                                                    width = moment(dr[dr.length-1]).weekday() - moment(dr[i]).weekday();
                                                    width = ((width + 1 ) * 100) + "%";       
                                                    return (
                                                        <div 
                                                            className={ "range_status" } 
                                                            key={j+Math.random().toString(36).substr(2, 9)} 
                                                            title={m.title} 
                                                            style={{width: width,backgroundColor:color}}
                                                            onClick={()=>{onEventMemoHandler({startDate :dr[0] , endDate : dr[dr.length-1]},4);}}>
                                                            <span>{dr[i] === current.format("YYYY-MM-DD") ? m.title : ""}  </span>        
                                                        </div>);  
                                                }
                                                
                                                
                                                
                                                
                                                                                             
                                                i++;                       
                                            }
                                           
                                           
                                           
                                        })
                                    }
                                  
                                    {  
                                        singleEvent.map((m,j) => {   
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
        <div className="calendar_wrap" id="calendar" style={{width:props.width}}>
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
            {
                !props.readonly ?  (
                <div className="btn_wrap">
                    <button type="button" className="btn" onClick={()=>{setMultSelect(!multSelect)}}
                        style={multSelect ? {background : "#c4302b"} : {}}
                    >다중선택</button>
                </div>) : <></>
            }
           
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