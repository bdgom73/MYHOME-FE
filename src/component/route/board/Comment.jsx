import moment from "moment";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "../../../css/write/comment.scss";
import 'moment/locale/ko'
export default function Comment(props){

    const {
        data
    } = props;

    const [page,setPage] = useState(0);
    const [prePage,setPrePage] = useState(20);
    return(
        <>
        {      
            data.length > 0 ? 
            data.sort((a,b)=>{
                return a.updated > b.updated ? -1 : a.updated < b.updated ? 1 : 0;
            }).slice(page, prePage).map((d,i)=>{
                return (
                    <comment key={`comment${i}${d.id}`}>
                        <div className="writer_info">
                            <profile>
                                <avatar>
                                {
                                d.avatar_url ? <img src={d.avatar_url} alt={d.name+"이미지"}/> : 
                                <>{d.name}</>
                                }
                                </avatar>
                                <info>   
                                    <c>
                                        { moment(d.updated, "YYYY-MM-DD HH:mm:ss").fromNow()}
                                        <small>({moment(d.updated).format("YYYY-MM-DD HH:mm")})</small>
                                    </c>
                                    <c>{d.name}</c>
                                </info>    
                            </profile>
                        </div>
                        <content dangerouslySetInnerHTML={{__html : d.description }}/>    
                    </comment>
                )            
            }) 
            : <no-comment>댓글이 없습니다.</no-comment>
        } 
        {
            data.length >= 20 ? 
            <ReactPaginate 
                pageCount={Math.ceil(data.length / 20)}
                pageRangeDisplayed={20}
                marginPagesDisplayed={0}
                breakLabel={""}
                previousLabel={"이전"}
                nextLabel={"다음"}
                onPageChange={({selected})=>{   
                    console.log(selected)
                    setPrePage(page);   
                    setPage(Number(selected));    
                    if(selected === 0){
                        setPrePage(20);   
                        setPage(0);  
                    }else{
                        setPage(Number(selected)*20);
                        setPrePage(Number(selected)*20+20)
                    }
                      
                }}
                containerClassName={"pagination-ul"}
                activeClassName={"currentPage"}
                previousClassName={"pageLabel-btn"}
                nextClassName={"pageLabel-btn"}
            /> : <></>
        }
        
        </>
    )
}