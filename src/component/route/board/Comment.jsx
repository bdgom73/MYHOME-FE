import moment from "moment";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "../../../css/write/comment.scss";
import 'moment/locale/ko'
import useMember from "../../../customState/useMember";
import { FiMoreVertical } from 'react-icons/fi';

export default function Comment(props){

    const {
        data, writer_id
    } = props;
    
    const [page,setPage] = useState(0);
    const [prePage,setPrePage] = useState(20);
    const member = useMember();
    console.log(data)
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
                                
                               <img src={d.avatar_url ? d.avatar_url : "/profile.png"} alt={d.name+"이미지"}/> : 
                               
                                </avatar>
                                <info>    
                                    <c>
                                        {d.nickname}
                                        
                                        {
                                        writer_id && writer_id === d.member_id ? 
                                        <pcon>
                                            <span>작성자</span>
                                        </pcon> : <></>   
                                        }  
                                        {
                                            d.rank === "ADMIN" ? 
                                            <pcon style={{backgroundColor:"#c4302b"}}>
                                            <span >운영자</span>
                                            </pcon> :<></>
                                        }      
                                    </c>  
                                    <c>
                                        { moment(d.updated, "YYYY-MM-DD HH:mm:ss").fromNow()}
                                        <small>({moment(d.updated).format("YYYY-MM-DD HH:mm")})</small>
                                    </c>  
                                </info>    
                            </profile>
                        </div>
                        <content dangerouslySetInnerHTML={{__html : d.description }}/>
                        {
                            (member.data.id === d.member_id && d.member_id && member.data.id) || member.data.rank === "ADMIN" ? 
                            <controller>
                                <button type="button" className="btn">수정</button>
                                <button type="button" className="btn delete" >삭제</button>
                            </controller>   : <controller><FiMoreVertical/></controller>
                        }
                       
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