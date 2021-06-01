import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import useMember from "../../../../customState/useMember";
import useModal from "../../../../customState/useModal";
import useTitle from "../../../../customState/useTitle";
import Modal from "../../../modal/modal";
import "../../../../css/route/VideoWrite.scss";
import { byte } from "../../../../js/common";
import CKEditor5 from "../../../part/write/CKEditor/CKEditor5";

export default function PhotoUpdate(props){

    const [clickEvent, setClickEvent] = useState(0);
    const {params}= props.match;
    const history = useHistory();
    const {refTitle} = useTitle();
    const modal = useModal();
    const member = useMember();
    const [desc,setDesc] = useState("");
    const [files, setFiles] = useState([]);
    const [image,setImage] = useState([]);
    const [filesize, setFilesize] = useState(0);
    const [change,setChange] = useState(true);
    const [data, setData] = useState({});  
    const [title,setTitle] = useState("");
    const [writer,setWriter] = useState("");
    const [board_id, setBoardId] = useState();
    useEffect(()=>{    
        setBoardId(params.id);
        axios.get("/bbs/view/"+params.id+"/photo")
         .then(res=>{ 
             console.log(res)
            setData(res.data); 
            setTitle(res.data.title);
            setWriter(res.data.nickname);
            setDesc(res.data.description);
            setImage(res.data.imageList);
            refTitle.innerHTML = `MYDOMUS | ${res.data.title ? res.data.title : "Update"}` 
         })
         .catch(e=>{
            console.log(e.response);
            history.push("/bbs/photo/page=1");
         });
 
     },[board_id])

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
            alert("이미지 10개이상 업로드는 불가능합니다.");    
        }   
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
                    </tbody>
                </table>
                <div className="images_list">
                <span className="title"><font color="#bbb">이전이미지</font></span>
                {
                    image[0] ?
                    image.map(m=>{
                        return (
                            <>                                        
                            <img src={m.image_url} alt={m.filename}  key={m.filename+m.image_url}/>              
                            </>
                        )
                    }) : <></>         
                }
                </div>
                <table>
                    <tbody>   
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
                            {/* <WriteEditor onChange={(ed)=>{setDesc(ed)}}  /> */}
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