import { useEffect, useState } from "react";
import Board from "../../part/write/Board";
import BoardTable from "../../part/write/BoardTable";
import { IoMdList } from 'react-icons/io';
import { BsTable } from 'react-icons/bs';
import "../../../css/write/board.scss";
import BoardCard from "../../part/write/BoardCard";
import axios from "axios";
import ReactPaginate from "react-paginate";
import qs from "query-string";
import { useHistory, useLocation } from "react-router";
import "../../../css/pagination.scss";
export default function VideoBoard(){

    const location = useLocation();
    const history = useHistory();
    const [data,setData] = useState([]);

    const [itemCount, setItemCount] = useState(40);
    const [preItemCount, setPreItemCount] = useState(0);
    const [total,setTotal] = useState(0);
    const [types, setTypes] = useState(true);
    const [permit,setPermit] = useState(true);
    const [page,setPage] = useState(qs.parse(location.search).page < 1 ? 0 : qs.parse(location.search).page-1 );

    /*
        TYPE이 테이블 일때 무한 스크롤
    */ 
    const infiniteScroll = ()=>{
        const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        const scrollTop = Math.max(Math.round(document.documentElement.scrollTop), Math.round(document.body.scrollTop));
        const clientHeight = document.documentElement.clientHeight; 
        if(!types){
            if(scrollTop + clientHeight === scrollHeight){  
                setPreItemCount(itemCount);
                setItemCount(itemCount + 40);    
                return;
            }

        }
    }
    useEffect(()=>{      
        window.addEventListener("scroll",infiniteScroll,true);   
    })

    //  TYPE이 테이블 일때 무한 스크롤
    useEffect(()=>{
        if(itemCount !== preItemCount) _getUrl();
    },[itemCount,permit,types])
    useEffect(()=>{
        _getUrl();
    },[page])
    // 총 size 가져오기
    useEffect(()=>{   
        if(!(qs.parse(location.search).page)) window.location.href="?page=1"
        axios.get(`/bbs/video/size`)
        .then(res=>{
            setTotal(res.data)
        })
    },[]);

   // data가져오기
    const _getUrl = ()=>{      
        let url = types ? `/bbs/video/get?size=${40}&page=${page}` : `/bbs/video/get?size=${itemCount}&page=0`;
        axios.get(url)
        .then(res=>{
            setData(res.data);  
            if(res.data.length < itemCount){
                setPermit(false);
            }
            if(types  && res.data.length < 1){
                window.location.href="?page=1";
            }
        }).catch(e=> console.log(e.response))
    }
    
    return (
        <>
        {
        types ? (
        <Board style={{maxWidth:"1100px",margin:"15px auto"}}>
        <h1>영상게시판</h1>
        <div className="board_controller">
            <span className="item" onClick={()=>{setTypes(true)}} title="리스트로 보기"><IoMdList size="22"/></span>
            <span className="item" onClick={()=>{setItemCount(40); setData([]); setTypes(false); }} title="상세보기"><BsTable size="22"/></span>
        </div>
        <BoardTable 
            data={data}
            columnData={["No","영상","제목","글쓴이","작성일","조회","추천"]}
            linkColumn={"title"}
            boardName="video"
            columnDataKey={["id","video_url","title","writer","updated","views","recommend"]}
            dateColumn="updated"
            videoColumn="video_url"
            autoSize
            />
         <ReactPaginate 
            pageCount={Math.ceil(total / 40)}
            pageRangeDisplayed={40}
            marginPagesDisplayed={0}
            breakLabel={""}
            previousLabel={"이전"}
            nextLabel={"다음"}
            onPageChange={({selected})=>{   
                setPage(Number(selected));     
                history.replace(`?page=${Number(selected)+1}`);
            }}
            containerClassName={"pagination-ul"}
            activeClassName={"currentPage"}
            previousClassName={"pageLabel-btn"}
            nextClassName={"pageLabel-btn"}
        />     
        </Board>
        ) : (
        <Board style={{maxWidth:"1100px",margin:"15px auto"}}>
        <h1>영상게시판</h1>
        <div className="board_controller">
            <span className="item" onClick={()=>{window.location.href="?page=1"}} title="리스트로 보기"><IoMdList size="22"/></span>
            <span className="item" onClick={()=>{setTypes(false)}} title="상세보기"><BsTable size="22"/></span>
        </div>
        <div className="card_board_wrpa">
        {
            data.map(m=>{
                const unique = m.video_url ? m["video_url"].split("https://youtu.be/")[1]: "";
                return <BoardCard 
                    id={m.id}
                    title={m.title}
                    key = {m.title}
                    writer = {m.writer}
                    recommend = {m.recommend}
                    views = {m.views}
                    imageUrl={`https://i1.ytimg.com/vi/${unique}/0.jpg`}
                    />
            })
        }
        </div>
        </Board>
        )
        }
        
        </>
    );
}