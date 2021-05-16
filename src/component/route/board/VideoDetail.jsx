import qs from "query-string";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import NotFound from "../../NotFound";
import "../../../css/route/videoDetail.scss";
import axios from "axios";
export default function VideoDetail(props){

    const {params}= props.match;
  
    const [board_id, setBoardId] = useState();
    const [videoType, setVideoType] = useState("YOUTUBE");
    const [data,setData] = useState({});
    const [existence,setExistence] = useState(false);
    const [videoUrl,setVideoUrl] = useState("")
    useEffect(()=>{    
       setBoardId(params.id);
       axios.get("/bbs/view/"+board_id)
        .then(res=>{
            const unique = res.data.video_url.split("https://youtu.be/")[1];
            setData(res.data || {});
            setVideoType(res.data.videoType);
            setVideoUrl(unique);
            setExistence(true);
        })
        .catch(e=>{
            console.log(e.response);
            setExistence(false);
        })
    },[board_id])


    if(existence){
        return(
        <>
        <div className="board_detail_wrap">
            <div className="board_body">
                <div className="board_video">
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
                        ) : (
                        <video controls>
                        <source src={data.video_url}/>
                        </video> 
                        )
                    }
                   
                   
                </div>
                <div className="board_sub">
                    <table>
                        <tr>dsd</tr>
                    </table>
                </div>
            </div>
        </div>
        </>
        );
    }else{
        return <NotFound text="해당 게시글이 존재하지 않습니다."/>;
    }
     
   
}