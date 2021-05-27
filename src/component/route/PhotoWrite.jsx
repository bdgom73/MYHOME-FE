import { useCallback, useEffect, useMemo, useState } from "react";
import {Editor} from "react-draft-wysiwyg";
import { EditorState,convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "../../css/route/VideoWrite.scss";
import { AiFillCloseSquare } from 'react-icons/ai';
import WriteEditor from "../part/write/WriteEditor";
import Modal from "../modal/modal";
import useModal from "../../customState/useModal";
import useMember from "../../customState/useMember";
import axios from "axios";
import { useHistory } from "react-router";
import useTitle from "../../customState/useTitle";

export default function PhotoWrite(props){

    useTitle(`MYDOMUS | WRITE - VIDEO`);
    const history = useHistory();
    const modal = useModal();
    const member = useMember();
    const [desc,setDesc] = useState("");
    const [files, setFiles] = useState([]);
    function onModalHandler(){
        if(modal.modal === 1){
            return <Modal close={modal.close}>잘못된 URL입니다.</Modal>
        }
    }

    function onChangeFileHandler(e){
        console.log(e)
        for(let i = 0 ; i < e.target.files.length ; i++){
            files.push(e.target.files[i]);
            readImage(e.target,i)
        }
        setFiles(files);   
    }
    function readImage(input,i) {
        if(input.files && input.files[i]) {
            const reader = new FileReader();
            reader.onload = e => {
                const previewImage = document.getElementById("target");
                const div = document.createElement("div");
                const inline = document.createElement("inline");
                const img = document.createElement("img");
                img.src = e.target.result;     
                img.classList.add("imagefile");
                inline.innerHTML="❌";
                inline.classList.add("close");  
                inline.onclick=()=>{
                    for(let a = 0; a < files.length; a++) {
                        if(files[a].name){
                            if(files[a].name === input.files[i].name) {
                                files.splice(a, 1);
                                a--;
                            }
                        }
                        
                    } 
                    setFiles(files);    
                    previewImage.removeChild(div);              
                }
                div.appendChild(inline);
                div.appendChild(img);
                div.classList.add("preview_img")
                previewImage.prepend(div);                 
            }
            reader.readAsDataURL(input.files[i]);     
        }
    }
    const onSubmitHandler = (e)=>{
        e.preventDefault();
        const fd = new FormData();     
        fd.append("title",e.target[0].value);
        fd.append("description",desc);
        let list = new DataTransfer();  
        for(let i = 0; i < files.length; i++) {
            list.items.add(files[i]);
        } 
        for(let i = 0; i < list.files.length; i++) {
            fd.append("images[]", list.files[i])
        }
      
        axios.post("/bbs/write?category=photo",fd,{headers:{'Content-Type': 'multipart/form-data',"Authorization" : member.SESSION_UID}})
            .then(res=>{
                history.push(`/bbs/photo/${res.data}`)
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
                        <th colSpan="2" className="target_th">                 
                            <div className="target" id="target">    
                                <div className="target_file" style={files.length > 10 ? {display:"none"} : {display:"flex"}}>
                                    <input multiple="multiple" type="file" name="images[]" id="images" onChange={onChangeFileHandler}/>
                                    <label for="images">➕</label>
                                </div>
                            </div>    
                        </th>      
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