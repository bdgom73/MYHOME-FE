import { useEffect, useState } from "react";

import axios from "axios";
import { useHistory } from "react-router";
import { AiTwotoneLike } from 'react-icons/ai';
import { GrFormView } from 'react-icons/gr';

import useMember from "../../../../customState/useMember";
import Comment from "../Comment";

import moment from "moment";
import useTitle from "../../../../customState/useTitle";

import CKEditor5 from "../../../part/write/CKEditor/CKEditor5";
export default function FreeDetail(props){

    const {refTitle} = useTitle();

    const member = useMember();
    const {params}= props.match;
    const history = useHistory();
    const [board_id, setBoardId] = useState();
    const [data,setData] = useState({});
    const [content,setContent] = useState();
    const [comment,setComment] = useState([]);
    const [recommendState,setRecommendState] = useState(false);
    const [recommend, setRecommend] = useState(0);
    const [editorContent, setEditorContent] = useState("");

    useEffect(()=>{    
       setBoardId(params.id);
       axios.get("/myApi/bbs/view/"+params.id+"/free")
        .then(res=>{   
            setData(res.data || {});
            setContent(res.data.description);
            setComment(res.data.commentDTOList || []);
            setRecommend(res.data.recommend);
            refTitle.innerHTML = `MYDOMUS | ${res.data.title ? res.data.title : "FREE"}`
         
        })
        .catch(e=>{
            console.log(e.response);
            history.push("/bbs/free/page=1");
        });

        if(!member.logined) setRecommendState(true);
    },[board_id])

    useEffect(()=>{      
        axios.get(`/myApi/bbs/${params.id}/check/recommend`,{
            headers : {
                "Authorization" : member.SESSION_UID
            }
        }).then(res=> {     
           setRecommendState(!res.data);
        })
        .catch(e=>{
            console.log(e.response);
            setRecommendState(true);
        })
    },[])
  
 
    const Recommend = ()=>{
        axios.get(`/myApi/bbs/${params.id}/recommend`,{
            headers : {
                "Authorization" : member.SESSION_UID
            }
        })
        .then(res=>{
            alert("현재글을 추천 했습니다")
            setRecommendState(true)
            setRecommend(recommend+1)
        }).catch(e=>{

            console.log(e.response)
        })
    }

    const onClickDeleteHandler = ()=>{
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios.delete("/myApi/bbs/delete?id="+params.id)
            .then(res=>{
                history.push("/bbs/free")
            })
            .catch(e=>{
                alert(e.response.data.message ? e.response.data.message : "해당 게시글 삭제에 실패했습니다." )
            });
        }
       
    }
    return(
    <>
    <div className="board_detail_wrap">
        <cl>
            board &#62; <a href="/bbs/free/page=1">free</a>
        </cl>
        <h1 title={data.title}>{data.title}</h1>
        <video-info>
            <info>
                <vi><small>작성자 |</small><a href={`/user=${data.nickname}`}><b>{data.nickname}</b></a>              
                {
                    data.rank === "ADMIN" ? 
                    <pcon style={{backgroundColor:"#c4302b"}}>
                    <span >운영자</span>
                    </pcon> :<></>
                }
                </vi> 
                {
                    moment(data.created).format("YYYY-MM-DD HH:mm") === moment(data.updated).format("YYYY-MM-DD HH:mm") ?
                    <vi><small>작성일 | {moment(data.created).format("YYYY-MM-DD HH:mm")}</small></vi>: 
                    <vi><small>작성일<small>(수정됨)</small> | {moment(data.updated).format("YYYY-MM-DD HH:mm")}</small></vi>
                }             
            </info>
            <info>
                <vi><GrFormView/> {data.views}</vi>
                <vi><AiTwotoneLike color="#3b5998"/> {recommend}</vi>   
            </info>  
        </video-info>
        <div className="board_body">
            <div className="board_main">    
                <div id="content_field" dangerouslySetInnerHTML={{ __html : content}}/>
            </div>
            <userController>
                <button type="button" className="btn" disabled={member.data.id === data.writer_id ? true : recommendState} onClick={Recommend}>
                    <AiTwotoneLike color="#fff"/>추천
                </button>
                
            </userController>
            <div className="btn_wrap">
            {
            (member.data.id === data.writer_id && data.writer_id && member.data.id) || member.data.rank === "ADMIN"? 
            <controller>
                <button type="button" className="btn" onClick={()=> history.push(`/bbs/update/free/${board_id}`)}>수정</button>
                <button type="button" className="btn delete" onClick={onClickDeleteHandler}>삭제</button>
            </controller>   : <></>
            }
            </div>
            <user-comment>
                {
                    member.logined ? (
                    <comment-write>
                        <writer><strong>작성자</strong> : {member.data.name}</writer>       
                        <CKEditor5 
                            onlyComments 
                            onChange={(value)=>{setEditorContent(value)}}
                            data = {editorContent}
                        />
                        <div className="btn_wrap" >
                            <button className="btn" onClick={(e)=>{
                                const fd = new FormData();
                                fd.append("description",editorContent);
                                axios.post(`/myApi/bbs/${board_id}/write/comment`,fd,{
                                    headers : {
                                        "Authorization" : member.SESSION_UID
                                    }
                                })
                                .then(res=>{   
                                    comment.push(res.data);
                                    setComment(comment);
                                    setEditorContent("");
                                }).catch(e=>{
                                    console.log(e.response)
                                })
                            }}>작성</button>
                           
                        </div>
                        
                    </comment-write>
                    ) : <div style={{textAlign:"center",margin:"10px"}}>로그인 후 이용할 수 있습니다.</div>
                }
               <Comment data={comment} writer_id={data.writer_id}/>   
            </user-comment>
        </div>
    </div>
    </>
    );
}
     
   
