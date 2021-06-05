import axios from "axios";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useMember from "../../../../customState/useMember";
import useModal from "../../../../customState/useModal";
import useTitle from "../../../../customState/useTitle";
import Modal from "../../../modal/modal";
import { byte } from "../../../../js/common";
import CKEditor5 from "../../../part/write/CKEditor/CKEditor5";
import { toast } from "react-toastify";

export default function PhotoWrite(props){

    useTitle(`MYDOMUS | WRITE - PHOTO`);
    const [clickEvent, setClickEvent] = useState(0);
    const history = useHistory();
    const modal = useModal();
    const member = useMember();
    const [desc,setDesc] = useState("");
    const [files, setFiles] = useState([]);
    const [filesize, setFilesize] = useState(0);
    const [change,setChange] = useState(true);
   

    useEffect(()=>{
        let size = 0;
        for(let i = 0 ; i < files.length ; i++){
            size += files[i].size;
        }
        setFilesize(size);    
    },[clickEvent,filesize,files])

    function onModalHandler(){
        if(modal.modal === 1){
            return <Modal close={modal.close}>잘못된 URL입니다.</Modal>
        }
    }
    function onChangeFileHandler(e){     
        if(files.length + e.target.files.length <= 10){
            let size = filesize;
            for(let i = 0 ; i < e.target.files.length ; i++){
                files.push(e.target.files[i]);
                size += e.target.files[i].size       
                readImage(e.target,i)   
            }
            setFilesize(size);    
            if(files.length >= 10) setChange(false);  
            else setChange(true);
        }else{
            toast.error("이미지 10개이상 업로드는 불가능합니다.");    
        }   
    }

    function readImage(input,i) {
        let size = filesize;
        console.log(size)
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
                inline.dataset.filename = input.files[i].name;
                inline.dataset.modified = input.files[i].lastModified;
                inline.dataset.size = input.files[i].size;                   
                inline.onclick=(e)=>{          
                    for(let a = 0; a < files.length; a++) {           
                        if(files[a].name === e.target.dataset.filename) {                     
                            files.splice(a, 1);     
                            break;         
                        }      
                    } 
                    setClickEvent(Math.random()*1024) 
                    setFiles(files);       
                    if(files.length >= 10) setChange(false);  
                    else setChange(true);
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
                if(res.status === 200) history.push(`/bbs/photo/${res.data}`)
            }).catch(e=>{
                toast.error(e.response.data.message ? e.response.data.message : "게시판 등록에 실패했습니다.")
            })
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
                                <div className="target_file"  style={!change ? {display:"none"} : {display:"flex"}}>
                                    <input multiple="multiple" type="file" name="images[]" id="images" onChange={onChangeFileHandler}/>
                                    <label for="images">➕</label>
                                </div>
                            </div> 
                            {filesize === 0 ? "": byte(filesize)}   
                        </th>      
                    </tr>
                    <tr>
                        <td colSpan='2' style={{padding : 5, margin:"0 auto"}}>
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