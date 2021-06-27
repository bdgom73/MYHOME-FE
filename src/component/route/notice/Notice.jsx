import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router";
import useTitle from "../../../customState/useTitle";
import Board from "../../part/write/Board";
import BoardTable from "../../part/write/BoardTable";

export default function Notice({UseAsPart, match, top}){

    useTitle(`MYDOMUS | NOTICE`)

    const history = useHistory();
    const {params} = match; 
    const [total,setTotal] = useState(0);
    const [loading,setLoading] = useState(true);
    const [page,setPage] = useState(0);
    const [data,setData] = useState([]);
    const [totalPage,setTotalPage] = useState(0);

    useEffect(()=>{ 
        if(!UseAsPart){   
            _getUrl();
            const {page : p} = params;
            let pp = p;
            pp *=1;
            if(Number(p) <= 0 || !p || isNaN(pp) || totalPage+1 > page) history.push("/bbs/notice/page=1") ;
            setPage(p-1);
        }
        if(UseAsPart && top){
            _getUrl();
        }
    },[page])
    
    useEffect(()=>{  
        if(!UseAsPart){
            axios.get(`/myApi/bbs/free/size`)
            .then(res=>{
                setTotal(res.data)
                setTotalPage(Math.ceil(res.data / 40));
            })
        }    
    },[UseAsPart]);

    const _getUrl = ()=>{   
        setLoading(true);   
        let url = top ? `/myApi/notice/get?top=${top ? top : 10}` :  `/notice/get?size=${40}&page=${page}` 
        axios.get(url)
        .then(res=>{
            setData(res.data || []);  
            setLoading(false);        
        }).catch(e=> {console.log(e.response)})
    }

    return(
        <>
        <Board style={!UseAsPart ? {maxWidth:"1100px",margin:"15px auto"} : {}}>
           {!UseAsPart ? (
            <>
            <h1>공지사항</h1> 
            <div className="board_control">
                <div className="btn_wrap">
                    <button type="button" className="btn" onClick={()=> history.push("/bbs/write/free")}>글쓰기</button>
                </div>
            </div>
            </>
            ) : <></>} 
        <BoardTable 
            data={data}
            linkColumn={"title"}
            boardName="notice"
            autoSize
            loading ={loading}
            writerColumn="writer"
            dateColumn="created"
        />   
        {
        !UseAsPart ? (
        <>
        <ReactPaginate 
            pageCount={Math.ceil(total / 40)}
            pageRangeDisplayed={40}
            marginPagesDisplayed={0}
            breakLabel={""}
            previousLabel={"이전"}
            nextLabel={"다음"}
            onPageChange={({selected})=>{   
                setPage(Number(selected));   
                history.push(`/bbs/free/page=${Number(selected)+1}`);
            }}
            containerClassName={"pagination-ul"}
            activeClassName={"currentPage"}
            previousClassName={"pageLabel-btn"}
            nextClassName={"pageLabel-btn"}       
        />
        </>
        ) : <></>}
        </Board>
        </>
    )
}