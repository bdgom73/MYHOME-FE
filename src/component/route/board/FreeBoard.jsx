import { useEffect, useState } from "react";
import Board from "../../part/write/Board";
import BoardTable from "../../part/write/BoardTable";
import { IoMdList } from 'react-icons/io';
import { BsTable } from 'react-icons/bs';
import "../../../css/write/board.scss";
import BoardCard from "../../part/write/BoardCard";
import axios from "axios";

export default function FreeBoard(){

    
    const [itemCount, setItemCount] = useState(20);
    const [preItemCount, setPreItemCount] = useState(0);

    const infiniteScroll = ()=>{
        const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        const scrollTop = Math.max(Math.round(document.documentElement.scrollTop), Math.round(document.body.scrollTop));
        const clientHeight = document.documentElement.clientHeight; 
        if(type !== "list" && permit){
            if(scrollTop + clientHeight === scrollHeight){  
                setPreItemCount(itemCount);
                setItemCount(itemCount + 20);         
                return;
            }

        }
    }
    
    const [data,setData] = useState([]);
    const [permit,setPermit] = useState(true);
    const [type, setType] = useState("list");
    
    useEffect(()=>{
        if(itemCount !== preItemCount) _getUrl();
    },[itemCount])
    useEffect(()=>{
        window.addEventListener("scroll",infiniteScroll,true)     
    })
    const _getUrl = ()=>{      
        axios.get(`/bbs/free/get?size=${itemCount}&page=0`)
        .then(res=>{
            setData(res.data);  
            if(res.data.length < itemCount){
                setPermit(false);
            }
        }).catch(e=> console.log(e.response))
    }
    return (
        <>
        {
        type === "list" ? (
        <Board style={{maxWidth:"800px",margin:"15px auto"}}>
        <h1>공유게시판</h1>
        <div className="board_controller">
            <span className="item" onClick={()=>{setType("list")}} title="리스트로 보기"><IoMdList size="22"/></span>
            <span className="item" onClick={()=>{setType("table")}} title="상세보기"><BsTable size="22"/></span>
        </div>
        <BoardTable 
             data={data}
             columnData={["No","제목","글쓴이","작성일","조회","추천"]}
             linkColumn={"title"}
             boardName="video"
             columnDataKey={["id","title","writer","updated","views","recommend"]}/>
            
        </Board>
        ) : (
        <Board>
        <h1>공유게시판</h1>
        <div className="board_controller">
            <span className="item" onClick={()=>{setType("list")}} title="리스트로 보기"><IoMdList size="22"/></span>
            <span className="item" onClick={()=>{setType("table")}} title="상세보기"><BsTable size="22"/></span>
        </div>
        {
            data.map(m=>{
                return <BoardCard 
                    id={m.id}
                    title={m.title}
                    key = {m.title}
                    writer = {m.writer}
                    recommend = {m.recommend}
                    views = {m.hits}/>
            })
        }
        </Board>
        )
        }
        
        </>
    );
}