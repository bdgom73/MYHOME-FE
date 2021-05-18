
import { useEffect, useState } from "react";
import NotFound from "../../NotFound";
import "../../../css/route/videoDetail.scss";
import axios from "axios";
import { useHistory } from "react-router";
export default function VideoDetail(props){

    const {params}= props.match;
    const history = useHistory();
    const [board_id, setBoardId] = useState();
    const [videoType, setVideoType] = useState("YOUTUBE");
    const [data,setData] = useState({});
    const [existence,setExistence] = useState(false);
    const [videoUrl,setVideoUrl] = useState("")
    useEffect(()=>{    
       setBoardId(params.id);
       axios.get("/bbs/view/"+params.id)
        .then(res=>{
            const unique = res.data.video_url.split("https://youtu.be/")[1];
            setData(res.data || {});
            setVideoType(res.data.videoType);
            setVideoUrl(unique);
            setExistence(true);
            document.getElementById("content_field").innerHTML = res.data.description;
        })
        .catch(e=>{
            console.log(e.response);
            setExistence(false);
            // history.push("/bbs/video");
        })
    },[board_id])


    
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
            <div className="board_main">    
                    <div id="content_field"></div>
            </div>
        </div>
    </div>
    </>
    );
}
     
   
