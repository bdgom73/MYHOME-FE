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
import { useHistory } from "react-router";
import useTitle from "../../customState/useTitle";

export default function FreeWrite(props){

    useTitle(`MYDOMUS | WRITE - FREE`);
    const history = useHistory();
    const modal = useModal();
    const member = useMember();
    const [desc,setDesc] = useState("");
    function onModalHandler(){
        if(modal.modal === 1){
            return <Modal close={modal.close}>잘못된 URL입니다.</Modal>
        }
    }
    const onSubmitHandler = (e)=>{
        e.preventDefault();
        const fd = new FormData();    
        fd.append("title",e.target[0].value);
        fd.append("description",desc);
        
        axios.post("/bbs/write?category=free",fd,{headers:{'Content-Type': 'multipart/form-data',"Authorization" : member.SESSION_UID}})
            .then(res=>{
                history.push(`/bbs/free/${res.data}`)
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