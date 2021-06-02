import moment from "moment";
import { useState } from "react";
import { byte } from "../../../../js/common";
import ProgressBar from "../../../progressBar";
import "../../../../css/route/videoUpload.scss";
import { FcVideoFile,FcClapperboard } from 'react-icons/fc';

export default function VideoUpload(){

    const [video,setVideo] = useState();
    const [videoLoading,setVideoLoading] = useState(false);
    const [loaded,setLoaded] = useState(0);
    const [total,setTotal] = useState(0);
    const [file,setFile] = useState({});

    function readVideo(input) {
        console.log(input.target.files[0])
        if(input.target.files[0]) { 
            const reader = new FileReader();
           
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
    return(
        <>
        <uploads>
            <div>
                <videoupload>
                    <videouploadcontent>
                        <vc>
                            <vh>파일명</vh>
                            <vd>{file.name ? file.name : ""}</vd>
                        </vc>  
                        <vc>
                            <vh>파일크기</vh>
                            <vd>{ file.size ? byte(file.size,2) : ""}</vd>
                        </vc>  
                        <vc>
                            <vh>수정일</vh>
                            <vd>{ file.lastModified ? moment(file.lastModified).format("YYYY-MM-DD HH:mm:ss") : ""}</vd>
                        </vc>  
                        <vc>
                            <vh>타입</vh>
                            <vd>{ file.type ? file.type : ""}</vd>
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
                        <previewviodeo>
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
            <div className="btn_wrap">    
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
    )
}