import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useMember from "../../../../customState/useMember";
import useModal from "../../../../customState/useModal";
import useTitle from "../../../../customState/useTitle";
import Modal from "../../../modal/modal";

import { RiPhoneFindLine } from 'react-icons/ri';
import { byte } from "../../../../js/common";
import moment from "moment";
import ProgressBar from "../../../progressBar";
import CKEditor5 from "../../../part/write/CKEditor/CKEditor5";
import { AiFillYoutube } from 'react-icons/ai';
import { ImTwitch } from 'react-icons/im';
import { afreecatv } from "../../../../afreecatv";
import Loading from "../../../part/Loading";

export default function VideoWrite(props){

    useTitle(`MYDOMUS | WRITE - VIDEO`);
    const history = useHistory();
    const modal = useModal();
    const member = useMember();
    const [videoType,setVideoType] = useState(false);
    const [file,setFile] = useState({});
    const [videoName,setVideoName]= useState("");
    const [desc,setDesc] = useState("");
    const [url,setUrl] = useState("");
    const [videoLoading,setVideoLoading] = useState(false);
    const [loaded,setLoaded] = useState(0);
    const [total,setTotal] = useState(0);
    const [platform,setPlatform] = useState("youtube");
    const [etcUrl , setETCUrl] = useState("");
    const [preUrl,setPreUrl] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);
    function onModalHandler(){
        if(modal.modal === 1){
            return <Modal close={modal.close}>잘못된 URL입니다.</Modal>
        }
    }
    function readImage(input,i) {
        if(input.files && input.files[i]) { 
            const reader = new FileReader();
            setTotal(input.files[0].size)  
            reader.onprogress = e=>{
                setLoaded(e.loaded);   
            }
          
            reader.onloadend = e =>{
                setVideoLoading(false) 
            }
            reader.onload = e => {                                
                const previewVideo = document.getElementById("target");
                const div = document.createElement("div");
                const inline = document.createElement("inline");
                const video = document.createElement("video");
                video.src = e.target.result;     
                video.classList.add("videoFile");
                video.style.width="100%";
                inline.innerHTML="❌";
                inline.style.cursor = "pointer"
                inline.classList.add("close");             
                inline.onclick=(e)=>{   
                    previewVideo.removeChild(div);  
                    setFile({});  
                    setVideoName("");
                    input.value = "";               
                }
                div.appendChild(inline);
                div.appendChild(video);
                div.classList.add("preview_video")
                previewVideo.prepend(div);                    
            }
            reader.readAsDataURL(input.files[i]);     
        }else{
            alert("미리보기를 할 수 없는 파일입니다.")
        }
    }

    const onSubmitHandler = (e)=>{
        e.preventDefault();    

        setUploadLoading(true); 
        const fd = new FormData();
        if(e.target[2].checked){
            fd.append("video",file);
        }else{
            const url = e.target[3].value;
            if(platform === "youtube"){
                if(url.indexOf("https://youtu.be/") !== -1){
                    const unique = url.split("https://youtu.be/")[1];
                    if(!unique){
                        modal.setModal(1)
                    }
                    fd.append("video_url",e.target[3].value);
                    fd.append("category_type","YOUTUBE");
                }
            }else if(platform === "twitch"){
                fd.append("video_url",e.target[3].value);
                fd.append("category_type","TWITCH");
            }else if(platform === "afreeca"){
                if(etcUrl.indexOf("https://vod.afreecatv.com/ST/") !== -1){
                    const unique = etcUrl.split("https://vod.afreecatv.com/ST/")[1];
                    if(!unique){
                        modal.setModal(1)
                    }
                    fd.append("video_url",e.target[3].value);
                    fd.append("category_type","AFREECA");
                }
            }
        }
       
        fd.append("title",e.target[0].value);
        fd.append("description",desc);
        
        
        axios.post("/bbs/write?category=video",fd,
        {headers:{'Content-Type': 'multipart/form-data',"Authorization" : member.SESSION_UID}})
            .then(res=>{
                e.preventDefault();
                if(res.status === 200) {
                    setUploadLoading(false)
                    history.push(`/bbs/video/${res.data}`)
                }            
            }).catch(e=>console.log(e.response))

    }

   
    return(
        <>
        {onModalHandler()}
        {uploadLoading ? <Loading/> : <></>}
        <div className="v_write_wrap">
            <form onSubmit={onSubmitHandler}>
                <table>
                    <tbody>
                    <tr>
                        <td colSpan='2'>
                            <input type="text" className="w_title" placeholder="제목을 입력해주세요" />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                            <input type="text" className="writer" readOnly defaultValue={member.data.name}/>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            동영상
                            <p>직접선택<input type="checkbox" value="url" onChange={(e)=>{setVideoType(e.target.checked);}}/></p>
                        </th>
                        <td>
                            {
                                videoType ?  (
                                    <div className="file_wrap">
                                        <input type="text" readOnly placeholder="영상을 선택해주세요" value={videoName}/>
                                        <input type="file" id="video_url" onChange={(e)=>{
                                            if(e.target.files[0]){
                                                if(e.target.files[0].type.indexOf("video") != -1) {
                                                    if(e.target.files[0].size <= 2147483648){
                                                        setVideoName(e.target.files[0].name);
                                                        setFile(e.target.files[0]);
                                                        readImage(e.target, 0);
                                                        setVideoLoading(true)
                                                    }else{
                                                        alert("2GB보다 큰 영상은 업로드할 수 없습니다. (" +byte(e.target.files[0].size)+")")
                                                    }   
                                                }else{
                                                    alert("비디오가 아닙니다.");
                                                }
                                            }
                                                
                                        }}/>
                                        <label htmlFor="video_url"><RiPhoneFindLine size="20"/></label>
                                    </div> 
                                ): (
                                <>
                                <div style={{position:"relative"}}>
                                <input type="text" className="video_file_text" placeholder="영상 주소를 입력해주세요"
                                value={preUrl}
                                onChange={(e)=>{
                                    setPreUrl(e.target.value)
                                    if(platform === "youtube"){
                                        if(e.target.value.indexOf("https://youtu.be/") != -1) {
                                            const u = e.target.value.split("https://youtu.be/")[1];
                                            setUrl(u);
                                            console.log(u);
                                        } else {
                                            setUrl("");
                                        }
                                    }else if(platform==="twitch"){
                                        setETCUrl(e.target.value)
                                    }else if(platform==="afreeca"){
                                        console.log("affre")
                                        if(e.target.value.indexOf("https://vod.afreecatv.com/ST/") != -1) {
                                            const u = e.target.value.split("https://vod.afreecatv.com/ST/")[1];
                                            console.log(u)
                                            setETCUrl(u)
                                        } else {
                                            setUrl("");
                                        }
                                       
                                    }     
                                }}
                                />  
                                <div className="select_video-type">
                                    <AiFillYoutube className={platform === "youtube" ? "youtube" : "youtube notselected"} onClick={e=>{
                                        setPlatform("youtube");
                                        setETCUrl("");
                                    }}/> 
                                    <ImTwitch title="점검중" className={platform === "twitch" ? "twitch" : "twitch notselected"} onClick={e=>{
                                        // setPlatform("twitch");
                                    }}/> 
                                    <img src={afreecatv.logo} alt="afreecaTV LOGO" className={platform === "afreeca" ? "afreecatv_logo" : "afreecatv_logo notselected"} onClick={e=>{
                                        setPlatform("afreeca");                        
                                        setUrl("");
                                    }}/>
                                </div> 
                                </div>
                                </>
                                )
                                         
                            }      
                        </td>
                    </tr>    
                    <tr style={videoType ? {display:"none"} : {display:"table-row"}}>
                        <th colSpan="2">
                            {
                                platform === "youtube" ? (
                                    <iframe 
                                    style={url !== "" ? {display : "block" , margin : "0 auto", width:"100%", height:"300px"} : {display : "none"}}
                                    title="Youtube video"
                                    className="iframeVideo"
                                    allowFullScreen = {false}
                                    src={`https://www.youtube.com/embed/${url}`}/>
                                ) : platform === "twicth" ? (
                                     <iframe 
                                        title="Twitch clips"
                                        src={"https://clips.twitch.tv/AstuteVibrantMilkEleGiggle-eJ3UKsq_0_hIqsPY"}  
                                        frameborder="0" allowfullscreen="true" scrolling="no" width="100%" />
                               
                                ) : platform === "afreeca" ? (
                                <iframe title="afreeca"
                                    style={etcUrl !== "" ? {display : "block" , margin : "0 auto", width:"100%", height:"300px"} : {display : "none"}}
                                    id="afreecatv_player_video"  
                                    src= {`//vod.afreecatv.com/embed.php?type=station&isAfreeca=false&autoPlay=false&showChat=true&mutePlay=false&szBjId=wnd2qud&nStationNo=18382776&nBbsNo=69072228&nTitleNo=${etcUrl}&szCategory=00010000&szVodCategory=00040066&szPart=CLIP&szVodType=STATION&nPlaylistIdx=0&isEmbedautoPlay=false&szSysType=html5`}
                                    frameborder="0" allowfullscreen="true"/>
                                ) : <></>
                                
                            }
                           
                        </th>
                    </tr> 
                    <tr style={videoType ? {display:"table-row"} : {display:"none"} }>
                        <td id="target" colSpan="2" style={{position:"relative"}}>
                                {
                                    videoLoading ? <><ProgressBar total={total} loaded={loaded} /></> : (
                                    <table style={file.name ? {display:"table"} : {display:"none"} }>  
                                    <tbody>
                                        <tr>
                                            <th style={{width:"auto"}}>파일명</th>
                                            <td>{file.name}</td>
                                        </tr>
                                        <tr>
                                            <th>파일크기</th>
                                            <td>{file.size ? byte(file.size,2) : ""}</td>
                                        </tr>
                                        <tr>
                                            <th>마지막수정일</th>
                                            <td>{moment(file.lastModified).format("YYYY-MM-DD HH:mm")}</td>
                                        </tr>
                                    </tbody>
                                </table>)
                                }  
                        </td>
                       
                    </tr>
                    <tr>
                        <td colSpan='2' style={{padding : 5, margin:"0 auto"}}>
                           {/* <WriteEditor onChange={(ed)=>{setDesc(ed)}} /> */}
                           <CKEditor5 onChange={(ed)=>{setDesc(ed)}}/>
                            <div className="btn_wrap">
                                <input type="submit" className="btn" value="글쓰기"/>
                                <button className="btn">목록</button>
                            </div> 
                        </td>
                    </tr>
                    </tbody>
                </table>  
                  
            </form>
        </div>
        </>
    );
}