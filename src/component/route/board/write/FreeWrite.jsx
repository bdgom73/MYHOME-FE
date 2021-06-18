import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import useMember from "../../../../customState/useMember";
import useModal from "../../../../customState/useModal";
import useTitle from "../../../../customState/useTitle";
import Modal from "../../../modal/modal";
import WriteEditor from "../../../part/write/WriteEditor";

import CKEditor5 from "../../../part/write/CKEditor/CKEditor5";

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

        if(e.target[0].value === ""){
            const fwt = document.getElementById("free_write_title");
            fwt.focus();
            fwt.style.borderBottom = "3px solid #ca5b5b";
            return;
        }
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
                            <input type="text" id="free_write_title" className="w_title" placeholder="제목을 입력해주세요" />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                            <input type="text" className="writer" readOnly defaultValue={member.data.name}/>
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