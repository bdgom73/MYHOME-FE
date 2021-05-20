import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import "../../../css/write/boardTable.scss";

import Loading from "../Loading";
export default function BoardTable(props){

    const { 
        columnData ,
        data,
        columnDataKey,
        boardName,
        linkColumn,
        dateColumn,
        writerColumn,
        videoColumn,
        autoSize,
     } = props;

    const history = useHistory();
 

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
            <thead>
                <tr>
                {
                    columnData.map((c,i)=>{
                        console.log(videoColumn, c)
                        return <th key={c+i}>{c}</th>
                    })
                }
                </tr>
            </thead>
            <tbody>
                {
                    data.length > 0?
                    data.map((d,i)=>{
                        const unique = videoColumn && d[videoColumn]? d[videoColumn].split("https://youtu.be/")[1]: "";
                        const key = dataField();
                        return (
                            <tr key={i+"tables"+i} >
                                {
                                    columnDataKey ? columnDataKey.map((k,j)=>{  
                                       
                                        if(linkColumn){
                                            return (
                                                <td key={k+i+j} onClick={k===linkColumn ? ()=>{onClickHandler(d.id)}:()=>{}}>
                                                    {dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                    videoColumn === k ? <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                    d[k]}
                                                </td>
                                            )
                                        }else{ 
                                            return (
                                                <td key={k+i+j} onClick={()=>{onClickHandler(d.id)}}>
                                                    {dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                    videoColumn === k ? <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                    d[k]}
                                                </td>
                                            )
                                        }
                                      
                                    }) : key.map((k,j)=>{
                                        if(linkColumn){
                                            return (
                                                <td key={k+i+j} onClick={k===linkColumn ? ()=>{onClickHandler(d.id)}:()=>{}}>
                                                {dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                    videoColumn === k ? <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                    d[k]}
                                                </td>
                                            )
                                        }else{
                                            return (
                                                <td key={k+i+j} onClick={()=>{onClickHandler(d.id)}}>
                                                    {dateColumn === k ? moment(d[dateColumn]).format("YYYY-MM-DD HH:mm") : 
                                                    videoColumn === k ? <img className="thumbnail" src={`https://i1.ytimg.com/vi/${unique}/1.jpg`} alt="youtube_video"/> :
                                                    d[k]}
                                                </td>
                                            )
                                        }
                                    })
                                }
                               
                            </tr>
                        )
                    }) : <tr><td colSpan={columnData.length}><Loading/></td></tr>
                }
            </tbody>
        </table>
        </>
    )
}