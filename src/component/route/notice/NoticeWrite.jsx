import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useMember from "../../../../customState/useMember";
import useModal from "../../../../customState/useModal";
import useTitle from "../../../../customState/useTitle";
import Modal from "../../../modal/modal";

import CKEditor5 from "../../../part/write/CKEditor/CKEditor5";

export default function NoticeWrite(props){

    useTitle(`MYDOMUS | WRITE - NOTICE`);

    const history = useHistory();
    const modal = useModal();
    const member = useMember();
    const [desc,setDesc] = useState("");

    useEffect(()=>{  
        if(member.data.rank){
            if(member.data.rank !== "ADMIN"){
                history.push("/");
            }
        }       
    },[member.data.rank])

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
        
        axios.post("/notice/write",fd,{headers:{'Content-Type': 'multipart/form-data',"Authorization" : member.SESSION_UID}})
        .then(res=>{
            history.push(`/notice/detail/${res.data}`)
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
                        <td colSpan='2' style={{padding : 5, margin:"0 auto"}}>
                           <CKEditor5 onChange={(ed)=>{setDesc(ed)}}/>
                           <div className="btn_wrap">
                                <input type="submit" className="btn" value="공지사항 작성"/>
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