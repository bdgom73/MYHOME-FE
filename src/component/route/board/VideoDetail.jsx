import qs from "query-string";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import NotFound from "../../NotFound";
import "../../../css/route/videoDetail.scss";
export default function VideoDetail(){

    const {search} = useLocation();
    const params = qs.parse(search);
    const [board_id, setBoardId] = useState();

    useEffect(()=>{
        setBoardId(params.id);
    },[board_id])
    if(board_id){
        return(
        <>
        <div className="board_detail_wrap">
            <div className="board_body">
                <div className="board_video">
                    {/* <video controls>
                        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                    </video> */}
                    <iframe 
                        title="Youtube video"
                        className="iframeVideo"
                        src="https://www.youtube.com/embed/dFk43kPfVAo"  
                        allowfullscreen="allowfullscreen"
                        mozallowfullscreen="mozallowfullscreen" 
                        msallowfullscreen="msallowfullscreen" 
                        oallowfullscreen="oallowfullscreen" 
                        webkitallowfullscreen="webkitallowfullscreen"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    ></iframe>
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