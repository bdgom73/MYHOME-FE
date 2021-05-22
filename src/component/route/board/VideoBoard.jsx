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
    const [loading,setLoading] = useState(true);
    const [itemCount, setItemCount] = useState(40);
    const [preItemCount, setPreItemCount] = useState(0);
    const [total,setTotal] = useState(0);
    const [page,setPage] = useState(0);
    const [totalPage,setTotalPage]=useState(0);
    const [stop,setStop] = useState(false);
    // const [test,setTest] = useState("test");
    /*
        TYPE이 테이블 일때 무한 스크롤
    */ 
    const infiniteScroll = ()=>{
        const scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        const scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        const clientHeight = document.documentElement.clientHeight; 
        // setTest("a값 : " + (scrollTop + clientHeight-200) + " b 값 : " + scrollHeight);
        if((scrollTop + clientHeight+500) >= scrollHeight){  
            if(page === (totalPage)){
                setStop(true);   
            }else {       
                setPage(page+1);   
                setStop(false);  
                
            }
        }
        
    }
    useEffect(()=>{      
        window.addEventListener("scroll",infiniteScroll);  
        return ()=>{
            window.removeEventListener("scroll",infiniteScroll)
        }
       
    })
    
    //  TYPE이 테이블 일때 무한 스크롤
    useEffect(()=>{
       if(!stop) _getUrl();     
    },[page])

    // 총 size 가져오기
    useEffect(()=>{   
        axios.get(`/bbs/video/size`)
        .then(res=>{
            setTotal(res.data);
            setTotalPage(Math.ceil(res.data / 40))
        })
       
    },[]);



   // data가져오기
    const _getUrl = ()=>{   
        setLoading(true)    
        let url =  `/bbs/video/get?size=${40}&page=${page}`;
        axios.get(url)
        .then(res=>{
            for(let i = 0 ; i < res.data.length ; i++ ){
                data.push(res.data[i]);
            }
            setData(data);  
            setLoading(false)          
        }).catch(e=> console.log(e.response))
    }
    
   
 
    return(
        <Board style={{maxWidth:"1100px",margin:"15px auto"}}>
        <h1>영상게시판</h1>
        {/* <div className="test">{test}</div> */}
        <div className="card_board_wrap">
        {
            data.map((m,i)=>{
                const unique = m.video_url ? m["video_url"].split("https://youtu.be/")[1]: "";
                return <BoardCard 
                    id={m.id}
                    title={m.title}
                    key = {m.title+i}
                    writer = {m.writer}
                    recommend = {m.recommend}
                    views = {m.views}
                    imageUrl={m.videoType ==="YOUTUBE" ? `https://i1.ytimg.com/vi/${unique}/0.jpg` : "/no_thumbnail.png"}
                    rank = {m.rank}
                    created = {m.created}
                    updated = {m.updated}
                    />
            })
        }
        </div>
        </Board>
    )
}

// return (
//     <>
//     {
//     types ? (
//     <Board style={{maxWidth:"1100px",margin:"15px auto"}}>
//     <h1>영상게시판</h1>
//     <div className="board_controller">
//         <span className="item" onClick={()=>{onTypeClick(true)}} title="리스트로 보기"><IoMdList size="22"/></span>
//         <span className="item" onClick={()=>{setItemCount(40); setData([]); onTypeClick(false); }} title="상세보기"><BsTable size="22"/></span>
//     </div>
//     <BoardTable 
//         data={data}
//         columnData={["No","영상","제목","글쓴이","작성일","조회","추천"]}
//         linkColumn={"title"}
//         boardName="video"
//         columnDataKey={["id","video_url","title","writer","created","views","recommend"]}
//         dateColumn="created"
//         updatedColumn = "updated"
//         videoColumn="video_url"
//         autoSize
//         loading={loading}
//         writerColumn="writer"
//         />
//      <ReactPaginate 
//         pageCount={Math.ceil(total / 40)}
//         pageRangeDisplayed={40}
//         marginPagesDisplayed={0}
//         breakLabel={""}
//         previousLabel={"이전"}
//         nextLabel={"다음"}
//         onPageChange={({selected})=>{   
//             setPage(Number(selected));     
//             history.replace(`?page=${Number(selected)+1}`);
//         }}
//         containerClassName={"pagination-ul"}
//         activeClassName={"currentPage"}
//         previousClassName={"pageLabel-btn"}
//         nextClassName={"pageLabel-btn"}
//     />     
//     </Board>
//     ) : (
//     <Board style={{maxWidth:"1100px",margin:"15px auto"}}>
//     <h1>영상게시판</h1>
//     <div className="board_controller">
//         <span className="item" onClick={()=>{onTypeClick(true,true)}} title="리스트로 보기"><IoMdList size="22"/></span>
//         <span className="item" onClick={()=>{onTypeClick(false)}} title="상세보기"><BsTable size="22"/></span>
//     </div>
//     <div className="card_board_wrap">
//     {
//         data.map((m,i)=>{
//             const unique = m.video_url ? m["video_url"].split("https://youtu.be/")[1]: "";
//             return <BoardCard 
//                 id={m.id}
//                 title={m.title}
//                 key = {m.title+i}
//                 writer = {m.writer}
//                 recommend = {m.recommend}
//                 views = {m.views}
//                 imageUrl={m.videoType ==="YOUTUBE" ? `https://i1.ytimg.com/vi/${unique}/0.jpg` : "/no_thumbnail.png"}
//                 rank = {m.rank}
//                 created = {m.created}
//                 updated = {m.updated}
//                 />
//         })
//     }
//     </div>
//     </Board>
//     )
//     }
    
//     </>
// );