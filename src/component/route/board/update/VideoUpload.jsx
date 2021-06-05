import moment from "moment";
import { useState } from "react";
import { byte } from "../../../../js/common";
import ProgressBar from "../../../progressBar";

import { FcVideoFile,FcClapperboard } from 'react-icons/fc';
import { afreecatv } from "../../../../afreecatv";
import { AiFillYoutube } from "react-icons/ai";
import { ImTwitch } from "react-icons/im";
import axios from "axios";
import Loading from "../../../part/Loading";

export default function VideoUpload({onChange,uuid,board_id, onUploadend}){

    const [video,setVideo] = useState();
    const [videoLoading,setVideoLoading] = useState(false);
    const [loaded,setLoaded] = useState(0);
    const [total,setTotal] = useState(0);
    const [file,setFile] = useState({});
    const [type,setType] = useState("upload");
    const [platform,setPlatform] = useState("youtube");
    const [url,setUrl] = useState();
    const [value,setValue] = useState("");

    const [uploadLoading, setUploadLoading] = useState(false);
    // 리턴 값 state
    const [reValue,setReValue] = useState([]);


    function readVideo(input) {
        if(input.target.files[0]) { 
            const reader = new FileReader();
            setReValue(input.target.files[0]);
            reader.onloadstart = e=>{
                setTotal(input.target.files[0].size) 
                setLoaded(0);   
                setVideoLoading(true) 
            }
            reader.onprogress = e=>{
                setLoaded(e.loaded);   
            }    
            reader.onloadend = e =>{
                setVideoLoading(false)         
            }
            reader.onload = e => {                                     
                const loadfile = input.target.files[0];
                const url = URL.createObjectURL(loadfile);
                setFile(loadfile)
                setVideo(url);            
            }
            reader.readAsDataURL(input.target.files[0]);     
        }else{
            alert("미리보기를 할 수 없는 파일입니다.");
        }
    }
    const onSubmitHandler = (e)=>{
        e.preventDefault();    
        setUploadLoading(true); 
        const fd = new FormData();
        fd.append("id",board_id);
        fd.append("category","video");
        if(type==="upload"){
            fd.append("video",reValue);        
        }else if(type==="videourl"){
            fd.append("video_url", value);
            fd.append("category_type",platform);
        }  
        axios.put("/bbs/update/upload",fd,
        {headers:{'Content-Type': 'multipart/form-data',"Authorization" : uuid}})
            .then(res=>{
                e.preventDefault();
                if(res.status === 200) {
                    setUploadLoading(false);
                    onUploadend(res);
                }            
            }).catch(e=>console.log(e.response))

    }
    return(
        <>
         {uploadLoading ? <Loading/> : <></>}
        <navigator>
            <navchild className={type==="upload" ? "selected" : ""} onClick={()=>{setType("upload")}}>
                <n>Upload</n>
            </navchild>
            <navchild className={type==="videourl" ? "selected" : ""} onClick={()=>{setType("videourl")}}>
                <n>VideoUrl</n>
            </navchild>
            <div className="border_bottom"></div>
        </navigator>
        {
            type==="upload" ? (
                <>
                <uploads>
                    <div>
                        <videoupload>
                            <videouploadcontent>
                                <vc>
                                    <vh>파일명</vh>
                                    <vd>
                                        <input type="text" value={file.name ? file.name : ""} readOnly/>
                                    </vd>
                                </vc>  
                                <vc>
                                    <vh>파일크기</vh>
                                    <vd>
                                        <input type="text" defaultValue={ file.size ? byte(file.size,2) : ""} readOnly/>    
                                    </vd>
                                </vc>  
                                <vc>
                                    <vh>수정일</vh>
                                    <vd>
                                        <input type="text" defaultValue={ file.lastModified ? moment(file.lastModified).format("YYYY-MM-DD HH:mm:ss") : ""}readOnly/>
                                    </vd>
                                </vc>  
                                <vc>
                                    <vh>타입</vh>
                                    <vd>
                                        <input type="text" defaultValue={ file.type ? file.type : ""} readOnly/>        
                                    </vd>
                                </vc> 
                            </videouploadcontent>
                        </videoupload>
                        <preview>
                            {
                                file.name ? (
                                <previewviodeo >
                                    <video src ={video ? video : ""} controls/>      
                                </previewviodeo>
                                ) : (
                                <>
                                <previewviodeo style={{border : "1px solid #bbbbbb"}}>
                                    <input type="file" id="video_file" onChange={readVideo}/>
                                    <label htmlFor="video_file">
                                        <FcVideoFile size="20"/>
                                        비디오 가져오기
                                    </label>
                                </previewviodeo>
                                </>
                                )
                            }        
                        </preview>
                    </div>
                    <div className="btn_wrap" style={{display: file.name ? "flex" : "none"}}>    
                        <input type="file" id="video_file" onChange={readVideo} style={{display:"none"}}/>
                        <label htmlFor="video_file">
                        <FcClapperboard size="30"/>
                        </label>
                    </div>     
                </uploads>
                {
                    videoLoading ? <ProgressBar total={total} loaded={loaded} /> :<></>
                }
                </>
            ) :
            type === "videourl" ? (
                <>
                <uploads>
                    <div>
                        <videoupload>
                            <videouploadcontent>
                                <vc>
                                    <vh>비디오주소</vh>
                                    <vd>
                                        <input type="text" value={value} onChange={(e)=>{
                                            if(platform === "youtube"){
                                                if(e.target.value.indexOf("https://youtu.be/") !== -1) {
                                                    const u = e.target.value.split("https://youtu.be/")[1];
                                                    setUrl(u);
                                                }else{
                                                    setUrl("");
                                                }
                                            }else if(platform === "twitch"){}
                                            else if(platform === "afreeca"){
                                                if(e.target.value.indexOf("https://vod.afreecatv.com/ST/") !== -1) {
                                                    const u = e.target.value.split("https://vod.afreecatv.com/ST/")[1];
                                                    setUrl(u)
                                                } else{
                                                    setUrl("");
                                                }
                                            } 
                                            setValue(e.target.value);
                                        }}/>
                                    </vd>
                                </vc>  
                                <vc>
                                    <vh>플랫폼</vh>
                                    <div className="select_video-type" style={{position:"relative"}}>
                                        <AiFillYoutube className={platform === "youtube" ? "youtube" : "youtube notselected"} onClick={()=>{setPlatform("youtube")}}/> 
                                        <ImTwitch title="점검중" className={platform === "twitch" ? "twitch" : "twitch notselected"} /> 
                                        <img src={afreecatv.logo} alt="afreecaTV LOGO" className={platform === "afreeca" ? "afreecatv_logo" : "afreecatv_logo notselected"} onClick={()=>{setPlatform("afreeca")}}/>
                                    </div>
                                </vc>      
                            </videouploadcontent>
                        </videoupload>
                        <preview>
                        {
                                platform === "youtube" ? (
                                    <iframe 
                                    style={url !== "" ? {display : "block" , margin : "0 auto", width:"100%"} : {display : "none"}}
                                    title="Youtube video"
                                    className="iframeVideo"
                                    allowFullScreen = {false}
                                    src={`https://www.youtube.com/embed/${url}`}
                                  
                                    />
                                ) : platform === "twicth" ? (
                                     <iframe 
                                        title="Twitch clips"
                                        src={"https://clips.twitch.tv/AstuteVibrantMilkEleGiggle-eJ3UKsq_0_hIqsPY"}  
                                        frameborder="0" allowfullscreen="true" scrolling="no" width="100%" />
                               
                                ) : platform === "afreeca" ? (
                                <iframe title="afreeca"
                                    style={url !== "" ? {display : "block" , margin : "0 auto", width:"100%"} : {display : "none"}}
                                    id="afreecatv_player_video"  
                                    src= {`//vod.afreecatv.com/embed.php?type=station&isAfreeca=false&autoPlay=false&showChat=true&mutePlay=false&szBjId=wnd2qud&nStationNo=18382776&nBbsNo=69072228&nTitleNo=${url}&szCategory=00010000&szVodCategory=00040066&szPart=CLIP&szVodType=STATION&nPlaylistIdx=0&isEmbedautoPlay=false&szSysType=html5`}
                                    frameborder="0" allowfullscreen="true" />
                                ) : <></>
                                
                            }                
                        </preview>
                    </div>
                    <div className="btn_wrap" style={{display: file.name ? "flex" : "none"}}>    
                        <input type="file" id="video_file" onChange={readVideo} style={{display:"none"}}/>
                        <label htmlFor="video_file">
                        <FcClapperboard size="30"/>
                        </label>
                    </div>     
                </uploads>
                </>
            ) :<></>
        }
        <div className="btn_wrap">
            <button type="button" className="btn" onClick={onSubmitHandler}>선택</button>    
        </div>     
        </>
    )
}