import { useCallback, useEffect, useMemo, useState } from "react";
import {Editor} from "react-draft-wysiwyg";
import { EditorState,convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "../../css/route/VideoWrite.scss";
import { RiPhoneFindLine } from 'react-icons/ri';
import WriteEditor from "../part/write/WriteEditor";
import Modal from "../modal/modal";
import useModal from "../../customState/useModal";
import useMember from "../../customState/useMember";
import axios from "axios";

export default function VideoWrite(props){

    
 
    const modal = useModal();
    const member = useMember();
    const [videoType,setVideoType] = useState(false);
    const [videoName,setVideoName]= useState("");
    const [desc,setDesc] = useState("");
    function onModalHandler(){
        if(modal.modal === 1){
            return <Modal close={modal.close}>잘못된 URL입니다.</Modal>
        }
    }
    const onSubmitHandler = (e)=>{
        e.preventDefault();
       
        console.log(e);
        const fd = new FormData();
        if(e.target[2].checked){
            fd.append("video",e.target[4].files[0]);
        }else{
            const url = e.target[3].value;
            const unique = url.split("https://youtu.be/")[1];
            if(!unique){
                modal.setModal(1)
            }
            fd.append("video_url",e.target[3].value);
        }
       
        fd.append("title",e.target[0].value);
        fd.append("description",desc);
        
        axios.post("/bbs/write?category=video",fd,{headers:{'Content-Type': 'multipart/form-data',"Authorization" : member.SESSION_UID}})
            .then(res=>{
                console.log(res);
            }).catch(e=>console.log(e.response))
    }

    return(
        <>
        {onModalHandler()}
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
                                        <input type="text" readOnly placeholder="영상을 선택해주세요" defaultValue={videoName}/>
                                        <input type="file" id="video_url" onChange={(e)=>{setVideoName(e.target.files[0].name)}}/>
                                        <label htmlFor="video_url"><RiPhoneFindLine size="20"/></label>
                                    </div> 
                                ): <input type="text" className="video_file_text" defaultValue="https://"/> 
                                         
                            }      
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                           <WriteEditor onChange={(ed)=>{setDesc(ed)}} />
                        </td>
                    </tr>
                    </tbody>
                </table>  
                <div className="btn_wrap">
                    <input type="submit" className="btn" value="글쓰기"/>
                    <button className="btn">목록</button>
                </div>    
            </form>
        </div>
        </>
    );
}