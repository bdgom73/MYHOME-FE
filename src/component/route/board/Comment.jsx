import moment from "moment";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

import 'moment/locale/ko'
import useMember from "../../../customState/useMember";
import { FiMoreVertical } from 'react-icons/fi';
import { Link } from "react-router-dom";
import axios from "axios";
import CKEditor5 from "../../part/write/CKEditor/CKEditor5";
export default function Comment(props){

    const {
        data, writer_id
    } = props;
    
    const [page,setPage] = useState(0);
    const [prePage,setPrePage] = useState(20);

    const [isUpdate,setIsUpdate] = useState(false);
    const [desc, setDesc] = useState("");

    const [currentComments , setCurrentComments] = useState("");
    const member = useMember();
    
    return(
        <>
        {      
            data.length > 0 ? 
            data.sort((a,b)=>{
                return a.updated > b.updated ? -1 : a.updated < b.updated ? 1 : 0;
            }).slice(page, prePage).map((d,i)=>{
                return (
                    <comment key={`comment${i}${d.id}`} id={`comment${d.id}`}>
                        <div className="writer_info">
                            <profile>
                                <avatar>                 
                                    <img src={d.avatar_url ? d.avatar_url : "/profile.png"} alt={d.name+"이미지"}/>
                                </avatar>
                                <info>    
                                    <c>
                                        <Link to={`/user/${d.nickname}`}>{d.nickname}</Link>
                                        
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
                        {
                            !isUpdate  || (d.id !== currentComments)? 
                            <content dangerouslySetInnerHTML={{__html : d.description }}/> :
                            <CKEditor5 onlyComments data={d.description} onChange={(e)=>{setDesc(e)}}/>
                        }
                        
                        {
                            (member.data.id === d.member_id && d.member_id && member.data.id) || member.data.rank === "ADMIN" ? 
                            <controller>
                                <button type="button" className="btn" onClick={()=> {
                                    setCurrentComments(d.id)
                                    if(!isUpdate){
                                        setIsUpdate(true);
                                    }else{
                                        const fd = new FormData();
                                        fd.append("description", desc);
                                        axios.put(`/comments/${d.id}/update`,fd)
                                        .then(res=>{
                                            if(res.status===200){ d.description = desc; setIsUpdate(false)}
                                        })
                                    }
                                }}>수정</button>
                                {
                                    isUpdate && d.id === currentComments? 
                                    <button type="button" className="btn" onClick={()=> setIsUpdate(false)}>취소</button> : <></>
                                }
                                <button type="button" className="btn delete" onClick={(e)=>{                   
                                    axios.delete(`/comments/delete/${d.board_id}/${d.id}`)
                                        .then(res=>{
                                            const cur = document.getElementById("comment"+d.id);
                                            if(res.status === 200) cur.remove(); 
                                        })
                                }}>삭제</button>
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