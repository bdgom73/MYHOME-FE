import { useEffect, useState } from "react";
import Board from "../../../part/write/Board";
import BoardTable from "../../../part/write/BoardTable";
import "../../../../css/write/board.scss";
import axios from "axios";
import { useHistory, useLocation } from "react-router";
import ReactPaginate from "react-paginate";
import useTitle from "../../../../customState/useTitle";
export default function FreeBoard(props){

    useTitle(`MYDOMUS | FREE`)
    // const [itemCount, setItemCount] = useState(40);
    // const [preItemCount, setPreItemCount] = useState(0);
    const {params} = props.match; 
    const history = useHistory();
    const [total,setTotal] = useState(0);
    const [loading,setLoading] = useState(true);
    const [page,setPage] = useState(0);
    const [data,setData] = useState([]);
    const [totalPage,setTotalPage] = useState(0);

    useEffect(()=>{    
        _getUrl();
        const {page : p} = params;
        let pp = p;
        pp *=1;
        if(Number(p) <= 0 || !p || isNaN(pp) || totalPage+1 > page) history.push("/bbs/free/page=1") ;
        setPage(p-1);
    },[page])


     // 총 size 가져오기
     useEffect(()=>{      
        axios.get(`/bbs/free/size`)
        .then(res=>{
            setTotal(res.data)
            setTotalPage(Math.ceil(res.data / 40));
        })
    },[]);
    const _getUrl = ()=>{   
        setLoading(true);   
        let url =  `/bbs/free/get?size=${40}&page=${page}` 
        axios.get(url)
        .then(res=>{
            setData(res.data);  
            setLoading(false);        
        }).catch(e=> {console.log(e.response)})
    }
    return (
        <>   
        <Board style={{maxWidth:"1100px",margin:"15px auto"}}>
        <h1>자유게시판</h1> 
        <div className="board_control">
            <div className="btn_wrap">
                <button type="button" className="btn" onClick={()=> history.push("/bbs/write/free")}>글쓰기</button>
            </div>
        </div>
        <BoardTable 
            data={data}
            columnData={["No","제목","글쓴이","작성일","조회","추천"]}
            linkColumn={"title"}
            boardName="free"
            columnDataKey={["id","title","writer","created","views","recommend"]}
            autoSize
            loading ={loading}
            writerColumn="writer"
            dateColumn="created"
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
                history.push(`/bbs/free/page=${Number(selected)+1}`);
            }}
            containerClassName={"pagination-ul"}
            activeClassName={"currentPage"}
            previousClassName={"pageLabel-btn"}
            nextClassName={"pageLabel-btn"}
        />
        </Board>  
        </>
    );
}