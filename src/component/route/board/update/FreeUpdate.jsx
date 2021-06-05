import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useMember from "../../../../customState/useMember";
import useModal from "../../../../customState/useModal";
import useTitle from "../../../../customState/useTitle";
import Modal from "../../../modal/modal";

import CKEditor5 from "../../../part/write/CKEditor/CKEditor5";

export default function FreeUpdate(props){

    const {params}= props.match;
    const history = useHistory();
    const {refTitle} = useTitle();
    const modal = useModal();
    const member = useMember();
    const [desc,setDesc] = useState("");
    const [title,setTitle] = useState("");
    const [writer,setWriter] = useState("");
    const [board_id, setBoardId] = useState();
    const [data, setData] = useState({});

    useEffect(()=>{    
        if(data.writer_id && member.data.id){
            if(data.writer_id !== member.data.id){
                history.push("/bbs/free/"+board_id)
            }
        }  
        
    },[data])

    useEffect(()=>{    
        setBoardId(params.id);
        axios.get("/bbs/view/"+params.id+"/free")
         .then(res=>{ 
             console.log(res)  
            setData(res.data); 
            setTitle(res.data.title);
            setWriter(res.data.nickname);
            setDesc(res.data.description);
            refTitle.innerHTML = `MYDOMUS | ${res.data.title ? res.data.title : "Update"}`
         })
         .catch(e=>{
            console.log(e.response);
            history.push("/bbs/free/page=1");
         });
 
     },[board_id])

    function onModalHandler(){
        if(modal.modal === 1){
            return <Modal close={modal.close}>잘못된 URL입니다.</Modal>
        }
    }

    const onSubmitHandler = (e)=>{
        e.preventDefault();
        const fd = new FormData();    
        fd.append("id", params.id);
        fd.append("title",e.target[0].value);
        fd.append("description",desc);
        fd.append("category","free")
        axios.put("/bbs/update",fd,{headers:{'Content-Type': 'multipart/form-data',"Authorization" : member.SESSION_UID}})
            .then(res=>{
                console.log(res);
                if(res.status === 200) history.push(`/bbs/free/${params.id}`)
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
                            <input type="text" className="w_title" placeholder="제목을 입력해주세요" defaultValue={title}/>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='2'>
                            <input type="text" className="writer" readOnly defaultValue={writer}/>
                        </td>
                    </tr>    
                    <tr>
                        <td colSpan='2' style={{padding : 5, margin:"0 auto"}}>
                           <CKEditor5 onChange={(ed)=>{setDesc(ed);}} data={desc} />
                           <div className="btn_wrap">
                                <input type="submit" className="btn" value="수정"/>
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