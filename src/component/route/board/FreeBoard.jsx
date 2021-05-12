import { useEffect, useState } from "react";
import Board from "../../part/write/Board";
import BoardTable from "../../part/write/BoardTable";
import { IoMdList } from 'react-icons/io';
import { BsTable } from 'react-icons/bs';
import "../../../css/write/board.scss";
import BoardCard from "../../part/write/BoardCard";

export default function FreeBoard(){

    const [data,setData] = useState([{
        id : 5,
        title : "공지사항",
        writer : "ADMIN",
        created : "2021-05-12 18:22",
        hits : "20",
        recommend : 50
    }]);

    const [type, setType] = useState("list");
    
    useEffect(()=>{
        
    },[])


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
            linkColumn={"title"}/>
            
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