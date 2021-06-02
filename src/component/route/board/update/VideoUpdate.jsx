import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useMember from "../../../../customState/useMember";
import useModal from "../../../../customState/useModal";
import useTitle from "../../../../customState/useTitle";
import Modal from "../../../modal/modal";
import "../../../../css/route/VideoWrite.scss";
import { RiPhoneFindLine } from 'react-icons/ri';
import { byte } from "../../../../js/common";
import moment from "moment";
import ProgressBar from "../../../progressBar";
import CKEditor5 from "../../../part/write/CKEditor/CKEditor5";
import { AiFillYoutube } from 'react-icons/ai';
import { ImTwitch } from 'react-icons/im';
import { afreecatv } from "../../../../afreecatv";
import Loading from "../../../part/Loading";
import VideoUpload from "./VideoUpload";

export default function VideoUpdate(props){

    const history = useHistory();
    const {params}= props.match;
    const {refTitle} = useTitle();
    const modal = useModal();
    const member = useMember();
    const [file,setFile] = useState({});
   
    const [desc,setDesc] = useState("");
    const [url,setUrl] = useState("");
    
    const [platform,setPlatform] = useState("youtube");
    const [etcUrl , setETCUrl] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);
    const [data, setData] = useState({});  
    const [title,setTitle] = useState("");
    const [writer,setWriter] = useState("");
    const [board_id, setBoardId] = useState();

    useEffect(()=>{    
        setBoardId(params.id);
        axios.get("/bbs/view/"+params.id+"/video")
         .then(res=>{ 
            console.log(res.data)
            setData(res.data); 
            setTitle(res.data.title);
            setWriter(res.data.nickname);
            setDesc(res.data.description);
            if(res.data.videoType === "YOUTUBE"){
                if(res.data.video_url.indexOf("https://youtu.be/") !== -1){
                    const unique = res.data.video_url.split("https://youtu.be/")[1];
                    if(!unique){
                        modal.setModal(1)
                    }
                    setUrl(unique);
                }
            }else if(res.data.videoType === "TWITCH"){ }
            else if(res.data.videoType === "AFREECA"){
                if(res.data.video_url.indexOf("https://vod.afreecatv.com/ST/") !== -1){
                    const unique = res.data.video_url.split("https://vod.afreecatv.com/ST/")[1];
                    if(!unique){
                        modal.setModal(1)
                    }
                    setUrl(unique);
                }
            }
            refTitle.innerHTML = `MYDOMUS | ${res.data.title ? res.data.title : "Update"}` 
         })
         .catch(e=>{
            console.log(e.response);
            history.push("/bbs/video/");
         });
 
     },[board_id])

    function onModalHandler(){
        if(modal.modal === 1){
            return <Modal close={modal.close}>잘못된 URL입니다.</Modal>
        }else if(modal.modal === 2){
            return <Modal close={modal.close}><VideoUpload/></Modal>
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
        
        
        axios.post("/bbs/update",fd,
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
                            <input type="text" className="w_title" placeholder="제목을 입력해주세요" defaultValue={title}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                            <input type="text" className="writer" readOnly defaultValue={writer}/>
                        </td>
                    </tr>
                    <tr>
                        <th colSpan="2">
                            <div className="update_info">
                                <div className="update_info_child">
                                    <t>비디오 타입 | </t>
                                    <c>
                                    {data.videoType === "LOCAL" ? "Produced by "+data.nickname : 
                                     data.videoType === "YOUTUBE" ? <AiFillYoutube className={"youtube"}/>   :
                                     data.videoType === "TWITCH" ? <ImTwitch title="점검중" className={"twitch"}/> :
                                     data.videoType === "AFREECA" ?  <img src={afreecatv.logo} alt="afreecaTV LOGO" className={"afreeca"}/> :<>NONE</>
                                    }
                                    </c>
                                </div>
                                <div className="update_info_child">
                                    <t>비디오 url | </t>
                                    <c> {data.video_url}</c>
                                </div>
                                <div className="btn_wrap" style={{position:"relative"}}>
                                    <button type='button' className="btn" >
                                        비디오 수정
                                    </button>
                                </div>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        <th colSpan="2" className="update_preview">
                            <div className="board_video">
                            {
                                data.videoType === "YOUTUBE" ? (
                                    <iframe 
                                    style={url !== "" ? {display : "block" , margin : "0 auto"} : {display : "none"}}
                                    title="Youtube video"
                                    className="iframeVideo"
                                    allowFullScreen = {false}
                                    src={`https://www.youtube.com/embed/${url}`}/>
                                ) : data.videoType === "TWITCH" ? (
                                     <iframe 
                                        title="Twitch clips"
                                        src={"https://clips.twitch.tv/AstuteVibrantMilkEleGiggle-eJ3UKsq_0_hIqsPY"}  
                                        frameborder="0" allowfullscreen="true" scrolling="no" width="100%" />
                               
                                ) : data.videoType === "AFREECA"  ? (
                                <iframe title="afreeca"
                                    style={etcUrl !== "" ? {display : "block" , margin : "0 auto", width:"100%", height:"300px"} : {display : "none"}}
                                    id="afreecatv_player_video"  
                                    src= {`//vod.afreecatv.com/embed.php?type=station&isAfreeca=false&autoPlay=false&showChat=true&mutePlay=false&szBjId=wnd2qud&nStationNo=18382776&nBbsNo=69072228&nTitleNo=${url}&szCategory=00010000&szVodCategory=00040066&szPart=CLIP&szVodType=STATION&nPlaylistIdx=0&isEmbedautoPlay=false&szSysType=html5`}
                                    frameborder="0" allowfullscreen="true"/>
                                ) : data.videoType === "LOCAL" ? (
                                    <video controls>
                                        <source src={data.video_url}/>
                                    </video>
                                ) :<></>
                                
                            }
                           </div>
                        </th>
                    </tr>     
                    <tr>
                        <td colSpan='2' style={{padding : 5, margin:"0 auto"}}>
                           <CKEditor5 onChange={(ed)=>{setDesc(ed)}} data={desc}/>
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