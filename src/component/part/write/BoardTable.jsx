import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import "../../../css/write/boardTable.scss";
import useMember from "../../../customState/useMember";
import SubLoading from "../../sub_loading";

import Loading from "../Loading";
export default function BoardTable(props){

    const [col, setCol] = useState([]);
    const { 
        columnData ,
        data,
        columnDataKey,
        boardName,
        linkColumn,
        dateColumn,
        updatedColumn,
        writerColumn,
        videoColumn,
        autoSize,
        loading,
        colgroup,
        imageColumn,
     } = props;
    
     
    const history = useHistory();
     console.log(data)
    useEffect(()=>{
        
        const col = colgroup ? colgroup.split(" ") : []
        setCol(col || []);
    },[])

    const dataField = ()=>{
        const key= Object.keys(data[0]);
        return key;
    }
  
    const onClickHandler=(id)=>{
        history.push(`/bbs/${boardName ? boardName : "free"}/${id}`)
    }
    return(
        <>
        <table className={autoSize ? "control" : "table"}>    
            <colgroup>
            {
                col.map((c,i)=>{
                    return <col width={c} key={i+c}/>    
                })
            }
            </colgroup>
            <thead>
                <tr>
                {   
                    columnData ? 
                    columnData.map((c,i)=>{
                        return <th key={c+i}>{c}</th>
                    }):<></>
                }
                </tr>
            </thead>
            <tbody>        
                {
                    loading ?  <tr><td colSpan={columnData ? columnData.length : 0}><SubLoading/></td></tr> : 
                    data ?
                    data.map((d,i)=>{
                        const unique = videoColumn && d[videoColumn]? d[videoColumn].split("https://youtu.be/")[1]: "";
                        const key = dataField();
                        return (          
                            <tr key={i+"tables"+i} > 
                                      
                                {
                                columnDataKey ? columnDataKey.map((k,j)=>{           
                                    if(linkColumn){
                                      
                                        return (
                                            <td key={k+i+j} onClick={k===linkColumn ? ()=>{onClickHandler(d.id)}:()=>{}} 
                                            className={k===linkColumn? "link" : ""} style={k==="title" ? {width : "40%"} : {}}>
                                          
                                                {          
                                                k === "id" && moment.duration(moment().diff(moment(d[dateColumn]))).days() < 1 ?
                                                <div className="new"><pcon><span>NEW</span></pcon>{d[k]}</div> :
                                                dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                videoColumn === k && d.videoType === "YOUTUBE" ? 
                                                <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "LOCAL" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "NONE" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                writerColumn === k && d.rank==="ADMIN" ?  
                                                <div className="flex"><pcon style={{backgroundColor:"#c4302b"}}>
                                                    <span >운영자</span>  
                                                </pcon>{d[k]}</div> :
                                                imageColumn === k ?  <img className="thumbnail" src={d.imageList[0] ? d.imageList[0].image_url : `/no_thumbnail.png`} alt="youtube_video"/> :
                                                d[k]}
                                                {
                                                    dateColumn === k && updatedColumn && moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") !== moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm") ? 
                                                    <div className="updated">(수정됨) {moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm")}</div> :<></>
                                                }
                                            </td>
                                        )
                                    }else{ 
                                        return (
                                            <td key={k+i+j} onClick={()=>{onClickHandler(d.id)}} style={k==="title" ? {width : "40%"} : {}}>
                                                 {          
                                                k === "id" && moment.duration(moment().diff(moment(d[dateColumn]))).days() < 1 ?
                                                <div className="new"><pcon><span>NEW</span></pcon>{d[k]}</div> :
                                                dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                videoColumn === k && d.videoType === "YOUTUBE" ? 
                                                <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "LOCAL" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "NONE" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                writerColumn === k && d.rank==="ADMIN" ?  
                                                <div className="flex"><pcon style={{backgroundColor:"#c4302b"}}>
                                                    <span >운영자</span>  
                                                </pcon>{d[k]}</div> : 
                                                d[k]}
                                                {
                                                    dateColumn === k && updatedColumn && moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") !== moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm") ? 
                                                    <div className="updated">(수정됨) {moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm")}</div> :<></>
                                                }
                                            </td>
                                        )
                                    }
                                    
                                }) : key.map((k,j)=>{
                                    if(linkColumn){
                                        return (
                                            <td key={k+i+j} onClick={k===linkColumn ? ()=>{onClickHandler(d.id)}:()=>{}} style={k==="title" ? {width : "40%"} : {}}>
                                             {          
                                                k === "id" && moment.duration(moment().diff(moment(d[dateColumn]))).days() < 1 ?
                                                <div className="new"><pcon><span>NEW</span></pcon>{d[k]}</div> :
                                                dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                videoColumn === k && d.videoType === "YOUTUBE" ? 
                                                <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "LOCAL" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "NONE" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                writerColumn === k && d.rank==="ADMIN" ?  
                                                <div className="flex"><pcon style={{backgroundColor:"#c4302b"}}>
                                                    <span >운영자</span>  
                                                </pcon>{d[k]}</div> :
                                                d[k]}
                                                {
                                                    dateColumn === k && updatedColumn && moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") !== moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm") ? 
                                                    <div className="updated">(수정됨) {moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm")}</div> :<></>
                                                }
                                            </td>
                                        )
                                    }else{
                                        return (
                                            <td key={k+i+j} onClick={()=>{onClickHandler(d.id)}} style={k==="title" ? {width : "40%"} : {}}>
                                                 {          
                                                k === "id" && moment.duration(moment().diff(moment(d[dateColumn]))).days() < 1 ?
                                                <div className="new"><pcon><span>NEW</span></pcon>{d[k]}</div> :
                                                dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                videoColumn === k && d.videoType === "YOUTUBE" ? 
                                                <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "LOCAL" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                videoColumn === k && d.videoType === "NONE" ?
                                                <img className="thumbnail" src={`/no_thumbnail.png`} alt="youtube_video"/> :
                                                writerColumn === k && d.rank==="ADMIN" ?  
                                                <div className="flex"><pcon style={{backgroundColor:"#c4302b"}}>
                                                    <span >운영자</span>  
                                                </pcon>{d[k]}</div> :
                                                d[k]}
                                                {
                                                    dateColumn === k && updatedColumn && moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") !== moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm") ? 
                                                    <div className="updated">(수정됨) {moment(d[updatedColumn]).format("YYYY-MM-DD HH:mm")}</div> :<></>
                                                }
                                            </td>
                                        )
                                    }
                                })
                                }
                               
                            </tr>
                           
                        )
                    }) : <tr><td colSpan={columnData.length}>게시글이 없습니다 😂</td></tr>
                }
            </tbody>
        </table>
        </>
    )
}