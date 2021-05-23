import { useEffect, useState } from "react";
import "../../../css/route/videoDetail.scss";
import axios from "axios";
import { useHistory } from "react-router";
import { AiTwotoneLike } from 'react-icons/ai';
import { GrFormView } from 'react-icons/gr';
import WriteEditor from "../../part/write/WriteEditor";
import useMember from "../../../customState/useMember";
import Comment from "./Comment";
import { EditorState,convertToRaw } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import moment from "moment";
export default function VideoDetail(props){

    const member = useMember();
    const {params}= props.match;
    const history = useHistory();
    const [board_id, setBoardId] = useState();
    const [videoType, setVideoType] = useState("YOUTUBE");
    const [data,setData] = useState({});
    const [existence,setExistence] = useState(false);
    const [content,setContent] = useState();
    const [videoUrl,setVideoUrl] = useState("")
    const [comment,setComment] = useState([]);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [context, setContext] = useState();
    const [videoError,setVideoError] = useState(false);
    useEffect(()=>{    
       setBoardId(params.id);
       axios.get("/bbs/view/"+params.id)
        .then(res=>{
            const unique = res.data.video_url.split("https://youtu.be/")[1];
            console.log(res.data)
            setData(res.data || {});
            setVideoType(res.data.videoType);
            setVideoUrl(unique);
            setExistence(true);   
            setContent(res.data.description);
            setComment(res.data.commentDTOList || []);
        })
        .catch(e=>{
            setExistence(false);
            history.push("/bbs/video");
        })
    },[board_id])

    const onEditorStateChange = (es)=>{ 
        setEditorState(es);  
    }
    useEffect(()=>{
        const editorToHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        setContext(editorToHtml);
    },[editorState])
    return(
    <>
    <div className="board_detail_wrap">
        <cl>
            board &#62; <a href="/bbs/video?page=1">video</a>
        </cl>
        <h1 title={data.title}>{data.title}</h1>
        <video-info>
            <info>
                <vi><small>작성자 |</small><b>{data.writer}</b>              
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
                <vi><AiTwotoneLike color="#3b5998"/> {data.recommend}</vi>   
            </info>  
        </video-info>
        <div className="board_body">
            <div className="board_video" style={videoType === "NONE" ? {minHeight : "0px"}:{}}>
                {
                    videoType === "YOUTUBE" ? (
                        <iframe 
                        title="Youtube video"
                        className="iframeVideo"
                        src={`https://www.youtube.com/embed/${videoUrl}`}  
                        allowfullscreen="allowfullscreen"
                        mozallowfullscreen="mozallowfullscreen" 
                        msallowfullscreen="msallowfullscreen" 
                        oallowfullscreen="oallowfullscreen" 
                        webkitallowfullscreen="webkitallowfullscreen"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    ></iframe>
                    ) : videoType === "LOCAL" ? (
                        <>
                        <video controls style={{width:"100%",height:"100%"}} onError={(e)=>{setVideoError(true);}}>
                        {
                            videoError ? 
                            <></>:
                            <source src={data.video_url} /> 
                        }
                        </video> 
                        {
                            videoError ?  <div className="video_error">재생할 수 없는 영상입니다.</div> : <></>
                        }
                        </>)
                     : videoType === "NONE" ? <></> : <></>
                }
    
            </div>
           
            <div className="board_main">    
                <div id="content_field" dangerouslySetInnerHTML={{ __html : content}}/>
            </div>
            <userController>
                <button type="button" className="btn" disabled={true}>
                    <AiTwotoneLike color="#fff"/>추천
                </button>
                
            </userController>
            <div className="btn_wrap">
            {
            (member.data.id === data.writer_id && data.writer_id && member.data.id) || member.data.rank === "ADMIN"? 
            <controller>
                <button type="button" className="btn">수정</button>
                <button type="button" className="btn delete" >삭제</button>
            </controller>   : <></>
            }
            </div>
            <user-comment>
                {
                    member.logined ? (
                    <comment-write>
                        <writer><strong>작성자</strong> : {member.data.name}</writer>
                        <WriteEditor isComment 
                        editorState={editorState}
                        onEditorStateChange={onEditorStateChange}
                        />
                        <div className="btn_wrap" >
                            <button className="btn" onClick={(e)=>{
                                const fd = new FormData();
                                fd.append("description",context);
                                axios.post(`/bbs/${board_id}/write/comment`,fd,{
                                    headers : {
                                        "Authorization" : member.SESSION_UID
                                    }
                                })
                                .then(res=>{   
                                    comment.push(res.data);
                                    setComment(comment);
                                    setEditorState(EditorState.createEmpty());
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
     
   
